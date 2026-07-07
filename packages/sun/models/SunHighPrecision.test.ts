import {LimbAlignment} from '@app/enums/limb';
import * as vsop87Date from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87J2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Earth from '@package/earth/models/Earth';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Sun from './Sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const earth = new Earth(toi, vsop87Date, vsop87J2000);
const sun = new Sun(toi, earth);

it('tests if name is correct', () => {
    expect(sun.name).toBe('sun');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const coords = sun.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(coords.x).toBe(0);
    expect(coords.y).toBe(0);
    expect(coords.z).toBe(0);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const coords = sun.getHeliocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBe(0);
    expect(coords.y).toBe(0);
    expect(coords.z).toBe(0);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = sun.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const coords = sun.getHeliocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const coords = sun.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(coords.x).toBeCloseTo(-0.87016292, 8);
    expect(coords.y).toBeCloseTo(-0.4828331, 8);
    expect(coords.z).toBeCloseTo(0.00002408, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const coords = sun.getGeocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBeCloseTo(-0.86770215, 8);
    expect(coords.y).toBeCloseTo(-0.4872415, 8);
    expect(coords.z).toBeCloseTo(-0.00000244, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = sun.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBeCloseTo(209.02487179, 8);
    expect(coords.lat).toBeCloseTo(0.00138647, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514386, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const coords = sun.getGeocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBeCloseTo(209.31555315, 8);
    expect(coords.lat).toBeCloseTo(-0.00014033, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514386, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const coords = sun.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(coords.rightAscension).toBeCloseTo(206.9810651, 8);
    expect(coords.declination).toBeCloseTo(-11.1254097, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514386, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const coords = sun.getGeocentricEquatorialSphericalDateCoordinates();

    expect(coords.rightAscension).toBeCloseTo(207.25762783, 8);
    expect(coords.declination).toBeCloseTo(-11.22974233, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514386, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = sun.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.86779362, 8);
    expect(y).toBeCloseTo(-0.48707858, 8);
    expect(z).toBeCloseTo(-0.00000244, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const coords = sun.getApparentGeocentricEclipticSphericalCoordinates();

    expect(coords.lon).toBeCloseTo(209.30479579, 8);
    expect(coords.lat).toBeCloseTo(-0.00014033, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514386, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const coords = sun.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(coords.rightAscension).toBeCloseTo(207.24736904, 8);
    expect(coords.declination).toBeCloseTo(-11.22593863, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514386, 8);
});

it('tests getTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        sun.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(207.248793, 6);
    expect(declination).toBeCloseTo(-11.227945, 6);
    expect(radiusVector).toBeCloseTo(0.995141, 6);
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.500753, 6);
    expect(altitude).toBeCloseTo(3.431448, 6);
    expect(radiusVector).toBeCloseTo(0.995141, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.500753, 6);
    expect(altitude).toBeCloseTo(3.641029, 6);
    expect(radiusVector).toBeCloseTo(0.995141, 6);
});

it('tests getDistanceToEarth', () => {
    const d = sun.getDistanceToEarth();

    expect(d).toBeCloseTo(148871402.777339, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = sun.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(148871402.777339, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = sun.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(148871013.470838, 6);
});

it('tests getLightTime', () => {
    const lt = sun.getLightTime();

    expect(sec2string(lt)).toBe('0h 8m 16.58s');
});

it('tests getAngularDiameter', () => {
    const delta = sun.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 07.803"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = sun.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 07.808"');
});

it('tests getApparentMagnitude', () => {
    const V = sun.getApparentMagnitude();

    expect(V).toBe(-26.74);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = sun.getTopocentricApparentMagnitude();

    expect(V).toBe(-26.74);
});

it('tests getTransit', () => {
    const toi = sun.getTransit(location);

    expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 10, min: 50, sec: 46});
});

describe('getGeometricRise', () => {
    it('tests the upper limb', () => {
        const toi = sun.getGeometricRise(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 48, sec: 56});
    });

    it('tests the center', () => {
        const toi = sun.getGeometricRise(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 50, sec: 47});
    });

    it('tests the lower limb', () => {
        const toi = sun.getGeometricRise(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 52, sec: 39});
    });
});

describe('getApparentRise', () => {
    it('tests the upper limb', () => {
        const toi = sun.getApparentRise(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 45, sec: 0});
    });

    it('tests the center', () => {
        const toi = sun.getApparentRise(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 46, sec: 51});
    });

    it('tests the lower limb', () => {
        const toi = sun.getApparentRise(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 48, sec: 43});
    });
});

describe('getGeometricSet', () => {
    it('tests the upper limb', () => {
        const toi = sun.getGeometricSet(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 51, sec: 47});
    });

    it('tests the center', () => {
        const toi = sun.getGeometricSet(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 49, sec: 55});
    });

    it('tests the lower limb', () => {
        const toi = sun.getGeometricSet(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 48, sec: 4});
    });
});

describe('getApparentSet', () => {
    it('tests the upper limb', () => {
        const toi = sun.getApparentSet(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 55, sec: 42});
    });

    it('tests the center', () => {
        const toi = sun.getApparentSet(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 53, sec: 51});
    });

    it('tests the lower limb', () => {
        const toi = sun.getApparentSet(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 52, sec: 0});
    });
});
