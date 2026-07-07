import {DEG} from '@app/constants/math';
import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import type {ShadowPathOptions} from '../types/ShadowPathTypes';
import {E_SQ, horizonSinAltitude, ONE_MINUS_F} from './constants';
import {latLonChordDeg, shortestAngleDelta, signedUnwrappedArea} from './contourGeometry';
import {type EdgeSample, shadowEdgePoint, terminatorRingPoint} from './shadowOutline';
import {solveSurfacePoint} from './surface';

const DEFAULT_STEP_SECONDS = 10;
const TANGENT_ITERATIONS = 12;
const TANGENT_CONVERGENCE_RAD = 1e-9;
const TOUCH_TIME_ITERATIONS = 40;
const CAP_PROBE_DOUBLINGS = 18;
const CAP_EDGE_ITERATIONS = 40;
const CAP_EDGE_SEED_DIVISOR = 1024;
const CAP_MAX_CHORD_DEG = 0.05;
const CAP_MAX_DEPTH = 12;
const CROSSING_ITERATIONS = 40;

interface SidePoint {
    tau: number;
    point: LatLon;
}

// The path is the region ever covered by the umbra while the Sun stands above the horizon —
// the same region the map's umbral shading shows. Its boundary has two kinds of pieces: the
// tangency envelope of the moving umbra (northern and southern limits) and, at each end, a
// rounded cap traced by the intersections of the umbra's edge with the horizon ring — points
// whose sunrise/sunset happens exactly on the shadow's edge. Each cap runs from one envelope
// end around the touch/leave tip to the other envelope end, bulging past the
// maximum-eclipse-at-horizon curve where the eclipse is already/still in progress at rise/set.
export default function calculateUmbraPathPolygon(
    elements: BesselianElements,
    options: ShadowPathOptions = {},
): Array<LatLon> {
    const z0 = horizonSinAltitude(options);
    const stepHours = (options.stepsInSeconds ?? DEFAULT_STEP_SECONDS) / 3600;

    const taus: Array<number> = [];
    for (let tau = elements.tMin; tau <= elements.tMax; tau += stepHours) {
        taus.push(tau);
    }
    const onSurface = taus.map((tau) => umbraTouchesSurface(elements, tau, z0));
    const first = onSurface.indexOf(true);
    if (first < 0) {
        return [];
    }
    const last = onSurface.lastIndexOf(true);

    const sideA: Array<SidePoint> = [];
    const sideB: Array<SidePoint> = [];
    for (let i = first; i <= last; i++) {
        const {a, b} = limitPointsAt(elements, taus[i], z0);
        if (a !== null) {
            sideA.push({tau: taus[i], point: a});
        }
        if (b !== null) {
            sideB.push({tau: taus[i], point: b});
        }
    }

    const touchStartTau = first > 0 ? touchTau(elements, taus[first - 1], taus[first], z0) : taus[first];
    const touchEndTau = last < taus.length - 1 ? touchTau(elements, taus[last + 1], taus[last], z0) : taus[last];
    const capStart =
        horizonCap(elements, touchStartTau, 1, sideB[0], sideA[0], stepHours, z0)
        ?? touchPointFallback(elements, touchStartTau, z0);
    const capEnd =
        horizonCap(elements, touchEndTau, -1, sideA[sideA.length - 1], sideB[sideB.length - 1], stepHours, z0)
        ?? touchPointFallback(elements, touchEndTau, z0);

    const ring: Array<LatLon> = [
        ...capStart,
        ...sideA.map(({point}) => point),
        ...capEnd,
        ...sideB.map(({point}) => point).reverse(),
    ];
    if (ring.length < 3) {
        return [];
    }
    if (signedUnwrappedArea(ring) < 0) {
        ring.reverse();
    }
    ring.push({...ring[0]});

    return ring;
}

