import type {LatLon} from '@app/types/LocationTypes';
import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';

import {calculateShadowBoundaryPoint, DEG, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F} from './eclipsePaths';
import type {BesselianElements} from './types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from './types/SolarEclipsePathTypes';
import {getBesselianElementsAtTime as evaluateElements} from './utils/besselianElements';

const DEFAULT_STYLE: Required<EclipseStyle> = {
    centralLineColor: 'rgba(0, 0, 0, 1)',
    umbralLimitColor: 'rgba(0, 0, 0, 0.5)',
    penumbralLimitColor: 'rgba(0, 0, 0, 0.6)',
    umbralFillColor: 'rgba(0, 0, 0, 0.3)',
    penumbralFillColor: 'rgba(0, 0, 0, 0.1)',
    centralLineWidth: 1.5,
    umbralLimitWidth: 1,
    penumbralLimitWidth: 1.5,
    sunsetBoundaryColor: 'rgba(255, 200, 0, 0.85)',
    sunsetBoundaryFillColor: 'rgba(255, 200, 0, 0.3)',
    sunsetBoundaryWidth: 1.5,
    sunriseBoundaryColor: 'rgba(255, 140, 0, 0.85)',
    sunriseBoundaryFillColor: 'rgba(255, 140, 0, 0.3)',
    sunriseBoundaryWidth: 1.5,
};

function projectLonLatToPixel(point: LatLon, canvas: Canvas): {x: number; y: number} {
    return {
        x: ((point.lon + 180) / 360) * canvas.width,
        y: ((90 - point.lat) / 180) * canvas.height,
    };
}

function traceSubpath(context: SKRSContext2D, canvas: Canvas, points: Array<LatLon>, closed: boolean): void {
    let previousX: number | null = null;
    for (const [i, point] of points.entries()) {
        const {x, y} = projectLonLatToPixel(point, canvas);
        if (i === 0) {
            context.moveTo(x, y);
        } else if (previousX !== null && Math.abs(x - previousX) > canvas.width / 2) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
        previousX = x;
    }
    if (closed && points.length >= 3) {
        const first = projectLonLatToPixel(points[0], canvas);
        const last = projectLonLatToPixel(points[points.length - 1], canvas);
        if (Math.abs(first.x - last.x) < canvas.width / 2) {
            context.lineTo(first.x, first.y);
        }
    }
}

function strokePolyline(
    context: SKRSContext2D,
    canvas: Canvas,
    points: Array<LatLon>,
    color: string,
    lineWidth: number,
    closed: boolean,
): void {
    if (points.length < 2) {
        return;
    }

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    traceSubpath(context, canvas, points, closed);
    context.stroke();
}

function unwrapPoints(points: Array<LatLon>): Array<LatLon> {
    if (points.length === 0) {
        return points;
    }
    const result: Array<LatLon> = [points[0]];
    for (let i = 1; i < points.length; i++) {
        let lon = points[i].lon;
        const prevLon = result[i - 1].lon;
        while (lon - prevLon > 180) {
            lon -= 360;
        }
        while (lon - prevLon < -180) {
            lon += 360;
        }
        result.push({lat: points[i].lat, lon});
    }

    return result;
}

function traceFillSubpath(context: SKRSContext2D, canvas: Canvas, points: Array<LatLon>): void {
    const unwrapped = unwrapPoints(points);
    const coords: Array<{x: number; y: number}> = [];
    let xMin = Infinity;
    let xMax = -Infinity;
    for (const point of unwrapped) {
        const {x, y} = projectLonLatToPixel(point, canvas);
        coords.push({x, y});
        if (x < xMin) {
            xMin = x;
        }
        if (x > xMax) {
            xMax = x;
        }
    }

    const drawShifted = (shift: number): void => {
        for (const [i, {x, y}] of coords.entries()) {
            if (i === 0) {
                context.moveTo(x + shift, y);
            } else {
                context.lineTo(x + shift, y);
            }
        }
        context.closePath();
    };

    drawShifted(0);
    // When the polygon extends past the left edge, draw a copy shifted right
    // so the portion that wraps around the antimeridian fills correctly on the right side.
    if (xMin < 0) {
        drawShifted(canvas.width);
    }
    // When the polygon extends past the right edge, draw a copy shifted left.
    if (xMax > canvas.width) {
        drawShifted(-canvas.width);
    }
}

