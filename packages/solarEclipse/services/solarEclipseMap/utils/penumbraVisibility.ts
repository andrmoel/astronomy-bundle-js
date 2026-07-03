import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {DEG, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F} from './constants';

// The penumbral region is shaded per pixel: a location is shaded iff at the moment of ITS
// OWN maximum eclipse the Sun is up per the map's horizon convention (zeta >= z0: the
// geometric horizon at z0 = 0, or the refracted upper-limb horizon at z0 = sin(-50'))
// and the eclipse magnitude is positive (m <= L1). This
// pointwise definition produces every boundary in one stroke — the penumbral limit
// (m = L1 envelope), the maximum-eclipse-at-sunrise/sunset curves (the green
// lines), their polar-midnight cusps, and the midnight-sun arcs joining them — where a
// polygon assembly needs a fragile per-curve case analysis that breaks with the eclipse
// geometry (compare the 2017-08-21 Arctic, where the rise/set curves swap sides at the
// local-midnight cusp near 78N).
//
// Maximum eclipse is the tau minimizing the fundamental-plane separation m between the
// location and the shadow axis — the same condition that defines the green curves, so the
// mask's rise/set border coincides with them exactly.

// Coarse scan step over [tMin, tMax]. Between samples m dips below the sampled minimum by
// at most ~ m'' (step/2)^2 / 2 ~ 0.005 Earth radii, covered by the decision slacks below.
const COARSE_STEP_HOURS = 0.25;
// Coarse depth (L1 - m) below this is conclusively outside, above it conclusively eclipsed.
const DEPTH_OUT_SLACK = 0.03;
const DEPTH_IN_SLACK = 0.01;
// Zeta moves by at most ~0.26/h (Earth rotation), i.e. ~0.033 per half step; a coarse zeta
// farther than this slack from the horizon threshold stays on its side at the true minimum.
const ZETA_SLACK = 0.05;
// Square tiles whose corners stay this far outside the penumbra at every sample are skipped
// wholesale; the slack covers the tile diagonal (~0.02 at 8 map pixels) plus the coarse
// sampling dip.
const TILE_SIZE = 8;
const TILE_SLACK = 0.05;
// Border pixels are supersampled on an n x n subgrid for antialiasing.
const SUBSAMPLES = 3;

