import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Sun from './Sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const sun = new Sun(toi);

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

    expect(coords.x).toBeCloseTo(-0.8701646, 8);
    expect(coords.y).toBeCloseTo(-0.48283379, 8);
    expect(coords.z).toBeCloseTo(0.00002523, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const coords = sun.getGeocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBeCloseTo(-0.86770383, 8);
    expect(coords.y).toBeCloseTo(-0.4872422, 8);
    expect(coords.z).toBeCloseTo(-0.00000202, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = sun.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBeCloseTo(209.02485979, 8);
    expect(coords.lat).toBeCloseTo(0.00145256, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514567, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const coords = sun.getGeocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBeCloseTo(209.31554093, 8);
    expect(coords.lat).toBeCloseTo(-0.00011635, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514567, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const coords = sun.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(coords.rightAscension).toBeCloseTo(206.98107755, 8);
    expect(coords.declination).toBeCloseTo(-11.12534365, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514567, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const coords = sun.getGeocentricEquatorialSphericalDateCoordinates();

    expect(coords.rightAscension).toBeCloseTo(207.25762482, 8);
    expect(coords.declination).toBeCloseTo(-11.22971558, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514567, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = sun.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.86779529, 8);
    expect(y).toBeCloseTo(-0.48707928, 8);
    expect(z).toBeCloseTo(-0.00000202, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const coords = sun.getApparentGeocentricEclipticSphericalCoordinates();

    expect(coords.lon).toBeCloseTo(209.30478357, 8);
    expect(coords.lat).toBeCloseTo(-0.00011635, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514567, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const coords = sun.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(coords.rightAscension).toBeCloseTo(207.24736604, 8);
    expect(coords.declination).toBeCloseTo(-11.22591188, 8);
    expect(coords.radiusVector).toBeCloseTo(0.99514567, 8);
});

it('tests getTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = sun.getTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(207.24879, 6);
    expect(declination).toBeCloseTo(-11.227918, 6);
    expect(radiusVector).toBeCloseTo(0.995143, 6);
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.500747, 6);
    expect(altitude).toBeCloseTo(3.433916, 6);
    expect(radiusVector).toBeCloseTo(0.995143, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.500747, 6);
    expect(altitude).toBeCloseTo(3.643402, 6);
    expect(radiusVector).toBeCloseTo(0.995143, 6);
});

it('tests getDistanceToEarth', () => {
    const d = sun.getDistanceToEarth();

    expect(d).toBeCloseTo(148871672.599051, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = sun.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(148871672.599051, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = sun.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(148871283.28993, 6);
});
//
// it('tests getTransit',  () => {
//     const toi =  sun.getTransit(location);
//
//     expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 10, min: 50, sec: 46});
// });
//
// it('tests getRise',  () => {
//     const toi =  sun.getRise(location);
//
//     expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 46, sec: 44});
// });
//
// it('tests getRiseUpperLimb',  () => {
//     const toi =  sun.getRiseUpperLimb(location);
//
//     expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 45, sec: 0});
// });
//
// it('tests getSet',  () => {
//     const toi =  sun.getSet(location);
//
//     expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 53, sec: 59});
// });
//
// it('tests getSetUpperLimb',  () => {
//     const toi =  sun.getSetUpperLimb(location);
//
//     expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 55, sec: 42});
// });

it('tests getLightTime', () => {
    const lt = sun.getLightTime();

    expect(sec2string(lt)).toBe('0h 8m 16.58s');
});

it('tests getAngularDiameter', () => {
    const delta = sun.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 09.579"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = sun.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 09.584"');
});

it('tests getApparentMagnitude', () => {
    const V = sun.getApparentMagnitude();

    expect(V).toBe(-26.74);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = sun.getTopocentricApparentMagnitude();

    expect(V).toBe(-26.74);
});
