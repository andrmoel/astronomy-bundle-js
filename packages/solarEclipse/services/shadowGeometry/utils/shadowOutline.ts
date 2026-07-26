import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';
import {DEG, E_SQ, EARTH_ROTATION_DEG_PER_HOUR, ONE_MINUS_F, RAD} from './constants';
import {
    closeContourAroundPole,
    lonWinding,
    shortestAngleDelta,
    shortestLonDelta,
    signedUnwrappedArea,
} from './contourGeometry';
import {groundFundamentalPoint, solveSurfacePoint} from './surface';

const PENUMBRA_Q_SAMPLES = 240;
const UMBRA_Q_SAMPLES = 64;

const RING_ARC_STEP = (2 * Math.PI) / 240;
const RING_ARC_MAX_CHORD_DEG = 0.1;
const RING_ARC_MAX_DEPTH = 10;

const UMBRA_OUTLINE_SEED_SAMPLES = 96;
const UMBRA_OUTLINE_DUPLICATE_CHORD_DEG = 1e-7;

const MARCH_INITIAL_STEP_DEG = 0.02;
const MARCH_MIN_STEP_DEG = 0.001;
const MARCH_MAX_STEP_DEG = 0.12;
const MARCH_MAX_TURN_DEG = 5;
const MARCH_STEP_GROW_FACTOR = 1.4;
const MARCH_GRADIENT_STEP_DEG = 1e-4;
const MARCH_MARGIN_TOLERANCE = 1e-9;
const MARCH_CORRECTOR_ITERATIONS = 12;
const MARCH_MAX_POINTS = 20000;
const MARCH_CLOSURE_MIN_POINTS = 6;

export interface EdgeSample {
    point: LatLon;
    xi: number;
    eta: number;
    zeta: number;
}

export interface EdgeAnchor {
    sample: EdgeSample;
    q: number;
}

export interface RingPoint {
    point: LatLon;
    xi: number;
    eta: number;
    sinU: number;
}

export function getInstantaneousUmbraOutline(
    elements: BesselianElements,
    tau: number,
    z0: number,
): Array<LatLon> | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const outline = traceVisibleUmbraOutline(elements, e, z0);
    if (outline === null) {
        return null;
    }

    const cleaned = dropNearDuplicatePoints(outline);
    if (cleaned.length < 3) {
        return null;
    }
    if (signedUnwrappedArea(cleaned) < 0) {
        cleaned.reverse();
    }

    return cleaned.map(({lat, lon}) => ({lat, lon: normalizeLongitude(lon)}));
}

function traceVisibleUmbraOutline(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    z0: number,
): Array<LatLon> | null {
    const margin = groundMarginFunction(elements, e, z0);
    const seed = findBoundarySeed(elements, e, z0, margin);
    if (seed === null) {
        return null;
    }

    return marchBoundary(margin, seed);
}

type GroundMargin = (lat: number, lon: number) => number;

function groundMarginFunction(elements: BesselianElements, e: BesselianElementsAtTime, z0: number): GroundMargin {
    const deltaT = getEclipseDeltaT(elements);

    return (lat: number, lon: number): number => {
        const {xi, eta, zeta} = groundFundamentalPoint(elements, e, lat, lon, deltaT);
        const l2 = e.l2 - zeta * elements.tanF2;
        const distance = Math.hypot(e.x - xi, e.y - eta);

        return Math.min(Math.abs(l2) - distance, zeta - z0);
    };
}

function findBoundarySeed(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    z0: number,
    margin: GroundMargin,
): LatLon | null {
    const qStep = (2 * Math.PI) / UMBRA_OUTLINE_SEED_SAMPLES;
    let best: EdgeSample | null = null;
    for (let i = 0; i < UMBRA_OUTLINE_SEED_SAMPLES; i++) {
        const sample = shadowEdgePoint(elements, e, i * qStep, true, false, z0);
        if (sample !== null && (best === null || sample.zeta > best.zeta)) {
            best = sample;
        }
    }
    if (best === null) {
        return null;
    }

    return correctOntoBoundary(margin, best.point, MARCH_INITIAL_STEP_DEG);
}

