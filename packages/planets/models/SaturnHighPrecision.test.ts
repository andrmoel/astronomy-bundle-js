import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Saturn} from '../index.saturn.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const saturn = Saturn.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(saturn.name).toBe('saturn');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.4085496485, 8);
    expect(y).toBeCloseTo(6.5680499214, 8);
    expect(z).toBeCloseTo(-0.3691281073, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.4085519651, 8);
    expect(y).toBeCloseTo(6.5680477766, 8);
    expect(z).toBeCloseTo(-0.3691281326, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(45.7042085445, 8);
    expect(lat).toBeCloseTo(-2.3034933545, 8);
    expect(radiusVector).toBeCloseTo(9.1839557886, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(45.7041888393, 8);
    expect(lat).toBeCloseTo(-2.3034934917, 8);
    expect(radiusVector).toBeCloseTo(9.1839558723, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.5770873877, 8);
    expect(y).toBeCloseTo(5.5992688979, 8);
    expect(z).toBeCloseTo(-0.3691241717, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.5770893851, 8);
    expect(y).toBeCloseTo(5.5992666979, 8);
    expect(z).toBeCloseTo(-0.3691241941, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(40.4087328532, 8);
    expect(lat).toBeCloseTo(-2.4469931595, 8);
    expect(radiusVector).toBeCloseTo(8.6455851942, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(40.4087131531, 8);
    expect(lat).toBeCloseTo(-2.4469932808, 8);
    expect(radiusVector).toBeCloseTo(8.6455852899, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(38.7788119846, 8);
    expect(declination).toBeCloseTo(12.6167928154, 8);
    expect(radiusVector).toBeCloseTo(8.6455851942, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(38.77879285, 8);
    expect(declination).toBeCloseTo(12.6167865916, 8);
    expect(radiusVector).toBeCloseTo(8.6455852899, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = saturn.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(6.5773936092, 8);
    expect(y).toBeCloseTo(5.5989646366, 8);
    expect(z).toBeCloseTo(-0.369161441, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(40.4058793837, 8);
    expect(lat).toBeCloseTo(-2.4472297524, 8);
    expect(radiusVector).toBeCloseTo(8.6456226995, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(38.7761100918, 8);
    expect(declination).toBeCloseTo(12.6156830996, 8);
    expect(radiusVector).toBeCloseTo(8.6456226995, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        saturn.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(38.77593988, 6);
    expect(declination).toBeCloseTo(12.6154753, 6);
    expect(radiusVector).toBeCloseTo(8.64560861, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57560587, 6);
    expect(altitude).toBeCloseTo(19.33215856, 6);
    expect(radiusVector).toBeCloseTo(8.64560861, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57560587, 6);
    expect(altitude).toBeCloseTo(19.37949823, 6);
    expect(radiusVector).toBeCloseTo(8.64560861, 6);
});

it('tests getDistanceToEarth', () => {
    const d = saturn.getDistanceToEarth();

    expect(d).toBeCloseTo(1293361150.32570839, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = saturn.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(1293366746.71880865, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = saturn.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(1293364638.24616003, 6);
});

it('tests getLightTime', () => {
    const lt = saturn.getLightTime();

    expect(sec2string(lt)).toBe('1h 11m 54.19s');
});

it('tests getAngularDiameter', () => {
    const delta = saturn.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 19.223"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = saturn.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 19.223"');
});

it('tests getElongation', () => {
    const phi = saturn.getElongation();

    expect(phi).toBeCloseTo(120.51582059, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = saturn.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(120.51559459, 6);
});

it('tests getPhaseAngle', () => {
    const i = saturn.getPhaseAngle();

    expect(i).toBeCloseTo(5.29241903, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = saturn.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(5.2924413, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = saturn.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.99786846, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = saturn.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.99786844, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = saturn.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.47527851, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = saturn.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.47515861, 6);
});

it('tests isWaxing', () => {
    const isWaxing = saturn.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = saturn.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = saturn.getApparentMagnitude();

    expect(V).toBeCloseTo(0.13507493, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = saturn.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(0.13508176, 6);
});

it('tests getTransit', () => {
    const toi = saturn.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 18, min: 58, sec: 25});
});

it('tests getGeometricRise', () => {
    const toi = saturn.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 11, min: 51, sec: 44});
});

it('tests getApparentRise', () => {
    const toi = saturn.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 11, min: 47, sec: 45});
});

it('tests getGeometricSet', () => {
    const toi = saturn.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 2, min: 9, sec: 8});
});

it('tests getApparentSet', () => {
    const toi = saturn.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 2, min: 13, sec: 7});
});
