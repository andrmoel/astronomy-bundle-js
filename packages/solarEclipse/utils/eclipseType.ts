import {polynomial} from '@app/utils/polynoms';
import {LocalSolarEclipseType, SolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getLocationOfGreatestEclipse, getTauOfGreatestEclipse} from '@package/solarEclipse/utils/greatestEclipse';
import {getLocalEclipseCircumstances, getLocalEclipseType} from '@package/solarEclipse/utils/localCircumstances';

const ECLIPSE_SEARCH_RANGE_HOURS = 4;

export function getEclipseType(elements: BesselianElements): SolarEclipseType {
    const tau = getTauOfGreatestEclipse(elements);
    const location = getLocationOfGreatestEclipse(elements);
    const circumstances = getLocalEclipseCircumstances(elements, {...location, elevation: 0}, tau);
    const localType = getLocalEclipseType(circumstances);

    if (localType !== LocalSolarEclipseType.Total && localType !== LocalSolarEclipseType.Annular) {
        return SolarEclipseType.Partial;
    }

    if (isHybridEclipse(elements)) {
        return SolarEclipseType.Hybrid;
    }

    return localType === LocalSolarEclipseType.Total ? SolarEclipseType.Total : SolarEclipseType.Annular;
}

function isHybridEclipse(elements: BesselianElements): boolean {
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
