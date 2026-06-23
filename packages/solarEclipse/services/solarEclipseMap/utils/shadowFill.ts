import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime as evaluateElements} from '@package/solarEclipse/utils/besselianElements';
import {parseRgba} from './color';
import {DEG, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F, RISE_SET_SIN_ALTITUDE} from './constants';
import {calculateShadowBoundaryPoint} from './shadowBoundary';

interface PixelRange {
    pyMin: number;
    pyMax: number;
    pxRanges: Array<{pxMin: number; pxMax: number}>;
}

interface PixelInterval {
    pxMin: number;
    pxMax: number;
}

function coneBoundingBoxPixels(
    elements: BesselianElements,
    e: ReturnType<typeof evaluateElements>,
    useUmbra: boolean,
    canvas: Canvas,
    bufferDeg: number,
): PixelRange | null {
    const samples: Array<LatLon> = [];
    // The boundary is sampled densely enough that the bounding box does not miss
    // the southernmost on-Earth extent of the cone near the limb; too few samples
    // leave a rectangular notch where inside-shadow pixels never get tested.
    const sampleCount = 128;
    for (let i = 0; i < sampleCount; i++) {
        const q = (2 * Math.PI * i) / sampleCount;
        const p = calculateShadowBoundaryPoint(elements, e, q, useUmbra);
        if (p !== null) {
            samples.push(p);
        }
    }
    if (samples.length === 0) {
        return null;
    }

    let minLat = Infinity;
    let maxLat = -Infinity;
    for (const p of samples) {
        if (p.lat < minLat) {
            minLat = p.lat;
        }
        if (p.lat > maxLat) {
            maxLat = p.lat;
        }
    }
    minLat = Math.max(-90, minLat - bufferDeg);
    maxLat = Math.min(90, maxLat + bufferDeg);

    const pyMin = Math.max(0, Math.floor(((90 - maxLat) / 180) * canvas.height));
    const pyMax = Math.min(canvas.height - 1, Math.ceil(((90 - minLat) / 180) * canvas.height));

    const refLon = samples[0].lon;
    let minOff = 0;
    let maxOff = 0;
    for (const p of samples) {
        let delta = p.lon - refLon;
        while (delta > 180) {
            delta -= 360;
        }
        while (delta < -180) {
            delta += 360;
        }
        if (delta < minOff) {
            minOff = delta;
        }
        if (delta > maxOff) {
            maxOff = delta;
        }
    }
    const minLonRaw = refLon + minOff - bufferDeg;
    const maxLonRaw = refLon + maxOff + bufferDeg;

    if (maxLonRaw - minLonRaw >= 360) {
        return {pyMin, pyMax, pxRanges: [{pxMin: 0, pxMax: canvas.width - 1}]};
    }

    const minPx = ((normalizeLongitude(minLonRaw) + 180) / 360) * canvas.width;
    const maxPx = ((normalizeLongitude(maxLonRaw) + 180) / 360) * canvas.width;
    const pxRanges: Array<{pxMin: number; pxMax: number}> = [];
    if (minPx <= maxPx) {
        pxRanges.push({pxMin: Math.max(0, Math.floor(minPx)), pxMax: Math.min(canvas.width - 1, Math.ceil(maxPx))});
    } else {
        pxRanges.push({pxMin: 0, pxMax: Math.min(canvas.width - 1, Math.ceil(maxPx))});
        pxRanges.push({pxMin: Math.max(0, Math.floor(minPx)), pxMax: canvas.width - 1});
    }

    return {pyMin, pyMax, pxRanges};
}

