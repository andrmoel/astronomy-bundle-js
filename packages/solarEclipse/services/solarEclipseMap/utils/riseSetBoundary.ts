import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import type {RiseSetBoundary} from '../types/SolarEclipsePathTypes';
import {
    DEG,
    E_SQ,
    EARTH_ROTATION_DEG_PER_HOUR,
    RISE_SET_BOUNDARY_Q_SAMPLES,
    RISE_SET_BOUNDARY_STEP_HOURS,
    RISE_SET_SIN_ALTITUDE,
} from './constants';
import {calculateShadowBoundaryPoint, penumbraBoundaryFundamental} from './shadowBoundary';
import {solveSurfacePoint} from './surface';

// Moves a geometric crossing (penumbra limit meeting the geometric terminator) onto the
// rise/set horizon (Sun's upper limb with refraction, centre at -50'). The refined point lies
// where the penumbra-limit circle of radius |l1 - zeta * tanF1| meets the terminator ring at
// zeta = RISE_SET_SIN_ALTITUDE; both are circles about the shadow axis in the fundamental
// plane, so the crossing is found by a two-circle intersection iterated for the ellipsoid.
function refineCrossingToRiseSetHorizon(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xiSeed: number,
    etaSeed: number,
): LatLon | null {
    const z0 = RISE_SET_SIN_ALTITUDE;
    const penumbraRadius = Math.abs(e.l1 - z0 * elements.tanF1);
    const axisDistance = Math.hypot(e.x, e.y);
    if (axisDistance === 0) {
        return null;
    }
    const ux = e.x / axisDistance;
    const uy = e.y / axisDistance;

    let xi = xiSeed;
    let eta = etaSeed;
    let sinU = 0;
    for (let iter = 0; iter < 40; iter++) {
        const sample = solveSurfacePoint(elements, e, xi, eta, true) ?? solveSurfacePoint(elements, e, xi, eta, false);
        if (sample !== null) {
            sinU = sample.sinU;
        }
        // Radius (about the axis) of the terminator ring at zeta = z0 on the ellipsoid.
        const ringRadiusSq = 1 - E_SQ * sinU * sinU - z0 * z0;
        if (ringRadiusSq < 0) {
            return null;
        }
        const ringRadius = Math.sqrt(ringRadiusSq);
        const along =
            (ringRadius * ringRadius - penumbraRadius * penumbraRadius + axisDistance * axisDistance)
            / (2 * axisDistance);
        const halfChordSq = ringRadius * ringRadius - along * along;
        if (halfChordSq < 0) {
            return null;
        }
        const halfChord = Math.sqrt(halfChordSq);
        const baseXi = along * ux;
        const baseEta = along * uy;
        const candidate1Xi = baseXi - halfChord * uy;
        const candidate1Eta = baseEta + halfChord * ux;
        const candidate2Xi = baseXi + halfChord * uy;
        const candidate2Eta = baseEta - halfChord * ux;
        const dist1 = (candidate1Xi - xi) ** 2 + (candidate1Eta - eta) ** 2;
        const dist2 = (candidate2Xi - xi) ** 2 + (candidate2Eta - eta) ** 2;
        const nextXi = dist1 <= dist2 ? candidate1Xi : candidate2Xi;
        const nextEta = dist1 <= dist2 ? candidate1Eta : candidate2Eta;
        const moved = (nextXi - xi) ** 2 + (nextEta - eta) ** 2;
        xi = nextXi;
        eta = nextEta;
        if (moved < 1e-18) {
            break;
        }
    }

    const solution = solveSurfacePoint(elements, e, xi, eta, true);

    return solution !== null ? {lat: solution.lat, lon: solution.lon} : null;
}

function isOnSunsetSide(point: LatLon, e: BesselianElementsAtTime, deltaT: number): boolean {
    const lonRad = point.lon * DEG;
    const gha = e.mu - ((EARTH_ROTATION_DEG_PER_HOUR * deltaT) / 3600) * DEG;
    const H = gha + lonRad;

    // H ∈ (0, π): sun is west of zenith (setting); H ∈ (-π, 0) or (π, 2π): sun is rising
    return Math.sin(H) > 0;
}

