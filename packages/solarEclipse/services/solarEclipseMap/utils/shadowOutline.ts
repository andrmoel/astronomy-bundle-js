import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {DEG, E_SQ, ONE_MINUS_F, RISE_SET_SIN_ALTITUDE} from './constants';
import {closeContourAroundPole, lonWinding, shortestLonDelta, signedUnwrappedArea} from './contourGeometry';
import {solveSurfacePoint} from './surface';

// The region where an eclipse is visible is the union over time of the instantaneous shadow
// outline: the shadow circle clipped to where the Sun is still up (zeta >= sin(-50'), the
// rise/set horizon). Rendering every outline into one nonzero-winding fill makes the canvas
// compute that union, so sunrise/sunset crescents, interior holes and polar caps all come out
// of the same construction instead of needing to be stitched from separate boundary curves.

// The tiny umbra circle needs far fewer edge samples than the penumbra for the same
// on-map chord length, and it is outlined at 4× more time steps.
const PENUMBRA_Q_SAMPLES = 240;
const UMBRA_Q_SAMPLES = 64;
// The rise/set horizon ring has a radius of ~1 Earth radius regardless of the shadow size,
// so its sampling step is independent of the shadow's edge sampling. Near the limb the
// map projection stretches a θ step into large lat/lon jumps, so segments longer than
// RING_ARC_MAX_CHORD_DEG on the map are subdivided adaptively.
const RING_ARC_STEP = (2 * Math.PI) / 240;
const RING_ARC_MAX_CHORD_DEG = 0.1;
const RING_ARC_MAX_DEPTH = 10;

interface EdgeSample {
    point: LatLon;
    xi: number;
    eta: number;
}

// One point of the shadow edge at position angle q, projected onto the requested sheet of
// the ellipsoid. The shadow radius depends on zeta, which depends on the surface point, so
// both are converged by fixed-point iteration. Returns null when the edge misses the
// ellipsoid or the surface point lies below the rise/set horizon.
function shadowEdgePoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    q: number,
    useUmbra: boolean,
    farSide: boolean,
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
    if (point === null || zeta < RISE_SET_SIN_ALTITUDE) {
        return null;
    }

    return {point, xi, eta};
}

// Bisects q between an accepted and a rejected edge sample down to the exact boundary of
// acceptance (the limb fold or the rise/set horizon crossing).
function bisectEdgeBoundary(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qGood: number,
    qBad: number,
    useUmbra: boolean,
    farSide: boolean,
): {sample: EdgeSample; q: number} | null {
    let good = qGood;
    let bad = qBad;
    for (let iter = 0; iter < 40; iter++) {
        const qMid = (good + bad) / 2;
        if (shadowEdgePoint(elements, e, qMid, useUmbra, farSide) !== null) {
            good = qMid;
        } else {
            bad = qMid;
        }
        if (Math.abs(bad - good) < 1e-9) {
            break;
        }
    }
    const sample = shadowEdgePoint(elements, e, good, useUmbra, farSide);

    return sample !== null ? {sample, q: good} : null;
}

