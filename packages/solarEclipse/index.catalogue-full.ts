import {BESSELIAN_ELEMENTS_CATALOGUE_FULL} from '@package/solarEclipse/resources/catalogueFull';
import {dateStringToJulianDay} from '@package/time/utils/dateTime';
import type {BesselianElements} from './types/BesselianElementTypes';
import {getBesselianElementsFromCatalogue} from './utils/besselianElements';

export function getBesselianElementsForEclipse(dateStr: string): BesselianElements {
    const jd = dateStringToJulianDay(dateStr);

    return getBesselianElementsFromCatalogue(BESSELIAN_ELEMENTS_CATALOGUE_FULL, jd);
}