// Finds the last non-null boundary point approaching the null side, i.e. the point
// on the penumbra boundary closest to the day/night terminator.
// qNonNull must produce a non-null result; qNull must produce null.
function findNullBoundary(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qNonNull: number,
    qNull: number,
): {geometric: LatLon; xi: number; eta: number} | null {
    let nonNullSide = qNonNull;
    let nullSide = qNull;

    for (let iter = 0; iter < 50; iter++) {
        const qMid = (nonNullSide + nullSide) / 2;
        const p = calculateShadowBoundaryPoint(elements, e, qMid, false);
        if (p !== null) {
            nonNullSide = qMid;
        } else {
            nullSide = qMid;
        }
        if (Math.abs(nullSide - nonNullSide) < 1e-9) {
            break;
        }
    }

    const geometric = calculateShadowBoundaryPoint(elements, e, nonNullSide, false);
    const fundamental = penumbraBoundaryFundamental(elements, e, nonNullSide);
    if (geometric === null || fundamental === null) {
        return null;
    }

    return {geometric, xi: fundamental.xi, eta: fundamental.eta};
}

interface SunsetCrossing {
    point: LatLon;
    qCos: number;
}

function collectSidedCrossings(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qVelocity: number,
    isSunset: boolean,
): Array<SunsetCrossing> {
    const N = RISE_SET_BOUNDARY_Q_SAMPLES;
    const pts: Array<LatLon | null> = new Array(N);
    for (let i = 0; i < N; i++) {
        pts[i] = calculateShadowBoundaryPoint(elements, e, (i / N) * 2 * Math.PI, false);
    }

    const result: Array<SunsetCrossing> = [];
    for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        const p1 = pts[i];
        const p2 = pts[j];
        if ((p1 === null) === (p2 === null)) {
            continue;
        }

        const q1 = (i / N) * 2 * Math.PI;
        const q2 = ((i + 1) / N) * 2 * Math.PI;
        const crossing = p1 !== null ? findNullBoundary(elements, e, q1, q2) : findNullBoundary(elements, e, q2, q1);
        if (crossing === null) {
            continue;
        }
        // Classify by the geometric crossing, which sits exactly on the night/day boundary; the
        // refined point is nudged ~100 km onto the night side and could otherwise flip sides near
        // the loop tips.
        if (isOnSunsetSide(crossing.geometric, e, elements.deltaT) !== isSunset) {
            continue;
        }

        const refined = refineCrossingToRiseSetHorizon(elements, e, crossing.xi, crossing.eta) ?? crossing.geometric;
        const qCrossing = (q1 + q2) / 2;
        result.push({point: refined, qCos: Math.cos(qCrossing - qVelocity)});
    }

    return result;
}

function crossingsAtTau(elements: BesselianElements, tau: number, isSunset: boolean): Array<SunsetCrossing> {
    const e = getBesselianElementsAtTime(elements, tau);
    const dx = polynomialDerivative(elements.x, tau);
    const dy = polynomialDerivative(elements.y, tau);
    const qVelocity = Math.atan2(dy, dx);

    return collectSidedCrossings(elements, e, qVelocity, isSunset);
}

function bisectEndTangent(
    elements: BesselianElements,
    isSunset: boolean,
    tauWithTwo: number,
    tauWithLess: number,
): LatLon | null {
    let twoSide = tauWithTwo;
    let lessSide = tauWithLess;
    for (let iter = 0; iter < 40; iter++) {
        const mid = (twoSide + lessSide) / 2;
        const c = crossingsAtTau(elements, mid, isSunset);
        if (c.length >= 2) {
            twoSide = mid;
        } else {
            lessSide = mid;
        }
        if (Math.abs(lessSide - twoSide) < 1e-8) {
            break;
        }
    }
    const c = crossingsAtTau(elements, twoSide, isSunset);
    if (c.length === 0) {
        return null;
    }
    if (c.length === 1) {
        return c[0].point;
    }

    const dlon = ((c[1].point.lon - c[0].point.lon + 540) % 360) - 180;
    let avgLon = c[0].point.lon + dlon / 2;
    while (avgLon > 180) {
        avgLon -= 360;
    }
    while (avgLon < -180) {
        avgLon += 360;
    }

    return {lat: (c[0].point.lat + c[1].point.lat) / 2, lon: avgLon};
}

