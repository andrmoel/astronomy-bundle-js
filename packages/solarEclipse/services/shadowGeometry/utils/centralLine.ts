import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';
import type {ShadowPathOptions} from '../types/ShadowPathTypes';
import {CENTRAL_LINE_STEP_HOURS, DEG, horizonSinAltitude, RAD} from './constants';
import {groundFundamentalPoint, solveSurfacePoint} from './surface';

const DEFAULT_STEP_SECONDS = 10;

const SEED_SCAN_SAMPLES = 240;

const TRACE_INITIAL_STEP_DEG = 0.05;
const TRACE_MIN_STEP_DEG = 0.0005;
const TRACE_MAX_STEP_DEG = 0.5;
const TRACE_MAX_TURN_DEG = 4;
const TRACE_STEP_GROW_FACTOR = 1.4;
const TRACE_JACOBIAN_STEP_DEG = 1e-5;
const TRACE_JACOBIAN_STEP_HOURS = 1e-6;
const TRACE_RESIDUAL_TOLERANCE = 1e-11;
const TRACE_CORRECTOR_ITERATIONS = 12;
const TRACE_MAX_POINTS_PER_DIRECTION = 50000;
const TRACE_TAU_MARGIN_HOURS = 0.25;
const HORIZON_BISECTION_ITERATIONS = 40;

interface TraceState {
    lat: number;
    lon: number;
    tau: number;
}

interface TraceVector {
    lat: number;
    lon: number;
    tau: number;
}

export function getCentralLine(elements: BesselianElements, options: ShadowPathOptions = {}): Array<LatLon> {
    const stepHours = (options.stepsInSeconds ?? DEFAULT_STEP_SECONDS) / 3600;

    return traceCentralLine(elements, horizonSinAltitude(options), stepHours);
}

export function calculateCentralLine(elements: BesselianElements, z0: number): Array<LatLon> {
    return traceCentralLine(elements, z0, CENTRAL_LINE_STEP_HOURS);
}

// The central line is the solution curve of (xi, eta)(lat, lon, tau) = (x, y)(tau) in
// (lat, lon, tau) space, traced with pseudo-arclength continuation. Where the shadow axis
// grazes the Earth's limb the curve simply folds in tau and the tangent keeps pointing along
// the ground track, so no near/far sheet handling is needed; each end terminates exactly on
// the horizon zeta = z0 of the requested convention.
function traceCentralLine(elements: BesselianElements, z0: number, stepHours: number): Array<LatLon> {
    const seed = findSeedState(elements);
    if (seed === null) {
        return [];
    }

    const forward = traceDirection(elements, seed, 1, z0, stepHours);
    const backward = traceDirection(elements, seed, -1, z0, stepHours);

    return [...backward.reverse(), toLatLon(seed), ...forward].map(({lat, lon}) => ({
        lat,
        lon: normalizeLongitude(lon),
    }));
}

function findSeedState(elements: BesselianElements): TraceState | null {
    let best: TraceState | null = null;
    let bestAxisDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i <= SEED_SCAN_SAMPLES; i++) {
        const tau = elements.tMin + ((elements.tMax - elements.tMin) * i) / SEED_SCAN_SAMPLES;
        const e = getBesselianElementsAtTime(elements, tau);
        const axisDistance = Math.hypot(e.x, e.y);
        if (axisDistance >= bestAxisDistance) {
            continue;
        }
        const solution = solveSurfacePoint(elements, e, e.x, e.y, false);
        if (solution !== null) {
            best = {lat: solution.lat, lon: solution.lon, tau};
            bestAxisDistance = axisDistance;
        }
    }
    if (best === null) {
        return null;
    }

    return correctOntoCurve(elements, best);
}

