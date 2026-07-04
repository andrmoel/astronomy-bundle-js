import {availableParallelism} from 'node:os';
import {isMainThread, parentPort, Worker, workerData} from 'node:worker_threads';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {calculateCentralLine} from './centralLine';
import {UMBRA_REGION_STEP_HOURS} from './constants';
import calculatePenumbraVisibilityAlpha, {
    computePenumbraAlphaBand,
    computePenumbraInsideBand,
    PENUMBRA_TILE_SIZE,
} from './penumbraVisibility';
import {assemblePng, deflatePngStrip, type PngStrip} from './pngEncode';
import {
    calculateMaxEclipseAtSunrise,
    calculateMaxEclipseAtSunset,
    calculateSunriseBoundary,
    calculateSunsetBoundary,
} from './riseSetBoundary';
import {calculateShadowRegionContours} from './shadowOutline';

// The per-pixel penumbra masks dominate the map generation time by far, so they are fanned
// out to a pool of worker threads; the pool also compresses the PNG strips of the final
// image. A mask's two passes (inside flags, then border antialiasing) run as narrow row
// bands over SharedArrayBuffers: bands are aligned to the mask's tile grid and each pass
// runs the exact per-pixel arithmetic of the single-threaded sweep, so the parallel mask is
// bit-identical (see penumbraVisibility). Narrow bands keep the workers balanced even
// though the shadow occupies few of them; an antialiasing band only waits for its own and
// its neighbouring inside bands, so the two passes pipeline without a global barrier.
//
// The worker entry point is this very module (new Worker(__filename) guarded by workerData),
// a pattern that survives bundlers: whatever file this module ends up in, that file registers
// the message handler when loaded as one of our workers. Runs fine inside AWS Lambda, which
// supports worker_threads; on single-vCPU Lambdas the pool degrades to one worker. Wherever
// workers are unavailable (or __filename is not defined, e.g. some ESM bundles), everything
// is computed synchronously on the main thread instead — same result, just slower.

const WORKER_ROLE = 'solar-eclipse-map-worker';
const BAND_ROWS = PENUMBRA_TILE_SIZE;

interface MaskBandTask {
    kind: 'inside' | 'alpha';
    elements: BesselianElements;
    width: number;
    height: number;
    z0: number;
    yStart: number;
    yEnd: number;
    inside: SharedArrayBuffer;
    alpha: SharedArrayBuffer;
}

interface PngStripTask {
    kind: 'png-strip';
    rgba: SharedArrayBuffer;
    width: number;
    yStart: number;
    yEnd: number;
    isLast: boolean;
}

// The vector paths (polygon geometry) run on the pool too, mainly to keep the main thread
// free while the masks compute: an occupied main thread cannot hand finished workers their
// next band. Structured cloning of the resulting coordinate arrays is numerically exact.
const GEOMETRY_CALCULATORS = {
    centralLine: (elements: BesselianElements, z0: number) => calculateCentralLine(elements, z0),
    umbralRegion: (elements: BesselianElements, z0: number) =>
        calculateShadowRegionContours(elements, true, UMBRA_REGION_STEP_HOURS, z0),
    sunriseBoundary: (elements: BesselianElements, z0: number) => calculateSunriseBoundary(elements, z0),
    sunsetBoundary: (elements: BesselianElements, z0: number) => calculateSunsetBoundary(elements, z0),
    maxEclipseSunrise: (elements: BesselianElements, z0: number) => calculateMaxEclipseAtSunrise(elements, z0),
    maxEclipseSunset: (elements: BesselianElements, z0: number) => calculateMaxEclipseAtSunset(elements, z0),
};

export type EclipseGeometry = keyof typeof GEOMETRY_CALCULATORS;

interface GeometryTask {
    kind: 'geometry';
    geometry: EclipseGeometry;
    elements: BesselianElements;
    z0: number;
}

type PoolTask = MaskBandTask | PngStripTask | GeometryTask;

function runTask(task: PoolTask): unknown {
    if (task.kind === 'png-strip') {
        // The deflated strip is cloned rather than transferred: Node Buffers may share a
        // pooled allocation, which must not be detached.
        return deflatePngStrip(new Uint8Array(task.rgba), task.width, task.yStart, task.yEnd, task.isLast);
    }
    if (task.kind === 'geometry') {
        return GEOMETRY_CALCULATORS[task.geometry](task.elements, task.z0);
    }

    const {elements, width, height, z0, yStart, yEnd} = task;
    const inside = new Uint8Array(task.inside);
    if (task.kind === 'inside') {
        computePenumbraInsideBand(elements, width, height, z0, yStart, yEnd, inside);
    } else {
        computePenumbraAlphaBand(elements, width, height, z0, yStart, yEnd, inside, new Uint8ClampedArray(task.alpha));
    }

    return null;
}

if (!isMainThread && parentPort !== null && workerData === WORKER_ROLE) {
    const port = parentPort;
    port.on('message', ({id, task}: {id: number; task: PoolTask}) => {
        port.postMessage({id, result: runTask(task)});
    });
}

interface Pool {
    size: number;
    run(task: PoolTask): Promise<unknown>;
}

let pool: Pool | null | undefined;

