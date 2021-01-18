import {correctPrecessionForEclipticCoordinates, correctPrecessionForEquatorialCoordinates} from './precessionCalc';
import {round} from './math';

describe('test for correctPrecessionForEquatorialCoordinates', () => {
    const jd = 1643074.5;

    const lon = 149.48194;
    const lat = 1.76549;
    const radiusVector = 1;

    it('tests correctPrecessionForEquatorialCoordinates', () => {
        const coords = correctPrecessionForEclipticCoordinates(lon, lat, radiusVector, jd);

        expect(round(coords.lon, 6)).toBe(118.704132);
        expect(round(coords.lat, 6)).toBe(1.615332);
        expect(round(coords.radiusVector, 6)).toBe(1);
    });
});

describe('test for correctPrecessionForEclipticCoordinates', () => {
    const jd = 2462088.69;

    const rightAscension = 41.054063;
    const declination = 49.227750;
    const radiusVector = 1;

    it('uses the default starting epoch J2000', () => {
        const coords = correctPrecessionForEquatorialCoordinates(rightAscension, declination, radiusVector, jd);

        expect(round(coords.rightAscension, 6)).toBe(41.547214);
        expect(round(coords.declination, 6)).toBe(49.348483);
        expect(round(coords.radiusVector, 6)).toBe(1);
    });
});
