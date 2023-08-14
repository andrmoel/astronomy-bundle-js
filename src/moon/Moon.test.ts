import {createLocation} from '../earth';
import {createTimeOfInterest} from '../time';
import {sec2string} from '../time/calculations/timeCalc';
import {deg2angle} from '../utils/angleCalc';
import {round} from '../utils/math';
import createMoon from './createMoon';
import GoldenHandle from './events/GoldenHandle';
import LunarV from './events/LunarV';
import LunarX from './events/LunarX';

const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = createMoon(toi);
const location = createLocation(52.519, -122.4108);

it('tests if name is correct', () => {
    expect(moon.name).toBe('moon');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const {x, y, z} = await moon.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(x, 6)).toBe(-0.928931);
    expect(round(y, 6)).toBe(-0.379272);
    expect(round(z, 6)).toBe(-0.000136);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const {x, y, z} = await moon.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(x, 6)).toBe(-0.928931);
    expect(round(y, 6)).toBe(-0.379272);
    expect(round(z, 6)).toBe(-0.000136);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const {lon, lat, radiusVector} = await moon.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(lon, 6)).toBe(202.209632);
    expect(round(lat, 6)).toBe(-0.007744);
    expect(round(radiusVector, 6)).toBe(1.003374);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const {lon, lat, radiusVector} = await moon.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(lon, 6)).toBe(202.209632);
    expect(round(lat, 6)).toBe(-0.007744);
    expect(round(radiusVector, 6)).toBe(1.003374);
});

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

it('tests getTopocentricEquatorialSphericalCoordinates', async () => {
    const {rightAscension, declination, radiusVector}
        = await moon.getTopocentricEquatorialSphericalCoordinates(location);

    expect(round(rightAscension, 6)).toBe(135.211802);
    expect(round(declination, 6)).toBe(13.079873);
    expect(round(radiusVector, 6)).toBe(0.002441);
});

it('tests getTopocentricHorizontalCoordinates', async () => {
    const {azimuth, altitude, radiusVector} = await moon.getTopocentricHorizontalCoordinates(location);

    expect(round(azimuth, 6)).toBe(108.968405);
    expect(round(altitude, 6)).toBe(30.91398);
    expect(round(radiusVector, 6)).toBe(0.002441);
});

it('tests getApparentTopocentricHorizontalCoordinates', async () => {
    const {azimuth, altitude, radiusVector} = await moon.getApparentTopocentricHorizontalCoordinates(location);

    expect(round(azimuth, 6)).toBe(108.968405);
    expect(round(altitude, 6)).toBe(30.94205);
    expect(round(radiusVector, 6)).toBe(0.002441);
});

it('tests getDistanceToEarth', async () => {
    const d = await moon.getDistanceToEarth();

    expect(round(d, 6)).toBe(368409.684816);
});

it('tests getApparentDistanceToEarth', async () => {
    const d = await moon.getApparentDistanceToEarth();

    expect(round(d, 6)).toBe(368409.684816);
});

it('tests getTopocentricDistanceToEarth', async () => {
    const d = await moon.getTopocentricDistanceToEarth(location);

    expect(round(d, 6)).toBe(365174.89477);
});

it('tests getTransit', async () => {
    const toi = await moon.getTransit(location);

    expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 3, min: 55, sec: 0});
});

it('tests getRise', async () => {
    const toi = await moon.getRise(location);

    expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 45, sec: 30});
});

it('tests getSet', async () => {
    const toi = await moon.getSet(location);

    expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 10, sec: 31});
});

it('tests getLightTime', async () => {
    const lt = await moon.getLightTime();

    expect(sec2string(lt)).toBe('0h 0m 1.23s');
});

it('tests getAngularDiameter', async () => {
    const delta = await moon.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 32\' 25.453"');
});

it('tests getTopocentricAngularDiameter', async () => {
    const delta = await moon.getTopocentricAngularDiameter(location);

    expect(deg2angle(delta)).toBe('0° 32\' 42.686"');
});

it('tests getElongation', async () => {
    const phi = await moon.getElongation();

    expect(round(phi, 6)).toBe(110.792854);
});

it('tests getTopocentricElongation', async () => {
    const phi = await moon.getTopocentricElongation(location);

    expect(round(phi, 6)).toBe(111.462765);
});

it('tests getPhaseAngle', async () => {
    const i = await moon.getPhaseAngle();

    expect(round(i, 6)).toBe(69.075679);
});

it('tests getTopocentricPhaseAngle', async () => {
    const i = await moon.getTopocentricPhaseAngle(location);

    expect(round(i, 6)).toBe(68.407512);
});

it('tests getIlluminatedFraction', async () => {
    const k = await moon.getIlluminatedFraction();

    expect(round(k, 3)).toBe(0.679);
});

it('tests getTopocentricIlluminatedFraction', async () => {
    const k = await moon.getTopocentricIlluminatedFraction(location);

    expect(round(k, 3)).toBe(0.684);
});

it('tests getPositionAngleOfBrightLimb', async () => {
    const chi = await moon.getPositionAngleOfBrightLimb();

    expect(round(chi, 3)).toBe(285.044);
});

it('tests getTopocentricPositionAngleOfBrightLimb', async () => {
    const chi = await moon.getTopocentricPositionAngleOfBrightLimb(location);

    expect(round(chi, 3)).toBe(284.96);
});

it('tests isWaxing', async () => {
    const isWaxing = await moon.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', async () => {
    const isWaxing = await moon.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', async () => {
    const V = await moon.getApparentMagnitude();

    expect(round(V, 2)).toBe(-11.04);
});

it('tests getTopocentricApparentMagnitude', async () => {
    const V = await moon.getTopocentricApparentMagnitude(location);

    expect(round(V, 2)).toBe(-11.08);
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

it('tests getGeocentricLibration', async () => {
    const {lon, lat} = await moon.getGeocentricLibration();

    expect(round(lon, 5)).toBe(-1.23121);
    expect(round(lat, 5)).toBe(4.1998);
});

it('tests getSelenographicLocationOfEarth', async () => {
    const {lon, lat} = await moon.getSelenographicLocationOfEarth();

    expect(round(lon, 5)).toBe(-1.23121);
    expect(round(lat, 5)).toBe(4.1998);
});

it('tests getSelenographicLocationOfSun', async () => {
    const {lon, lat} = await moon.getSelenographicLocationOfSun();

    expect(round(lon, 5)).toBe(67.89894);
    expect(round(lat, 5)).toBe(1.4615);
});

it('tests GoldenHandle', () => {
    expect(moon.getGoldenHandle()).toBeInstanceOf(GoldenHandle);
});

it('tests getLunarX', () => {
    expect(moon.getLunarX()).toBeInstanceOf(LunarX);
});

it('tests getLunarV', () => {
    expect(moon.getLunarV()).toBeInstanceOf(LunarV);
});
