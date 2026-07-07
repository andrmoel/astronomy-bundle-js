import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import {DEG, E_SQ, ONE_MINUS_F} from '@package/solarEclipse/services/shadowGeometry/utils/constants';
import {
    isOnSunsetSide,
    maxEclipseHorizonRootAtTau,
} from '@package/solarEclipse/services/shadowGeometry/utils/maxEclipseHorizon';
import {terminatorRingPoint} from '@package/solarEclipse/services/shadowGeometry/utils/shadowOutline';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import type {RiseSetBoundary} from '../types/SolarEclipsePathTypes';
import {
    RISE_SET_BOUNDARY_Q_SAMPLES,
    RISE_SET_BOUNDARY_STEP_HOURS,
    RISE_SET_GAP_SUBDIVISION_DEPTH,
    RISE_SET_MAX_CHORD_DEG,
    RISE_SET_TIP_REFINEMENT_SAMPLES,
} from './constants';
import {calculateShadowBoundaryPoint, penumbraBoundaryFundamental} from './shadowBoundary';

// Moves a crossing (penumbra limit meeting the terminator) onto the horizon ring at
// zeta = z0. The refined point lies where the penumbra-limit circle of radius
// |l1 - zeta * tanF1| meets the terminator ring at that zeta; both are circles about the
// shadow axis in the fundamental plane, so the crossing is found by a two-circle
// intersection iterated for the ellipsoid. This is needed even for the geometric horizon
// (z0 = 0): the shadow-boundary solver's day sheet ends at the ellipsoid fold, which sits
// O(e^2) short of zeta = 0 — amplified by the grazing geometry to a visible offset.
function refineCrossingToHorizon(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    xiSeed: number,
    etaSeed: number,
    z0: number,
): LatLon | null {
    const penumbraRadius = Math.abs(e.l1 - z0 * elements.tanF1);
    const axisDistance = Math.hypot(e.x, e.y);
    if (axisDistance === 0) {
        return null;
    }
    const ux = e.x / axisDistance;
    const uy = e.y / axisDistance;

    let xi = xiSeed;
    let eta = etaSeed;
    // On the ring sinU follows linearly from eta: (1 - f) sinU = eta cos d + zeta sin d.
    let sinU = (etaSeed * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
    for (let iter = 0; iter < 40; iter++) {
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
        sinU = (eta * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
        if (moved < 1e-18) {
            break;
        }
    }

    return terminatorRingPoint(elements, e, Math.atan2(eta, xi), sinU, z0).point;
}

// The point where the penumbra-limit circle is TANGENT to the horizon ring (the halfChord
// = 0 case of refineCrossingToHorizon's two-circle intersection): it lies on the ring along
// the axis direction, iterated for the ellipsoid. Used for the rise/set loop tips, where
// the intersection construction is marginal — right at tangency one crossing's halfChordSq
// can dip below zero numerically and fall back to the geometric point ~0.6 degrees off the
// ring (observed for 1988-03-18 as a kink at the sunrise loop's P2 tip).
function refineTangentToHorizon(elements: BesselianElements, e: BesselianElementsAtTime, z0: number): LatLon | null {
    const penumbraRadius = Math.abs(e.l1 - z0 * elements.tanF1);
    const axisDistance = Math.hypot(e.x, e.y);
    if (axisDistance === 0) {
        return null;
    }
    const ux = e.x / axisDistance;
    const uy = e.y / axisDistance;

    let xi = ux;
    let eta = uy;
    let sinU = (uy * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
    for (let iter = 0; iter < 40; iter++) {
        const ringRadiusSq = 1 - E_SQ * sinU * sinU - z0 * z0;
        if (ringRadiusSq < 0) {
            return null;
        }
        const along =
            (ringRadiusSq - penumbraRadius * penumbraRadius + axisDistance * axisDistance) / (2 * axisDistance);
        xi = along * ux;
        eta = along * uy;
        const next = (eta * e.cosD + z0 * e.sinD) / ONE_MINUS_F;
        const moved = (next - sinU) ** 2;
        sinU = next;
        if (moved < 1e-18) {
            break;
        }
    }

    return terminatorRingPoint(elements, e, Math.atan2(eta, xi), sinU, z0).point;
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

interface TerminatorCrossing {
    point: LatLon;
    qCos: number;
    isSunset: boolean;
}

// Collects ALL penumbra-limit/terminator crossings at one instant, each tagged with its
// rise/set side. The tag is NOT used to filter here: near the terminator's polar fold
// (local midnight in polar summer) sin H hovers around zero and the tag jitters between
// rise and set from one tau to the next. Filtering by side during the sweep therefore
// tears both loops apart — the sweep must stay side-agnostic; the tags only vote on each
// run's majority side at assembly (observed for 2017-08-21: ~26 fold crossings at 77°N
// tagged "sunset" chorded the European sunset loop to the Kara Sea while the sunrise loop
// lost its western tip).
function collectCrossings(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qVelocity: number,
    z0: number,
): Array<TerminatorCrossing> {
    const N = RISE_SET_BOUNDARY_Q_SAMPLES;
    const pts: Array<LatLon | null> = new Array(N);
    for (let i = 0; i < N; i++) {
        pts[i] = calculateShadowBoundaryPoint(elements, e, (i / N) * 2 * Math.PI, false);
    }

    const result: Array<TerminatorCrossing> = [];
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

        const point = refineCrossingToHorizon(elements, e, crossing.xi, crossing.eta, z0) ?? crossing.geometric;
        const qCrossing = (q1 + q2) / 2;
        result.push({
            point,
            qCos: Math.cos(qCrossing - qVelocity),
            // Classify by the geometric crossing, which sits exactly on the night/day boundary;
            // the refined point is nudged ~100 km onto the night side and could otherwise flip
            // sides near the loop tips.
            isSunset: isOnSunsetSide(crossing.geometric, e, elements.deltaT),
        });
    }

    return result;
}

function crossingsAtTau(elements: BesselianElements, tau: number, z0: number): Array<TerminatorCrossing> {
    const e = getBesselianElementsAtTime(elements, tau);
    const dx = polynomialDerivative(elements.x, tau);
    const dy = polynomialDerivative(elements.y, tau);
    const qVelocity = Math.atan2(dy, dx);

    return collectCrossings(elements, e, qVelocity, z0);
}

function bisectEndTangent(
    elements: BesselianElements,
    tauWithTwo: number,
    tauWithLess: number,
    z0: number,
): {tip: SidedPoint; tau: number} | null {
    let twoSide = tauWithTwo;
    let lessSide = tauWithLess;
    for (let iter = 0; iter < 40; iter++) {
        const mid = (twoSide + lessSide) / 2;
        const c = crossingsAtTau(elements, mid, z0);
        if (c.length >= 2) {
            twoSide = mid;
        } else {
            lessSide = mid;
        }
        if (Math.abs(lessSide - twoSide) < 1e-8) {
            break;
        }
    }
    const c = crossingsAtTau(elements, twoSide, z0);
    if (c.length === 0) {
        return null;
    }
    if (c.length === 1) {
        return {tip: {point: c[0].point, isSunset: c[0].isSunset}, tau: twoSide};
    }

    // The two crossings at the bisected tau sit a fraction of a degree apart around the
    // tangency point, so place the tip at the tangency itself. A tip straddling the
    // midnight fold has an ambiguous side; either choice places it within a pixel of both
    // loops, so the first crossing's tag is fine.
    const e = getBesselianElementsAtTime(elements, twoSide);
    const tangencyPoint = refineTangentToHorizon(elements, e, z0);
    if (tangencyPoint !== null) {
        return {tip: {point: tangencyPoint, isSunset: c[0].isSunset}, tau: twoSide};
    }

    const dlon = ((c[1].point.lon - c[0].point.lon + 540) % 360) - 180;
    let avgLon = c[0].point.lon + dlon / 2;
    while (avgLon > 180) {
        avgLon -= 360;
    }
    while (avgLon < -180) {
        avgLon += 360;
    }

    return {
        tip: {point: {lat: (c[0].point.lat + c[1].point.lat) / 2, lon: avgLon}, isSunset: c[0].isSunset},
        tau: twoSide,
    };
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

interface SidedPoint {
    point: LatLon;
    isSunset: boolean;
}

// One maximal tau interval during which the penumbra limit crosses the terminator. Each
// run traces one closed band on the terminator; for polar eclipses a single run can hold
// both the sunrise and the sunset half, joined across the midnight fold.
interface RiseSetRun {
    leadingEdge: Array<SidedPoint>;
    trailingEdge: Array<SidedPoint>;
    startTip: SidedPoint | null;
    endTip: SidedPoint | null;
}

function calculateRiseSetRuns(elements: BesselianElements, z0: number): Array<RiseSetRun> {
    // Two curves form each run's band:
    //   leadingEdge  = where eclipse BEGINS (C1) at rise/set  (forward of shadow velocity)
    //   trailingEdge = where eclipse ENDS (C4) at rise/set    (rearward of shadow velocity)
    //
    // For each tau, the penumbra circle intersects the terminator at 0, 1, or 2 points.
    // The sweep is side-agnostic — see collectCrossings for why filtering by rise/set here
    // would tear the loops at the midnight fold. We assign crossings to the leading/trailing
    // branch by proximity to each branch's most-recent point — qCos (bearing relative to
    // shadow velocity) is only used for the initial classification before either branch
    // exists. Proximity is required because near a pole or meridian transition, one crossing
    // can vanish while the other continues with a qCos that flips sign — using qCos at that
    // moment would misassign the survivor to the wrong branch and break the loop closure
    // (observed over east Russia for the 2026-08-12 sunrise polygon).
    //
    // Tangent tips: at a true tangent moment (e.g., penumbra first/last touches Earth on
    // the terminator), the crossing count jumps 0 ↔ 2 between adjacent taus. We bisect tau
    // to find the tangent point and insert it for clean tip closure. Meridian transitions
    // (1 ↔ 2) are not tangents — we don't insert tips there.
    const runs: Array<RiseSetRun> = [];
    let current: RiseSetRun | null = null;

    let prevCount = 0;
    // Branch the previous tau's single crossing went to. Sticky across a 1-crossing
    // run so the surviving branch keeps growing once chosen — otherwise the migrating
    // single crossing can wander close to the other branch's stale endpoint and flip,
    // splitting one continuous trajectory across both branches.
    let lastSingleBranch: 'leading' | 'trailing' | null = null;

    const feed = (crossings: Array<TerminatorCrossing>): void => {
        if (current === null || crossings.length === 0) {
            return;
        }
        const {leadingEdge, trailingEdge} = current;
        const leadingLast = leadingEdge.length > 0 ? leadingEdge[leadingEdge.length - 1].point : null;
        const trailingLast = trailingEdge.length > 0 ? trailingEdge[trailingEdge.length - 1].point : null;

        if (crossings.length >= 2) {
            const c0 = {point: crossings[0].point, isSunset: crossings[0].isSunset};
            const c1 = {point: crossings[1].point, isSunset: crossings[1].isSunset};
            if (leadingLast === null && trailingLast === null) {
                if (crossings[0].qCos >= crossings[1].qCos) {
                    leadingEdge.push(c0);
                    trailingEdge.push(c1);
                } else {
                    leadingEdge.push(c1);
                    trailingEdge.push(c0);
                }
            } else if (leadingLast !== null && trailingLast !== null) {
                const dLL0 = latLonDistSq(c0.point, leadingLast);
                const dLL1 = latLonDistSq(c1.point, leadingLast);
                const dTL0 = latLonDistSq(c0.point, trailingLast);
                const dTL1 = latLonDistSq(c1.point, trailingLast);
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
                if (latLonDistSq(c0.point, leadingLast) <= latLonDistSq(c1.point, leadingLast)) {
                    leadingEdge.push(c0);
                    trailingEdge.push(c1);
                } else {
                    leadingEdge.push(c1);
                    trailingEdge.push(c0);
                }
            } else {
                // Mirror of the previous case.
                if (latLonDistSq(c0.point, trailingLast as LatLon) <= latLonDistSq(c1.point, trailingLast as LatLon)) {
                    trailingEdge.push(c0);
                    leadingEdge.push(c1);
                } else {
                    trailingEdge.push(c1);
                    leadingEdge.push(c0);
                }
            }
            lastSingleBranch = null;
        } else {
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
                leadingEdge.push({point: c.point, isSunset: c.isSunset});
            } else {
                trailingEdge.push({point: c.point, isSunset: c.isSunset});
            }
            lastSingleBranch = target;
        }
    };

    // Fills the sqrt-speed hole next to a tangency: the two crossings separate from (or
    // merge into) the tip at a rate ~ sqrt(|tau - tangent|), so the first uniform step
    // after the tangent already sits several degrees away from the tip. Sampling at
    // tangent + span * (k/N)^2 spaces the extra points roughly evenly along the curve
    // (observed for 1988-03-18: without this, the sunset loop chorded from the P3 tip at
    // 85°N straight to 89°N/157°E, cutting the polar hook's ascending edge).
    const feedTipNeighborhood = (tangentTau: number, gridTau: number): void => {
        const span = gridTau - tangentTau;
        const N = RISE_SET_TIP_REFINEMENT_SAMPLES;
        for (let i = 1; i < N; i++) {
            // Ascending tau order either way: k counts up after a start tip (span > 0,
            // sweeping away from the tangent) and down before an end tip (span < 0).
            const k = span > 0 ? i : N - i;
            feed(crossingsAtTau(elements, tangentTau + span * (k / N) ** 2, z0));
        }
    };

    // True when a crossing is further than the chord tolerance from both branch ends,
    // measured with the longitude scaled to real angular size (latLonDistSq's raw lon
    // difference would demand needless subdivision near the poles).
    const needsSubdivision = (crossings: Array<TerminatorCrossing>): boolean => {
        if (current === null) {
            return false;
        }
        const ends: Array<LatLon> = [];
        if (current.leadingEdge.length > 0) {
            ends.push(current.leadingEdge[current.leadingEdge.length - 1].point);
        }
        if (current.trailingEdge.length > 0) {
            ends.push(current.trailingEdge[current.trailingEdge.length - 1].point);
        }
        if (ends.length === 0) {
            return false;
        }

        return crossings.some((c) =>
            ends.every((end) => {
                let dLon = Math.abs(c.point.lon - end.lon);
                if (dLon > 180) {
                    dLon = 360 - dLon;
                }
                dLon *= Math.cos(((c.point.lat + end.lat) / 2) * DEG);
                const dLat = c.point.lat - end.lat;

                return dLat * dLat + dLon * dLon > RISE_SET_MAX_CHORD_DEG ** 2;
            }),
        );
    };

    // Feeds the crossings at tauB, first bisecting tau wherever the curve outruns the
    // uniform step (the crossings race around the terminator's polar fold at several
    // degrees per step; fixed sampling chords across the curve there — observed for
    // 1988-03-18 as a 0.7 degree bite out of the sunset loop near 87°N, 143°W).
    const feedRefined = (tauA: number, tauB: number, crossingsB: Array<TerminatorCrossing>, depth: number): void => {
        if (depth > 0 && needsSubdivision(crossingsB)) {
            const mid = (tauA + tauB) / 2;
            feedRefined(tauA, mid, crossingsAtTau(elements, mid, z0), depth - 1);
            feedRefined(mid, tauB, crossingsB, depth - 1);

            return;
        }
        feed(crossingsB);
    };

    for (let tau = elements.tMin; tau <= elements.tMax; tau += RISE_SET_BOUNDARY_STEP_HOURS) {
        const crossings = crossingsAtTau(elements, tau, z0);

        if (crossings.length === 0) {
            if (current !== null) {
                // Close the run; a 2 → 0 transition is a true tangent, 1 → 0 is not.
                if (prevCount >= 2) {
                    const tangent = bisectEndTangent(elements, tau - RISE_SET_BOUNDARY_STEP_HOURS, tau, z0);
                    if (tangent !== null) {
                        feedTipNeighborhood(tangent.tau, tau - RISE_SET_BOUNDARY_STEP_HOURS);
                        current.endTip = tangent.tip;
                    }
                }
                runs.push(current);
                current = null;
            }
            lastSingleBranch = null;
            prevCount = 0;
            continue;
        }

        if (current === null) {
            current = {leadingEdge: [], trailingEdge: [], startTip: null, endTip: null};
            lastSingleBranch = null;
            // A 0 → 2 transition is a true tangent; skip when the sweep starts mid-run at tMin.
            if (crossings.length >= 2 && tau > elements.tMin) {
                const tangent = bisectEndTangent(elements, tau, tau - RISE_SET_BOUNDARY_STEP_HOURS, z0);
                if (tangent !== null) {
                    current.startTip = tangent.tip;
                    feedTipNeighborhood(tangent.tau, tau);
                }
            }
        }

        feedRefined(tau - RISE_SET_BOUNDARY_STEP_HOURS, tau, crossings, RISE_SET_GAP_SUBDIVISION_DEPTH);
        prevCount = crossings.length;
    }
    if (current !== null) {
        runs.push(current);
    }

    return runs;
}

// Assembles the run's closed cycle: leading edge, end tip, trailing edge reversed, start
// tip.
function assembleRunCycle(run: RiseSetRun): Array<SidedPoint> {
    const cycle: Array<SidedPoint> = [];
    if (run.startTip !== null) {
        cycle.push(run.startTip);
    }
    cycle.push(...run.leadingEdge);
    if (run.endTip !== null) {
        cycle.push(run.endTip);
    }
    for (let i = run.trailingEdge.length - 1; i >= 0; i--) {
        cycle.push(run.trailingEdge[i]);
    }

    return cycle;
}

export function calculateRiseSetBoundary(elements: BesselianElements, isSunset: boolean, z0: number): RiseSetBoundary {
    // A run's cycle is drawn whole, as on the Jubier/Espenak maps, and assigned to the
    // sunrise or sunset side by majority vote of its points. Near the terminator's polar
    // fold a run carries a short arc tagged with the other side (the sun grazes the horizon
    // around local midnight there), but that arc still belongs to the run's loop — filtering
    // it out chops the loop's polar hook (observed for 1988-03-18: the sunset loop's descent
    // to the P3 region at 77°N, 59°E, rise-tagged, went missing). For eclipses whose penumbra
    // never fully leaves the terminator (e.g. 2021-12-04, 2026-08-12) there is a single run:
    // one closed curve holding both halves, which Jubier likewise draws as one loop — it goes
    // to the majority side and the minority side stays empty.
    //
    // RiseSetBoundary holds a single polygon, so if several runs land on the same side
    // (not observed for any catalogued eclipse) keep the largest.
    let best: RiseSetBoundary = [];
    for (const run of calculateRiseSetRuns(elements, z0)) {
        const cycle = assembleRunCycle(run);
        const sunsetCount = cycle.filter((p) => p.isSunset).length;
        const runIsSunset = sunsetCount * 2 > cycle.length;
        if (runIsSunset === isSunset && cycle.length > best.length) {
            best = cycle.map((p) => p.point);
        }
    }

    return best;
}

export function calculateSunsetBoundary(elements: BesselianElements, z0: number): RiseSetBoundary {
    return calculateRiseSetBoundary(elements, true, z0);
}

export function calculateSunriseBoundary(elements: BesselianElements, z0: number): RiseSetBoundary {
    return calculateRiseSetBoundary(elements, false, z0);
}

// Curve of maximum (greatest) eclipse at sunrise/sunset — the green line inside the rise/set
// loops on Jubier/Espenak maps: the locus of points whose deepest eclipse phase occurs exactly
// while the Sun sits on the horizon. Sweeping tau traces one tau-ordered polyline per
// terminator side.
export function calculateMaxEclipseAtHorizon(
    elements: BesselianElements,
    isSunset: boolean,
    z0: number,
): Array<LatLon> {
    const curve: Array<LatLon> = [];
    for (let tau = elements.tMin; tau <= elements.tMax; tau += RISE_SET_BOUNDARY_STEP_HOURS) {
        const root = maxEclipseHorizonRootAtTau(elements, tau, isSunset, z0);
        if (root !== null) {
            curve.push(root.point);
        }
    }

    return longestContinuousRun(curve);
}

// Legit consecutive points stay within ~6 degrees even at the accelerating loop tips; a
// larger gap means the sweep switched branches.
const MAX_ECLIPSE_GAP_DEG_SQ = 100;

// In polar summer the horizon graze can also happen around local midnight, where the
// sunrise/sunset classification (sin H) flips mid-branch: the tau-ordered sweep then contains
// a short stray arc from the polar zone next to the main branch, separated by a large jump
// (observed for 2017-08-21: seven Arctic points, then a 60-degree jump to the true sunset
// branch). Only the main branch bisecting the rise/set loop is wanted — keep the longest
// gap-free run.
function longestContinuousRun(points: Array<LatLon>): Array<LatLon> {
    let best: Array<LatLon> = [];
    let run: Array<LatLon> = [];
    for (const point of points) {
        if (run.length > 0 && latLonDistSq(run[run.length - 1], point) > MAX_ECLIPSE_GAP_DEG_SQ) {
            if (run.length > best.length) {
                best = run;
            }
            run = [];
        }
        run.push(point);
    }

    return run.length > best.length ? run : best;
}

export function calculateMaxEclipseAtSunrise(elements: BesselianElements, z0: number): Array<LatLon> {
    return calculateMaxEclipseAtHorizon(elements, false, z0);
}

export function calculateMaxEclipseAtSunset(elements: BesselianElements, z0: number): Array<LatLon> {
    return calculateMaxEclipseAtHorizon(elements, true, z0);
}
