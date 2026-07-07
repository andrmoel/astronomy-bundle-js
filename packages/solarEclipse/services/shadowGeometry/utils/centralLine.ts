import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import type {ShadowPathOptions} from '../types/ShadowPathTypes';
import {CENTRAL_LINE_STEP_HOURS, horizonSinAltitude} from './constants';
import {latLonChordDeg} from './contourGeometry';
import {type RingPoint, terminatorRingPoint} from './shadowOutline';
import {solveSurfacePoint} from './surface';

const DEFAULT_STEP_SECONDS = 10;
const TANGENT_TAU_ITERATIONS = 40;
const HORIZON_TAU_ITERATIONS = 40;
const HORIZON_WALK_MAX_STEPS = 3600;
const TIP_MAX_CHORD_DEG = 0.05;
const TIP_MAX_DEPTH = 12;

// The ground track of the shadow axis, ending exactly where the axis crosses the horizon at
// zeta = z0 — the point of the umbra path polygon's end cap that the central line must touch
// (its maximum eclipse is central and happens on the horizon). Between the last grid sample
// and that endpoint the axis races across the surface, so each tip is refined: the tangency
// time is bisected, the sunlit stretch up to the fold is filled in, and the night-side sliver
// down to z0 is followed on the far sheet, all subdivided on chord length.
export function getCentralLine(elements: BesselianElements, options: ShadowPathOptions = {}): Array<LatLon> {
    const z0 = horizonSinAltitude(options);
    const stepHours = (options.stepsInSeconds ?? DEFAULT_STEP_SECONDS) / 3600;

    const main: Array<LatLon> = [];
    let firstTau: number | null = null;
    let lastTau: number | null = null;
    for (let tau = elements.tMin; tau <= elements.tMax; tau += stepHours) {
        const sol = centralLineSurfacePoint(elements, tau, false);
        if (sol === null) {
            continue;
        }
        main.push(sol.point);
        firstTau ??= tau;
        lastTau = tau;
    }
    if (firstTau === null || lastTau === null) {
        return main;
    }

    const startTip = centralLineTip(elements, firstTau - stepHours, firstTau, z0);
    const endTip = centralLineTip(elements, lastTau + stepHours, lastTau, z0);

    return [...startTip.reverse(), ...main, ...endTip];
}

// One refined end of the line, ordered from the interior (adjacent to the grid sample at
// tauInside, which is not repeated) out to the horizon endpoint. The endpoint itself is the
// horizon-ring point at the axis azimuth, bisected on |axis| = ring radius: the axis-surface
// solution ends at the ellipsoid fold, which sits O(e^2) short of zeta = z0 (amplified by the
// grazing geometry — ~0.13 degrees), so the ring must be solved directly to land on the same
// curve as the umbra path polygon's end cap.
function centralLineTip(elements: BesselianElements, tauOutside: number, tauInside: number, z0: number): Array<LatLon> {
    const outside = Math.min(elements.tMax, Math.max(elements.tMin, tauOutside));
    if (outside === tauInside || centralLineSurfacePoint(elements, outside, false) !== null) {
        return [];
    }
    const tangentTau = bisectTangentTau(elements, outside, tauInside);
    const tangent = centralLineSurfacePoint(elements, tangentTau, false);
    if (tangent === null) {
        return [];
    }

    const tip: Array<LatLon> = [];
    const inside = centralLineSurfacePoint(elements, tauInside, false);
    if (inside !== null) {
        subdivideTrack(elements, tauInside, inside.point, tangentTau, tangent.point, false, 0, tip);
    }
    tip.push(tangent.point);

    const horizonTau = axisRingCrossingTau(elements, tangentTau, Math.sign(tauInside - tauOutside), z0);
    if (horizonTau === null) {
        return tip;
    }
    // With refraction the stretch between the fold and the horizon crossing lies on the far
    // sheet (Sun between -50' and the geometric horizon); with the geometric horizon it falls
    // into the fold gap and collapses to the direct connection.
    const farTangent = centralLineSurfacePoint(elements, tangentTau, true);
    const farEnd = centralLineSurfacePoint(elements, horizonTau, true);
    if (farTangent !== null && farEnd !== null && farEnd.zeta >= z0 - 1e-6) {
        subdivideTrack(elements, tangentTau, farTangent.point, horizonTau, farEnd.point, true, 0, tip);
    }
    tip.push(axisRingPoint(elements, horizonTau, z0).point);

    return tip;
}

