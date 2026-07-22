import {horizonSinAltitude} from './constants';
import isPointInPolygon from './pointInPolygon';
import {calculateSunriseBoundary, calculateSunsetBoundary} from './riseSetBoundary';
import {ELEMENTS_2019_07_02, ELEMENTS_2021_12_04} from './testSupport';

describe('2019-07-02 (South Pacific / Chile / Argentina)', () => {
    const sunset = calculateSunsetBoundary(ELEMENTS_2019_07_02, 0);

    it('traces one closed loop for the sunset boundary', () => {
        expect(sunset.length).toBeGreaterThan(100);
        expect(sunset[0]).toEqual(sunset[sunset.length - 1]);
    });

    it('encloses regions where the eclipse is in progress at sunset', () => {
        expect(isPointInPolygon({lat: -33.447, lon: -70.673}, sunset)).toBe(true);
        expect(isPointInPolygon({lat: -34.6037, lon: -58.3816}, sunset)).toBe(true);
    });

    it('excludes regions far from the terminator', () => {
        expect(isPointInPolygon({lat: 40.7128, lon: -74.006}, sunset)).toBe(false);
        expect(isPointInPolygon({lat: -20, lon: -140}, sunset)).toBe(false);
    });

    it('keeps the sunrise side empty when a single run covers both halves', () => {
        expect(calculateSunriseBoundary(ELEMENTS_2019_07_02, 0)).toEqual([]);
    });

    it('depends on the horizon convention', () => {
        const refracted = calculateSunsetBoundary(ELEMENTS_2019_07_02, horizonSinAltitude({refraction: true}));

        expect(refracted.length).toBeGreaterThan(100);
        expect(refracted).not.toEqual(sunset);
    });
});

describe('2021-12-04 (Antarctica)', () => {
    it('traces one closed loop for the sunrise boundary', () => {
        const sunrise = calculateSunriseBoundary(ELEMENTS_2021_12_04, 0);

        expect(sunrise.length).toBeGreaterThan(100);
        expect(sunrise[0]).toEqual(sunrise[sunrise.length - 1]);
        expect(calculateSunsetBoundary(ELEMENTS_2021_12_04, 0)).toEqual([]);
    });
});
