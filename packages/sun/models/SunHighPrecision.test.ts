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
    const {rightAscension, declination, radiusVector} = sun.getTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(207.248793, 6);
    expect(declination).toBeCloseTo(-11.227945, 6);
    expect(radiusVector).toBeCloseTo(0.995141, 6);
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.50076, 6);
    expect(altitude).toBeCloseTo(3.433893, 6);
    expect(radiusVector).toBeCloseTo(0.995141, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.50076, 6);
    expect(altitude).toBeCloseTo(3.643379, 6);
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

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 09.582"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = sun.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 09.587"');
});

it('tests getApparentMagnitude', () => {
    const V = sun.getApparentMagnitude();

    expect(V).toBe(-26.74);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = sun.getTopocentricApparentMagnitude();

    expect(V).toBe(-26.74);
});