// Squared lat/lon distance, antimeridian-aware. Used to decide which existing branch
// a new crossing continues. Cheap and adequate for ranking proximity at our step sizes.
function latLonDistSq(a: LatLon, b: LatLon): number {
    let dLon = b.lon - a.lon;
    while (dLon > 180) {
        dLon -= 360;
    }
    while (dLon < -180) {
        dLon += 360;
    }
    const dLat = b.lat - a.lat;

    return dLat * dLat + dLon * dLon;
}

export function calculateRiseSetBoundary(elements: BesselianElements, isSunset: boolean): RiseSetBoundary {
    // Two curves form the loop:
    //   leadingEdge  = where eclipse BEGINS (C1) at rise/set  (forward of shadow velocity)
    //   trailingEdge = where eclipse ENDS (C4) at rise/set    (rearward of shadow velocity)
    //
    // For each tau, the penumbra circle intersects the chosen terminator side at 0, 1, or 2
    // points. We assign crossings to the leading/trailing branch by proximity to each
    // branch's most-recent point — qCos (bearing relative to shadow velocity) is only used
    // for the initial classification before either branch exists. Proximity is required
    // because near a pole or meridian transition, one crossing can vanish from the
    // sunrise/sunset side while the other continues with a qCos that flips sign — using
    // qCos at that moment would misassign the survivor to the wrong branch and break the
    // loop closure (observed over east Russia for the 2026-08-12 sunrise polygon).
    //
    // Tangent tips: at a true tangent moment (e.g., penumbra first/last touches Earth on
    // the chosen terminator side), the crossing count jumps 0 ↔ 2 between adjacent taus.
    // We bisect tau to find the tangent point and insert it for clean tip closure.
    // Meridian transitions (1 ↔ 2) are not tangents — we don't insert tips there.
    const leadingEdge: Array<LatLon> = [];
    const trailingEdge: Array<LatLon> = [];

    let firstTwoTau: number | null = null;
    let countBeforeFirstTwo = -1;
    let lastTwoTau: number | null = null;
    let countAfterLastTwo = -1;

    let prevCount = -1;
    // Branch the previous tau's single crossing went to. Sticky across a 1-crossing
    // run so the surviving branch keeps growing once chosen — otherwise the migrating
    // single crossing can wander close to the other branch's stale endpoint and flip,
    // splitting one continuous trajectory across both branches.
    let lastSingleBranch: 'leading' | 'trailing' | null = null;

    for (let tau = elements.tMin; tau <= elements.tMax; tau += RISE_SET_BOUNDARY_STEP_HOURS) {
        const crossings = crossingsAtTau(elements, tau, isSunset);
        const leadingLast = leadingEdge.length > 0 ? leadingEdge[leadingEdge.length - 1] : null;
        const trailingLast = trailingEdge.length > 0 ? trailingEdge[trailingEdge.length - 1] : null;

        if (crossings.length >= 2) {
            const c0 = crossings[0].point;
            const c1 = crossings[1].point;
            if (leadingLast === null && trailingLast === null) {
                if (crossings[0].qCos >= crossings[1].qCos) {
                    leadingEdge.push(c0);
                    trailingEdge.push(c1);
                } else {
                    leadingEdge.push(c1);
                    trailingEdge.push(c0);
                }
            } else if (leadingLast !== null && trailingLast !== null) {
                const dLL0 = latLonDistSq(c0, leadingLast);
                const dLL1 = latLonDistSq(c1, leadingLast);
                const dTL0 = latLonDistSq(c0, trailingLast);
                const dTL1 = latLonDistSq(c1, trailingLast);
                if (dLL0 + dTL1 <= dLL1 + dTL0) {
                    leadingEdge.push(c0);
                    trailingEdge.push(c1);
                } else {
                    leadingEdge.push(c1);
                    trailingEdge.push(c0);
                }
            } else if (leadingLast !== null) {
                // Trailing branch hasn't started yet — continue leading with the closer
                // crossing, fork the other into a fresh trailing branch.
                if (latLonDistSq(c0, leadingLast) <= latLonDistSq(c1, leadingLast)) {
                    leadingEdge.push(c0);
                    trailingEdge.push(c1);
                } else {
                    leadingEdge.push(c1);
                    trailingEdge.push(c0);
                }
            } else {
                // Mirror of the previous case.
                if (latLonDistSq(c0, trailingLast as LatLon) <= latLonDistSq(c1, trailingLast as LatLon)) {
                    trailingEdge.push(c0);
                    leadingEdge.push(c1);
                } else {
                    trailingEdge.push(c1);
                    leadingEdge.push(c0);
                }
            }
            if (firstTwoTau === null) {
                firstTwoTau = tau;
                countBeforeFirstTwo = prevCount;
            }
            lastTwoTau = tau;
            lastSingleBranch = null;
        } else if (crossings.length === 1) {
            const c = crossings[0];
            let target: 'leading' | 'trailing';
            if (lastSingleBranch !== null) {
                target = lastSingleBranch;
            } else if (leadingLast !== null && trailingLast !== null) {
                target =
                    latLonDistSq(c.point, leadingLast) <= latLonDistSq(c.point, trailingLast) ? 'leading' : 'trailing';
            } else if (leadingLast !== null) {
                target = 'leading';
            } else if (trailingLast !== null) {
                target = 'trailing';
            } else {
                target = c.qCos >= 0 ? 'leading' : 'trailing';
            }
            if (target === 'leading') {
                leadingEdge.push(c.point);
            } else {
                trailingEdge.push(c.point);
            }
            lastSingleBranch = target;
        } else {
            lastSingleBranch = null;
        }

        if (lastTwoTau === tau - RISE_SET_BOUNDARY_STEP_HOURS && prevCount >= 2 && crossings.length < 2) {
            countAfterLastTwo = crossings.length;
        } else if (lastTwoTau !== null && lastTwoTau !== tau && countAfterLastTwo === -1) {
            countAfterLastTwo = crossings.length;
        }
        prevCount = crossings.length;
    }
    if (lastTwoTau !== null && countAfterLastTwo === -1) {
        countAfterLastTwo = 0;
    }

    // Include endTip only when the post-lastTwoTau transition is 2 → 0 (true tangent).
    // A 2 → 1 transition is a meridian crossing of one intersection, not a tangent.
    let endTip: LatLon | null = null;
    if (lastTwoTau !== null && countAfterLastTwo === 0) {
        endTip = bisectEndTangent(elements, isSunset, lastTwoTau, lastTwoTau + RISE_SET_BOUNDARY_STEP_HOURS);
    }

    // Include startTip only when the pre-firstTwoTau transition is 0 → 2 (true tangent).
    let startTip: LatLon | null = null;
    if (firstTwoTau !== null && countBeforeFirstTwo === 0) {
        startTip = bisectEndTangent(elements, isSunset, firstTwoTau, firstTwoTau - RISE_SET_BOUNDARY_STEP_HOURS);
    }

    if (leadingEdge.length === 0 && trailingEdge.length === 0) {
        return [];
    }

    const loop: Array<LatLon> = [];
    if (startTip !== null) {
        loop.push(startTip);
    }
    loop.push(...leadingEdge);
    if (endTip !== null) {
        loop.push(endTip);
    }
    for (let i = trailingEdge.length - 1; i >= 0; i--) {
        loop.push(trailingEdge[i]);
    }

    return loop;
}

export function calculateSunsetBoundary(elements: BesselianElements): RiseSetBoundary {
    return calculateRiseSetBoundary(elements, true);
}

export function calculateSunriseBoundary(elements: BesselianElements): RiseSetBoundary {
    return calculateRiseSetBoundary(elements, false);
}
