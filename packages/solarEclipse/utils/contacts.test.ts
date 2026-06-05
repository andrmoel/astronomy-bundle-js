import type {Location} from '@app/types/LocationTypes';
import elements from '../resources/besselianElements/2459552.5.json';
import {parseBesselianElements} from './besselianElements';
import {getContactTaus} from './contacts';

const besselianElements = parseBesselianElements(elements);

describe('getContactTaus', () => {
    it('had an observer on the central line', () => {
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
        // Punta arenas
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
