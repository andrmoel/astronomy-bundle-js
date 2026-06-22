import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '../utils/besselianElements';
import {CENTRAL_LINE_STEP_HOURS, RISE_SET_SIN_ALTITUDE} from './constants';
import {solveSurfacePoint} from './surface';

// Projects the shadow axis (xi = x, eta = y) onto the surface and reports the depth zeta of
// that surface point. farSide selects the night-side intersection (zeta < 0) used to extend
// the line past the geometric horizon.
function centralLineSurfacePoint(
    elements: BesselianElements,
    tau: number,
    farSide: boolean,
): {point: LatLon; zeta: number} | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, farSide);

    return solution !== null ? {point: {lat: solution.lat, lon: solution.lon}, zeta: solution.zeta} : null;
}

// Refraction + Sun's upper limb: the central eclipse stays visible until the Sun's upper limb
// sets at the refracted horizon (Sun's centre at -50'), slightly past the geometric tangent
// where the sunlit axis solution ends at zeta = 0. From that tangent we step into the eclipse
// (toward the interior) along the night-side axis solution, collecting points until zeta drops
// below RISE_SET_SIN_ALTITUDE. Points are ordered tangent -> refracted tip.
function calculateCentralLineHook(
    elements: BesselianElements,
    tangentTau: number,
    stepTowardInterior: number,
): Array<LatLon> {
    const hook: Array<LatLon> = [];
    let tau = tangentTau;
    for (let i = 0; i < 1000; i++) {
        tau += stepTowardInterior;
        const sol = centralLineSurfacePoint(elements, tau, true);
        if (sol === null) {
            break;
        }
        hook.push(sol.point);
        if (sol.zeta < RISE_SET_SIN_ALTITUDE) {
            break;
        }
    }

    return hook;
}

export function calculateCentralLine(elements: BesselianElements): Array<LatLon> {
    const main: Array<LatLon> = [];
    let firstTau: number | null = null;
    let lastTau: number | null = null;

    for (let tau = elements.tMin; tau <= elements.tMax; tau += CENTRAL_LINE_STEP_HOURS) {
        const sol = centralLineSurfacePoint(elements, tau, false);
        if (sol === null) {
            continue;
        }
        main.push(sol.point);
        if (firstTau === null) {
            firstTau = tau;
        }
        lastTau = tau;
    }

    if (firstTau === null || lastTau === null) {
        return main;
    }

    const startHook = calculateCentralLineHook(elements, firstTau, CENTRAL_LINE_STEP_HOURS);
    const endHook = calculateCentralLineHook(elements, lastTau, -CENTRAL_LINE_STEP_HOURS);

    return [...startHook.reverse(), ...main, ...endHook];
}