function traceDirection(
    elements: BesselianElements,
    seed: TraceState,
    direction: number,
    z0: number,
    stepHours: number,
): Array<LatLon> {
    const points: Array<LatLon> = [];
    let state = seed;
    let previousTangent = curveTangent(elements, seed, null);
    if (previousTangent === null) {
        return points;
    }
    if (Math.sign(previousTangent.tau || 1) !== direction) {
        previousTangent = negate(previousTangent);
    }

    let stepDeg = TRACE_INITIAL_STEP_DEG;
    for (let i = 0; i < TRACE_MAX_POINTS_PER_DIRECTION; i++) {
        const advanced = advanceAlongCurve(elements, state, previousTangent, stepDeg, stepHours);
        if (advanced === null) {
            return points;
        }
        if (groundZeta(elements, advanced.state) < z0) {
            const endpoint = bisectHorizonEndpoint(elements, state, previousTangent, advanced.usedStepDeg, z0);
            if (endpoint !== null) {
                points.push(toLatLon(endpoint));
            }
            return points;
        }
        if (
            advanced.state.tau < elements.tMin - TRACE_TAU_MARGIN_HOURS
            || advanced.state.tau > elements.tMax + TRACE_TAU_MARGIN_HOURS
        ) {
            return points;
        }
        points.push(toLatLon(advanced.state));
        state = advanced.state;
        previousTangent = advanced.tangent;
        stepDeg =
            advanced.turnDeg < TRACE_MAX_TURN_DEG / 3
                ? Math.min(advanced.usedStepDeg * TRACE_STEP_GROW_FACTOR, TRACE_MAX_STEP_DEG)
                : advanced.usedStepDeg;
    }

    return points;
}

function advanceAlongCurve(
    elements: BesselianElements,
    state: TraceState,
    previousTangent: TraceVector,
    stepDeg: number,
    stepHours: number,
): {state: TraceState; tangent: TraceVector; usedStepDeg: number; turnDeg: number} | null {
    let step = stepDeg;
    while (true) {
        const predicted = predictState(state, previousTangent, step, stepHours);
        const corrected = correctOntoCurve(elements, predicted);
        if (corrected !== null) {
            const tangent = curveTangent(elements, corrected, previousTangent);
            if (tangent !== null) {
                const turnDeg = groundTurnDeg(previousTangent, tangent, corrected.lat);
                if (turnDeg <= TRACE_MAX_TURN_DEG || step <= TRACE_MIN_STEP_DEG) {
                    return {state: corrected, tangent, usedStepDeg: step, turnDeg};
                }
            }
        }
        if (step <= TRACE_MIN_STEP_DEG) {
            return null;
        }
        step = Math.max(step / 2, TRACE_MIN_STEP_DEG);
    }
}

function predictState(state: TraceState, tangent: TraceVector, stepDeg: number, stepHours: number): TraceState {
    const groundSpeed = groundMagnitude(tangent, state.lat);
    let scale = stepDeg / Math.max(groundSpeed, 1e-12);
    if (Math.abs(tangent.tau) * scale > stepHours) {
        scale = stepHours / Math.abs(tangent.tau);
    }

    return {
        lat: state.lat + tangent.lat * scale,
        lon: state.lon + tangent.lon * scale,
        tau: state.tau + tangent.tau * scale,
    };
}

// Newton with the minimal-norm pseudoinverse of the 2x3 residual Jacobian: the correction
// stays perpendicular to the curve, so the continuation parameter is not disturbed.
function correctOntoCurve(elements: BesselianElements, start: TraceState): TraceState | null {
    let state = start;
    for (let iter = 0; iter < TRACE_CORRECTOR_ITERATIONS; iter++) {
        const residual = curveResidual(elements, state);
        if (Math.hypot(residual.xi, residual.eta) < TRACE_RESIDUAL_TOLERANCE) {
            return state;
        }
        const jacobian = residualJacobian(elements, state);
        const delta = minimalNormSolution(jacobian, residual);
        if (delta === null) {
            return null;
        }
        state = {lat: state.lat - delta.lat, lon: state.lon - delta.lon, tau: state.tau - delta.tau};
    }

    return null;
}

function curveTangent(elements: BesselianElements, state: TraceState, orient: TraceVector | null): TraceVector | null {
    const jacobian = residualJacobian(elements, state);
    const tangent = {
        lat: jacobian.xi.lon * jacobian.eta.tau - jacobian.xi.tau * jacobian.eta.lon,
        lon: jacobian.xi.tau * jacobian.eta.lat - jacobian.xi.lat * jacobian.eta.tau,
        tau: jacobian.xi.lat * jacobian.eta.lon - jacobian.xi.lon * jacobian.eta.lat,
    };
    const length = Math.hypot(tangent.lat, tangent.lon, tangent.tau);
    if (length < 1e-18) {
        return null;
    }
    const normalized = {lat: tangent.lat / length, lon: tangent.lon / length, tau: tangent.tau / length};
    if (orient !== null && dot(normalized, orient) < 0) {
        return negate(normalized);
    }

    return normalized;
}

interface ResidualJacobian {
    xi: TraceVector;
    eta: TraceVector;
}

