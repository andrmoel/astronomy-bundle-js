import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Mars} from '../index.mars.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mars = Mars.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(mars.name).toBe('mars');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.3903616447, 8);
    expect(y).toBeCloseTo(-0.0209978845, 8);
    expect(z).toBeCloseTo(-0.0346179241, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.3903616366, 8);
    expect(y).toBeCloseTo(-0.0209983324, 8);
    expect(z).toBeCloseTo(-0.0346179244, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(359.1347584223, 8);
    expect(lat).toBeCloseTo(-1.4261219105, 8);
    expect(radiusVector).toBeCloseTo(1.3909510469, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(359.1347399638, 8);
    expect(lat).toBeCloseTo(-1.4261219242, 8);
    expect(radiusVector).toBeCloseTo(1.3909510456, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.5588993839, 8);
    expect(y).toBeCloseTo(-0.989778908, 8);
    expect(z).toBeCloseTo(-0.0346139885, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.5588990566, 8);
    expect(y).toBeCloseTo(-0.9897794111, 8);
    expect(z).toBeCloseTo(-0.0346139858, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(327.5876535287, 8);
    expect(lat).toBeCloseTo(-1.0738832831, 8);
    expect(radiusVector).toBeCloseTo(1.8468967768, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(327.5876349083, 8);
    expect(lat).toBeCloseTo(-1.0738832045, 8);
    expect(radiusVector).toBeCloseTo(1.84689677, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(330.1572404492432, 8);
    expect(declination).toBeCloseTo(-13.318841567905826, 8);
    expect(radiusVector).toBeCloseTo(1.8468967768, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(330.1568937322, 8);
    expect(declination).toBeCloseTo(-13.3180512545, 8);
    expect(radiusVector).toBeCloseTo(1.84689677, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mars.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(1.5587568199, 8);
    expect(y).toBeCloseTo(-0.9901527648, 8);
    expect(z).toBeCloseTo(-0.034619769, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(327.5754900764, 8);
    expect(lat).toBeCloseTo(-1.0740160146, 8);
    expect(radiusVector).toBeCloseTo(1.8469769488, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(330.1452287825, 8);
    expect(declination).toBeCloseTo(-13.3223657059, 8);
    expect(radiusVector).toBeCloseTo(1.8469769488, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mars.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(330.14473263, 6);
    expect(declination).toBeCloseTo(-13.32323344, 6);
    expect(radiusVector).toBeCloseTo(1.84700497, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.38980398, 6);
    expect(altitude).toBeCloseTo(-41.08442214, 6);
    expect(radiusVector).toBeCloseTo(1.84700497, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.38980398, 6);
    expect(altitude).toBeCloseTo(-41.08442214, 6);
    expect(radiusVector).toBeCloseTo(1.84700497, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mars.getDistanceToEarth();

    expect(d).toBeCloseTo(276291824.19905788, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mars.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(276303818.7788288, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mars.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(276308011.22959524, 6);
});

it('tests getLightTime', () => {
    const lt = mars.getLightTime();

    expect(sec2string(lt)).toBe('0h 15m 21.61s');
});

it('tests getAngularDiameter', () => {
    const delta = mars.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 05.071"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = mars.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 05.071"');
});

it('tests getElongation', () => {
    const phi = mars.getElongation();

    expect(phi).toBeCloseTo(47.72541237, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mars.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(47.72467099, 6);
});

it('tests getPhaseAngle', () => {
    const i = mars.getPhaseAngle();

    expect(i).toBeCloseTo(31.53926411, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mars.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(31.53856265, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mars.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.92614095, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mars.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.92614415, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mars.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.79346598, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mars.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.7941809, 6);
});

it('tests isWaxing', () => {
    const isWaxing = mars.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = mars.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = mars.getApparentMagnitude();

    expect(V).toBeCloseTo(1.03340056, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mars.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(1.03351655, 6);
});

it('tests getTransit', () => {
    const toi = mars.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 26, sec: 30});
});

it('tests getGeometricRise', () => {
    const toi = mars.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 38, sec: 0});
});

it('tests getApparentRise', () => {
    const toi = mars.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 34, sec: 0});
});

it('tests getGeometricSet', () => {
    const toi = mars.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 19, min: 15, sec: 39});
});

it('tests getApparentSet', () => {
    const toi = mars.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 19, min: 19, sec: 39});
});
