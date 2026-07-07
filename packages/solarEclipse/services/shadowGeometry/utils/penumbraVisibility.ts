import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {DEG, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F} from './constants';

const COARSE_STEP_HOURS = 0.25;

const DEPTH_OUT_SLACK = 0.03;
const DEPTH_IN_SLACK = 0.01;
const ZETA_SLACK = 0.05;

export const PENUMBRA_TILE_SIZE = 8;
const TILE_SIZE = PENUMBRA_TILE_SIZE;
const TILE_SLACK = 0.05;

export function pixelCenterLon(px: number, width: number): number {
    return ((px + 0.5) / width) * 360 - 180;
}

export function pixelCenterLat(py: number, height: number): number {
    return 90 - ((py + 0.5) / height) * 180;
}

// Border pixels are supersampled on an n x n subgrid for antialiasing.
const SUBSAMPLES = 3;

export interface ScanContext {
    elements: BesselianElements;
    ghaOffset: number;
    tanF1: number;
    z0: number;
    taus: Float64Array;
    xs: Float64Array;
    ys: Float64Array;
    l1s: Float64Array;
    sinDs: Float64Array;
    cosDs: Float64Array;
    sinGs: Float64Array;
    cosGs: Float64Array;
}

export function buildScanContext(elements: BesselianElements, z0: number): ScanContext {
    const ghaOffset = ((EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600) * DEG;
    const count = Math.max(2, Math.ceil((elements.tMax - elements.tMin) / COARSE_STEP_HOURS) + 1);
    const taus = new Float64Array(count);
    const xs = new Float64Array(count);
    const ys = new Float64Array(count);
    const l1s = new Float64Array(count);
    const sinDs = new Float64Array(count);
    const cosDs = new Float64Array(count);
    const sinGs = new Float64Array(count);
    const cosGs = new Float64Array(count);
    for (let i = 0; i < count; i++) {
        const tau = elements.tMin + ((elements.tMax - elements.tMin) * i) / (count - 1);
        const e = getBesselianElementsAtTime(elements, tau);
        const gha = e.mu - ghaOffset;
        taus[i] = tau;
        xs[i] = e.x;
        ys[i] = e.y;
        l1s[i] = e.l1;
        sinDs[i] = e.sinD;
        cosDs[i] = e.cosD;
        sinGs[i] = Math.sin(gha);
        cosGs[i] = Math.cos(gha);
    }

    return {elements, ghaOffset, tanF1: elements.tanF1, z0, taus, xs, ys, l1s, sinDs, cosDs, sinGs, cosGs};
}

function parametricLatitude(latRad: number): {sinU: number; cosU: number} {
    const sinLat = Math.sin(latRad);
    const cosLat = Math.cos(latRad);
    const norm = Math.hypot(cosLat, ONE_MINUS_F * sinLat);

    return {sinU: (ONE_MINUS_F * sinLat) / norm, cosU: cosLat / norm};
}

interface MaxEclipseState {
    m: number;
    zeta: number;
    l1Effective: number;
}

function stateAtTau(ctx: ScanContext, tau: number, lonRad: number, sinU: number, cosU: number): MaxEclipseState {
    const e = getBesselianElementsAtTime(ctx.elements, tau);
    const H = e.mu - ctx.ghaOffset + lonRad;
    const sinH = Math.sin(H);
    const cosH = Math.cos(H);
    const pSinU = ONE_MINUS_F * sinU;
    const xi = cosU * sinH;
    const cosUcosH = cosU * cosH;
    const zeta = pSinU * e.sinD + cosUcosH * e.cosD;
    const eta = pSinU * e.cosD - cosUcosH * e.sinD;
    const m = Math.hypot(xi - e.x, eta - e.y);

    return {m, zeta, l1Effective: e.l1 - zeta * ctx.tanF1};
}

function separationAtTau(ctx: ScanContext, tau: number, lonRad: number, sinU: number, cosU: number): number {
    const elements = ctx.elements;
    const tau2 = tau * tau;
    const tau3 = tau2 * tau;
    const cd = elements.d;
    const d = (cd[0] + cd[1] * tau + cd[2] * tau2) * DEG;
    const cMu = elements.mu;
    const mu = (cMu[0] + cMu[1] * tau + cMu[2] * tau2) * DEG;
    const H = mu - ctx.ghaOffset + lonRad;
    const sinH = Math.sin(H);
    const cosH = Math.cos(H);
    const pSinU = ONE_MINUS_F * sinU;
    const xi = cosU * sinH;
    const eta = pSinU * Math.cos(d) - cosU * cosH * Math.sin(d);
    const cx = elements.x;
    const x = cx[0] + cx[1] * tau + cx[2] * tau2 + cx[3] * tau3;
    const cy = elements.y;
    const y = cy[0] + cy[1] * tau + cy[2] * tau2 + cy[3] * tau3;

    return Math.hypot(xi - x, eta - y);
}

const GOLDEN = (Math.sqrt(5) - 1) / 2;

function refineMaxEclipse(
    ctx: ScanContext,
    bestIndex: number,
    lonRad: number,
    sinU: number,
    cosU: number,
): MaxEclipseState {
    let a = ctx.taus[Math.max(0, bestIndex - 1)];
    let b = ctx.taus[Math.min(ctx.taus.length - 1, bestIndex + 1)];
    let t1 = b - GOLDEN * (b - a);
    let t2 = a + GOLDEN * (b - a);
    let m1 = separationAtTau(ctx, t1, lonRad, sinU, cosU);
    let m2 = separationAtTau(ctx, t2, lonRad, sinU, cosU);
    for (let iter = 0; iter < 20; iter++) {
        if (m1 <= m2) {
            b = t2;
            t2 = t1;
            m2 = m1;
            t1 = b - GOLDEN * (b - a);
            m1 = separationAtTau(ctx, t1, lonRad, sinU, cosU);
        } else {
            a = t1;
            t1 = t2;
            m1 = m2;
            t2 = a + GOLDEN * (b - a);
            m2 = separationAtTau(ctx, t2, lonRad, sinU, cosU);
        }
    }

    return stateAtTau(ctx, (a + b) / 2, lonRad, sinU, cosU);
}

function isMaxEclipseVisible(
    ctx: ScanContext,
    lonRad: number,
    sinLon: number,
    cosLon: number,
    sinU: number,
    cosU: number,
): boolean {
    const count = ctx.taus.length;
    const {sinGs, cosGs, xs, ys, sinDs, cosDs} = ctx;
    const pSinU = ONE_MINUS_F * sinU;
    let bestIndex = 0;
    let bestMSq = Infinity;
    let bestZeta = 0;
    for (let i = 0; i < count; i++) {
        const sinH = sinGs[i] * cosLon + cosGs[i] * sinLon;
        const cosH = cosGs[i] * cosLon - sinGs[i] * sinLon;
        const cosUcosH = cosU * cosH;
        const xi = cosU * sinH - xs[i];
        const eta = pSinU * cosDs[i] - cosUcosH * sinDs[i] - ys[i];
        const mSq = xi * xi + eta * eta;
        if (mSq < bestMSq) {
            bestMSq = mSq;
            bestIndex = i;
            bestZeta = pSinU * sinDs[i] + cosUcosH * cosDs[i];
        }
    }

    const m = Math.sqrt(bestMSq);
    const depth = ctx.l1s[bestIndex] - bestZeta * ctx.tanF1 - m;
    if (depth < -DEPTH_OUT_SLACK) {
        return false;
    }
    if (depth > DEPTH_IN_SLACK && Math.abs(bestZeta - ctx.z0) > ZETA_SLACK) {
        return bestZeta > ctx.z0;
    }

    const state = refineMaxEclipse(ctx, bestIndex, lonRad, sinU, cosU);

    return state.zeta >= ctx.z0 && state.m <= state.l1Effective;
}

export function isMaxEclipseVisibleAt(ctx: ScanContext, latDeg: number, lonDeg: number): boolean {
    const lonRad = lonDeg * DEG;
    const {sinU, cosU} = parametricLatitude(latDeg * DEG);

    return isMaxEclipseVisible(ctx, lonRad, Math.sin(lonRad), Math.cos(lonRad), sinU, cosU);
}

export default function calculatePenumbraVisibilityAlpha(
    elements: BesselianElements,
    width: number,
    height: number,
    z0: number,
): Uint8ClampedArray {
    const inside = new Uint8Array(width * height);
    computePenumbraInsideBand(elements, width, height, z0, 0, height, inside);
    const alpha = new Uint8ClampedArray(width * height);
    computePenumbraAlphaBand(elements, width, height, z0, 0, height, inside, alpha);

    return alpha;
}

export function computePenumbraInsideBand(
    elements: BesselianElements,
    width: number,
    height: number,
    z0: number,
    yStart: number,
    yEnd: number,
    inside: Uint8Array,
): void {
    const ctx = buildScanContext(elements, z0);
    const count = ctx.taus.length;

    const lonRads = new Float64Array(width);
    const sinLons = new Float64Array(width);
    const cosLons = new Float64Array(width);
    for (let px = 0; px < width; px++) {
        const lonRad = pixelCenterLon(px, width) * DEG;
        lonRads[px] = lonRad;
        sinLons[px] = Math.sin(lonRad);
        cosLons[px] = Math.cos(lonRad);
    }
    const sinUs = new Float64Array(height);
    const cosUs = new Float64Array(height);
    for (let py = yStart; py < yEnd; py++) {
        const {sinU, cosU} = parametricLatitude(pixelCenterLat(py, height) * DEG);
        sinUs[py] = sinU;
        cosUs[py] = cosU;
    }

    // Distance of a pixel outside the penumbra, minimized over the coarse instants; used to
    // discard whole tiles that stay clear of the shadow throughout the eclipse.
    const clearance = (px: number, py: number): number => {
        const {sinGs, cosGs, xs, ys, sinDs, cosDs, l1s} = ctx;
        const absTanF1 = Math.abs(ctx.tanF1);
        const sinLon = sinLons[px];
        const cosLon = cosLons[px];
        const pSinU = ONE_MINUS_F * sinUs[py];
        const cosU = cosUs[py];
        let best = Infinity;
        for (let i = 0; i < count; i++) {
            const sinH = sinGs[i] * cosLon + cosGs[i] * sinLon;
            const cosH = cosGs[i] * cosLon - sinGs[i] * sinLon;
            const xi = cosU * sinH - xs[i];
            const eta = pSinU * cosDs[i] - cosU * cosH * sinDs[i] - ys[i];
            const gap = Math.sqrt(xi * xi + eta * eta) - l1s[i] - absTanF1;
            if (gap < best) {
                best = gap;
            }
        }

        return best;
    };

    for (let tileY = yStart; tileY < yEnd; tileY += TILE_SIZE) {
        const tileYEnd = Math.min(height - 1, tileY + TILE_SIZE - 1);
        for (let tileX = 0; tileX < width; tileX += TILE_SIZE) {
            const xEnd = Math.min(width - 1, tileX + TILE_SIZE - 1);
            if (
                clearance(tileX, tileY) > TILE_SLACK
                && clearance(xEnd, tileY) > TILE_SLACK
                && clearance(tileX, tileYEnd) > TILE_SLACK
                && clearance(xEnd, tileYEnd) > TILE_SLACK
            ) {
                continue;
            }
            for (let py = tileY; py <= tileYEnd; py++) {
                const rowOffset = py * width;
                for (let px = tileX; px <= xEnd; px++) {
                    if (isMaxEclipseVisible(ctx, lonRads[px], sinLons[px], cosLons[px], sinUs[py], cosUs[py])) {
                        inside[rowOffset + px] = 1;
                    }
                }
            }
        }
    }
}

export function computePenumbraAlphaBand(
    elements: BesselianElements,
    width: number,
    height: number,
    z0: number,
    yStart: number,
    yEnd: number,
    inside: Uint8Array,
    alpha: Uint8ClampedArray,
): void {
    const ctx = buildScanContext(elements, z0);
    const lonStep = 360 / width;
    const latStep = 180 / height;
    for (let py = yStart; py < yEnd; py++) {
        const rowOffset = py * width;
        for (let px = 0; px < width; px++) {
            const value = inside[rowOffset + px];
            const onBorder =
                (px > 0 && inside[rowOffset + px - 1] !== value)
                || (px + 1 < width && inside[rowOffset + px + 1] !== value)
                || (py > 0 && inside[rowOffset - width + px] !== value)
                || (py + 1 < height && inside[rowOffset + width + px] !== value);
            if (!onBorder) {
                alpha[rowOffset + px] = value === 1 ? 255 : 0;
                continue;
            }
            let covered = 0;
            for (let sy = 0; sy < SUBSAMPLES; sy++) {
                const lat = 90 - (py + (sy + 0.5) / SUBSAMPLES) * latStep;
                for (let sx = 0; sx < SUBSAMPLES; sx++) {
                    const lon = (px + (sx + 0.5) / SUBSAMPLES) * lonStep - 180;
                    if (isMaxEclipseVisibleAt(ctx, lat, lon)) {
                        covered++;
                    }
                }
            }
            alpha[rowOffset + px] = Math.round((covered / (SUBSAMPLES * SUBSAMPLES)) * 255);
        }
    }
}