function createPool(): Pool | null {
    if (typeof __filename === 'undefined' || !isMainThread) {
        return null;
    }

    const size = Math.max(1, Math.min(availableParallelism(), 16));
    // Each worker keeps up to two tasks in its own message queue, so it can start the next
    // one immediately even while the main thread — which hands out the work — is busy.
    const MAX_IN_FLIGHT = 2;
    const pending = new Map<number, {resolve: (result: unknown) => void; reject: (err: Error) => void}>();
    const queue: Array<{id: number; task: PoolTask}> = [];
    let nextId = 0;

    const fail = (err: Error): void => {
        for (const {reject} of pending.values()) {
            reject(err);
        }
        pending.clear();
        queue.length = 0;
    };

    try {
        const slots = Array.from({length: size}, () => {
            const worker = new Worker(__filename, {workerData: WORKER_ROLE});
            worker.on('error', fail);
            // Idle workers must not keep the process (or a warm Lambda container) alive.
            worker.unref();

            return {worker, inFlight: 0};
        });

        const pump = (): void => {
            while (queue.length > 0) {
                let best = null;
                for (const slot of slots) {
                    if (slot.inFlight < MAX_IN_FLIGHT && (best === null || slot.inFlight < best.inFlight)) {
                        best = slot;
                    }
                }
                if (best === null) {
                    return;
                }
                const entry = queue.shift();
                if (entry === undefined) {
                    return;
                }
                if (best.inFlight === 0) {
                    best.worker.ref();
                }
                best.inFlight++;
                best.worker.postMessage(entry);
            }
        };

        for (const slot of slots) {
            slot.worker.on('message', ({id, result}: {id: number; result: unknown}) => {
                slot.inFlight--;
                if (slot.inFlight === 0) {
                    slot.worker.unref();
                }
                pending.get(id)?.resolve(result);
                pending.delete(id);
                pump();
            });
        }

        // While tasks are queued, the otherwise-idle main thread works through the small
        // ones itself, one per event-loop turn (yielding in between keeps the worker
        // messages flowing). This matters most during the workers' startup ramp, when only
        // part of the pool is online yet. Geometry tasks are left alone — one can occupy
        // the thread, and with it the task handout, for over a hundred milliseconds.
        let stealing = false;
        const stealStep = (): void => {
            const index = queue.findIndex(({task}) => task.kind !== 'geometry');
            const entry = index === -1 ? undefined : queue.splice(index, 1)[0];
            if (entry === undefined) {
                stealing = false;

                return;
            }
            const result = runTask(entry.task);
            pending.get(entry.id)?.resolve(result);
            pending.delete(entry.id);
            setImmediate(stealStep);
        };

        return {
            size,
            run(task: PoolTask): Promise<unknown> {
                return new Promise((resolve, reject) => {
                    const id = nextId++;
                    pending.set(id, {resolve, reject});
                    queue.push({id, task});
                    pump();
                    if (!stealing) {
                        stealing = true;
                        setImmediate(stealStep);
                    }
                });
            },
        };
    } catch {
        return null;
    }
}

// One vector path on the worker pool; null when the pool is unavailable (the caller then
// computes it on the main thread instead).
export async function calculateGeometryParallel(
    geometry: EclipseGeometry,
    elements: BesselianElements,
    z0: number,
): Promise<unknown | null> {
    pool ??= createPool();
    const activePool = pool;
    if (activePool === null) {
        return null;
    }

    try {
        return await activePool.run({kind: 'geometry', geometry, elements, z0});
    } catch {
        return null;
    }
}

// Same mask as calculatePenumbraVisibilityAlpha, computed band-wise on the worker pool.
export async function calculatePenumbraVisibilityAlphaParallel(
    elements: BesselianElements,
    width: number,
    height: number,
    z0: number,
): Promise<Uint8ClampedArray> {
    pool ??= createPool();
    const activePool = pool;
    if (activePool === null) {
        return calculatePenumbraVisibilityAlpha(elements, width, height, z0);
    }

    try {
        const inside = new SharedArrayBuffer(width * height);
        const alpha = new SharedArrayBuffer(width * height);
        const bounds: Array<[number, number]> = [];
        for (let yStart = 0; yStart < height; yStart += BAND_ROWS) {
            bounds.push([yStart, Math.min(height, yStart + BAND_ROWS)]);
        }
        const shared = {elements, width, height, z0, inside, alpha};
        const insideDone = bounds.map(([yStart, yEnd]) => activePool.run({...shared, kind: 'inside', yStart, yEnd}));
        await Promise.all(
            bounds.map(([yStart, yEnd], band) =>
                Promise.all(insideDone.slice(Math.max(0, band - 1), band + 2)).then(() =>
                    activePool.run({...shared, kind: 'alpha', yStart, yEnd}),
                ),
            ),
        );

        return new Uint8ClampedArray(alpha);
    } catch {
        return calculatePenumbraVisibilityAlpha(elements, width, height, z0);
    }
}

// PNG of the RGBA pixels (see pngEncode), with the strips deflated on the worker pool.
export async function encodePngParallel(rgba: Uint8ClampedArray, width: number, height: number): Promise<Buffer> {
    pool ??= createPool();
    const activePool = pool;

    const bounds: Array<[number, number]> = [];
    if (activePool !== null) {
        const rowsPerStrip = Math.max(1, Math.ceil(height / activePool.size));
        for (let yStart = 0; yStart < height; yStart += rowsPerStrip) {
            bounds.push([yStart, Math.min(height, yStart + rowsPerStrip)]);
        }
    } else {
        bounds.push([0, height]);
    }

    let strips: Array<PngStrip>;
    if (activePool === null) {
        strips = [deflatePngStrip(rgba, width, 0, height, true)];
    } else {
        try {
            const shared = new SharedArrayBuffer(rgba.length);
            new Uint8Array(shared).set(rgba);
            strips = (await Promise.all(
                bounds.map(([yStart, yEnd], i) =>
                    activePool.run({
                        kind: 'png-strip',
                        rgba: shared,
                        width,
                        yStart,
                        yEnd,
                        isLast: i === bounds.length - 1,
                    }),
                ),
            )) as Array<PngStrip>;
        } catch {
            strips = [deflatePngStrip(rgba, width, 0, height, true)];
        }
    }

    return assemblePng(width, height, strips);
}
