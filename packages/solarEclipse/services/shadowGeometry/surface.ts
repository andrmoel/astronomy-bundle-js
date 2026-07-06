import {
    ECCENTRICITY_SQUARED as E_SQ,
    EARTH_ROTATION_DEG_PER_HOUR,
    EARTH_POLAR_RADIUS_RATIO as ONE_MINUS_F,
} from '@app/constants/earth';
import {RAD} from '@app/constants/math';
import {normalizeLongitude} from '@app/utils/location';
import type {BesselianElements, BesselianElementsAtTime} from '../../types/BesselianElementTypes';
import {getEclipseDeltaT} from '../../utils/besselianElements';

export interface SurfaceSolution {
    lat: number;
    lon: number;
    // Distance of the surface point from the fundamental plane along the shadow axis (Earth
    // equatorial radii). zeta / rho = sin(Sun's geocentric altitude); zeta = 0 is the
    // geometric terminator, zeta < 0 the night side.
    zeta: number;
    sinU: number;
}

export function solveSurfacePoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xi: number,
    eta: number,
    farSide: boolean,
): SurfaceSolution | null {
    const rho1 = Math.sqrt(1 - E_SQ * e.cosD * e.cosD);
    const sinD1 = e.sinD / rho1;
    const cosD1 = (ONE_MINUS_F * e.cosD) / rho1;

    const eta1 = eta / rho1;
    const bSq = 1 - xi * xi - eta1 * eta1;
    if (bSq < 0) {
        return null;
    }
    const sign = farSide ? -1 : 1;
    const B = sign * Math.sqrt(bSq);

    const sinU = eta1 * cosD1 + B * sinD1;
    const cosU = Math.sqrt(Math.max(0, 1 - sinU * sinU));

    const zetaSq = 1 - E_SQ * sinU * sinU - xi * xi - eta * eta;
    if (zetaSq < 0) {
        return null;
    }
    const zeta = sign * Math.sqrt(zetaSq);

    const theta = Math.atan2(xi, (zeta - ONE_MINUS_F * sinU * e.sinD) / e.cosD);
    const lat = Math.atan2(sinU, ONE_MINUS_F * cosU) * RAD;
    let lon = (theta - e.mu) * RAD + (EARTH_ROTATION_DEG_PER_HOUR * getEclipseDeltaT(elements)) / 3600;
    lon = normalizeLongitude(lon);

    return {lat, lon, zeta, sinU};
}
