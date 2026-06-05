import {correctPrecessionForEclipticCoordinates, correctPrecessionForEquatorialCoordinates} from './precession';

describe('test for correctPrecessionForEquatorialCoordinates', () => {
    const jd = 1643074.5;

    const coords = {
        lon: 149.48194,
        lat: 1.76549,
        radiusVector: 1,
    };

    it('tests correctPrecessionForEquatorialCoordinates', () => {
        const correctedCoords = correctPrecessionForEclipticCoordinates(coords, jd);

        expect(correctedCoords.lon).toBeCloseTo(118.704132, 6);
        expect(correctedCoords.lat).toBeCloseTo(1.615332, 6);
        expect(correctedCoords.radiusVector).toBeCloseTo(1, 6);
    });
});

describe('test for correctPrecessionForEclipticCoordinates', () => {
    const jd = 2462088.69;

    const coords = {
        rightAscension: 41.054063,
        declination: 49.22775,
        radiusVector: 1,
    };

    it('uses the default starting epoch J2000', () => {
        const correctedCoords = correctPrecessionForEquatorialCoordinates(coords, jd);

        expect(correctedCoords.rightAscension).toBeCloseTo(41.547214, 6);
        expect(correctedCoords.declination).toBeCloseTo(49.348483, 6);
        expect(correctedCoords.radiusVector).toBeCloseTo(1, 6);
    });
});
