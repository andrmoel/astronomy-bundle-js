import {polynomial, polynomialDerivative} from '@app/utils/polynoms';
import {SolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements, BesselianElementsAtTime} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';

const ECLIPSE_SEARCH_RANGE_HOURS = 4;
const NEWTON_CONVERGENCE_TOLERANCE = 1e-8;
const MAX_NEWTON_ITERATIONS = 50;

export function getEclipseType(elements: BesselianElements): SolarEclipseType {
    const tauGE = findGreatestEclipseTau(elements);
    const e = getBesselianElementsAtTime(elements, tauGE);

    if (isPartialEclipse(e)) {
        return SolarEclipseType.Partial;
    }

    if (isHybridEclipse(elements)) {
        return SolarEclipseType.Hybrid;
    }

    const zetaGE = Math.sqrt(Math.max(0, 1 - e.x * e.x - e.y * e.y));
    return e.l2 - zetaGE * elements.tanF2 < 0 ? SolarEclipseType.Total : SolarEclipseType.Annular;
}

function findGreatestEclipseTau(elements: BesselianElements): number {
    let tau = 0;

    for (let i = 0; i < MAX_NEWTON_ITERATIONS; i++) {
        const x = polynomial(elements.x, tau);
        const y = polynomial(elements.y, tau);
        const xp = polynomialDerivative(elements.x, tau);
        const yp = polynomialDerivative(elements.y, tau);
        // x[2] and x[3] are the quadratic and cubic coefficients
        const xpp = 2 * elements.x[2] + 6 * elements.x[3] * tau;
        const ypp = 2 * elements.y[2] + 6 * elements.y[3] * tau;

        const f = x * xp + y * yp;
        const fp = xp * xp + x * xpp + yp * yp + y * ypp;

        if (Math.abs(fp) < 1e-12) {
            break;
        }

        const delta = -f / fp;
        tau += delta;

        if (Math.abs(tau) > ECLIPSE_SEARCH_RANGE_HOURS) {
            tau = Math.sign(tau) * ECLIPSE_SEARCH_RANGE_HOURS;
            break;
        }

        if (Math.abs(delta) < NEWTON_CONVERGENCE_TOLERANCE) {
            break;
        }
    }

    return tau;
}

function isPartialEclipse(e: BesselianElementsAtTime): boolean {
    return e.x * e.x + e.y * e.y >= 1;
}

function isHybridEclipse(elements: BesselianElements): boolean {
    // Hybrid: effective l2 changes sign along the path when accounting for Earth's curvature.
    // For an observer on Earth's surface at zeta = sqrt(1 - x² - y²), the corrected shadow
    // radius is l2' = l2 - zeta·tanF2. The umbra reaches Earth when l2' < 0 at the axis
    // (zeta_max), while l2 > 0 at the path edge (zeta = 0) means the antumbra is also present.
    let hasUmbra = false;
    let hasAntumbra = false;
    for (let tau = -ECLIPSE_SEARCH_RANGE_HOURS; tau <= ECLIPSE_SEARCH_RANGE_HOURS; tau += 0.01) {
        const x = polynomial(elements.x, tau);
        const y = polynomial(elements.y, tau);
        const r2 = x * x + y * y;

        if (r2 >= 1) {
            continue;
        }

        const l2 = polynomial(elements.l2, tau);
        const zeta = Math.sqrt(1 - r2);

        if (l2 - zeta * elements.tanF2 < 0) {
            hasUmbra = true;
        }

        if (l2 > 0) {
            hasAntumbra = true;
        }

        if (hasUmbra && hasAntumbra) {
            return true;
        }
    }

    return false;
}
