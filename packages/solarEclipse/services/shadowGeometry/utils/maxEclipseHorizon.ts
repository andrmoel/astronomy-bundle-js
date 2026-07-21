import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';
import {DEG, EARTH_ROTATION_DEG_PER_HOUR} from './constants';
import {type RingPoint, terminatorRingPoint} from './shadowOutline';

// Ring positions sampled per instant when locating the maximum-eclipse-at-horizon root.
const MAX_ECLIPSE_RING_SAMPLES = 240;

export interface MaxEclipseHorizonRoot {
    point: LatLon;
    separation: number;
}

// The maximum-eclipse point on the horizon at one instant: the root of the separation-rate
// condition (P - S) . (P' - S') = 0 on the horizon ring, inside the penumbra and on the
// requested terminator side. A fixed location reaches maximum eclipse when its
// fundamental-plane separation from the shadow axis stops shrinking, i.e. when the separation
// vector is perpendicular to the relative velocity of location and shadow. The location
// itself moves with Earth's rotation; for a surface point on the horizon ring at zeta = z0,
//   xi'  = mu' (z0 cos d - eta sin d)
//   eta' = mu' xi sin d - z0 d'
// Only the near-side root can pass the penumbra test, so each tau yields at most one point.
export function maxEclipseHorizonRootAtTau(
    elements: BesselianElements,
    tau: number,
    isSunset: boolean,
    z0: number,
): MaxEclipseHorizonRoot | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const deltaT = getEclipseDeltaT(elements);
    const dx = polynomialDerivative(elements.x, tau);
    const dy = polynomialDerivative(elements.y, tau);
    const muDot = polynomialDerivative(elements.mu, tau) * DEG;
    const dDot = polynomialDerivative(elements.d, tau) * DEG;
    const penumbraRadius = Math.abs(e.l1 - z0 * elements.tanF1);

    const separationRate = (ring: RingPoint): number => {
        const xiDot = muDot * (z0 * e.cosD - ring.eta * e.sinD);
        const etaDot = muDot * ring.xi * e.sinD - z0 * dDot;

        return (ring.xi - e.x) * (xiDot - dx) + (ring.eta - e.y) * (etaDot - dy);
    };

    const N = MAX_ECLIPSE_RING_SAMPLES;
    const rings: Array<RingPoint> = new Array(N);
    const rates: Array<number> = new Array(N);
    let sinUSeed = e.sinD;
    for (let i = 0; i < N; i++) {
        const ring = terminatorRingPoint(elements, e, (i / N) * 2 * Math.PI, sinUSeed, z0);
        rings[i] = ring;
        rates[i] = separationRate(ring);
        sinUSeed = ring.sinU;
    }

    let best: MaxEclipseHorizonRoot | null = null;
    for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        if (rates[i] * rates[j] > 0) {
            continue;
        }

        // Bisect theta to the root of the separation rate.
        let thetaA = (i / N) * 2 * Math.PI;
        let thetaB = ((i + 1) / N) * 2 * Math.PI;
        let rateA = rates[i];
        let root = rings[i];
        for (let iter = 0; iter < 40; iter++) {
            const thetaMid = (thetaA + thetaB) / 2;
            root = terminatorRingPoint(elements, e, thetaMid, root.sinU, z0);
            const rate = separationRate(root);
            if (rateA * rate <= 0) {
                thetaB = thetaMid;
            } else {
                thetaA = thetaMid;
                rateA = rate;
            }
            if (thetaB - thetaA < 1e-10) {
                break;
            }
        }

        const separation = Math.hypot(root.xi - e.x, root.eta - e.y);
        if (separation > penumbraRadius) {
            continue;
        }
        if (isOnSunsetSide(root.point, e, deltaT) !== isSunset) {
            continue;
        }
        if (best === null || separation < best.separation) {
            best = {point: root.point, separation};
        }
    }

    return best;
}

export function isOnSunsetSide(point: LatLon, e: BesselianElementsAtTime, deltaT: number): boolean {
    const lonRad = point.lon * DEG;
    const gha = e.mu - ((EARTH_ROTATION_DEG_PER_HOUR * deltaT) / 3600) * DEG;
    const H = gha + lonRad;

    // H ∈ (0, π): sun is west of zenith (setting); H ∈ (-π, 0) or (π, 2π): sun is rising
    return Math.sin(H) > 0;
}