function marchBoundary(margin: GroundMargin, seed: LatLon): Array<LatLon> | null {
    const points: Array<LatLon> = [seed];
    let position = seed;
    let stepDeg = MARCH_INITIAL_STEP_DEG;
    for (let i = 0; i < MARCH_MAX_POINTS; i++) {
        const advanced = advanceAlongBoundary(margin, position, stepDeg);
        if (advanced === null) {
            return null;
        }
        position = advanced.point;
        stepDeg =
            advanced.turnDeg < MARCH_MAX_TURN_DEG / 3
                ? Math.min(advanced.stepDeg * MARCH_STEP_GROW_FACTOR, MARCH_MAX_STEP_DEG)
                : advanced.stepDeg;
        if (points.length >= MARCH_CLOSURE_MIN_POINTS && !groundChordTooLong(position, seed, stepDeg)) {
            return points;
        }
        points.push(position);
    }

    return null;
}

function advanceAlongBoundary(
    margin: GroundMargin,
    position: LatLon,
    stepDeg: number,
): {point: LatLon; stepDeg: number; turnDeg: number} | null {
    const tangent = boundaryTangent(margin, position);
    if (tangent === null) {
        return null;
    }
    let step = stepDeg;
    while (true) {
        const predicted = movePoint(position, tangent, step);
        const corrected = correctOntoBoundary(margin, predicted, step);
        if (corrected !== null) {
            const newTangent = boundaryTangent(margin, corrected);
            if (newTangent !== null) {
                const turnDeg =
                    Math.acos(Math.max(-1, Math.min(1, tangent.x * newTangent.x + tangent.y * newTangent.y))) * RAD;
                if (turnDeg <= MARCH_MAX_TURN_DEG || step <= MARCH_MIN_STEP_DEG) {
                    return {point: corrected, stepDeg: step, turnDeg};
                }
            }
        }
        if (step <= MARCH_MIN_STEP_DEG) {
            return null;
        }
        step = Math.max(step / 2, MARCH_MIN_STEP_DEG);
    }
}

function boundaryTangent(margin: GroundMargin, position: LatLon): {x: number; y: number} | null {
    const gradient = marginGradient(margin, position);
    const length = Math.hypot(gradient.x, gradient.y);
    if (length < 1e-12) {
        return null;
    }

    return {x: gradient.y / length, y: -gradient.x / length};
}

function marginGradient(margin: GroundMargin, position: LatLon): {x: number; y: number} {
    const h = MARCH_GRADIENT_STEP_DEG;
    const cosLat = Math.cos(position.lat * DEG);
    const dLon = h / Math.max(cosLat, 1e-6);

    return {
        x: (margin(position.lat, position.lon + dLon) - margin(position.lat, position.lon - dLon)) / (2 * h),
        y: (margin(position.lat + h, position.lon) - margin(position.lat - h, position.lon)) / (2 * h),
    };
}

function correctOntoBoundary(margin: GroundMargin, start: LatLon, maxShiftDeg: number): LatLon | null {
    let position = start;
    for (let iter = 0; iter < MARCH_CORRECTOR_ITERATIONS; iter++) {
        const value = margin(position.lat, position.lon);
        if (Math.abs(value) < MARCH_MARGIN_TOLERANCE) {
            return position;
        }
        const gradient = marginGradient(margin, position);
        const lengthSq = gradient.x * gradient.x + gradient.y * gradient.y;
        if (lengthSq < 1e-24) {
            return null;
        }
        const shift = -value / Math.sqrt(lengthSq);
        const clamped = Math.max(-2 * maxShiftDeg, Math.min(2 * maxShiftDeg, shift));
        const direction = {
            x: gradient.x / Math.sqrt(lengthSq),
            y: gradient.y / Math.sqrt(lengthSq),
        };
        position = movePoint(position, direction, clamped);
    }

    return null;
}

