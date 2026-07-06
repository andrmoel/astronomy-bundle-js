import {DEG} from '@app/constants/math';
import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import type {ShadowPathOptions} from '../types/ShadowPathTypes';
import {horizonSinAltitude} from './constants';
import {shortestAngleDelta, signedUnwrappedArea} from './contourGeometry';
import {type EdgeSample, shadowEdgePoint} from './shadowOutline';
import {solveSurfacePoint} from './surface';

const DEFAULT_STEP_SECONDS = 10;
const TANGENT_ITERATIONS = 12;
const TANGENT_CONVERGENCE_RAD = 1e-9;
const TOUCH_TIME_ITERATIONS = 40;
const FOLD_BISECTION_ITERATIONS = 40;

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

    const sideA: Array<LatLon> = [];
    const sideB: Array<LatLon> = [];
    for (let i = first; i <= last; i++) {
        const {a, b} = limitPointsAt(elements, taus[i], z0);
        if (a !== null) {
            sideA.push(a);
        }
        if (b !== null) {
            sideB.push(b);
        }
    }

    const touchStart = first > 0 ? touchPoint(elements, taus[first - 1], taus[first], z0) : null;
    const touchEnd = last < taus.length - 1 ? touchPoint(elements, taus[last + 1], taus[last], z0) : null;

    const ring: Array<LatLon> = [];
    if (touchStart !== null) {
        ring.push(touchStart);
    }
    ring.push(...sideA);
    if (touchEnd !== null) {
        ring.push(touchEnd);
    }
    for (let i = sideB.length - 1; i >= 0; i--) {
        ring.push(sideB[i]);
    }
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
            return horizonFoldPoint(elements, e, qNew, z0);
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

function horizonFoldPoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qBad: number,
    z0: number,
): LatLon | null {
    const qEarth = Math.atan2(-e.y, -e.x);
    if (umbraEdgePoint(elements, e, qEarth, z0) === null) {
        return null;
    }
    let good = qEarth;
    let bad = qEarth + shortestAngleDelta(qEarth, qBad);
    for (let iter = 0; iter < FOLD_BISECTION_ITERATIONS; iter++) {
        const qMid = (good + bad) / 2;
        if (umbraEdgePoint(elements, e, qMid, z0) !== null) {
            good = qMid;
        } else {
            bad = qMid;
        }
    }

    return umbraEdgePoint(elements, e, good, z0)?.point ?? null;
}

function touchPoint(elements: BesselianElements, tauOff: number, tauOn: number, z0: number): LatLon | null {
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
    const e = getBesselianElementsAtTime(elements, on);

    return umbraEdgePoint(elements, e, Math.atan2(-e.y, -e.x), z0)?.point ?? null;
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