function residualJacobian(elements: BesselianElements, state: TraceState): ResidualJacobian {
    const hDeg = TRACE_JACOBIAN_STEP_DEG;
    const hTau = TRACE_JACOBIAN_STEP_HOURS;
    const latPlus = curveResidual(elements, {...state, lat: state.lat + hDeg});
    const latMinus = curveResidual(elements, {...state, lat: state.lat - hDeg});
    const lonPlus = curveResidual(elements, {...state, lon: state.lon + hDeg});
    const lonMinus = curveResidual(elements, {...state, lon: state.lon - hDeg});
    const tauPlus = curveResidual(elements, {...state, tau: state.tau + hTau});
    const tauMinus = curveResidual(elements, {...state, tau: state.tau - hTau});

    return {
        xi: {
            lat: (latPlus.xi - latMinus.xi) / (2 * hDeg),
            lon: (lonPlus.xi - lonMinus.xi) / (2 * hDeg),
            tau: (tauPlus.xi - tauMinus.xi) / (2 * hTau),
        },
        eta: {
            lat: (latPlus.eta - latMinus.eta) / (2 * hDeg),
            lon: (lonPlus.eta - lonMinus.eta) / (2 * hDeg),
            tau: (tauPlus.eta - tauMinus.eta) / (2 * hTau),
        },
    };
}

function minimalNormSolution(jacobian: ResidualJacobian, residual: {xi: number; eta: number}): TraceVector | null {
    const a = dot(jacobian.xi, jacobian.xi);
    const b = dot(jacobian.xi, jacobian.eta);
    const c = dot(jacobian.eta, jacobian.eta);
    const det = a * c - b * b;
    if (Math.abs(det) < 1e-24) {
        return null;
    }
    const alpha = (c * residual.xi - b * residual.eta) / det;
    const beta = (a * residual.eta - b * residual.xi) / det;

    return {
        lat: alpha * jacobian.xi.lat + beta * jacobian.eta.lat,
        lon: alpha * jacobian.xi.lon + beta * jacobian.eta.lon,
        tau: alpha * jacobian.xi.tau + beta * jacobian.eta.tau,
    };
}

function bisectHorizonEndpoint(
    elements: BesselianElements,
    state: TraceState,
    tangent: TraceVector,
    stepDeg: number,
    z0: number,
): TraceState | null {
    let above = 0;
    let below = stepDeg;
    let endpoint: TraceState | null = null;
    for (let iter = 0; iter < HORIZON_BISECTION_ITERATIONS; iter++) {
        const mid = (above + below) / 2;
        const candidate = correctOntoCurve(elements, predictState(state, tangent, mid, Number.POSITIVE_INFINITY));
        if (candidate === null) {
            below = mid;
            continue;
        }
        if (groundZeta(elements, candidate) >= z0) {
            above = mid;
            endpoint = candidate;
        } else {
            below = mid;
        }
    }

    return endpoint;
}

function curveResidual(elements: BesselianElements, state: TraceState): {xi: number; eta: number} {
    const e = getBesselianElementsAtTime(elements, state.tau);
    const ground = groundFundamentalPoint(elements, e, state.lat, state.lon, getEclipseDeltaT(elements));

    return {xi: ground.xi - e.x, eta: ground.eta - e.y};
}

function groundZeta(elements: BesselianElements, state: TraceState): number {
    const e = getBesselianElementsAtTime(elements, state.tau);

    return groundFundamentalPoint(elements, e, state.lat, state.lon, getEclipseDeltaT(elements)).zeta;
}

function groundTurnDeg(previous: TraceVector, next: TraceVector, lat: number): number {
    const cosLat = Math.cos(lat * DEG);
    const v1 = {x: previous.lon * cosLat, y: previous.lat};
    const v2 = {x: next.lon * cosLat, y: next.lat};
    const l1 = Math.hypot(v1.x, v1.y);
    const l2 = Math.hypot(v2.x, v2.y);
    if (l1 < 1e-12 || l2 < 1e-12) {
        return 0;
    }
    const cos = Math.max(-1, Math.min(1, (v1.x * v2.x + v1.y * v2.y) / (l1 * l2)));

    return Math.acos(cos) * RAD;
}

function groundMagnitude(vector: TraceVector, lat: number): number {
    return Math.hypot(vector.lon * Math.cos(lat * DEG), vector.lat);
}

function dot(a: TraceVector, b: TraceVector): number {
    return a.lat * b.lat + a.lon * b.lon + a.tau * b.tau;
}

function negate(vector: TraceVector): TraceVector {
    return {lat: -vector.lat, lon: -vector.lon, tau: -vector.tau};
}

function toLatLon(state: TraceState): LatLon {
    return {lat: state.lat, lon: state.lon};
}
