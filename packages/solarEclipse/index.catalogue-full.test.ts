import {Catalogue as StandardCatalogue} from './index.catalogue';
import {Catalogue as FullCatalogue} from './index.catalogue-full';

describe('catalogue-full entrypoint', () => {
    it('uses the full eclipse catalogue from -1999 to 3000', () => {
        const dates = FullCatalogue.getAvailableEclipseDates();

        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];

        expect(dates).toHaveLength(11898);
        expect(firstDate).toBe('-1999-06-12');
        expect(lastDate).toBe('3000-10-19');
        expect(FullCatalogue.getBesselianElements(firstDate).t0Hours).toBe(3);
        expect(FullCatalogue.getBesselianElements(lastDate).t0Hours).toBe(16);
    });

    it('does not change the standard catalogue entrypoint', () => {
        expect(() => StandardCatalogue.getBesselianElements('-0500-03-14')).toThrow(
            'Date -0500-03-14 is outside the catalogue range (1900–2100). Use catalogue-full for dates outside this range.',
        );
    });
});
