import {round} from '../../utils/math';
import {correctPrecessionForEclipticCoordinates, correctPrecessionForEquatorialCoordinates} from './precessionCalc';

describe('test for correctPrecessionForEquatorialCoordinates', () => {
    const jd = 1643074.5;

    const coords = {
        lon: 149.48194,
        lat: 1.76549,
        radiusVector: 1,
    };

    it('tests correctPrecessionForEquatorialCoordinates', () => {
        const correctedCoords = correctPrecessionForEclipticCoordinates(coords, jd);

        expect(round(correctedCoords.lon, 6)).toBe(118.704132);
        expect(round(correctedCoords.lat, 6)).toBe(1.615332);
        expect(round(correctedCoords.radiusVector, 6)).toBe(1);
    });
});

describe('test for correctPrecessionForEclipticCoordinates', () => {
    const jd = 2462088.69;

    const coords = {
        rightAscension: 41.054063,
        declination: 49.227750,
        radiusVector: 1,
    };

    it('uses the default starting epoch J2000', () => {
        const correctedCoords = correctPrecessionForEquatorialCoordinates(coords, jd);

        expect(round(correctedCoords.rightAscension, 6)).toBe(41.547214);
        expect(round(correctedCoords.declination, 6)).toBe(49.348483);
        expect(round(correctedCoords.radiusVector, 6)).toBe(1);
    });
});
