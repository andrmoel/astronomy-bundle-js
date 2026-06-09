import {EARTH_POLAR_RADIUS_RATIO, EARTH_ROTATION_DEG_PER_HOUR, ECCENTRICITY_SQUARED} from '@app/constants/earth';
import {DEG} from '@app/constants/math';
import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';

const MAX_ITERATIONS = 30;
const ITERATION_TOLERANCE_HOURS = 1e-8;
const ECLIPSE_SEARCH_RANGE_HOURS = 4;

export function getLocationOfGreatestEclipse(elements: BesselianElements): LatLon {
    const tau = getTauOfGreatestEclipse(elements);
    const e = getBesselianElementsAtTime(elements, tau);
    const {sinD, cosD} = e;

    // If the shadow axis misses Earth, project it onto the limb
    const dist = Math.sqrt(e.x * e.x + e.y * e.y);
    const xi = dist > 1 ? e.x / dist : e.x;
    const eta = dist > 1 ? e.y / dist : e.y;

    const rho1 = Math.sqrt(1 - ECCENTRICITY_SQUARED * cosD * cosD);
    const sinD1 = sinD / rho1;
    const cosD1 = (EARTH_POLAR_RADIUS_RATIO * cosD) / rho1;
    const eta1 = eta / rho1;
    const B = Math.sqrt(Math.max(0, 1 - xi * xi - eta1 * eta1));

    const sinU = Math.max(-1, Math.min(1, eta1 * cosD1 + B * sinD1));
    const cosU = Math.sqrt(1 - sinU * sinU);

    const zeta = Math.sqrt(Math.max(0, 1 - ECCENTRICITY_SQUARED * sinU * sinU - xi * xi - eta * eta));

    const theta = Math.atan2(xi, (zeta - EARTH_POLAR_RADIUS_RATIO * sinU * sinD) / cosD);
    const lat = Math.atan2(sinU, EARTH_POLAR_RADIUS_RATIO * cosU) / DEG;
    const lon = (theta - e.mu) / DEG + (EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600;

    return {
        lat: lat,
        lon: normalizeLongitude(lon),
    };
}

export function getJulianDayOfGreatestEclipse(elements: BesselianElements): number {
    return elements.t0Jde - elements.deltaT / 86400;
}

export function getTauOfGreatestEclipse(elements: BesselianElements): number {
    let tau = 0;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const e = getBesselianElementsAtTime(elements, tau);
        const xp = polynomialDerivative(elements.x, tau);
        const yp = polynomialDerivative(elements.y, tau);
        const nSq = xp * xp + yp * yp;

        if (nSq < 1e-20) {
            return 0;
        }

        const delta = -(e.x * xp + e.y * yp) / nSq;
        tau += delta;

        if (Math.abs(tau) > ECLIPSE_SEARCH_RANGE_HOURS) {
            return 0;
        }

        if (Math.abs(delta) < ITERATION_TOLERANCE_HOURS) {
            return tau;
        }
    }

    return 0;
}
