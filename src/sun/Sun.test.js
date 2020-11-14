import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import {deg2angle} from '../utils/angleCalc';
import {sec2string} from '../utils/timeCalc';
import Sun from './Sun';

const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = new Sun(toi);

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await sun.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(-0.87016292);
    expect(round(coords.y, 8)).toBe(-0.4828331);
    expect(round(coords.z, 8)).toBe(0.00002408);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await sun.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(-0.86770215);
    expect(round(coords.y, 8)).toBe(-0.4872415);
    expect(round(coords.z, 8)).toBe(-0.00000243);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await sun.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(209.02487179);
    expect(round(coords.lat, 8)).toBe(0.00138647);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await sun.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(209.31555315);
    expect(round(coords.lat, 8)).toBe(-0.00014017);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const coords = await sun.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(coords.rightAscension, 8)).toBe(206.9810651);
    expect(round(coords.declination, 8)).toBe(-11.1254097);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const coords = await sun.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(207.25762788);
    expect(round(coords.declination, 8)).toBe(-11.22974218);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const coords = await sun.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(coords.lon, 8)).toBe(209.30479579);
    expect(round(coords.lat, 8)).toBe(-0.00014017);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await sun.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(207.2473691);
    expect(round(coords.declination, 8)).toBe(-11.22593849);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getDistanceToEarth', async () => {
    const d = await sun.getDistanceToEarth();

    expect(round(d, 6)).toBe(148871402.777339);
});

it('getLightTime', async () => {
    const lt = await sun.getLightTime();

    expect(sec2string(lt)).toBe('0h 8m 16.58s');
});

it('tests getAngularDiameter', async () => {
    const delta = await sun.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 32\' 09.582"');
});

it('getApparentMagnitude', () => {
    expect(sun.getApparentMagnitude()).toBe(-26.74);
});
