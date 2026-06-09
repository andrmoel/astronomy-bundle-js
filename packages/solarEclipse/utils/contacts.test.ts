import type {Location} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getContactTaus} from './contacts';

// 2021-12-04 total solar eclipse
const besselianElements: BesselianElements = {
    t0Jde: 2459552.816,
    t0Hours: 8,
    tMin: -76.8,
    tMax: -46.2,
    deltaT: 72.6,
    x: [0.025209, 0.5683028, 0.0000391, -0.0000097],
    y: [-0.983653, -0.1315142, 0.0002213, 0.0000024],
    d: [-22.2747192, -0.005178, 0.000006],
    mu: [302.452179, 14.99728, 0],
    l1: [0.537805, -0.000016, -0.0000131],
    l2: [-0.008292, -0.000016, -0.0000131],
    tanF1: 0.0047434,
    tanF2: 0.0047198,
};

describe('getContactTaus', () => {
    describe('contacts for the 2021-12-04 total solar eclipse', () => {
        it('had an observer on the central line', () => {
            // Union Glacier
            const location: Location = {
                lat: -79.738991,
                lon: -82.736597,
                elevation: 718,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-1.084899);
            expect(result?.c2).toBeCloseTo(-0.232001);
            expect(result?.max).toBeCloseTo(-0.225928);
            expect(result?.c3).toBeCloseTo(-0.21984);
            expect(result?.c4).toBeCloseTo(0.6400323);
        });

        it('had an observer outside of the central line', () => {
            // Peter I Island
            const location: Location = {
                lat: -68.85446,
                lon: 90.5926,
                elevation: 10,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-0.702428);
            expect(result?.c2).toBeNull();
            expect(result?.max).toBeCloseTo(0.226772);
            expect(result?.c3).toBeNull();
            expect(result?.c4).toBeCloseTo(1.135714);
        });

        it('had an observer who withness the end of the eclipse during sunrise', () => {
            // Ushuaia
            const location: Location = {
                lat: -54.83955,
                lon: -68.31199,
                elevation: 20,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-1.485303);
            expect(result?.c2).toBeNull();
            expect(result?.max).toBeCloseTo(-0.725366);
            expect(result?.c3).toBeNull();
            expect(result?.c4).toBeCloseTo(0.053415);
        });

        it('had an observer outside of the eclipse path', () => {
            // Punta Arenas
            const location: Location = {
                lat: -53.16261,
                lon: -70.90806,
                elevation: 20,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-1.471936);
            expect(result?.c2).toBeNull();
            expect(result?.max).toBeCloseTo(-0.725366);
            expect(result?.c3).toBeNull();
            expect(result?.c4).toBeCloseTo(0.053415);
        });
    });
});

describe('contactTausToContactJulianDays', () => {
    it('returns the correct contact julian days for a central-line observer', () => {
        // TODO ...
    });
});