function movePoint(position: LatLon, direction: {x: number; y: number}, stepDeg: number): LatLon {
    const cosLat = Math.cos(position.lat * DEG);

    return {
        lat: position.lat + direction.y * stepDeg,
        lon: position.lon + (direction.x * stepDeg) / Math.max(cosLat, 1e-6),
    };
}

function dropNearDuplicatePoints(outline: Array<LatLon>): Array<LatLon> {
    const cleaned: Array<LatLon> = [];
    for (const point of outline) {
        const last = cleaned[cleaned.length - 1];
        if (last === undefined || groundChordTooLong(last, point, UMBRA_OUTLINE_DUPLICATE_CHORD_DEG)) {
            cleaned.push(point);
        }
    }
    while (
        cleaned.length > 1
        && !groundChordTooLong(cleaned[0], cleaned[cleaned.length - 1], UMBRA_OUTLINE_DUPLICATE_CHORD_DEG)
    ) {
        cleaned.pop();
    }

    return cleaned;
}

export function calculateShadowRegionContours(
    elements: BesselianElements,
    useUmbra: boolean,
    stepHours: number,
    z0: number,
): Array<Array<LatLon>> {
    const qSamples = useUmbra ? UMBRA_Q_SAMPLES : PENUMBRA_Q_SAMPLES;
    const contours: Array<Array<LatLon>> = [];
    for (let tau = elements.tMin; tau <= elements.tMax; tau += stepHours) {
        const e = getBesselianElementsAtTime(elements, tau);
        let outline = instantaneousShadowOutline(elements, e, useUmbra, qSamples, z0);
        if (outline === null) {
            continue;
        }

        const winding = lonWinding(outline);
        if (Math.abs(winding) >= 180) {
            const poleLat = isPoleInsideInstantShadow(elements, e, useUmbra, 90, z0)
                ? 90
                : isPoleInsideInstantShadow(elements, e, useUmbra, -90, z0)
                  ? -90
                  : null;
            // A contour that winds around the globe without containing a pole is a numerical
            // artifact; dropping one of hundreds of outlines is invisible, rendering it is not.
            if (poleLat === null) {
                continue;
            }
            outline = closeContourAroundPole(outline, poleLat, winding);
        }
        if (signedUnwrappedArea(outline) < 0) {
            outline.reverse();
        }
        contours.push(outline);
    }

    return contours;
}

function instantaneousShadowOutline(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    useUmbra: boolean,
    qSamples: number,
    z0: number,
): Array<LatLon> | null {
    const qStep = (2 * Math.PI) / qSamples;
    const samples: Array<EdgeSample | null> = [];
    let firstAccepted = -1;
    for (let i = 0; i < qSamples; i++) {
        const sample = shadowEdgePoint(elements, e, i * qStep, useUmbra, false, z0);
        samples.push(sample);
        if (sample !== null && firstAccepted < 0) {
            firstAccepted = i;
        }
    }
    if (firstAccepted < 0) {
        return null;
    }

    const outline: Array<LatLon> = [];
    let gapStart: EdgeAnchor | null = null;
    for (let offset = 0; offset <= qSamples; offset++) {
        const i = (firstAccepted + offset) % qSamples;
        const q = (firstAccepted + offset) * qStep;
        const sample = offset === qSamples ? samples[firstAccepted] : samples[i];
        if (sample === null) {
            if (gapStart === null && outline.length > 0) {
                gapStart = bisectEdgeBoundary(elements, e, q - qStep, q, useUmbra, false, z0);
                if (gapStart !== null) {
                    outline.push(gapStart.sample.point);
                }
            }
            continue;
        }
        if (gapStart !== null) {
            const gapEnd = bisectEdgeBoundary(elements, e, q, q - qStep, useUmbra, false, z0);
            const nightIn = nightSheetRun(elements, e, gapStart.q, -1, useUmbra, qStep, z0);
            const nightOut = gapEnd !== null ? nightSheetRun(elements, e, gapEnd.q, 1, useUmbra, qStep, z0) : [];
            const arcFrom = nightIn.length > 0 ? nightIn[nightIn.length - 1] : gapStart.sample;
            const arcTo = nightOut.length > 0 ? nightOut[nightOut.length - 1] : (gapEnd?.sample ?? sample);
            outline.push(...nightIn.map(({point}) => point));
            outline.push(...terminatorRingArc(elements, e, arcFrom, arcTo, z0));
            for (let k = nightOut.length - 1; k >= 0; k--) {
                outline.push(nightOut[k].point);
            }
            if (gapEnd !== null) {
                outline.push(gapEnd.sample.point);
            }
            gapStart = null;
        }
        if (offset < qSamples) {
            outline.push(sample.point);
        }
    }

    return outline.length >= 3 ? outline : null;
}

