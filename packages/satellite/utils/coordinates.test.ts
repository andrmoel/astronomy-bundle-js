import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {teme2equatorialSpherical, teme2geographicLocation, teme2topocentricHorizontal} from './coordinates';

const {T} = TimeOfInterest.fromTime(2026, 9, 28, 14, 39, 0);
const POSITION = {x: -1957.968754269824, y: -3744.0801829416077, z: 5319.007487858728};
const BERLIN = {lat: 52.52, lon: 13.405, elevation: 34};

describe('teme2equatorialSpherical', () => {
    it('converts to right ascension, declination and distance', () => {
        const {rightAscension, declination, radiusVector} = teme2equatorialSpherical(POSITION, T);

        expect(rightAscension).toBeCloseTo(242.39477, 4);
        expect(declination).toBeCloseTo(51.53824, 5);
        expect(radiusVector).toBeCloseTo(6792.9094, 4);
    });

    it('handles a position on the celestial pole', () => {
        const {declination, radiusVector} = teme2equatorialSpherical({x: 0, y: 0, z: 7000}, T);

        expect(declination).toBe(90);
        expect(radiusVector).toBe(7000);
    });
});

describe('teme2geographicLocation', () => {
    it('converts to the sub-satellite point', () => {
        const location = teme2geographicLocation(POSITION, T);

        expect(location.lat).toBeCloseTo(51.71375, 4);
        expect(location.lon).toBeCloseTo(15.25535, 4);
        expect(location.elevation).toBeCloseTo(427907, -1);
    });

    it('returns western longitudes as negative values', () => {
        const location = teme2geographicLocation({x: -POSITION.x, y: -POSITION.y, z: POSITION.z}, T);

        expect(location.lon).toBeCloseTo(15.25535 - 180, 4);
    });

    it('returns the height above the pole', () => {
        const location = teme2geographicLocation({x: 0, y: 0, z: -7000}, T);

        expect(location.lat).toBeCloseTo(-90, 6);
        expect(location.elevation).toBeCloseTo(643248, -1);
    });
});

describe('teme2topocentricHorizontal', () => {
    it('converts to azimuth, altitude and distance for an observer', () => {
        const {azimuth, altitude, radiusVector} = teme2topocentricHorizontal(POSITION, BERLIN, T);

        expect(azimuth).toBeCloseTo(124.5621, 3);
        expect(altitude).toBeCloseTo(68.7434, 3);
        expect(radiusVector).toBeCloseTo(456.947, 2);
    });
});
