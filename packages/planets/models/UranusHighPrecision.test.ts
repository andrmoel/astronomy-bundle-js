import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Uranus} from '../index.uranus.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const uranus = Uranus.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(uranus.name).toBe('uranus');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = uranus.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(14.4305558514, 8);
    expect(y).toBeCloseTo(-13.7356503613, 8);
    expect(z).toBeCloseTo(-0.2381298778, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.4305522423, 8);
    expect(y).toBeCloseTo(-13.7356546944, 8);
    expect(z).toBeCloseTo(-0.2381297636, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(316.4132920869, 8);
    expect(lat).toBeCloseTo(-0.6848104027, 8);
    expect(radiusVector).toBeCloseTo(19.9239990682, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(316.4132759044, 8);
    expect(lat).toBeCloseTo(-0.6848100617, 8);
    expect(radiusVector).toBeCloseTo(19.92399944, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(14.5990935828, 8);
    expect(y).toBeCloseTo(-14.7044313848, 8);
    expect(z).toBeCloseTo(-0.2381259422, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.5990896544, 8);
    expect(y).toBeCloseTo(-14.7044357731, 8);
    expect(z).toBeCloseTo(-0.2381258251, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(314.7940389212, 8);
    expect(lat).toBeCloseTo(-0.6584192995, 8);
    expect(radiusVector).toBeCloseTo(20.722223336, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(314.7940226635, 8);
    expect(lat).toBeCloseTo(-0.6584189648, 8);
    expect(radiusVector).toBeCloseTo(20.7222236809, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(317.4597146585, 8);
    expect(declination).toBeCloseTo(-17.0248582586, 8);
    expect(radiusVector).toBeCloseTo(20.722223336, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(317.4596983009, 8);
    expect(declination).toBeCloseTo(-17.0248627032, 8);
    expect(radiusVector).toBeCloseTo(20.7222236809, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = uranus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(14.5965562268, 8);
    expect(y).toBeCloseTo(-14.7069520433, 8);
    expect(z).toBeCloseTo(-0.2381366023, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(314.7841492389, 8);
    expect(lat).toBeCloseTo(-0.658448729, 8);
    expect(radiusVector).toBeCloseTo(20.7222248168, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(317.449835439, 8);
    expect(declination).toBeCloseTo(-17.0277844783, 8);
    expect(radiusVector).toBeCloseTo(20.7222248168, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        uranus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(317.44980479, 6);
    expect(declination).toBeCloseTo(-17.02785429, 6);
    expect(radiusVector).toBeCloseTo(20.72225737, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.83419306, 6);
    expect(altitude).toBeCloseTo(-49.78110756, 6);
    expect(radiusVector).toBeCloseTo(20.72225737, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.83419306, 6);
    expect(altitude).toBeCloseTo(-49.78110756, 6);
    expect(radiusVector).toBeCloseTo(20.72225737, 6);
});

it('tests getDistanceToEarth', () => {
    const d = uranus.getDistanceToEarth();

    expect(d).toBeCloseTo(3100000538.2825375, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = uranus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(3100000708.2140875, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = uranus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(3100005578.7247348, 6);
});

it('tests getLightTime', () => {
    const lt = uranus.getLightTime();

    expect(sec2string(lt)).toBe('2h 52m 20.49s');
});

it('tests getAngularDiameter', () => {
    const delta = uranus.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 03.401"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = uranus.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 03.401"');
});

it('tests getElongation', () => {
    const phi = uranus.getElongation();

    expect(phi).toBeCloseTo(34.93033493, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = uranus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(34.93028739, 6);
});

it('tests getPhaseAngle', () => {
    const i = uranus.getPhaseAngle();

    expect(i).toBeCloseTo(1.61934832, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = uranus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(1.61934379, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = uranus.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.999800307411193, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = uranus.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.99980030852845, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = uranus.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(253.90341151, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = uranus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(253.90350489, 6);
});

it('tests isWaxing', () => {
    const isWaxing = uranus.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = uranus.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = uranus.getApparentMagnitude();

    expect(V).toBeCloseTo(5.89230309, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = uranus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(5.89230661, 6);
});

it('tests getTransit', () => {
    const toi = uranus.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 13, min: 34, sec: 11});
});

it('tests getGeometricRise', () => {
    const toi = uranus.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 9, sec: 0});
});

it('tests getApparentRise', () => {
    const toi = uranus.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 4, sec: 47});
});

it('tests getGeometricSet', () => {
    const toi = uranus.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 17, min: 59, sec: 24});
});

it('tests getApparentSet', () => {
    const toi = uranus.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 18, min: 3, sec: 37});
});
