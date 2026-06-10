import {BESSELIAN_ELEMENTS_CATALOGUE} from '@package/solarEclipse/resources/catalogue';
import type {BesselianElements, Catalogue as CatalogueType} from '../types/BesselianElementTypes';
import {type CatalogueRange, getAvailableEclipseDates, getBesselianElements} from '../utils/catalogue';

export default class Catalogue {
    protected static readonly catalogue: CatalogueType = BESSELIAN_ELEMENTS_CATALOGUE;

    protected static readonly range: CatalogueRange = {
        dateFrom: 1900,
        dateTo: 2100,
        outOfRangeHint: ' Use catalogue-full for dates outside this range.',
    };

    public static getAvailableEclipseDates(dateFrom?: string, dateTo?: string): Array<string> {
        return getAvailableEclipseDates(this.catalogue, dateFrom, dateTo);
    }

    public static getBesselianElements(dateStr: string): BesselianElements {
        return getBesselianElements(this.catalogue, dateStr, this.range);
    }
}