// This is the same coarse over-approximation as the old pixel mask, stored as
// merged row ranges so repeated eclipse-time boxes do not rewrite millions of pixels.
function buildShadowMaskRows(
    elements: BesselianElements,
    useUmbra: boolean,
    canvas: Canvas,
): Array<Array<PixelInterval>> {
    const rows: Array<Array<PixelInterval>> = Array.from({length: canvas.height}, () => []);
    const coarseTauStep = 30 / 3600;
    for (let tau = elements.tMin; tau <= elements.tMax; tau += coarseTauStep) {
        const e = evaluateElements(elements, tau);
        const bbox = coneBoundingBoxPixels(elements, e, useUmbra, canvas, 2);
        if (bbox === null) {
            continue;
        }
        for (let py = bbox.pyMin; py <= bbox.pyMax; py++) {
            const row = rows[py];
            for (const range of bbox.pxRanges) {
                row.push({pxMin: range.pxMin, pxMax: range.pxMax});
            }
        }
    }

    for (const row of rows) {
        if (row.length < 2) {
            continue;
        }

        row.sort((a, b) => a.pxMin - b.pxMin || a.pxMax - b.pxMax);
        let writeIndex = 0;
        for (const range of row) {
            const previous = row[writeIndex - 1];
            if (writeIndex === 0 || range.pxMin > previous.pxMax + 1) {
                row[writeIndex] = range;
                writeIndex++;
            } else if (range.pxMax > previous.pxMax) {
                previous.pxMax = range.pxMax;
            }
        }
        row.length = writeIndex;
    }

    return rows;
}

interface ShadowEvaluationCache {
    length: number;
    tanF: number;
    x: Float64Array;
    y: Float64Array;
    l0: Float64Array;
    sinD: Float64Array;
    cosD: Float64Array;
    sinAlpha: Float64Array;
    cosAlpha: Float64Array;
}