export function shadowEdgePoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    q: number,
    useUmbra: boolean,
    farSide: boolean,
    z0: number,
): EdgeSample | null {
    const l0 = useUmbra ? e.l2 : e.l1;
    const tanF = useUmbra ? elements.tanF2 : elements.tanF1;
    const cosQ = Math.cos(q);
    const sinQ = Math.sin(q);

    let radius = Math.abs(l0);
    let xi = 0;
    let eta = 0;
    let zeta = 0;
    let point: LatLon | null = null;
    for (let iter = 0; iter < 8; iter++) {
        xi = e.x + radius * cosQ;
        eta = e.y + radius * sinQ;
        const solution = solveSurfacePoint(elements, e, xi, eta, farSide);
        if (solution === null) {
            return null;
        }
        point = {lat: solution.lat, lon: solution.lon};
        zeta = solution.zeta;
        const newRadius = Math.abs(l0 - solution.zeta * tanF);
        if (Math.abs(newRadius - radius) < 1e-9) {
            break;
        }
        radius = newRadius;
    }
    if (point === null || zeta < z0) {
        return null;
    }

    return {point, xi, eta, zeta};
}

export function bisectEdgeBoundary(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qGood: number,
    qBad: number,
    useUmbra: boolean,
    farSide: boolean,
    z0: number,
): EdgeAnchor | null {
    let good = qGood;
    let bad = qBad;
    for (let iter = 0; iter < 40; iter++) {
        const qMid = (good + bad) / 2;
        if (shadowEdgePoint(elements, e, qMid, useUmbra, farSide, z0) !== null) {
            good = qMid;
        } else {
            bad = qMid;
        }
        if (Math.abs(bad - good) < 1e-9) {
            break;
        }
    }
    const sample = shadowEdgePoint(elements, e, good, useUmbra, farSide, z0);

    return sample !== null ? {sample, q: good} : null;
}

function nightSheetRun(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qFold: number,
    direction: number,
    useUmbra: boolean,
    qStep: number,
    z0: number,
): Array<EdgeSample> {
    const run: Array<EdgeSample> = [];
    const nightStep = qStep / 4;
    const maxSteps = Math.ceil((2 * Math.PI) / nightStep);
    let qGood = qFold;
    for (let step = 1; step <= maxSteps; step++) {
        const q = qFold + direction * step * nightStep;
        const sample = shadowEdgePoint(elements, e, q, useUmbra, true, z0);
        if (sample === null) {
            const crossing = bisectEdgeBoundary(elements, e, qGood, q, useUmbra, true, z0);
            if (crossing !== null) {
                run.push(crossing.sample);
            }
            break;
        }
        run.push(sample);
        qGood = q;
    }

    return run;
}

