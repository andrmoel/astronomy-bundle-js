import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Venus} from '../index.venus.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const venus = Venus.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(venus.name).toBe('venus');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.718629822, 8);
    expect(y).toBeCloseTo(-0.0225191041, 8);
    expect(z).toBeCloseTo(0.0411717305, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.7186298301, 8);
    expect(y).toBeCloseTo(-0.022518859, 8);
    expect(z).toBeCloseTo(0.0411717308, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(181.7948428351, 8);
    expect(lat).toBeCloseTo(3.2773993404, 8);
    expect(radiusVector).toBeCloseTo(0.7201604286, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(181.7948232886, 8);
    expect(lat).toBeCloseTo(3.27739936, 8);
    expect(radiusVector).toBeCloseTo(0.720160429, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.5500920898, 8);
    expect(y).toBeCloseTo(-0.9913001289, 8);
    expect(z).toBeCloseTo(0.041175666, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.5500924172, 8);
    expect(y).toBeCloseTo(-0.9912999389, 8);
    expect(z).toBeCloseTo(0.0411756693, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(240.9732375875, 8);
    expect(lat).toBeCloseTo(2.0800510927, 8);
    expect(radiusVector).toBeCloseTo(1.1344481893, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(240.9732184605, 8);
    expect(lat).toBeCloseTo(2.0800512691, 8);
    expect(radiusVector).toBeCloseTo(1.1344481821, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(239.2844670308, 8);
    expect(declination).toBeCloseTo(-18.3162024876, 8);
    expect(radiusVector).toBeCloseTo(1.1344481893, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(239.284447355, 8);
    expect(declination).toBeCloseTo(-18.316198429, 8);
    expect(radiusVector).toBeCloseTo(1.1344481821, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = venus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.5502406416, 8);
    expect(y).toBeCloseTo(-0.991086366, 8);
    expect(z).toBeCloseTo(0.0411750711, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(240.9614297858, 8);
    expect(lat).toBeCloseTo(2.080231543, 8);
    expect(radiusVector).toBeCloseTo(1.1343334342, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(239.2723356767, 8);
    expect(declination).toBeCloseTo(-18.313626483, 8);
    expect(radiusVector).toBeCloseTo(1.1343334342, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        venus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(239.27345661, 6);
    expect(declination).toBeCloseTo(-18.31499951, 6);
    expect(radiusVector).toBeCloseTo(1.13435849, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.95397162, 6);
    expect(altitude).toBeCloseTo(-36.02295826, 6);
    expect(radiusVector).toBeCloseTo(1.13435849, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.95397162, 6);
    expect(altitude).toBeCloseTo(-36.02295826, 6);
    expect(radiusVector).toBeCloseTo(1.13435849, 6);
});

it('tests getDistanceToEarth', () => {
    const d = venus.getDistanceToEarth();

    expect(d).toBeCloseTo(169711032.10735878, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = venus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(169693865.95633015, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = venus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(169697614.1208993, 6);
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

    expect(phi).toBeCloseTo(38.94456899, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = venus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(38.94319898, 6);
});

it('tests getPhaseAngle', () => {
    const i = venus.getPhaseAngle();

    expect(i).toBeCloseTo(59.12575654, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = venus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(59.12430818, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = venus.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.75657773, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = venus.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.75658858, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = venus.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(104.30959384, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = venus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(104.30792093, 6);
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

    expect(V).toBeCloseTo(-4.06814455, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = venus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-4.06834584, 6);
});

it('tests getTransit', () => {
    const toi = venus.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 8, min: 23, sec: 57});
});

it('tests getGeometricRise', () => {
    const toi = venus.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 4, min: 6, sec: 22});
});

it('tests getApparentRise', () => {
    const toi = venus.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 4, min: 2, sec: 2});
});

it('tests getGeometricSet', () => {
    const toi = venus.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 40, sec: 55});
});

it('tests getApparentSet', () => {
    const toi = venus.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 45, sec: 15});
});
