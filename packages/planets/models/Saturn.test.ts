import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Saturn from './Saturn';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const saturn = Saturn.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(saturn.name).toBe('saturn');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.4085282758, 8);
    expect(y).toBeCloseTo(6.5680485933, 8);
    expect(z).toBeCloseTo(-0.3691251653, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.4085304588, 8);
    expect(y).toBeCloseTo(6.5680464789, 8);
    expect(z).toBeCloseTo(-0.3691251894, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(45.704298266, 8);
    expect(lat).toBeCloseTo(-2.3034789963, 8);
    expect(radiusVector).toBeCloseTo(9.1839398068, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(45.7042792907, 8);
    expect(lat).toBeCloseTo(-2.303479144, 8);
    expect(radiusVector).toBeCloseTo(9.1839398188, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.5770648764, 8);
    expect(y).toBeCloseTo(5.599267492, 8);
    expect(z).toBeCloseTo(-0.3691219097, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.5770667358, 8);
    expect(y).toBeCloseTo(5.5992653213, 8);
    expect(z).toBeCloseTo(-0.3691219309, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(40.4088225487, 8);
    expect(lat).toBeCloseTo(-2.4469832906, 8);
    expect(radiusVector).toBeCloseTo(8.6455670617, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(40.4088035894, 8);
    expect(lat).toBeCloseTo(-2.446983428, 8);
    expect(radiusVector).toBeCloseTo(8.6455670714, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(38.77861677571883, 8);
    expect(declination).toBeCloseTo(12.617832698897203, 8);
    expect(radiusVector).toBeCloseTo(8.6455670617, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(38.778877734, 8);
    expect(declination).toBeCloseTo(12.6168239998, 8);
    expect(radiusVector).toBeCloseTo(8.6455670714, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = saturn.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(6.5773709612, 8);
    expect(y).toBeCloseTo(5.598963256, 8);
    expect(z).toBeCloseTo(-0.3691591801, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(40.4059697882, 8);
    expect(lat).toBeCloseTo(-2.4472199157, 8);
    expect(radiusVector).toBeCloseTo(8.6456044788, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(38.7761949491, 8);
    expect(declination).toBeCloseTo(12.6157204838, 8);
    expect(radiusVector).toBeCloseTo(8.6456044788, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        saturn.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(38.77602474, 6);
    expect(declination).toBeCloseTo(12.61551268, 6);
    expect(radiusVector).toBeCloseTo(8.64559038, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57556177, 6);
    expect(altitude).toBeCloseTo(19.33223933, 6);
    expect(radiusVector).toBeCloseTo(8.64559038, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57556177, 6);
    expect(altitude).toBeCloseTo(19.37957879, 6);
    expect(radiusVector).toBeCloseTo(8.64559038, 6);
});

it('tests getDistanceToEarth', () => {
    const d = saturn.getDistanceToEarth();

    expect(d).toBeCloseTo(1293358424.87245727, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = saturn.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(1293364020.94094753, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = saturn.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(1293361912.45981932, 6);
});

it('tests getLightTime', () => {
    const lt = saturn.getLightTime();

    expect(sec2string(lt)).toBe('1h 11m 54.18s');
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

    expect(phi).toBeCloseTo(120.51597548, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = saturn.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(120.51574948, 6);
});

it('tests getPhaseAngle', () => {
    const i = saturn.getPhaseAngle();

    expect(i).toBeCloseTo(5.29241922, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = saturn.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(5.29244148, 6);
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

    expect(chi).toBeCloseTo(250.47525174, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = saturn.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.47513185, 6);
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

    expect(V).toBeCloseTo(0.13506545, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = saturn.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(0.13507229, 6);
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