function fillPolygons(context: SKRSContext2D, canvas: Canvas, contours: Array<Array<LatLon>>, color: string): void {
    const usable = contours.filter((contour) => contour.length >= 3);
    if (usable.length === 0) {
        return;
    }

    context.fillStyle = color;
    context.beginPath();
    for (const contour of usable) {
        traceFillSubpath(context, canvas, contour);
    }
    context.fill('nonzero');
}

function parseRgba(color: string): {r: number; g: number; b: number; a: number} {
    if (color.startsWith('#')) {
        return {
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16),
            a: 255,
        };
    }
    const match = color.match(/^rgba?\(([^)]+)\)$/);
    if (match !== null) {
        const parts = match[1].split(',').map((s) => parseFloat(s.trim()));

        return {
            r: Math.round(parts[0]),
            g: Math.round(parts[1]),
            b: Math.round(parts[2]),
            a: parts.length > 3 ? Math.round(parts[3] * 255) : 255,
        };
    }

    return {r: 0, g: 0, b: 0, a: 255};
}

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
    const sampleCount = 32;
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

    const normalizeLon = (lon: number): number => {
        let n = lon;
        while (n > 180) {
            n -= 360;
        }
        while (n < -180) {
            n += 360;
        }

        return n;
    };
    const minPx = ((normalizeLon(minLonRaw) + 180) / 360) * canvas.width;
    const maxPx = ((normalizeLon(maxLonRaw) + 180) / 360) * canvas.width;
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
        if (zeta < 0) {
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

function rasterizeShadowFill(
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

export interface RenderPathsVisibility {
    isCentralLineVisible?: boolean;
    isUmbraVisible?: boolean;
    isPenumbraVisible?: boolean;
    isSunriseLineVisible?: boolean;
    isSunsetLineVisible?: boolean;
}

export default function renderPaths(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
    visibility?: RenderPathsVisibility,
): void {
    const resolved: Required<EclipseStyle> = {...DEFAULT_STYLE, ...(style ?? {})};
    const isPenumbraVisible = !!visibility?.isPenumbraVisible;
    const isUmbraVisible = !!visibility?.isUmbraVisible;
    const isCentralLineVisible = !!visibility?.isCentralLineVisible;
    const isSunriseLineVisible = !!visibility?.isSunriseLineVisible;
    const isSunsetLineVisible = !!visibility?.isSunsetLineVisible;

    if (isPenumbraVisible) {
        rasterizeShadowFill(context, canvas, elements, false, 30 / 3600, resolved.penumbralFillColor);
    }

    if (isUmbraVisible) {
        rasterizeShadowFill(context, canvas, elements, true, 5 / 3600, resolved.umbralFillColor);
    }

    if (isCentralLineVisible) {
        strokePolyline(context, canvas, paths.centralLine, resolved.centralLineColor, resolved.centralLineWidth, false);
    }

    if (isSunriseLineVisible) {
        fillPolygons(context, canvas, [paths.sunriseBoundary], resolved.sunriseBoundaryFillColor);
        strokePolyline(
            context,
            canvas,
            paths.sunriseBoundary,
            resolved.sunriseBoundaryColor,
            resolved.sunriseBoundaryWidth,
            true,
        );
    }

    if (isSunsetLineVisible) {
        fillPolygons(context, canvas, [paths.sunsetBoundary], resolved.sunsetBoundaryFillColor);
        strokePolyline(
            context,
            canvas,
            paths.sunsetBoundary,
            resolved.sunsetBoundaryColor,
            resolved.sunsetBoundaryWidth,
            true,
        );
    }
}
