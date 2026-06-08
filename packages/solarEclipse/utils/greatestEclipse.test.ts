import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getJulianDayOfGreatestEclipse, getLocationOfGreatestEclipse} from '@package/solarEclipse/utils/greatestEclipse';
import {julianDay2time} from '@package/time/utils/dateTime';

describe('getLocationOfGreatestEclipse', () => {
    it('returns the point of greatest eclipse for a partial eclipse', () => {
        // 2022-04-30 partial solar eclipse
        const elementsPartial: BesselianElements = {
            t0Jde: 2459700.36292,
            t0Hours: 21,
            tMin: -3,
            tMax: 3,
            deltaT: 69.3,
            x: [0.61808002, 0.47531471, -0.0000015, -0.00000568],
            y: [-1.02808905, 0.2096405, -0.0000432, -0.00000268],
            d: [14.97103977, 0.012167, -0.000003],
            mu: [135.70559692, 15.00247002, 0],
            l1: [0.56107301, 0.0000847, -0.0000103],
            l2: [0.014861, 0.0000843, -0.0000102],
            tanF1: 0.004642,
            tanF2: 0.0046189,
        };

        const {lat, lon} = getLocationOfGreatestEclipse(elementsPartial);

        expect(lat).toBeCloseTo(-62.51235, 5);
        expect(lon).toBeCloseTo(-71.40541, 5);
    });

    it('returns the point of greatest eclipse for a total eclipse', () => {
        // 2026-08-12 total solar eclipse
        const elementsTotal = {
            t0Jde: 2461265.24104,
            t0Hours: 18,
            tMin: -3,
            tMax: 3,
            deltaT: 69.1,
            x: [0.47551399, 0.51892489, -0.0000773, -0.00000804],
            y: [0.77118301, -0.230168, -0.0001246, 0.00000377],
            d: [14.79666996, -0.012065, -0.000003],
            mu: [88.74778748, 15.0030899, 0],
            l1: [0.53795499, 0.0000939, -0.0000121],
            l2: [-0.008142, 0.0000935, -0.0000121],
            tanF1: 0.0046141,
            tanF2: 0.0045911,
        };

        const {lat, lon} = getLocationOfGreatestEclipse(elementsTotal);

        expect(lat).toBeCloseTo(65.22344, 5);
        expect(lon).toBeCloseTo(-25.24243, 5);
    });
});

describe('getJulianDayOfGreatestEclipse', () => {
    it('returns the time of greatest eclipse for a partial eclipse', () => {
        // 2022-04-30 partial solar eclipse
        const elementsPartial: BesselianElements = {
            t0Jde: 2459700.36292,
            t0Hours: 21,
            tMin: -3,
            tMax: 3,
            deltaT: 69.3,
            x: [0.61808002, 0.47531471, -0.0000015, -0.00000568],
            y: [-1.02808905, 0.2096405, -0.0000432, -0.00000268],
            d: [14.97103977, 0.012167, -0.000003],
            mu: [135.70559692, 15.00247002, 0],
            l1: [0.56107301, 0.0000847, -0.0000103],
            l2: [0.014861, 0.0000843, -0.0000102],
            tanF1: 0.004642,
            tanF2: 0.0046189,
        };

        const result = getJulianDayOfGreatestEclipse(elementsPartial);
        const time = julianDay2time(result);

        expect(result).toBeCloseTo(2459700.362118, 6);
        expect(time).toEqual({
            year: 2022,
            month: 4,
            day: 30,
            hour: 20,
            min: 41,
            sec: 26,
        });
    });

    it('returns the time of greatest eclipse for a total eclipse', () => {
        // 2026-08-12 total solar eclipse
        const elementsTotal: BesselianElements = {
            t0Jde: 2461265.24104,
            t0Hours: 18,
            tMin: -3,
            tMax: 3,
            deltaT: 69.1,
            x: [0.47551399, 0.51892489, -0.0000773, -0.00000804],
            y: [0.77118301, -0.230168, -0.0001246, 0.00000377],
            d: [14.79666996, -0.012065, -0.000003],
            mu: [88.74778748, 15.0030899, 0],
            l1: [0.53795499, 0.0000939, -0.0000121],
            l2: [-0.008142, 0.0000935, -0.0000121],
            tanF1: 0.0046141,
            tanF2: 0.0045911,
        };

        const result = getJulianDayOfGreatestEclipse(elementsTotal);
        const time = julianDay2time(result);

        expect(result).toBeCloseTo(2461265.24024, 6);
        expect(time).toEqual({
            year: 2026,
            month: 8,
            day: 12,
            hour: 17,
            min: 45,
            sec: 56,
        });
    });
});
