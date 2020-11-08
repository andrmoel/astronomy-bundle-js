import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import createMoon from './createMoon';
import {deg2angle} from '../utils/angleCalc';

it('tests getGeocentricEquatorialRectangularCoordinates', () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const {x, y, z} = moon.getGeocentricEquatorialRectangularCoordinates();

    expect(round(x, 6)).toBe(-0.001682);
    expect(round(y, 6)).toBe(0.001701);
    expect(round(z, 6)).toBe(0.000586);
});

it('tests getGeocentricEclipticSphericalCoordinates', () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const {lon, lat, radiusVector} = moon.getGeocentricEclipticSphericalCoordinates();

    expect(round(lon, 6)).toBe(133.162655);
    expect(round(lat, 6)).toBe(-3.229126);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const {lon, lat, radiusVector} = moon.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(lon, 6)).toBe(133.167265);
    expect(round(lat, 6)).toBe(-3.229126);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getGeocentricEquatorialSphericalCoordinates', () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const {rightAscension, declination, radiusVector} = moon.getGeocentricEquatorialSphericalCoordinates();

    expect(round(rightAscension, 6)).toBe(134.68392);
    expect(round(declination, 6)).toBe(13.769656);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const {rightAscension, declination, radiusVector} = moon.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(rightAscension, 6)).toBe(134.688469);
    expect(round(declination, 6)).toBe(13.768367);
    expect(round(radiusVector, 6)).toBe(0.002463);
});

it('tests getDistanceToEarth', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
    const moon = createMoon(toi);

    expect(round(moon.getDistanceToEarth(), 6)).toBe(378157.525065);
});

it('tests getAngularDiameter', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
    const moon = createMoon(toi);

    expect(deg2angle(moon.getAngularDiameter())).toBe('0° 31\' 35.305"');
});

it('tests getPhaseAngle', async () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const i = await moon.getPhaseAngle();

    expect(round(i, 6)).toBe(69.081341);
});

it('tests getIlluminatedFraction', async () => {
    const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
    const moon = createMoon(toi);

    const k = await moon.getIlluminatedFraction();

    expect(round(k, 3)).toBe(0.679);
});

it('tests getUpcomingNewMoon', () => {
    const toi = createTimeOfInterest.fromTime(2020, 11, 1, 0, 0, 0);
    const moon = createMoon(toi);

    const toiNewMoon = moon.getUpcomingNewMoon();

    expect(toiNewMoon.time).toEqual({year: 2020, month: 11, day: 15, hour: 5, min: 8, sec: 23});
});

it('tests getUpcomingFirstQuarter', () => {
    const toi = createTimeOfInterest.fromTime(2020, 11, 1, 0, 0, 0);
    const moon = createMoon(toi);

    const toiFirstQuarter = moon.getUpcomingFirstQuarter();

    expect(toiFirstQuarter.time).toEqual({year: 2020, month: 11, day: 22, hour: 4, min: 46, sec: 35});
});

it('tests getUpcomingFullMoon', () => {
    const toi = createTimeOfInterest.fromTime(2020, 11, 1, 0, 0, 0);
    const moon = createMoon(toi);

    const toiFullMoon = moon.getUpcomingFullMoon();

    expect(toiFullMoon.time).toEqual({year: 2020, month: 11, day: 30, hour: 9, min: 31, sec: 22});
});

it('tests getUpcomingLastQuarter', () => {
    const toi = createTimeOfInterest.fromTime(2020, 11, 1, 0, 0, 0);
    const moon = createMoon(toi);

    const toiLastQuarter = moon.getUpcomingLastQuarter();

    expect(toiLastQuarter.time).toEqual({year: 2020, month: 12, day: 8, hour: 0, min: 37, sec: 46});
});