interface ScanContext {
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

function buildScanContext(elements: BesselianElements, z0: number): ScanContext {
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

// Geocentric direction of a sea-level point at geodetic latitude: tan U = (1 - f) tan(lat).
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

// Separation and horizon state of the location at one exact instant.
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

// Golden-section refinement of the separation minimum inside the coarse bracket.
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
    let m1 = stateAtTau(ctx, t1, lonRad, sinU, cosU).m;
    let m2 = stateAtTau(ctx, t2, lonRad, sinU, cosU).m;
    for (let iter = 0; iter < 20; iter++) {
        if (m1 <= m2) {
            b = t2;
            t2 = t1;
            m2 = m1;
            t1 = b - GOLDEN * (b - a);
            m1 = stateAtTau(ctx, t1, lonRad, sinU, cosU).m;
        } else {
            a = t1;
            t1 = t2;
            m1 = m2;
            t2 = a + GOLDEN * (b - a);
            m2 = stateAtTau(ctx, t2, lonRad, sinU, cosU).m;
        }
    }

    return stateAtTau(ctx, (a + b) / 2, lonRad, sinU, cosU);
}

// Is the maximum eclipse of this location visible (Sun up, magnitude positive)?
function isMaxEclipseVisible(
    ctx: ScanContext,
    lonRad: number,
    sinLon: number,
    cosLon: number,
    sinU: number,
    cosU: number,
): boolean {
    const count = ctx.taus.length;
    const pSinU = ONE_MINUS_F * sinU;
    let bestIndex = 0;
    let bestMSq = Infinity;
    let bestZeta = 0;
    for (let i = 0; i < count; i++) {
        const sinH = ctx.sinGs[i] * cosLon + ctx.cosGs[i] * sinLon;
        const cosH = ctx.cosGs[i] * cosLon - ctx.sinGs[i] * sinLon;
        const cosUcosH = cosU * cosH;
        const xi = cosU * sinH - ctx.xs[i];
        const eta = pSinU * ctx.cosDs[i] - cosUcosH * ctx.sinDs[i] - ctx.ys[i];
        const mSq = xi * xi + eta * eta;
        if (mSq < bestMSq) {
            bestMSq = mSq;
            bestIndex = i;
            bestZeta = pSinU * ctx.sinDs[i] + cosUcosH * ctx.cosDs[i];
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

function isMaxEclipseVisibleAt(ctx: ScanContext, latDeg: number, lonDeg: number): boolean {
    const lonRad = lonDeg * DEG;
    const {sinU, cosU} = parametricLatitude(latDeg * DEG);

    return isMaxEclipseVisible(ctx, lonRad, Math.sin(lonRad), Math.cos(lonRad), sinU, cosU);
}

// Alpha mask (0..255 per pixel, row-major) of the visible penumbral eclipse on the
// equirectangular map, antialiased along its boundary by subpixel supersampling.
export default function calculatePenumbraVisibilityAlpha(
    elements: BesselianElements,
    width: number,
    height: number,
    z0: number,
): Uint8ClampedArray {
    const ctx = buildScanContext(elements, z0);
    const count = ctx.taus.length;

    const lonRads = new Float64Array(width);
    const sinLons = new Float64Array(width);
    const cosLons = new Float64Array(width);
    for (let px = 0; px < width; px++) {
        const lonRad = (((px + 0.5) / width) * 360 - 180) * DEG;
        lonRads[px] = lonRad;
        sinLons[px] = Math.sin(lonRad);
        cosLons[px] = Math.cos(lonRad);
    }
    const sinUs = new Float64Array(height);
    const cosUs = new Float64Array(height);
    for (let py = 0; py < height; py++) {
        const {sinU, cosU} = parametricLatitude((90 - ((py + 0.5) / height) * 180) * DEG);
        sinUs[py] = sinU;
        cosUs[py] = cosU;
    }

    // Distance of a pixel outside the penumbra, minimized over the coarse instants; used to
    // discard whole tiles that stay clear of the shadow throughout the eclipse.
    const clearance = (px: number, py: number): number => {
        const sinLon = sinLons[px];
        const cosLon = cosLons[px];
        const pSinU = ONE_MINUS_F * sinUs[py];
        const cosU = cosUs[py];
        let best = Infinity;
        for (let i = 0; i < count; i++) {
            const sinH = ctx.sinGs[i] * cosLon + ctx.cosGs[i] * sinLon;
            const cosH = ctx.cosGs[i] * cosLon - ctx.sinGs[i] * sinLon;
            const xi = cosU * sinH - ctx.xs[i];
            const eta = pSinU * ctx.cosDs[i] - cosU * cosH * ctx.sinDs[i] - ctx.ys[i];
            const gap = Math.sqrt(xi * xi + eta * eta) - ctx.l1s[i] - Math.abs(ctx.tanF1);
            if (gap < best) {
                best = gap;
            }
        }

        return best;
    };

    const inside = new Uint8Array(width * height);
    for (let tileY = 0; tileY < height; tileY += TILE_SIZE) {
        const yEnd = Math.min(height - 1, tileY + TILE_SIZE - 1);
        for (let tileX = 0; tileX < width; tileX += TILE_SIZE) {
            const xEnd = Math.min(width - 1, tileX + TILE_SIZE - 1);
            if (
                clearance(tileX, tileY) > TILE_SLACK
                && clearance(xEnd, tileY) > TILE_SLACK
                && clearance(tileX, yEnd) > TILE_SLACK
                && clearance(xEnd, yEnd) > TILE_SLACK
            ) {
                continue;
            }
            for (let py = tileY; py <= yEnd; py++) {
                const rowOffset = py * width;
                for (let px = tileX; px <= xEnd; px++) {
                    if (isMaxEclipseVisible(ctx, lonRads[px], sinLons[px], cosLons[px], sinUs[py], cosUs[py])) {
                        inside[rowOffset + px] = 1;
                    }
                }
            }
        }
    }

    const alpha = new Uint8ClampedArray(width * height);
    const lonStep = 360 / width;
    const latStep = 180 / height;
    for (let py = 0; py < height; py++) {
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

    return alpha;
}
