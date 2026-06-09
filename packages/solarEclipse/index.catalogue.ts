import {BESSELIAN_ELEMENTS_CATALOGUE} from '@package/solarEclipse/resources/catalogue';
import {dateStringToJulianDay} from '@package/time/utils/dateTime';
import type {BesselianElements} from './types/BesselianElementTypes';
import {parseBesselianElements} from './utils/besselianElements';

export function getBesselianElementsForEclipse(dateStr: string): BesselianElements {
    const year = parseInt(dateStr.split('-')[0], 10);
    if (year < 1900 || year > 2100) {
        throw new Error(
            `Date ${dateStr} is outside the catalogue range (1900–2100). Use catalogue-full for dates outside this range.`,
        );
    }

    const jd = dateStringToJulianDay(dateStr);
    const raw = BESSELIAN_ELEMENTS_CATALOGUE[jd];

    if (!raw) {
        throw new Error(`No Besselian elements found for eclipse on ${dateStr}`);
    }

    return parseBesselianElements(raw);
}