// From the limb fold at qFold, the boundary doubles back on the night sheet (the ~50' sliver
// between the geometric terminator and the rise/set horizon) until the edge drops below the
// horizon. direction is -1 at a gap start (q decreasing) and +1 at a gap end.
function nightSheetRun(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qFold: number,
    direction: number,
    useUmbra: boolean,
    qStep: number,
): Array<EdgeSample> {
    const run: Array<EdgeSample> = [];
    // The sliver covers only a small q range, so it is walked at a finer step than the
    // day-side sweep; the step count is capped at a full revolution as a safety net.
    // The fold itself is on the sliver (zeta ≈ 0 there), so when even the first step is
    // already past the horizon, the crossing is still bisected from the fold — otherwise
    // a sliver narrower than one step would silently drop its whole flap.
    const nightStep = qStep / 4;
    const maxSteps = Math.ceil((2 * Math.PI) / nightStep);
    let qGood = qFold;
    for (let step = 1; step <= maxSteps; step++) {
        const q = qFold + direction * step * nightStep;
        const sample = shadowEdgePoint(elements, e, q, useUmbra, true);
        if (sample === null) {
            const crossing = bisectEdgeBoundary(elements, e, qGood, q, useUmbra, true);
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

interface RingPoint {
    point: LatLon;
    xi: number;
    eta: number;
    sinU: number;
}

// Surface point of the rise/set horizon ring (zeta = sin(-50')) at position angle theta.
// The ring radius depends weakly on sinU through the ellipsoid flattening, so it is
// converged by fixed-point iteration.
function terminatorRingPoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    theta: number,
    sinUSeed: number,
): RingPoint | null {
    const z0 = RISE_SET_SIN_ALTITUDE;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    let sinU = sinUSeed;
    let result: RingPoint | null = null;
    for (let iter = 0; iter < 3; iter++) {
        const rho = Math.sqrt(Math.max(0, 1 - E_SQ * sinU * sinU - z0 * z0));
        const xi = rho * cosTheta;
        const eta = rho * sinTheta;
        const solution = solveSurfacePoint(elements, e, xi, eta, true);
        if (solution === null) {
            break;
        }
        sinU = solution.sinU;
        result = {point: {lat: solution.lat, lon: solution.lon}, xi, eta, sinU};
    }

    return result;
}

// Arc of the rise/set horizon ring between two fundamental-plane points, taking the side
// that stays inside the shadow circle. The direction is picked by which candidate arc's
// midpoint lies closer to the shadow centre — for the umbra the shadow radius is of the
// same order as the ring-radius convergence error, so a converged point is required to
// make that comparison reliable.
function terminatorRingArc(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    from: EdgeSample,
    to: EdgeSample,
): Array<LatLon> {
    const thetaFrom = Math.atan2(from.eta, from.xi);
    const thetaTo = Math.atan2(to.eta, to.xi);
    let sinU = solveSurfacePoint(elements, e, from.xi, from.eta, true)?.sinU ?? 0;

    const distanceToShadowCentre = (theta: number): number => {
        const ringPoint = terminatorRingPoint(elements, e, theta, sinU);

        return ringPoint === null ? Infinity : Math.hypot(ringPoint.xi - e.x, ringPoint.eta - e.y);
    };

    let delta = thetaTo - thetaFrom;
    while (delta > Math.PI) {
        delta -= 2 * Math.PI;
    }
    while (delta < -Math.PI) {
        delta += 2 * Math.PI;
    }
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
        const ringPoint = terminatorRingPoint(elements, e, theta, sinU);
        if (ringPoint === null) {
            continue;
        }
        sinU = ringPoint.sinU;
        anchors.push({theta, ring: ringPoint});
    }
    anchors.push({theta: thetaFrom + delta, ring: {point: to.point, xi: to.xi, eta: to.eta, sinU}});

    const chordTooLong = (a: RingPoint, b: RingPoint): boolean => {
        const dLat = b.point.lat - a.point.lat;
        const dLon = shortestLonDelta(a.point.lon, b.point.lon) * Math.cos(((a.point.lat + b.point.lat) / 2) * DEG);

        return dLat * dLat + dLon * dLon > RING_ARC_MAX_CHORD_DEG * RING_ARC_MAX_CHORD_DEG;
    };

    const arc: Array<LatLon> = [];
    const emitBetween = (thetaA: number, a: RingPoint, thetaB: number, b: RingPoint, depth: number): void => {
        if (depth >= RING_ARC_MAX_DEPTH || !chordTooLong(a, b)) {
            return;
        }
        const thetaMid = (thetaA + thetaB) / 2;
        const mid = terminatorRingPoint(elements, e, thetaMid, a.sinU);
        if (mid === null) {
            return;
        }
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

function instantaneousShadowOutline(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    useUmbra: boolean,
    qSamples: number,
): Array<LatLon> | null {
    const qStep = (2 * Math.PI) / qSamples;
    const samples: Array<EdgeSample | null> = [];
    let firstAccepted = -1;
    for (let i = 0; i < qSamples; i++) {
        const sample = shadowEdgePoint(elements, e, i * qStep, useUmbra, false);
        samples.push(sample);
        if (sample !== null && firstAccepted < 0) {
            firstAccepted = i;
        }
    }
    if (firstAccepted < 0) {
        return null;
    }

    const outline: Array<LatLon> = [];
    let gapStart: {sample: EdgeSample; q: number} | null = null;
    for (let offset = 0; offset <= qSamples; offset++) {
        const i = (firstAccepted + offset) % qSamples;
        const q = (firstAccepted + offset) * qStep;
        const sample = offset === qSamples ? samples[firstAccepted] : samples[i];
        if (sample === null) {
            if (gapStart === null && outline.length > 0) {
                gapStart = bisectEdgeBoundary(elements, e, q - qStep, q, useUmbra, false);
                if (gapStart !== null) {
                    outline.push(gapStart.sample.point);
                }
            }
            continue;
        }
        if (gapStart !== null) {
            const gapEnd = bisectEdgeBoundary(elements, e, q, q - qStep, useUmbra, false);
            const nightIn = nightSheetRun(elements, e, gapStart.q, -1, useUmbra, qStep);
            const nightOut = gapEnd !== null ? nightSheetRun(elements, e, gapEnd.q, 1, useUmbra, qStep) : [];
            const arcFrom = nightIn.length > 0 ? nightIn[nightIn.length - 1] : gapStart.sample;
            const arcTo = nightOut.length > 0 ? nightOut[nightOut.length - 1] : (gapEnd?.sample ?? sample);
            outline.push(...nightIn.map(({point}) => point));
            outline.push(...terminatorRingArc(elements, e, arcFrom, arcTo));
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

function isPoleInsideInstantShadow(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    useUmbra: boolean,
    poleLat: number,
): boolean {
    const sinU = poleLat > 0 ? 1 : -1;
    const eta = sinU * ONE_MINUS_F * e.cosD;
    const zeta = sinU * ONE_MINUS_F * e.sinD;
    if (zeta < RISE_SET_SIN_ALTITUDE) {
        return false;
    }
    const l0 = useUmbra ? e.l2 : e.l1;
    const tanF = useUmbra ? elements.tanF2 : elements.tanF1;

    return Math.hypot(e.x, e.y - eta) < Math.abs(l0 - zeta * tanF);
}

export function calculateShadowRegionContours(
    elements: BesselianElements,
    useUmbra: boolean,
    stepHours: number,
): Array<Array<LatLon>> {
    const qSamples = useUmbra ? UMBRA_Q_SAMPLES : PENUMBRA_Q_SAMPLES;
    const contours: Array<Array<LatLon>> = [];
    for (let tau = elements.tMin; tau <= elements.tMax; tau += stepHours) {
        const e = getBesselianElementsAtTime(elements, tau);
        let outline = instantaneousShadowOutline(elements, e, useUmbra, qSamples);
        if (outline === null) {
            continue;
        }

        const winding = lonWinding(outline);
        if (Math.abs(winding) >= 180) {
            const poleLat = isPoleInsideInstantShadow(elements, e, useUmbra, 90)
                ? 90
                : isPoleInsideInstantShadow(elements, e, useUmbra, -90)
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
