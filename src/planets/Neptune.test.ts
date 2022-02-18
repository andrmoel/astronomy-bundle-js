import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import {deg2angle} from '../utils/angleCalc';
import {sec2string} from '../time/calculations/timeCalc';
import {createLocation} from '../earth';
import Neptune from './Neptune';
import Jupiter from './Jupiter';
import {Position} from './types/PlanetTypes';

const toi = createTimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const neptune = new Neptune(toi);
const location = createLocation(52.519, 13.408);

it('tests if name is correct', () => {
    expect(neptune.name).toBe('neptune');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await neptune.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(16.81082165);
    expect(round(coords.y, 8)).toBe(-24.9925517);
    expect(round(coords.z, 8)).toBe(0.12726704);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await neptune.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(16.81081318);
    expect(round(coords.y, 8)).toBe(-24.99255729);
    expect(round(coords.z, 8)).toBe(0.12726711);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await neptune.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(303.92608916);
    expect(round(coords.lat, 8)).toBe(0.24209006);
    expect(round(coords.radiusVector, 8)).toBe(30.12055049);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await neptune.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(303.92606985);
    expect(round(coords.lat, 8)).toBe(0.2420902);
    expect(round(coords.radiusVector, 8)).toBe(30.1205504);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await neptune.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(16.97934665);
    expect(round(coords.y, 8)).toBe(-25.96133495);
    expect(round(coords.z, 8)).toBe(0.12727097);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await neptune.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(16.97933786);
    expect(round(coords.y, 8)).toBe(-25.96134059);
    expect(round(coords.z, 8)).toBe(0.12727105);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await neptune.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(303.1856655);
    expect(round(coords.lat, 8)).toBe(0.23506976);
    expect(round(coords.radiusVector, 8)).toBe(31.02104645);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await neptune.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(303.18564621);
    expect(round(coords.lat, 8)).toBe(0.2350699);
    expect(round(coords.radiusVector, 8)).toBe(31.02104636);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const coords = await neptune.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(coords.rightAscension, 8)).toBe(305.42525786);
    expect(round(coords.declination, 8)).toBe(-19.21486984);
    expect(round(coords.radiusVector, 8)).toBe(31.02104645);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const coords = await neptune.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(305.42523794);
    expect(round(coords.declination, 8)).toBe(-19.21487416);
    expect(round(coords.radiusVector, 8)).toBe(31.02104636);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', async () => {
    const {x, y, z} = await neptune.getApparentGeocentricEclipticRectangularCoordinates();

    expect(round(x, 8)).toBe(16.97471051);
    expect(round(y, 8)).toBe(-25.96438252);
    expect(round(z, 8)).toBe(0.12729334);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const coords = await neptune.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(coords.lon, 8)).toBe(303.17541811);
    expect(round(coords.lat, 8)).toBe(0.23511097);
    expect(round(coords.radiusVector, 8)).toBe(31.02105995);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await neptune.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(305.41468815);
    expect(round(coords.declination, 8)).toBe(-19.21719201);
    expect(round(coords.radiusVector, 8)).toBe(31.02105995);
});

it('tests getTopocentricEquatorialSphericalCoordinates', async () => {
    const {rightAscension, declination, radiusVector}
        = await neptune.getTopocentricEquatorialSphericalCoordinates(location);

    expect(round(rightAscension, 6)).toBe(305.414678);
    expect(round(declination, 6)).toBe(-19.217235);
    expect(round(radiusVector, 6)).toBe(31.021095);
});

it('tests getTopocentricHorizontalCoordinates', async () => {
    const {azimuth, altitude, radiusVector} = await neptune.getTopocentricHorizontalCoordinates(location);

    expect(round(azimuth, 6)).toBe(339.698957);
    expect(round(altitude, 6)).toBe(-55.40089);
    expect(round(radiusVector, 6)).toBe(31.021095);
});

it('tests getApparentTopocentricHorizontalCoordinates', async () => {
    const {azimuth, altitude, radiusVector} = await neptune.getApparentTopocentricHorizontalCoordinates(location);

    expect(round(azimuth, 6)).toBe(339.698957);
    expect(round(altitude, 6)).toBe(-55.40089);
    expect(round(radiusVector, 6)).toBe(31.021095);
});

it('tests getDistanceToEarth', async () => {
    const d = await neptune.getDistanceToEarth();

    expect(round(d, 2)).toBe(4640682482.19);
});

it('tests getApparentDistanceToEarth', async () => {
    const d = await neptune.getApparentDistanceToEarth();

    expect(round(d, 2)).toBe(4640684514.87);
});

it('tests getTopocentricDistanceToEarth', async () => {
    const d = await neptune.getTopocentricDistanceToEarth(location);

    expect(round(d, 2)).toBe(4640689764.85);
});

it('tests getTransit', async () => {
    const toi = await neptune.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 46, sec: 9});
});

it('tests getRise', async () => {
    const toi = await neptune.getRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 8, min: 30, sec: 33});
});

it('tests getSet', async () => {
    const toi = await neptune.getSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 17, min: 1, sec: 46});
});

it('tests getLightTime', async () => {
    const lt = await neptune.getLightTime();

    expect(sec2string(lt)).toBe('4h 17m 59.65s');
});

it('tests getAngularDiameter', async () => {
    const delta = await neptune.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 00\' 02.201"');
});

it('tests getElongation', async () => {
    const phi = await neptune.getElongation();

    expect(round(phi, 2)).toBe(23.32);
});

it('tests getPhaseAngle', async () => {
    const i = await neptune.getPhaseAngle();

    expect(round(i, 2)).toBe(0.74);
});

it('tests getIlluminatedFraction', async () => {
    const i = await neptune.getIlluminatedFraction();

    expect(round(i, 2)).toBe(1);
});

it('tests getPositionAngleOfBrightLimb', async () => {
    const chi = await neptune.getPositionAngleOfBrightLimb();

    expect(round(chi, 2)).toBe(256.13);
});

it('tests isWaxing', async () => {
    const isWaxing = await neptune.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', async () => {
    const V = await neptune.getApparentMagnitude();

    expect(round(V, 2)).toBe(7.85);
});

it('tests getConjunctionInRightAscensionTo', async () => {
    const toiConjunction0 = createTimeOfInterest.fromTime(2022, 4, 12, 0, 0, 0);
    const neptune = new Neptune(toiConjunction0);

    const {toi, position, angularDistance} = await neptune.getConjunctionInRightAscensionTo(Jupiter);

    expect(toi.time).toEqual({year: 2022, month: 4, day: 12, hour: 20, min: 6, sec: 49});
    expect(position).toBe(Position.South);
    expect(round(angularDistance, 6)).toBe(0.107984);
});