function bisectTangentTau(elements: BesselianElements, tauOff: number, tauOn: number): number {
    let off = tauOff;
    let on = tauOn;
    for (let iter = 0; iter < TANGENT_TAU_ITERATIONS; iter++) {
        const tauMid = (off + on) / 2;
        if (centralLineSurfacePoint(elements, tauMid, false) !== null) {
            on = tauMid;
        } else {
            off = tauMid;
        }
    }

    return on;
}

// The time at which the shadow axis crosses the horizon ring at zeta = z0, bisected on the
// sign of |axis| - ring radius. The bracket is walked from the tangency into the eclipse;
// if the axis is already inside the ring there, the outside bound is walked the other way.
function axisRingCrossingTau(
    elements: BesselianElements,
    tangentTau: number,
    direction: number,
    z0: number,
): number | null {
    const clearance = (tau: number): number => {
        const e = getBesselianElementsAtTime(elements, tau);
        const ring = axisRingPoint(elements, tau, z0);

        return Math.hypot(e.x, e.y) - Math.hypot(ring.xi, ring.eta);
    };

    let outside: number | null = null;
    let inside: number | null = null;
    for (let step = 0; step <= HORIZON_WALK_MAX_STEPS && inside === null; step++) {
        const tau = tangentTau + direction * step * CENTRAL_LINE_STEP_HOURS;
        if (clearance(tau) >= 0) {
            outside = tau;
        } else {
            inside = tau;
        }
    }
    for (let step = 1; step <= HORIZON_WALK_MAX_STEPS && outside === null; step++) {
        const tau = tangentTau - direction * step * CENTRAL_LINE_STEP_HOURS;
        if (clearance(tau) >= 0) {
            outside = tau;
        } else {
            inside = tau;
        }
    }
    if (outside === null || inside === null) {
        return null;
    }

    let above = outside;
    let below = inside;
    for (let iter = 0; iter < HORIZON_TAU_ITERATIONS; iter++) {
        const tauMid = (above + below) / 2;
        if (clearance(tauMid) >= 0) {
            above = tauMid;
        } else {
            below = tauMid;
        }
    }

    return (above + below) / 2;
}

function axisRingPoint(elements: BesselianElements, tau: number, z0: number): RingPoint {
    const e = getBesselianElementsAtTime(elements, tau);

    return terminatorRingPoint(elements, e, Math.atan2(e.y, e.x), e.sinD, z0);
}

function subdivideTrack(
    elements: BesselianElements,
    tauA: number,
    pointA: LatLon,
    tauB: number,
    pointB: LatLon,
    farSide: boolean,
    depth: number,
    out: Array<LatLon>,
): void {
    if (depth >= TIP_MAX_DEPTH || latLonChordDeg(pointA, pointB) <= TIP_MAX_CHORD_DEG) {
        return;
    }
    const tauMid = (tauA + tauB) / 2;
    const mid = centralLineSurfacePoint(elements, tauMid, farSide);
    if (mid === null) {
        return;
    }
    subdivideTrack(elements, tauA, pointA, tauMid, mid.point, farSide, depth + 1, out);
    out.push(mid.point);
    subdivideTrack(elements, tauMid, mid.point, tauB, pointB, farSide, depth + 1, out);
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

function centralLineSurfacePoint(
    elements: BesselianElements,
    tau: number,
    farSide: boolean,
): {point: LatLon; zeta: number} | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, farSide);

    return solution !== null ? {point: {lat: solution.lat, lon: solution.lon}, zeta: solution.zeta} : null;
}
