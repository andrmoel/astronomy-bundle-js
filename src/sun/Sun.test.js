import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import {deg2angle} from '../utils/angleCalc';
import Sun from './Sun';

const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = new Sun(toi);

it('tests getGeocentricRectangularJ2000Coordinates', async () => {
    const coords = await sun.getGeocentricRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(-0.87016292);
    expect(round(coords.y, 8)).toBe(-0.4828331);
    expect(round(coords.z, 8)).toBe(0.00002408);
});

it('tests getGeocentricRectangularDateCoordinates', async () => {
    const coords = await sun.getGeocentricRectangularDateCoordinates();

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

it('tests getApparentGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await sun.getApparentGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(209.31051523);
    expect(round(coords.lat, 8)).toBe(-0.00014017);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await sun.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(207.25282342);
    expect(round(coords.declination, 8)).toBe(-11.22796087);
    expect(round(coords.radiusVector, 8)).toBe(0.99514386);
});

it('tests getDistanceToEarth', async () => {
    const d = await sun.getDistanceToEarth();

    expect(round(d, 6)).toBe(148871402.777339);
});

it('tests getAngularDiameter', async () => {
    const delta = await sun.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 32\' 09.582"');
});

it('getApparentMagnitude', async () => {
    expect(await sun.getApparentMagnitude()).toBe(-26.74);
});
