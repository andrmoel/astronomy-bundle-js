import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';
import {CENTRAL_LINE_STEP_HOURS} from './constants';
import {solveSurfacePoint} from './surface';

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

export function calculateCentralLine(elements: BesselianElements, z0: number): Array<LatLon> {
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

    const startHook = calculateCentralLineHook(elements, firstTau, CENTRAL_LINE_STEP_HOURS, z0);
    const endHook = calculateCentralLineHook(elements, lastTau, -CENTRAL_LINE_STEP_HOURS, z0);

    return [...startHook.reverse(), ...main, ...endHook];
}

function calculateCentralLinePoint(elements: BesselianElements, tau: number): LatLon | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, false, getEclipseDeltaT(elements));

    return solution !== null ? {lat: solution.lat, lon: solution.lon} : null;
}

function centralLineSurfacePoint(
    elements: BesselianElements,
    tau: number,
    farSide: boolean,
): {point: LatLon; zeta: number} | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, farSide);

    return solution !== null ? {point: {lat: solution.lat, lon: solution.lon}, zeta: solution.zeta} : null;
}

// The central eclipse stays visible until the Sun sets at the horizon of the map's settings
// (with refraction: upper limb on the refracted horizon, Sun's centre at -50', slightly past
// the geometric tangent where the sunlit axis solution ends at zeta = 0). From that tangent
// we step into the eclipse (toward the interior) along the night-side axis solution,
// collecting points until zeta drops below z0. Points are ordered tangent -> horizon tip;
// at the geometric horizon (z0 = 0) the hook degenerates to a sub-pixel stub.
function calculateCentralLineHook(
    elements: BesselianElements,
    tangentTau: number,
    stepTowardInterior: number,
    z0: number,
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
        if (sol.zeta < z0) {
            break;
        }
    }

    return hook;
}