function terminatorRingArc(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    from: EdgeSample,
    to: EdgeSample,
    z0: number,
): Array<LatLon> {
    const thetaFrom = Math.atan2(from.eta, from.xi);
    const thetaTo = Math.atan2(to.eta, to.xi);
    let sinU = solveSurfacePoint(elements, e, from.xi, from.eta, true)?.sinU ?? 0;

    const distanceToShadowCentre = (theta: number): number => {
        const ringPoint = terminatorRingPoint(elements, e, theta, sinU, z0);

        return Math.hypot(ringPoint.xi - e.x, ringPoint.eta - e.y);
    };

    let delta = shortestAngleDelta(thetaFrom, thetaTo);
    const deltaLong = delta - Math.sign(delta || 1) * 2 * Math.PI;
    if (distanceToShadowCentre(thetaFrom + deltaLong / 2) < distanceToShadowCentre(thetaFrom + delta / 2)) {
        delta = deltaLong;
    }

    const anchors: Array<{theta: number; ring: RingPoint}> = [
        {theta: thetaFrom, ring: {point: from.point, xi: from.xi, eta: from.eta, sinU}},
    ];
    const steps = Math.max(1, Math.ceil(Math.abs(delta) / RING_ARC_STEP));
    for (let k = 1; k < steps; k++) {
        const theta = thetaFrom + (delta * k) / steps;
        const ringPoint = terminatorRingPoint(elements, e, theta, sinU, z0);
        sinU = ringPoint.sinU;
        anchors.push({theta, ring: ringPoint});
    }
    anchors.push({theta: thetaFrom + delta, ring: {point: to.point, xi: to.xi, eta: to.eta, sinU}});

    const chordTooLong = (a: RingPoint, b: RingPoint): boolean =>
        groundChordTooLong(a.point, b.point, RING_ARC_MAX_CHORD_DEG);

    const arc: Array<LatLon> = [];
    const emitBetween = (thetaA: number, a: RingPoint, thetaB: number, b: RingPoint, depth: number): void => {
        if (depth >= RING_ARC_MAX_DEPTH || !chordTooLong(a, b)) {
            return;
        }
        const thetaMid = (thetaA + thetaB) / 2;
        const mid = terminatorRingPoint(elements, e, thetaMid, a.sinU, z0);
        emitBetween(thetaA, a, thetaMid, mid, depth + 1);
        arc.push(mid.point);
        emitBetween(thetaMid, mid, thetaB, b, depth + 1);
    };

    for (let i = 1; i < anchors.length; i++) {
        if (i > 1) {
            arc.push(anchors[i - 1].ring.point);
        }
        emitBetween(anchors[i - 1].theta, anchors[i - 1].ring, anchors[i].theta, anchors[i].ring, 0);
    }

    return arc;
}

export function terminatorRingPoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    theta: number,
    sinUSeed: number,
    z0: number,
): RingPoint {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    let sinU = sinUSeed;
    let xi = 0;
    let eta = 0;
    for (let iter = 0; iter < 4; iter++) {
        const rho = Math.sqrt(Math.max(0, 1 - E_SQ * sinU * sinU - z0 * z0));
        xi = rho * cosTheta;
        eta = rho * sinTheta;
        sinU = (eta * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
    }

    const cosU = Math.sqrt(Math.max(0, 1 - sinU * sinU));
    const lat = Math.atan2(sinU, ONE_MINUS_F * cosU) * RAD;
    const thetaG = Math.atan2(xi, (z0 - ONE_MINUS_F * sinU * e.sinD) / e.cosD);
    const lon = normalizeLongitude(
        (thetaG - e.mu) * RAD + (EARTH_ROTATION_DEG_PER_HOUR * getEclipseDeltaT(elements)) / 3600,
    );

    return {point: {lat, lon}, xi, eta, sinU};
}

function isPoleInsideInstantShadow(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    useUmbra: boolean,
    poleLat: number,
    z0: number,
): boolean {
    const sinU = poleLat > 0 ? 1 : -1;
    const eta = sinU * ONE_MINUS_F * e.cosD;
    const zeta = sinU * ONE_MINUS_F * e.sinD;
    if (zeta < z0) {
        return false;
    }
    const l0 = useUmbra ? e.l2 : e.l1;
    const tanF = useUmbra ? elements.tanF2 : elements.tanF1;

    return Math.hypot(e.x, e.y - eta) < Math.abs(l0 - zeta * tanF);
}

function groundChordTooLong(a: LatLon, b: LatLon, maxChordDeg: number): boolean {
    const dLat = b.lat - a.lat;
    const dLon = shortestLonDelta(a.lon, b.lon) * Math.cos(((a.lat + b.lat) / 2) * DEG);

    return dLat * dLat + dLon * dLon > maxChordDeg * maxChordDeg;
}
