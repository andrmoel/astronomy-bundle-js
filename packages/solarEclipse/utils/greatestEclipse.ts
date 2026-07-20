import {SECONDS_PER_DAY} from '@app/constants/time';
import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import {solveLimbClampedSurfacePoint} from '@package/solarEclipse/services/shadowGeometry/utils/surface';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';

const MAX_ITERATIONS = 30;
const ITERATION_TOLERANCE_HOURS = 1e-8;
const ECLIPSE_SEARCH_RANGE_HOURS = 4;

export function getLocationOfGreatestEclipse(elements: BesselianElements): LatLon {
    const tau = getTauOfGreatestEclipse(elements);
    const e = getBesselianElementsAtTime(elements, tau);

    // If the shadow axis misses Earth, project it onto the limb
    const dist = Math.sqrt(e.x * e.x + e.y * e.y);
    const xi = dist > 1 ? e.x / dist : e.x;
    const eta = dist > 1 ? e.y / dist : e.y;

    const {lat, lon} = solveLimbClampedSurfacePoint(elements, e, xi, eta, getEclipseDeltaT(elements));

    return {lat, lon};
}

export function getJulianDayOfGreatestEclipse(elements: BesselianElements): number {
    return elements.t0Jde - getEclipseDeltaT(elements) / SECONDS_PER_DAY;
}

export function getGamma(elements: BesselianElements): number {
    const tau = getTauOfGreatestEclipse(elements);
    const e = getBesselianElementsAtTime(elements, tau);
    const distance = Math.sqrt(e.x * e.x + e.y * e.y);

    return e.y < 0 ? -distance : distance;
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
