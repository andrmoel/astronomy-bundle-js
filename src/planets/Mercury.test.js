import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import {deg2angle} from '../utils/angleCalc';
import {sec2string} from '../utils/timeCalc';
import Mercury from './Mercury';
import Venus from './Venus';

const toi = createTimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mercury = new Mercury(toi);

const location = {
    lat: 52.519,
    lon: 13.408,
};

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await mercury.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(-0.14072789);
    expect(round(coords.y, 8)).toBe(-0.44390102);
    expect(round(coords.z, 8)).toBe(-0.02334563);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await mercury.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(-0.14072804);
    expect(round(coords.y, 8)).toBe(-0.44390097);
    expect(round(coords.z, 8)).toBe(-0.02334563);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await mercury.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(252.41006367);
    expect(round(coords.lat, 8)).toBe(-2.87000485);
    expect(round(coords.radiusVector, 8)).toBe(0.46625902);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await mercury.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(252.4100445);
    expect(round(coords.lat, 8)).toBe(-2.87000467);
    expect(round(coords.radiusVector, 8)).toBe(0.46625901);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await mercury.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(0.02779711);
    expect(round(coords.y, 8)).toBe(-1.41268426);
    expect(round(coords.z, 8)).toBe(-0.0233417);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await mercury.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(0.02779664);
    expect(round(coords.y, 8)).toBe(-1.41268427);
    expect(round(coords.z, 8)).toBe(-0.02334169);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await mercury.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(271.12725235);
    expect(round(coords.lat, 8)).toBe(-0.94642533);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await mercury.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(271.12723336);
    expect(round(coords.lat, 8)).toBe(-0.94642515);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const coords = await mercury.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(coords.rightAscension, 8)).toBe(271.23745344);
    expect(round(coords.declination, 8)).toBe(-24.37927381);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const coords = await mercury.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(271.2374326);
    expect(round(coords.declination, 8)).toBe(-24.37927379);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', async () => {
    const {x, y, z} = await mercury.getApparentGeocentricEclipticRectangularCoordinates();

    expect(round(x, 8)).toBe(0.02738728);
    expect(round(y, 8)).toBe(-1.41263084);
    expect(round(z, 8)).toBe(-0.02332071);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const coords = await mercury.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(coords.lon, 8)).toBe(271.11067857);
    expect(round(coords.lat, 8)).toBe(-0.94561583);
    expect(round(coords.radiusVector, 8)).toBe(1.41308874);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await mercury.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(271.21925277);
    expect(round(coords.declination, 8)).toBe(-24.37860566);
    expect(round(coords.radiusVector, 8)).toBe(1.41308874);
});

it('tests getTopocentricEquatorialSphericalCoordinates', async () => {
    const {rightAscension, declination, radiusVector}
        = await mercury.getTopocentricEquatorialSphericalCoordinates(location);

    expect(round(rightAscension, 6)).toBe(271.219689);
    expect(round(declination, 6)).toBe(-24.379446);
    expect(round(radiusVector, 6)).toBe(1.413125);
});

it('tests getTopocentricHorizontalCoordinates', async () => {
    const {azimuth, altitude, radiusVector} = await mercury.getTopocentricHorizontalCoordinates(location);

    expect(round(azimuth, 6)).toBe(39.390453);
    expect(round(altitude, 6)).toBe(-57.233213);
    expect(round(radiusVector, 6)).toBe(1.413125);
});

it('tests getApparentTopocentricHorizontalCoordinates', async () => {
    const {azimuth, altitude, radiusVector} = await mercury.getApparentTopocentricHorizontalCoordinates(location);

    expect(round(azimuth, 6)).toBe(39.390453);
    expect(round(altitude, 6)).toBe(-57.233213);
    expect(round(radiusVector, 6)).toBe(1.413125);
});

it('tests getDistanceToEarth', async () => {
    const d = await mercury.getDistanceToEarth();

    expect(round(d, 2)).toBe(211404305.97);
});

it('tests getApparentDistanceToEarth', async () => {
    const d = await mercury.getApparentDistanceToEarth();

    expect(round(d, 2)).toBe(211395067.3);
});

it('tests getTopocentricDistanceToEarth', async () => {
    const d = await mercury.getTopocentricDistanceToEarth(location);

    expect(round(d, 2)).toBe(211400427.82);
});

it('tests getTransit', async () => {
    const toi = await mercury.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 10, min: 32, sec: 39});
});

it('tests getRise', async () => {
    const toi = await mercury.getRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 6, min: 52, sec: 16});
});

it('tests getSet', async () => {
    const toi = await mercury.getSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 12, sec: 52});
});

it('tests getLightTime', async () => {
    const lt = await mercury.getLightTime();

    expect(sec2string(lt)).toBe('0h 11m 45.17s');
});

it('tests getAngularDiameter', async () => {
    const delta = await mercury.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 00\' 04.761"');
});

it('tests getPhaseAngle', async () => {
    const i = await mercury.getPhaseAngle();

    expect(round(i, 2)).toBe(18.82);
});

it('tests getIlluminatedFraction', async () => {
    const i = await mercury.getIlluminatedFraction();

    expect(round(i, 2)).toBe(0.97);
});

it('tests getPositionAngleOfBrightLimb', async () => {
    const chi = await mercury.getPositionAngleOfBrightLimb();

    expect(round(chi, 2)).toBe(83.39);
});

it('tests isWaxing', async () => {
    const isWaxing = await mercury.isWaxing();

    expect(isWaxing).toBeFalsy();
});

it('tests getApparentMagnitude', async () => {
    const V = await mercury.getApparentMagnitude();

    expect(round(V, 2)).toBe(-0.72);
});

it('tests getConjunctionInRightAscensionTo', async () => {
    const toiConjunction0 = createTimeOfInterest.fromTime(2020, 5, 22, 0, 0, 0);
    const mercury = new Mercury(toiConjunction0);

    const toiConjunction = await mercury.getConjunctionInRightAscensionTo(Venus);

    expect(toiConjunction.time).toEqual({year: 2020, month: 5, day: 22, hour: 7, min: 55, sec: 13});
});
