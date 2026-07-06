import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {E_SQ, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F, RAD} from './constants';

export interface SurfaceSolution {
    lat: number;
    lon: number;
    zeta: number;
    sinU: number;
}

export function solveSurfacePoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xi: number,
    eta: number,
    farSide: boolean,
    deltaT: number = elements.deltaT,
): SurfaceSolution | null {
    const {eta1, sinD1, cosD1} = diskTerms(e, eta);
    const bSq = 1 - xi * xi - eta1 * eta1;
    if (bSq < 0) {
        return null;
    }
    const sign = farSide ? -1 : 1;
    const B = sign * Math.sqrt(bSq);

    const sinU = eta1 * cosD1 + B * sinD1;

    const zetaSq = 1 - E_SQ * sinU * sinU - xi * xi - eta * eta;
    if (zetaSq < 0) {
        return null;
    }
    const zeta = sign * Math.sqrt(zetaSq);

    return finishSolution(e, xi, sinU, zeta, deltaT);
}

// Like solveSurfacePoint, but clamps a point that misses the ellipsoid onto the limb
// (B = 0, zeta = 0) instead of failing, always on the sunlit near side.
export function solveLimbClampedSurfacePoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xi: number,
    eta: number,
    deltaT: number = elements.deltaT,
): SurfaceSolution {
    const {eta1, sinD1, cosD1} = diskTerms(e, eta);
    const B = Math.sqrt(Math.max(0, 1 - xi * xi - eta1 * eta1));

    const sinU = Math.max(-1, Math.min(1, eta1 * cosD1 + B * sinD1));
    const zeta = Math.sqrt(Math.max(0, 1 - E_SQ * sinU * sinU - xi * xi - eta * eta));

    return finishSolution(e, xi, sinU, zeta, deltaT);
}

export function fundamentalToLatLon(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xi: number,
    eta: number,
): LatLon | null {
    const solution = solveSurfacePoint(elements, e, xi, eta, false);

    return solution !== null ? {lat: solution.lat, lon: solution.lon} : null;
}

function diskTerms(e: BesselianElementsAtTime, eta: number): {eta1: number; sinD1: number; cosD1: number} {
    const rho1 = Math.sqrt(1 - E_SQ * e.cosD * e.cosD);

    return {eta1: eta / rho1, sinD1: e.sinD / rho1, cosD1: (ONE_MINUS_F * e.cosD) / rho1};
}

function finishSolution(
    e: BesselianElementsAtTime,
    xi: number,
    sinU: number,
    zeta: number,
    deltaT: number,
): SurfaceSolution {
    const cosU = Math.sqrt(Math.max(0, 1 - sinU * sinU));
    const theta = Math.atan2(xi, (zeta - ONE_MINUS_F * sinU * e.sinD) / e.cosD);
    const lat = Math.atan2(sinU, ONE_MINUS_F * cosU) * RAD;
    const lon = normalizeLongitude((theta - e.mu) * RAD + (EARTH_ROTATION_DEG_PER_HOUR * deltaT) / 3600);

    return {lat, lon, zeta, sinU};
}
