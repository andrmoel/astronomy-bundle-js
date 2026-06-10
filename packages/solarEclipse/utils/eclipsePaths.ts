import {EARTH_POLAR_RADIUS_RATIO, EARTH_ROTATION_DEG_PER_HOUR, ECCENTRICITY_SQUARED} from '@app/constants/earth';
import {RAD} from '@app/constants/math';
import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import type {BesselianElements, BesselianElementsAtTime} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '../utils/besselianElements';

export function getCentralLine(elements: BesselianElements, stepsInSeconds = 10): Array<LatLon> {
    const points: Array<LatLon> = [];

    for (let tau = elements.tMin; tau <= elements.tMax; tau += stepsInSeconds / 3600) {
        const point = calculateCentralLinePoint(elements, tau);

        if (point !== null) {
            points.push(point);
        }
    }

    return points;
}

function calculateCentralLinePoint(elements: BesselianElements, tau: number): LatLon | null {
    const e = getBesselianElementsAtTime(elements, tau);

    return fundamentalToLatLon(elements, e, e.x, e.y);
}

export function fundamentalToLatLon(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xi: number,
    eta: number,
): LatLon | null {
    const rho1Sq = 1 - ECCENTRICITY_SQUARED * e.cosD * e.cosD;
    const rho1 = Math.sqrt(rho1Sq);
    const sinD1 = e.sinD / rho1;
    const cosD1 = (EARTH_POLAR_RADIUS_RATIO * e.cosD) / rho1;

    const eta1 = eta / rho1;
    const bSq = 1 - xi * xi - eta1 * eta1;

    if (bSq < 0) {
        return null;
    }

    const B = Math.sqrt(bSq);

    const sinU = eta1 * cosD1 + B * sinD1;
    const cosU = Math.sqrt(Math.max(0, 1 - sinU * sinU));

    const zetaSq = 1 - ECCENTRICITY_SQUARED * sinU * sinU - xi * xi - eta * eta;

    if (zetaSq < 0) {
        return null;
    }

    const zeta = Math.sqrt(zetaSq);

    const theta = Math.atan2(xi, (zeta - EARTH_POLAR_RADIUS_RATIO * sinU * e.sinD) / e.cosD);
    const lat = Math.atan2(sinU, EARTH_POLAR_RADIUS_RATIO * cosU) * RAD;
    let lon = (theta - e.mu) * RAD + (EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600;
    lon = normalizeLongitude(lon);

    return {lat, lon};
}
