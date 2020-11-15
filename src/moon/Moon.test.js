import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import {deg2angle} from '../utils/angleCalc';
import {sec2string} from '../utils/timeCalc';
import createMoon from './createMoon';

const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = createMoon(toi);

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const {x, y, z} = await moon.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(x, 6)).toBe(-0.001682);
    expect(round(y, 6)).toBe(0.001793);
    expect(round(z, 6)).toBe(-0.000139);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const {x, y, z} = await moon.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(x, 6)).toBe(-0.001682);
    expect(round(y, 6)).toBe(0.001793);
    expect(round(z, 6)).toBe(-0.000139);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const {lon, lat, radiusVector} = await moon.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(lon, 6)).toBe(133.162655);
    expect(round(lat, 6)).toBe(-3.229126);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const {lon, lat, radiusVector} = await moon.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(lon, 6)).toBe(133.162655);
    expect(round(lat, 6)).toBe(-3.229126);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const {rightAscension, declination, radiusVector} = await moon.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(rightAscension, 6)).toBe(134.68392);
    expect(round(declination, 6)).toBe(13.769656);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const {rightAscension, declination, radiusVector} = await moon.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(rightAscension, 6)).toBe(134.68392);
    expect(round(declination, 6)).toBe(13.769656);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', async () => {
    const {x, y, z} = await moon.getApparentGeocentricEclipticRectangularCoordinates();

    expect(round(x, 8)).toBe(-0.00168211);
    expect(round(y, 8)).toBe(0.00179332);
    expect(round(z, 8)).toBe(-0.00013872);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const {lon, lat, radiusVector} = await moon.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(lon, 6)).toBe(133.167265);
    expect(round(lat, 6)).toBe(-3.229126);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const {rightAscension, declination, radiusVector}
        = await moon.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(rightAscension, 6)).toBe(134.688469);
    expect(round(declination, 6)).toBe(13.768367);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getDistanceToEarth', async () => {
    const d = await moon.getDistanceToEarth();

    expect(round(d, 6)).toBe(368409.684816);
});

it('tests getAngularDiameter', async () => {
    const lt = await moon.getLightTime();

    expect(sec2string(lt)).toBe('0h 0m 1.23s');
});

it('tests getAngularDiameter', async () => {
    const delta = await moon.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 32\' 25.453"');
});

it('tests getPhaseAngle', async () => {
    const i = await moon.getPhaseAngle();

    expect(round(i, 6)).toBe(69.075679);
});

it('tests getIlluminatedFraction', async () => {
    const k = await moon.getIlluminatedFraction();

    expect(round(k, 3)).toBe(0.679);
});

it('tests getUpcomingNewMoon', () => {
    const toiNewMoon = moon.getUpcomingNewMoon();

    expect(toiNewMoon.time).toEqual({year: 1992, month: 4, day: 3, hour: 5, min: 2, sec: 3});
});

it('tests getUpcomingFirstQuarter', () => {
    const toiFirstQuarter = moon.getUpcomingFirstQuarter();

    expect(toiFirstQuarter.time).toEqual({year: 1992, month: 4, day: 10, hour: 10, min: 6, sec: 42});
});

it('tests getUpcomingFullMoon', () => {
    const toiFullMoon = moon.getUpcomingFullMoon();

    expect(toiFullMoon.time).toEqual({year: 1992, month: 4, day: 17, hour: 4, min: 43, sec: 22});
});

it('tests getUpcomingLastQuarter', () => {
    const toiLastQuarter = moon.getUpcomingLastQuarter();

    expect(toiLastQuarter.time).toEqual({year: 1992, month: 4, day: 24, hour: 21, min: 40, sec: 37});
});
