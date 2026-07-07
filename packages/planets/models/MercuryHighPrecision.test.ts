import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Mercury} from '../index.mercury.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mercury = Mercury.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(mercury.name).toBe('mercury');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.1407122375, 8);
    expect(y).toBeCloseTo(-0.4439062634, 8);
    expect(z).toBeCloseTo(-0.0233474957, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.1407123857, 8);
    expect(y).toBeCloseTo(-0.4439062164, 8);
    expect(z).toBeCloseTo(-0.0233474942, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(252.4120942665, 8);
    expect(lat).toBeCloseTo(-2.8702320716, 8);
    expect(radiusVector).toBeCloseTo(0.4662593806, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(252.4120751275, 8);
    expect(lat).toBeCloseTo(-2.8702318894, 8);
    expect(radiusVector).toBeCloseTo(0.4662593806, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(0.0278255018, 8);
    expect(y).toBeCloseTo(-1.412687287, 8);
    expect(z).toBeCloseTo(-0.0233435601, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(0.0278250342, 8);
    expect(y).toBeCloseTo(-1.4126872951, 8);
    expect(z).toBeCloseTo(-0.0233435557, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(271.1284009574, 8);
    expect(lat).toBeCloseTo(-0.9464985403, 8);
    expect(radiusVector).toBeCloseTo(1.4131541144, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(271.128381995, 8);
    expect(lat).toBeCloseTo(-0.946498361, 8);
    expect(radiusVector).toBeCloseTo(1.4131541133, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(271.2387149677, 8);
    expect(declination).toBeCloseTo(-24.3793371427, 8);
    expect(radiusVector).toBeCloseTo(1.4131541144, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(271.2386941508, 8);
    expect(declination).toBeCloseTo(-24.3793371265, 8);
    expect(radiusVector).toBeCloseTo(1.4131541133, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mercury.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(0.0274156578, 8);
    expect(y).toBeCloseTo(-1.4126338707, 8);
    expect(z).toBeCloseTo(-0.0233225776, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(271.1118268854, 8);
    expect(lat).toBeCloseTo(-0.9456890295, 8);
    expect(radiusVector).toBeCloseTo(1.4130923585, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(271.2205139551, 8);
    expect(declination).toBeCloseTo(-24.3786691281, 8);
    expect(radiusVector).toBeCloseTo(1.4130923585, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mercury.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(271.22095032, 6);
    expect(declination).toBeCloseTo(-24.37950986, 6);
    expect(radiusVector).toBeCloseTo(1.41312819, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.3885738, 6);
    expect(altitude).toBeCloseTo(-57.23468783, 6);
    expect(radiusVector).toBeCloseTo(1.41312819, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.3885738, 6);
    expect(altitude).toBeCloseTo(-57.23468783, 6);
    expect(radiusVector).toBeCloseTo(1.41312819, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mercury.getDistanceToEarth();

    expect(d).toBeCloseTo(211404846.31906354, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mercury.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(211395607.92656314, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mercury.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(211400968.47589397, 6);
});

it('tests getLightTime', () => {
    const lt = mercury.getLightTime();

    expect(sec2string(lt)).toBe('0h 11m 45.17s');
});

it('tests getAngularDiameter', () => {
    const delta = mercury.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 04.761"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = mercury.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 04.761"');
});

it('tests getElongation', () => {
    const phi = mercury.getElongation();

    expect(phi).toBeCloseTo(8.79801043, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mercury.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(8.79771242, 6);
});

it('tests getPhaseAngle', () => {
    const i = mercury.getPhaseAngle();

    expect(i).toBeCloseTo(18.81871814, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mercury.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(18.81674098, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mercury.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.97327196, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mercury.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.97327753, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mercury.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(83.3906121, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mercury.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(83.38474024, 6);
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

    expect(V).toBeCloseTo(-0.72149625, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mercury.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-0.72159425, 6);
});

it('tests getTransit', () => {
    const toi = mercury.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 10, min: 32, sec: 39});
});

it('tests getGeometricRise', () => {
    const toi = mercury.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 6, min: 57, sec: 20});
});

it('tests getApparentRise', () => {
    const toi = mercury.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 6, min: 52, sec: 17});
});

it('tests getGeometricSet', () => {
    const toi = mercury.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 7, sec: 48});
});

it('tests getApparentSet', () => {
    const toi = mercury.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 12, sec: 51});
});
