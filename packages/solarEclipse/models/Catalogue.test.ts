import {Catalogue} from '../index.catalogue';

describe('Catalogue', () => {
    it('uses the standard eclipse catalogue by default', () => {
        expect(Catalogue.getAvailableEclipseDates('2017-08-21', '2017-08-21')).toEqual(['2017-08-21']);
        expect(Catalogue.getBesselianElements('2017-08-21').t0Hours).toBe(18);
    });

    it('throws for dates outside the standard range', () => {
        expect(() => Catalogue.getBesselianElements('-0500-03-14')).toThrow(
            'Date -0500-03-14 is outside the catalogue range (1900–2100). Use catalogue-full for dates outside this range.',
        );
    });
});
