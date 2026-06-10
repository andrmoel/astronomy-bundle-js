import {Catalogue} from './index.catalogue';

describe('catalogue entrypoint', () => {
    it('uses the full eclipse catalogue from -1999 to 3000', () => {
        const dates = Catalogue.getAvailableEclipseDates();

        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];

        expect(dates).toHaveLength(454);
        expect(firstDate).toBe('1900-05-28');
        expect(lastDate).toBe('2100-09-04');
    });
});
