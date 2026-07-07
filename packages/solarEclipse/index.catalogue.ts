import Catalogue from './models/Catalogue';
import {BESSELIAN_ELEMENTS_CATALOGUE} from './resources/catalogue';

const catalogue = Catalogue.create(BESSELIAN_ELEMENTS_CATALOGUE, {
    dateFrom: 1900,
    dateTo: 2100,
    outOfRangeHint: ' Use catalogue-full for dates outside this range.',
});

export {catalogue as Catalogue};
