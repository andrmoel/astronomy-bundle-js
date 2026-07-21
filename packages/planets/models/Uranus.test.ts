import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Uranus from './Uranus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const uranus = Uranus.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(uranus.name).toBe('uranus');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = uranus.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(14.4301077719, 8);
    expect(y).toBeCloseTo(-13.7363495172, 8);
    expect(z).toBeCloseTo(-0.2258647222, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.4301032299, 8);
    expect(y).toBeCloseTo(-13.7363543129, 8);
    expect(z).toBeCloseTo(-0.2258646908, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(316.4109472223, 8);
    expect(lat).toBeCloseTo(-0.6495364182, 8);
    expect(radiusVector).toBeCloseTo(19.9240137332, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(316.4109282263, 8);
    expect(lat).toBeCloseTo(-0.6495363275, 8);
    expect(radiusVector).toBeCloseTo(19.9240137496, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(14.5986443645, 8);
    expect(y).toBeCloseTo(-14.7051306186, 8);
    expect(z).toBeCloseTo(-0.2258614666, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.598639499, 8);
    expect(y).toBeCloseTo(-14.7051354706, 8);
    expect(z).toBeCloseTo(-0.2258614322, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(314.7917952137, 8);
    expect(lat).toBeCloseTo(-0.624505312, 8);
    expect(radiusVector).toBeCloseTo(20.7222657406, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(314.7917762138, 8);
    expect(lat).toBeCloseTo(-0.6245052165, 8);
    expect(radiusVector).toBeCloseTo(20.7222657556, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(317.4470782718, 8);
    expect(declination).toBeCloseTo(-16.9930907066, 8);
    expect(radiusVector).toBeCloseTo(20.7222657406, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(317.4470592485, 8);
    expect(declination).toBeCloseTo(-16.9930961823, 8);
    expect(radiusVector).toBeCloseTo(20.7222657556, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = uranus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(14.5961059205, 8);
    expect(y).toBeCloseTo(-14.7076517112, 8);
    expect(z).toBeCloseTo(-0.2258715119, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(314.781902636, 8);
    expect(lat).toBeCloseTo(-0.6245330536, 8);
    expect(radiusVector).toBeCloseTo(20.7222668902, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(317.4371970552, 8);
    expect(declination).toBeCloseTo(-16.9960155744, 8);
    expect(radiusVector).toBeCloseTo(20.7222668902, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        uranus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(317.43716642, 6);
    expect(declination).toBeCloseTo(-16.99608543, 6);
    expect(radiusVector).toBeCloseTo(20.72229944, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.87036924, 6);
    expect(altitude).toBeCloseTo(-49.75642191, 6);
    expect(radiusVector).toBeCloseTo(20.72229944, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.87036924, 6);
    expect(altitude).toBeCloseTo(-49.75642191, 6);
    expect(radiusVector).toBeCloseTo(20.72229944, 6);
});

it('tests getDistanceToEarth', () => {
    const d = uranus.getDistanceToEarth();

    expect(d).toBeCloseTo(3100006832.5713902, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = uranus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(3100007002.3044386, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = uranus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(3100011871.0545049, 6);
});

it('tests getLightTime', () => {
    const lt = uranus.getLightTime();

    expect(sec2string(lt)).toBe('2h 52m 20.51s');
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

    expect(phi).toBeCloseTo(34.92761039, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = uranus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(34.92756281, 6);
});

it('tests getPhaseAngle', () => {
    const i = uranus.getPhaseAngle();

    expect(i).toBeCloseTo(1.61923667, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = uranus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(1.61923214, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = uranus.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9998003349432343, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = uranus.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9998003360605947, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = uranus.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(253.85853088, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = uranus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(253.85862427, 6);
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

    expect(V).toBeCloseTo(5.89230883, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = uranus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(5.89231235, 6);
});

it('tests getTransit', () => {
    const toi = uranus.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 13, min: 34, sec: 8});
});

it('tests getGeometricRise', () => {
    const toi = uranus.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 8, sec: 45});
});

it('tests getApparentRise', () => {
    const toi = uranus.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 4, sec: 32});
});

it('tests getGeometricSet', () => {
    const toi = uranus.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 17, min: 59, sec: 33});
});

it('tests getApparentSet', () => {
    const toi = uranus.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 18, min: 3, sec: 46});
});
