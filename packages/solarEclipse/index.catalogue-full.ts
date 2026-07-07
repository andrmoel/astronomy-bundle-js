import Catalogue from './models/Catalogue';
import {BESSELIAN_ELEMENTS_CATALOGUE_FULL} from './resources/catalogueFull';

const catalogue = Catalogue.create(BESSELIAN_ELEMENTS_CATALOGUE_FULL, {
    dateFrom: -1999,
    dateTo: 3000,
});

export {catalogue as Catalogue};
