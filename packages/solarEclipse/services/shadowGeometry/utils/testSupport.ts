import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {
    getLocalEclipseCircumstances,
    getLocalHorizontalCoordinates,
    getMagnitude,
} from '@package/solarEclipse/utils/localCircumstances';
import {DEG, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F} from './constants';

// 2019-07-02 (total, South Pacific / Chile / Argentina)
export const ELEMENTS_2019_07_02: BesselianElements = {
    t0Jde: 2458667.30842,
    t0Hours: 19,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [-0.215634, 0.56620872, 0.0000274, -0.00000879],
    y: [-0.65070802, 0.0106399, -0.0001272, -2.7e-7],
    d: [23.0129509, -0.003187, -0.000005],
    mu: [103.9797287, 14.99950981, 0],
    l1: [0.53763098, -0.0000898, -0.000012],
    l2: [-0.008464, -0.0000894, -0.000012],
    tanF1: 0.0045984,
    tanF2: 0.0045755,
};

// 2021-12-04 (total, Antarctica)
export const ELEMENTS_2021_12_04: BesselianElements = {
    t0Jde: 2459552.81572,
    t0Hours: 8,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [0.025209, 0.56830281, 0.0000391, -0.00000965],
    y: [-0.98365301, -0.13151421, 0.0002213, 0.0000024],
    d: [-22.27471924, -0.005178, 0.000006],
    mu: [302.45217896, 14.99728012, 0],
    l1: [0.53780502, -0.000016, -0.0000131],
    l2: [-0.008292, -0.000016, -0.0000131],
    tanF1: 0.0047434,
    tanF2: 0.0047198,
};

// 2029-12-05 (partial, southern South America and Antarctica, south pole inside)
export const ELEMENTS_2029_12_05: BesselianElements = {
    t0Jde: 2462476.128000021,
    t0Hours: 15,
    tMin: -4,
    tMax: 4,
    deltaT: 77.5,
    x: [-0.06383299827575684, 0.5766354487614564, -0.0000027008880886257518, -0.00000950007049771386],
    y: [-1.0596660375595093, -0.014017194180712853, 0.00022950294351922212, 1.0003961300112125e-7],
    d: [-22.445449829101562, -0.0050537751560335575, 0.000006000096133378196],
    mu: [47.30984878540039, 14.997170428015565, 0],
    l1: [0.5406419206627513, 0.00006989796151927013, -0.000012799829096346935],
    l2: [-0.005469252601702933, 0.0000694996955783325, -0.000012799829096346935],
    tanF1: 0.00474459830624857,
    tanF2: 0.004720900282291905,
};

// Whether the umbra/antumbra ever covers the point while the Sun stands above the geometric
// horizon (zeta >= 0) — the region convention of the umbra path polygon and the map's
// umbral shading. Scans coarsely with early exit, then finely around the closest approach.
export function everInsideVisibleUmbra(eclipse: BesselianElements, point: LatLon): boolean {
    const latRad = point.lat * DEG;
    const lonRad = point.lon * DEG;
    const sinLat = Math.sin(latRad);
    const cosLat = Math.cos(latRad);
    const norm = Math.hypot(cosLat, ONE_MINUS_F * sinLat);
    const sinU = (ONE_MINUS_F * sinLat) / norm;
    const cosU = cosLat / norm;
    const ghaOffset = ((EARTH_ROTATION_DEG_PER_HOUR * eclipse.deltaT) / 3600) * DEG;

    const depth = (tau: number): number => {
        const e = getBesselianElementsAtTime(eclipse, tau);
        const H = e.mu - ghaOffset + lonRad;
        const pSinU = ONE_MINUS_F * sinU;
        const cosUcosH = cosU * Math.cos(H);
        const xi = cosU * Math.sin(H);
        const zeta = pSinU * e.sinD + cosUcosH * e.cosD;
        if (zeta < 0) {
            return -Infinity;
        }
        const eta = pSinU * e.cosD - cosUcosH * e.sinD;
        const m = Math.hypot(xi - e.x, eta - e.y);

        return Math.abs(e.l2 - zeta * eclipse.tanF2) - m;
    };

    const coarse = 20 / 3600;
    let best = -Infinity;
    let bestTau = eclipse.tMin;
    for (let tau = eclipse.tMin; tau <= eclipse.tMax; tau += coarse) {
        const d = depth(tau);
        if (d > 0) {
            return true;
        }
        if (d > best) {
            best = d;
            bestTau = tau;
        }
    }
    for (let tau = bestTau - coarse; tau <= bestTau + coarse; tau += 0.5 / 3600) {
        if (depth(tau) > 0) {
            return true;
        }
    }

    return false;
}

export function maxEclipseCircumstances(
    eclipse: BesselianElements,
    point: LatLon,
): {magnitude: number; altitude: number} {
    const location = {...point, elevation: 0};
    let bestTau = eclipse.tMin;
    let bestDistance = Infinity;
    for (let tau = eclipse.tMin; tau <= eclipse.tMax; tau += 0.005) {
        const {distance} = getLocalEclipseCircumstances(eclipse, location, tau);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestTau = tau;
        }
    }
    let lower = bestTau - 0.005;
    let upper = bestTau + 0.005;
    for (let iter = 0; iter < 50; iter++) {
        const tau1 = lower + (upper - lower) / 3;
        const tau2 = upper - (upper - lower) / 3;
        const distance1 = getLocalEclipseCircumstances(eclipse, location, tau1).distance;
        const distance2 = getLocalEclipseCircumstances(eclipse, location, tau2).distance;
        if (distance1 < distance2) {
            upper = tau2;
        } else {
            lower = tau1;
        }
    }
    const circumstances = getLocalEclipseCircumstances(eclipse, location, (lower + upper) / 2);

    return {
        magnitude: getMagnitude(circumstances),
        altitude: getLocalHorizontalCoordinates(circumstances, location).altitude,
    };
}
