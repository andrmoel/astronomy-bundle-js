import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Mercury from './Mercury';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mercury = Mercury.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(mercury.name).toBe('mercury');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.140788505, 8);
    expect(y).toBeCloseTo(-0.4441455739, 8);
    expect(z).toBeCloseTo(-0.0176520237, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.140788653, 8);
    expect(y).toBeCloseTo(-0.4441455271, 8);
    expect(z).toBeCloseTo(-0.0176520226, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(252.4120462077, 8);
    expect(lat).toBeCloseTo(-2.1696658474, 8);
    expect(radiusVector).toBeCloseTo(0.4662598907, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(252.412027115, 8);
    expect(lat).toBeCloseTo(-2.1696657098, 8);
    expect(radiusVector).toBeCloseTo(0.4662598907, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(0.0277480882, 8);
    expect(y).toBeCloseTo(-1.4129266753, 8);
    expect(z).toBeCloseTo(-0.0176487681, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(0.027747617, 8);
    expect(y).toBeCloseTo(-1.4129266847, 8);
    expect(z).toBeCloseTo(-0.017648764, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(271.1250718804, 8);
    expect(lat).toBeCloseTo(-0.7155023612, 8);
    expect(radiusVector).toBeCloseTo(1.4133093172, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(271.12505276, 8);
    expect(lat).toBeCloseTo(-0.715502194, 8);
    expect(radiusVector).toBeCloseTo(1.4133093173, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(271.2328900221, 8);
    expect(declination).toBeCloseTo(-24.1483780234, 8);
    expect(radiusVector).toBeCloseTo(1.4133093172, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(271.232869069, 8);
    expect(declination).toBeCloseTo(-24.1483780197, 8);
    expect(radiusVector).toBeCloseTo(1.4133093173, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mercury.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(0.0273381929, 8);
    expect(y).toBeCloseTo(-1.4128729747, 8);
    expect(z).toBeCloseTo(-0.0176279145, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(271.1084985407, 8);
    expect(lat).toBeCloseTo(-0.7146882099, 8);
    expect(radiusVector).toBeCloseTo(1.4132473823, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(271.2147217782, 8);
    expect(declination).toBeCloseTo(-24.1477046932, 8);
    expect(radiusVector).toBeCloseTo(1.4132473823, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mercury.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(271.21515742, 6);
    expect(declination).toBeCloseTo(-24.14855123, 6);
    expect(radiusVector).toBeCloseTo(1.41328313, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.21748211, 6);
    expect(altitude).toBeCloseTo(-57.02315353, 6);
    expect(radiusVector).toBeCloseTo(1.41328313, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.21748211, 6);
    expect(altitude).toBeCloseTo(-57.02315353, 6);
    expect(radiusVector).toBeCloseTo(1.41328313, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mercury.getDistanceToEarth();

    expect(d).toBeCloseTo(211428064.2325016, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mercury.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(211418798.842596, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mercury.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(211424146.7089298, 6);
});

it('tests getLightTime', () => {
    const lt = mercury.getLightTime();

    expect(sec2string(lt)).toBe('0h 11m 45.25s');
});

it('tests getAngularDiameter', () => {
    const delta = mercury.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 04.76"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = mercury.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 04.76"');
});

it('tests getElongation', () => {
    const phi = mercury.getElongation();

    expect(phi).toBeCloseTo(8.77959707, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mercury.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(8.77927668, 6);
});

it('tests getPhaseAngle', () => {
    const i = mercury.getPhaseAngle();

    expect(i).toBeCloseTo(18.77815458, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mercury.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(18.77614159, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mercury.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.97338603, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mercury.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.97339169, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mercury.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(84.88279701, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mercury.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(84.87692984, 6);
});

it('tests isWaxing', () => {
    const isWaxing = mercury.isWaxing();

    expect(isWaxing).toBeFalsy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = mercury.isTopocentricWaxing(location);

    expect(isWaxing).toBeFalsy();
});

it('tests getApparentMagnitude', () => {
    const V = mercury.getApparentMagnitude();

    expect(V).toBeCloseTo(-0.72244945, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mercury.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-0.72254897, 6);
});

it('tests getTransit', () => {
    const toi = mercury.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 10, min: 32, sec: 38});
});

it('tests getGeometricRise', () => {
    const toi = mercury.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 6, min: 55, sec: 31});
});

it('tests getApparentRise', () => {
    const toi = mercury.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 6, min: 50, sec: 30});
});

it('tests getGeometricSet', () => {
    const toi = mercury.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 9, sec: 34});
});

it('tests getApparentSet', () => {
    const toi = mercury.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 14, sec: 34});
});