function buildShadowEvaluationCache(
    elements: BesselianElements,
    useUmbra: boolean,
    evaluations: Array<ReturnType<typeof evaluateElements>>,
): ShadowEvaluationCache {
    const deltaTRotationRad = ((EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600) * DEG;
    const length = evaluations.length;
    const cache: ShadowEvaluationCache = {
        length,
        tanF: useUmbra ? elements.tanF2 : elements.tanF1,
        x: new Float64Array(length),
        y: new Float64Array(length),
        l0: new Float64Array(length),
        sinD: new Float64Array(length),
        cosD: new Float64Array(length),
        sinAlpha: new Float64Array(length),
        cosAlpha: new Float64Array(length),
    };

    for (let i = 0; i < length; i++) {
        const evaluation = evaluations[i];
        const alpha = evaluation.mu - deltaTRotationRad;
        cache.x[i] = evaluation.x;
        cache.y[i] = evaluation.y;
        cache.l0[i] = useUmbra ? evaluation.l2 : evaluation.l1;
        cache.sinD[i] = evaluation.sinD;
        cache.cosD[i] = evaluation.cosD;
        cache.sinAlpha[i] = Math.sin(alpha);
        cache.cosAlpha[i] = Math.cos(alpha);
    }

    return cache;
}

// sinAlphas[i]/cosAlphas[i] = sin/cos(evaluations[i].mu - deltaTRotationRad).
// sinLon/cosLon = sin/cos(lonRad) for the point being tested.
// H = alpha + lonRad is expanded with the angle-addition identity so the inner
// evaluation loop contains no Math.sin/cos calls.
function isInsideShadowAtPoint(
    cache: ShadowEvaluationCache,
    sinU: number,
    cosU: number,
    sinLon: number,
    cosLon: number,
): boolean {
    const {
        length,
        tanF,
        x: xs,
        y: ys,
        l0: l0s,
        sinD: sinDs,
        cosD: cosDs,
        sinAlpha: sinAlphas,
        cosAlpha: cosAlphas,
    } = cache;
    for (let i = 0; i < length; i++) {
        const sinH = sinAlphas[i] * cosLon + cosAlphas[i] * sinLon;
        const cosH = cosAlphas[i] * cosLon - sinAlphas[i] * sinLon;
        const xi = cosU * sinH;
        const eta = ONE_MINUS_F * sinU * cosDs[i] - cosU * cosH * sinDs[i];
        const zeta = ONE_MINUS_F * sinU * sinDs[i] + cosU * cosH * cosDs[i];
        // Sun's upper limb + refraction: a point still sees the (partial/total) eclipse until
        // the Sun's centre drops to -50' (upper limb at the refracted horizon), so the shadow
        // extends slightly onto the night side rather than ending at the geometric horizon.
        if (zeta < RISE_SET_SIN_ALTITUDE) {
            continue;
        }
        const radius = Math.abs(l0s[i] - zeta * tanF);
        const dx = xi - xs[i];
        const dy = eta - ys[i];
        if (dx * dx + dy * dy < radius * radius) {
            return true;
        }
    }

    return false;
}

const SUB_OFFSETS_16X: ReadonlyArray<readonly [number, number]> = (() => {
    const offsets: Array<readonly [number, number]> = [];
    const positions = [-0.375, -0.125, 0.125, 0.375];
    for (const dyf of positions) {
        for (const dxf of positions) {
            offsets.push([dyf, dxf]);
        }
    }

    return offsets;
})();

export function rasterizeShadowFill(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    useUmbra: boolean,
    tauStep: number,
    color: string,
): void {
    const evaluations = [];
    for (let tau = elements.tMin; tau <= elements.tMax; tau += tauStep) {
        evaluations.push(evaluateElements(elements, tau));
    }
    const evaluationCache = buildShadowEvaluationCache(elements, useUmbra, evaluations);
    const maskRows = buildShadowMaskRows(elements, useUmbra, canvas);
    const w = canvas.width;
    const h = canvas.height;

    // Precompute per-column longitude trig reused across every row.
    const sinLons = new Float64Array(w);
    const cosLons = new Float64Array(w);
    for (let px = 0; px < w; px++) {
        const lonRad = (((px + 0.5) / w) * 360 - 180) * DEG;
        sinLons[px] = Math.sin(lonRad);
        cosLons[px] = Math.cos(lonRad);
    }

    const binary = new Uint8Array(w * h);
    for (let py = 0; py < h; py++) {
        const ranges = maskRows[py];
        if (ranges.length === 0) {
            continue;
        }

        const lat = 90 - ((py + 0.5) / h) * 180;
        const u = Math.atan(ONE_MINUS_F * Math.tan(lat * DEG));
        const sinU = Math.sin(u);
        const cosU = Math.cos(u);

        for (const {pxMin, pxMax} of ranges) {
            for (let px = pxMin; px <= pxMax; px++) {
                const idx = py * w + px;
                if (isInsideShadowAtPoint(evaluationCache, sinU, cosU, sinLons[px], cosLons[px])) {
                    binary[idx] = 1;
                }
            }
        }
    }

    const alphaMask = new Float32Array(w * h);
    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            const idx = py * w + px;
            const v = binary[idx];

            let isBoundary = false;
            for (let dy = -1; dy <= 1 && !isBoundary; dy++) {
                for (let dx = -1; dx <= 1 && !isBoundary; dx++) {
                    if (dx === 0 && dy === 0) {
                        continue;
                    }
                    const ny = py + dy;
                    const nx = px + dx;
                    if (ny < 0 || ny >= h || nx < 0 || nx >= w) {
                        continue;
                    }
                    if (binary[ny * w + nx] !== v) {
                        isBoundary = true;
                    }
                }
            }

            if (!isBoundary) {
                alphaMask[idx] = v;
                continue;
            }

            let count = 0;
            for (const [dyf, dxf] of SUB_OFFSETS_16X) {
                const subLat = 90 - ((py + 0.5 + dyf) / h) * 180;
                const subU = Math.atan(ONE_MINUS_F * Math.tan(subLat * DEG));
                const subSinU = Math.sin(subU);
                const subCosU = Math.cos(subU);
                const subLonRad = (((px + 0.5 + dxf) / w) * 360 - 180) * DEG;
                const subSinLon = Math.sin(subLonRad);
                const subCosLon = Math.cos(subLonRad);
                if (isInsideShadowAtPoint(evaluationCache, subSinU, subCosU, subSinLon, subCosLon)) {
                    count++;
                }
            }
            alphaMask[idx] = count / SUB_OFFSETS_16X.length;
        }
    }

    const {r, g, b, a} = parseRgba(color);
    const baseAlpha = a / 255;
    const imageData = context.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (const [i, element] of alphaMask.entries()) {
        const alpha = element * baseAlpha;
        if (alpha > 0) {
            const idx = i * 4;
            data[idx] = Math.round(data[idx] * (1 - alpha) + r * alpha);
            data[idx + 1] = Math.round(data[idx + 1] * (1 - alpha) + g * alpha);
            data[idx + 2] = Math.round(data[idx + 2] * (1 - alpha) + b * alpha);
        }
    }
    context.putImageData(imageData, 0, 0);
}
