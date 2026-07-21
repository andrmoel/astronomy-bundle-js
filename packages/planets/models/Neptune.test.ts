import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Neptune from './Neptune';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const neptune = Neptune.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(neptune.name).toBe('neptune');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.8108756717, 8);
    expect(y).toBeCloseTo(-24.9925004469, 8);
    expect(z).toBeCloseTo(0.127231577, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.8108673266, 8);
    expect(y).toBeCloseTo(-24.9925060214, 8);
    expect(z).toBeCloseTo(0.1272316494, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.9262288408, 8);
    expect(lat).toBeCloseTo(0.2420227046, 8);
    expect(radiusVector).toBeCloseTo(30.1205379651, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.9262097507, 8);
    expect(lat).toBeCloseTo(0.2420228425, 8);
    expect(radiusVector).toBeCloseTo(30.1205379333, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.9794122643, 8);
    expect(y).toBeCloseTo(-25.9612815483, 8);
    expect(z).toBeCloseTo(0.1272348326, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.9794035957, 8);
    expect(y).toBeCloseTo(-25.961287179, 8);
    expect(z).toBeCloseTo(0.1272349079, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.185820914, 8);
    expect(lat).toBeCloseTo(0.2350030796, 8);
    expect(radiusVector).toBeCloseTo(31.02103753, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.1858018219, 8);
    expect(lat).toBeCloseTo(0.2350032191, 8);
    expect(radiusVector).toBeCloseTo(31.0210374979, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(305.4254342842, 8);
    expect(declination).toBeCloseTo(-19.2148988934, 8);
    expect(radiusVector).toBeCloseTo(31.02103753, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(305.4254145766, 8);
    expect(declination).toBeCloseTo(-19.2149031595, 8);
    expect(radiusVector).toBeCloseTo(31.0210374979, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = neptune.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(16.9747762383, 8);
    expect(y).toBeCloseTo(-25.9643291259, 8);
    expect(z).toBeCloseTo(0.1272571957, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(303.1755736908, 8);
    expect(lat).toBeCloseTo(0.235044282, 8);
    expect(radiusVector).toBeCloseTo(31.0210510776, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(305.4148647531, 8);
    expect(declination).toBeCloseTo(-19.2172210314, 8);
    expect(radiusVector).toBeCloseTo(31.0210510776, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        neptune.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(305.41485416, 6);
    expect(declination).toBeCloseTo(-19.21726431, 6);
    expect(radiusVector).toBeCloseTo(31.02108617, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.69865947, 6);
    expect(altitude).toBeCloseTo(-55.40092544, 6);
    expect(radiusVector).toBeCloseTo(31.02108617, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.69865947, 6);
    expect(altitude).toBeCloseTo(-55.40092544, 6);
    expect(radiusVector).toBeCloseTo(31.02108617, 6);
});

it('tests getDistanceToEarth', () => {
    const d = neptune.getDistanceToEarth();

    expect(d).toBeCloseTo(4640681156.2192688, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = neptune.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(4640683187.7047052, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = neptune.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(4640688437.6777468, 6);
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

    expect(phi).toBeCloseTo(23.3175197, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = neptune.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(23.31749959, 6);
});

it('tests getPhaseAngle', () => {
    const i = neptune.getPhaseAngle();

    expect(i).toBeCloseTo(0.74041739, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = neptune.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(0.74041593, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = neptune.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9999582489398345, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = neptune.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9999582491046977, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = neptune.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(256.12888485, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = neptune.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(256.12898025, 6);
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

    expect(V).toBeCloseTo(7.85459521, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = neptune.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(7.85459862, 6);
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