function limitPointsAt(elements: BesselianElements, tau: number, z0: number): {a: LatLon | null; b: LatLon | null} {
    const e = getBesselianElementsAtTime(elements, tau);
    const derivatives: ShadowDerivatives = {
        xDot: polynomialDerivative(elements.x, tau),
        yDot: polynomialDerivative(elements.y, tau),
        lDot: polynomialDerivative(elements.l2, tau),
        muDot: polynomialDerivative(elements.mu, tau) * DEG,
        dDot: polynomialDerivative(elements.d, tau) * DEG,
    };

    return {
        a: limitPoint(elements, e, derivatives, 1, z0),
        b: limitPoint(elements, e, derivatives, -1, z0),
    };
}

interface ShadowDerivatives {
    xDot: number;
    yDot: number;
    lDot: number;
    muDot: number;
    dDot: number;
}

function limitPoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    derivatives: ShadowDerivatives,
    branch: number,
    z0: number,
): LatLon | null {
    let xi = e.x;
    let eta = e.y;
    let zeta = solveSurfacePoint(elements, e, e.x, e.y, false)?.zeta ?? 0;
    let q: number | null = null;
    let point: LatLon | null = null;
    for (let iter = 0; iter < TANGENT_ITERATIONS; iter++) {
        const qNew = tangentPositionAngle(elements, e, derivatives, xi, eta, zeta, branch);
        const edge = umbraEdgePoint(elements, e, qNew, z0);
        if (edge === null) {
            return null;
        }
        xi = edge.xi;
        eta = edge.eta;
        zeta = edge.zeta;
        point = edge.point;
        if (q !== null && Math.abs(shortestAngleDelta(q, qNew)) < TANGENT_CONVERGENCE_RAD) {
            break;
        }
        q = qNew;
    }

    return point;
}

function tangentPositionAngle(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    derivatives: ShadowDerivatives,
    xi: number,
    eta: number,
    zeta: number,
    branch: number,
): number {
    const {xDot, yDot, lDot, muDot, dDot} = derivatives;
    const xiDot = muDot * (zeta * e.cosD - eta * e.sinD);
    const etaDot = muDot * xi * e.sinD - dDot * zeta;
    const zetaDot = dDot * eta - muDot * xi * e.cosD;

    const a = xiDot - xDot;
    const b = etaDot - yDot;
    const lEffective = e.l2 - zeta * elements.tanF2;
    const c = Math.sign(lEffective) * (lDot - zetaDot * elements.tanF2);
    const alpha = Math.acos(Math.max(-1, Math.min(1, c / Math.hypot(a, b))));

    return Math.atan2(b, a) + branch * alpha;
}

function touchTau(elements: BesselianElements, tauOff: number, tauOn: number, z0: number): number {
    let off = tauOff;
    let on = tauOn;
    for (let iter = 0; iter < TOUCH_TIME_ITERATIONS; iter++) {
        const tauMid = (off + on) / 2;
        if (umbraTouchesSurface(elements, tauMid, z0)) {
            on = tauMid;
        } else {
            off = tauMid;
        }
    }

    return on;
}

