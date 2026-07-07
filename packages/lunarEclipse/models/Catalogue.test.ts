import {Catalogue} from '../index.catalogue';

describe('Catalogue', () => {
    it('uses the standard eclipse catalogue by default', () => {
        expect(Catalogue.getAvailableEclipseDates('2001-01-09', '2001-01-09')).toEqual(['2001-01-09']);
        expect(Catalogue.getBesselianElements('2001-01-09').t0Hours).toBe(20);
    });

    it('throws for dates outside the standard range', () => {
        expect(() => Catalogue.getBesselianElements('-0500-03-14')).toThrow(
            'Date -0500-03-14 is outside the catalogue range (1900–2100). Use catalogue-full for dates outside this range.',
        );
    });
});
