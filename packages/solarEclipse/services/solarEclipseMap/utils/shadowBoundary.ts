import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {E_SQ, ONE_MINUS_F} from './constants';
import {fundamentalToLatLon, solveSurfacePoint} from './surface';

export function calculateShadowBoundaryPoint(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    q: number,
    useUmbra: boolean,
): LatLon | null {
    const l0 = useUmbra ? e.l2 : e.l1;
    const tanF = useUmbra ? elements.tanF2 : elements.tanF1;
    const sinQ = Math.sin(q);
    const cosQ = Math.cos(q);

    let radius = Math.abs(l0);
    let result: LatLon | null = null;

    for (let iter = 0; iter < 6; iter++) {
        const xi = e.x + radius * cosQ;
        const eta = e.y + radius * sinQ;

        const rho1 = Math.sqrt(1 - E_SQ * e.cosD * e.cosD);
        const eta1 = eta / rho1;
        const bSq = 1 - xi * xi - eta1 * eta1;
        if (bSq < 0) {
            return null;
        }
        const B = Math.sqrt(bSq);
        const sinD1 = e.sinD / rho1;
        const cosD1 = (ONE_MINUS_F * e.cosD) / rho1;
        const sinU = eta1 * cosD1 + B * sinD1;

        const zetaSq = 1 - E_SQ * sinU * sinU - xi * xi - eta * eta;
        if (zetaSq < 0) {
            return null;
        }
        const zeta = Math.sqrt(zetaSq);

        const newRadius = Math.abs(l0 - zeta * tanF);
        if (Math.abs(newRadius - radius) < 1e-8) {
            result = fundamentalToLatLon(elements, e, xi, eta);
            break;
        }
        radius = newRadius;
    }

    if (result === null) {
        const xi = e.x + radius * cosQ;
        const eta = e.y + radius * sinQ;
        result = fundamentalToLatLon(elements, e, xi, eta);
    }

    return result;
}

// Same fixed-point iteration as calculateShadowBoundaryPoint, but returns the converged
// fundamental-plane coordinates so the crossing can be refined onto the depressed horizon.
export function penumbraBoundaryFundamental(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    q: number,
): {xi: number; eta: number} | null {
    const l0 = e.l1;
    const tanF = elements.tanF1;
    const sinQ = Math.sin(q);
    const cosQ = Math.cos(q);

    let radius = Math.abs(l0);
    for (let iter = 0; iter < 6; iter++) {
        const xi = e.x + radius * cosQ;
        const eta = e.y + radius * sinQ;
        const solution = solveSurfacePoint(elements, e, xi, eta, false);
        if (solution === null) {
            return null;
        }
        const newRadius = Math.abs(l0 - solution.zeta * tanF);
        if (Math.abs(newRadius - radius) < 1e-8) {
            return {xi, eta};
        }
        radius = newRadius;
    }

    return {xi: e.x + radius * cosQ, eta: e.y + radius * sinQ};
}
