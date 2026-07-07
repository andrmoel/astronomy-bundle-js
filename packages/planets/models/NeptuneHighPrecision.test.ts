import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Neptune} from '../index.neptune.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const neptune = Neptune.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(neptune.name).toBe('neptune');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.8108235576, 8);
    expect(y).toBeCloseTo(-24.992550389, 8);
    expect(z).toBeCloseTo(0.1272669666, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.8108150955, 8);
    expect(y).toBeCloseTo(-24.992555967, 8);
    expect(z).toBeCloseTo(0.1272670381, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.9260935618, 8);
    expect(lat).toBeCloseTo(0.2420899233, 8);
    expect(radiusVector).toBeCloseTo(30.1205504683, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.9260742832, 8);
    expect(lat).toBeCloseTo(0.2420900602, 8);
    expect(radiusVector).toBeCloseTo(30.120550374, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.9793612969, 8);
    expect(y).toBeCloseTo(-25.9613314126, 8);
    expect(z).toBeCloseTo(0.1272709021, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.9793525155, 8);
    expect(y).toBeCloseTo(-25.9613370456, 8);
    expect(z).toBeCloseTo(0.1272709767, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.1856917208, 8);
    expect(lat).toBeCloseTo(0.2350695947, 8);
    expect(radiusVector).toBeCloseTo(31.0210515077, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.1856724519, 8);
    expect(lat).toBeCloseTo(0.235069733, 8);
    expect(radiusVector).toBeCloseTo(31.0210514158, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(305.4252849161, 8);
    expect(declination).toBeCloseTo(-19.2148639596, 8);
    expect(radiusVector).toBeCloseTo(31.0210515077, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(305.4252650266, 8);
    expect(declination).toBeCloseTo(-19.2148682674, 8);
    expect(radiusVector).toBeCloseTo(31.0210514158, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = neptune.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(16.9747251537, 8);
    expect(y).toBeCloseTo(-25.9643789897, 8);
    expect(z).toBeCloseTo(0.1272932645, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(303.1754443217, 8);
    expect(lat).toBeCloseTo(0.235110796, 8);
    expect(radiusVector).toBeCloseTo(31.0210650033, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(305.4147152041, 8);
    expect(declination).toBeCloseTo(-19.2171861304, 8);
    expect(radiusVector).toBeCloseTo(31.0210650033, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        neptune.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(305.41470459, 6);
    expect(declination).toBeCloseTo(-19.21722941, 6);
    expect(radiusVector).toBeCloseTo(31.0211001, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.69891563, 6);
    expect(altitude).toBeCloseTo(-55.400923, 6);
    expect(radiusVector).toBeCloseTo(31.0211001, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.69891563, 6);
    expect(altitude).toBeCloseTo(-55.400923, 6);
    expect(radiusVector).toBeCloseTo(31.0211001, 6);
});

it('tests getDistanceToEarth', () => {
    const d = neptune.getDistanceToEarth();

    expect(d).toBeCloseTo(4640683238.68186283, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = neptune.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(4640685271.33573151, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = neptune.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(4640690521.30863857, 6);
});

it('tests getLightTime', () => {
    const lt = neptune.getLightTime();

    expect(sec2string(lt)).toBe('4h 17m 59.65s');
});

it('tests getAngularDiameter', () => {
    const delta = neptune.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 02.201"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = neptune.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 02.201"');
});

it('tests getElongation', () => {
    const phi = neptune.getElongation();

    expect(phi).toBeCloseTo(23.31732415, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = neptune.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(23.31730405, 6);
});

it('tests getPhaseAngle', () => {
    const i = neptune.getPhaseAngle();

    expect(i).toBeCloseTo(0.74041131, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = neptune.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(0.74040985, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = neptune.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9999582496254975, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = neptune.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9999582497903583, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = neptune.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(256.12887527, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = neptune.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(256.12897067, 6);
});

it('tests isWaxing', () => {
    const isWaxing = neptune.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = neptune.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = neptune.getApparentMagnitude();

    expect(V).toBeCloseTo(7.85459673156347, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = neptune.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(7.854600139267886, 6);
});

it('tests getTransit', () => {
    const toi = neptune.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 46, sec: 9});
});

it('tests getGeometricRise', () => {
    const toi = neptune.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 8, min: 34, sec: 56});
});

it('tests getApparentRise', () => {
    const toi = neptune.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 8, min: 30, sec: 33});
});

it('tests getGeometricSet', () => {
    const toi = neptune.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 16, min: 57, sec: 22});
});

it('tests getApparentSet', () => {
    const toi = neptune.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 17, min: 1, sec: 46});
});