// The rounded end cap: umbra-edge/horizon-ring crossings traced over the interval during
// which the umbra straddles the ring. The crossing branches merge at both window edges; the
// cap's outward tip is the merge point where the umbra finally clears the sunrise terminator
// (tipDirection +1) or first meets the sunset terminator (-1) — the terminator outruns the
// shadow there, so that is the extreme of the path. Each branch is traced from the envelope
// end it joins to the tip, subdivided on chord length. The straddle window can be shorter
// than a second (hybrid eclipses), so it is probed with geometrically growing offsets and
// its edges are grown and bisected the same way.
function horizonCap(
    elements: BesselianElements,
    touchTauValue: number,
    tipDirection: number,
    fromJunction: SidePoint | undefined,
    toJunction: SidePoint | undefined,
    stepHours: number,
    z0: number,
): Array<LatLon> | null {
    let anchor: number | null = null;
    for (let k = 0; k <= CAP_PROBE_DOUBLINGS && anchor === null; k++) {
        const offset = (stepHours / CAP_EDGE_SEED_DIVISOR) * 2 ** k;
        for (const tau of k === 0 ? [touchTauValue] : [touchTauValue + offset, touchTauValue - offset]) {
            if (ringCrossingAt(elements, tau, 1, z0) !== null) {
                anchor = tau;
                break;
            }
        }
    }
    if (anchor === null) {
        return null;
    }

    const tipTau = crossingWindowEdge(elements, anchor, tipDirection, stepHours, z0);
    const tip = ringCrossingAt(elements, tipTau, 1, z0);
    if (tip === null) {
        return null;
    }
    const farTau = crossingWindowEdge(elements, anchor, -tipDirection, stepHours, z0);
    const fromTau = branchTau(elements, fromJunction, tipTau, farTau, z0);
    const toTau = branchTau(elements, toJunction, tipTau, farTau, z0);
    const fromSide = branchSide(elements, fromTau, fromJunction, z0) ?? 1;
    const toSide = branchSide(elements, toTau, toJunction, z0) ?? -fromSide;
    const fromPoint = ringCrossingAt(elements, fromTau, fromSide, z0);
    const toPoint = ringCrossingAt(elements, toTau, toSide, z0);
    if (fromPoint === null || toPoint === null) {
        return null;
    }

    const cap: Array<LatLon> = [fromPoint];
    subdivideCrossings(elements, fromTau, fromPoint, tipTau, tip, fromSide, z0, 0, cap);
    cap.push(tip);
    subdivideCrossings(elements, tipTau, tip, toTau, toPoint, toSide, z0, 0, cap);
    cap.push(toPoint);

    return cap;
}

// Where a cap branch leaves the window toward its envelope end. An envelope can die outside
// the window (extreme grazing ends, where the tangency point drifts into the near-limb zone
// the Besselian surface inversion cannot reach — 2026-08-12's sunset end): the branch is
// then clamped to the nearer window edge, collapsing to the tip when the envelope died on
// the tip side, and the ring closes the remaining gap with a straight edge.
function branchTau(
    elements: BesselianElements,
    junction: SidePoint | undefined,
    tipTau: number,
    farTau: number,
    z0: number,
): number {
    if (junction === undefined) {
        return farTau;
    }
    if (ringCrossingAt(elements, junction.tau, 1, z0) !== null) {
        return junction.tau;
    }

    return Math.abs(junction.tau - tipTau) <= Math.abs(junction.tau - farTau) ? tipTau : farTau;
}

function branchSide(
    elements: BesselianElements,
    tau: number,
    junction: SidePoint | undefined,
    z0: number,
): number | null {
    if (junction === undefined) {
        return null;
    }
    const plus = ringCrossingAt(elements, tau, 1, z0);
    const minus = ringCrossingAt(elements, tau, -1, z0);
    if (plus === null || minus === null) {
        return null;
    }

    return latLonChordDeg(plus, junction.point) <= latLonChordDeg(minus, junction.point) ? 1 : -1;
}

// One edge of the straddle window in tau: grown geometrically from a seed far below any
// window's width, then bisected. Returns the innermost tau still inside the window.
function crossingWindowEdge(
    elements: BesselianElements,
    anchor: number,
    direction: number,
    stepHours: number,
    z0: number,
): number {
    let inside = anchor;
    let outside: number | null = null;
    let step = stepHours / CAP_EDGE_SEED_DIVISOR;
    for (let iter = 0; iter < CAP_EDGE_ITERATIONS && outside === null; iter++) {
        const tau = inside + direction * step;
        if (ringCrossingAt(elements, tau, 1, z0) !== null) {
            inside = tau;
            step *= 2;
        } else {
            outside = tau;
        }
    }
    if (outside === null) {
        return inside;
    }

    let bad = outside;
    for (let iter = 0; iter < CAP_EDGE_ITERATIONS; iter++) {
        const tauMid = (bad + inside) / 2;
        if (ringCrossingAt(elements, tauMid, 1, z0) !== null) {
            inside = tauMid;
        } else {
            bad = tauMid;
        }
    }

    return inside;
}

