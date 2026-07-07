import type {BesselianElements, Catalogue as CatalogueType} from '../types/BesselianElementTypes';
import {type CatalogueRange, getAvailableEclipseDates, getBesselianElements} from '../utils/catalogue';

export default class Catalogue {
    private constructor(
        private readonly catalogue: CatalogueType,
        private readonly range: CatalogueRange,
    ) {}

    public static create(catalogue: CatalogueType, range: CatalogueRange): Catalogue {
        return new Catalogue(catalogue, range);
    }

    public getAvailableEclipseDates(dateFrom?: string, dateTo?: string): Array<string> {
        return getAvailableEclipseDates(this.catalogue, dateFrom, dateTo);
    }

    public getBesselianElements(dateStr: string): BesselianElements {
        return getBesselianElements(this.catalogue, dateStr, this.range);
    }
}
