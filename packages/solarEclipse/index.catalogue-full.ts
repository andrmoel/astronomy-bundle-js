import CatalogueClass from './models/Catalogue';
import {BESSELIAN_ELEMENTS_CATALOGUE_FULL} from './resources/catalogueFull';
import type {Catalogue as CatalogueType} from './types/BesselianElementTypes';
import type {CatalogueRange} from './utils/catalogue';

class Catalogue extends CatalogueClass {
    protected static readonly catalogue: CatalogueType = BESSELIAN_ELEMENTS_CATALOGUE_FULL;

    protected static readonly range: CatalogueRange = {
        dateFrom: -1999,
        dateTo: 3000,
    };
}

export {Catalogue};