function subdivideCrossings(
    elements: BesselianElements,
    tauA: number,
    pointA: LatLon,
    tauB: number,
    pointB: LatLon,
    side: number,
    z0: number,
    depth: number,
    cap: Array<LatLon>,
): void {
    if (depth >= CAP_MAX_DEPTH || latLonChordDeg(pointA, pointB) <= CAP_MAX_CHORD_DEG) {
        return;
    }
    const tauMid = (tauA + tauB) / 2;
    const pointMid = ringCrossingAt(elements, tauMid, side, z0);
    if (pointMid === null) {
        return;
    }
    subdivideCrossings(elements, tauA, pointA, tauMid, pointMid, side, z0, depth + 1, cap);
    cap.push(pointMid);
    subdivideCrossings(elements, tauMid, pointMid, tauB, pointB, side, z0, depth + 1, cap);
}

// One of the two intersections of the umbra's edge circle with the horizon ring at zeta = z0,
// found as a two-circle intersection about the shadow axis in the fundamental plane, iterated
// for the ellipsoid (the ring radius depends on the latitude of the crossing). The side sign
// picks the branch relative to the axis direction and stays consistent while the axis drifts.
function ringCrossingAt(elements: BesselianElements, tau: number, side: number, z0: number): LatLon | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const radius = Math.abs(e.l2 - z0 * elements.tanF2);
    const axisDistance = Math.hypot(e.x, e.y);
    if (axisDistance === 0) {
        return null;
    }
    const ux = e.x / axisDistance;
    const uy = e.y / axisDistance;

    let xi = ux;
    let eta = uy;
    let sinU = (eta * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
    for (let iter = 0; iter < CROSSING_ITERATIONS; iter++) {
        const ringRadiusSq = 1 - E_SQ * sinU * sinU - z0 * z0;
        if (ringRadiusSq < 0) {
            return null;
        }
        const along = (ringRadiusSq - radius * radius + axisDistance * axisDistance) / (2 * axisDistance);
        const halfChordSq = ringRadiusSq - along * along;
        if (halfChordSq < 0) {
            return null;
        }
        const halfChord = Math.sqrt(halfChordSq);
        const nextXi = along * ux - side * halfChord * uy;
        const nextEta = along * uy + side * halfChord * ux;
        const moved = (nextXi - xi) ** 2 + (nextEta - eta) ** 2;
        xi = nextXi;
        eta = nextEta;
        sinU = (eta * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
        if (moved < 1e-18) {
            break;
        }
    }

    return terminatorRingPoint(elements, e, Math.atan2(eta, xi), sinU, z0).point;
}

function touchPointFallback(elements: BesselianElements, tau: number, z0: number): Array<LatLon> {
    const e = getBesselianElementsAtTime(elements, tau);
    const point = umbraEdgePoint(elements, e, Math.atan2(-e.y, -e.x), z0)?.point;

    return point !== undefined ? [point] : [];
}

function umbraTouchesSurface(elements: BesselianElements, tau: number, z0: number): boolean {
    const e = getBesselianElementsAtTime(elements, tau);

    return umbraEdgePoint(elements, e, Math.atan2(-e.y, -e.x), z0) !== null;
}

function umbraEdgePoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    q: number,
    z0: number,
): EdgeSample | null {
    for (const farSide of z0 < 0 ? [false, true] : [false]) {
        const sample = shadowEdgePoint(elements, e, q, true, farSide, z0);
        if (sample !== null) {
            return sample;
        }
    }

    return null;
}
