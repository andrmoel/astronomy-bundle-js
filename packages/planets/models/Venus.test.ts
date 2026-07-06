import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Venus from './Venus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const venus = Venus.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(venus.name).toBe('venus');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.7186160942, 8);
    expect(y).toBeCloseTo(-0.0225186129, 8);
    expect(z).toBeCloseTo(0.0414077686, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.718616102, 8);
    expect(y).toBeCloseTo(-0.0225183745, 8);
    expect(z).toBeCloseTo(0.0414077689, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(181.7948379235, 8);
    expect(lat).toBeCloseTo(3.2962102368, 8);
    expect(radiusVector).toBeCloseTo(0.7201602475, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(181.7948189169, 8);
    expect(lat).toBeCloseTo(3.2962102583, 8);
    expect(radiusVector).toBeCloseTo(0.7201602478, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.5500794937, 8);
    expect(y).toBeCloseTo(-0.9912997143, 8);
    expect(z).toBeCloseTo(0.0414110242, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.5500798249, 8);
    expect(y).toBeCloseTo(-0.9912995322, 8);
    expect(z).toBeCloseTo(0.0414110275, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(240.9737840184, 8);
    expect(lat).toBeCloseTo(2.0919419619, 8);
    expect(radiusVector).toBeCloseTo(1.1344502836, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(240.973764915, 8);
    expect(lat).toBeCloseTo(2.0919421253, 8);
    expect(radiusVector).toBeCloseTo(1.1344502852, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(239.2875763933, 8);
    expect(declination).toBeCloseTo(-18.3046709183, 8);
    expect(radiusVector).toBeCloseTo(1.1344502836, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(239.2875567399, 8);
    expect(declination).toBeCloseTo(-18.3046668775, 8);
    expect(radiusVector).toBeCloseTo(1.1344502852, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = venus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.5502280502, 8);
    expect(y).toBeCloseTo(-0.9910859635, 8);
    expect(z).toBeCloseTo(0.0414104142, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(240.9619763357, 8);
    expect(lat).toBeCloseTo(2.0921228354, 8);
    expect(radiusVector).toBeCloseTo(1.1343355397, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(239.2754461049, 8);
    expect(declination).toBeCloseTo(-18.3020947427, 8);
    expect(radiusVector).toBeCloseTo(1.1343355397, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        venus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(239.27656644, 6);
    expect(declination).toBeCloseTo(-18.3034679, 6);
    expect(radiusVector).toBeCloseTo(1.13436059, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.94238908, 6);
    expect(altitude).toBeCloseTo(-36.01561442, 6);
    expect(radiusVector).toBeCloseTo(1.13436059, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.94238908, 6);
    expect(altitude).toBeCloseTo(-36.01561442, 6);
    expect(radiusVector).toBeCloseTo(1.13436059, 6);
});

it('tests getDistanceToEarth', () => {
    const d = venus.getDistanceToEarth();

    expect(d).toBeCloseTo(169711347.07391998, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = venus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(169694181.40300283, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = venus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(169697928.91147086, 6);
});

it('tests getLightTime', () => {
    const lt = venus.getLightTime();

    expect(sec2string(lt)).toBe('0h 9m 26.1s');
});

it('tests getAngularDiameter', () => {
    const delta = venus.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 14.712"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = venus.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 14.712"');
});

it('tests getElongation', () => {
    const phi = venus.getElongation();

    expect(phi).toBeCloseTo(38.94449574, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = venus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(38.94312545, 6);
});

it('tests getPhaseAngle', () => {
    const i = venus.getPhaseAngle();

    expect(i).toBeCloseTo(59.1256175, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = venus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(59.12416948, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = venus.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.75657878, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = venus.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.75658962, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = venus.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(104.32341509, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = venus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(104.32174255, 6);
});

it('tests isWaxing', () => {
    const isWaxing = venus.isWaxing();

    expect(isWaxing).toBeFalsy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = venus.isTopocentricWaxing(location);

    expect(isWaxing).toBeFalsy();
});

it('tests getApparentMagnitude', () => {
    const V = venus.getApparentMagnitude();

    expect(V).toBeCloseTo(-4.06814392, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = venus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-4.0683452, 6);
});

it('tests getTransit', () => {
    const toi = venus.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 8, min: 23, sec: 58});
});

it('tests getGeometricRise', () => {
    const toi = venus.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 4, min: 6, sec: 18});
});

it('tests getApparentRise', () => {
    const toi = venus.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 4, min: 1, sec: 58});
});

it('tests getGeometricSet', () => {
    const toi = venus.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 41, sec: 0});
});

it('tests getApparentSet', () => {
    const toi = venus.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 45, sec: 20});
});
