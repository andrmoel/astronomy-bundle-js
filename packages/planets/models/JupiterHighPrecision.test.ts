import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Jupiter} from '../index.jupiter.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const jupiter = Jupiter.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(jupiter.name).toBe('jupiter');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = jupiter.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(4.0034535287, 8);
    expect(y).toBeCloseTo(2.9353632862, 8);
    expect(z).toBeCloseTo(-0.1018214063, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = jupiter.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(4.0034545441, 8);
    expect(y).toBeCloseTo(2.9353619605, 8);
    expect(z).toBeCloseTo(-0.1018214173, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(36.2491596019, 8);
    expect(lat).toBeCloseTo(-1.1750199827, 8);
    expect(radiusVector).toBeCloseTo(4.9653162414, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(36.2491403326, 8);
    expect(lat).toBeCloseTo(-1.1750201007, 8);
    expect(radiusVector).toBeCloseTo(4.9653162766, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = jupiter.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(4.1719912679, 8);
    expect(y).toBeCloseTo(1.9665822627, 8);
    expect(z).toBeCloseTo(-0.1018174708, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = jupiter.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(4.171991964, 8);
    expect(y).toBeCloseTo(1.9665808818, 8);
    expect(z).toBeCloseTo(-0.1018174788, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(25.2381289232, 8);
    expect(lat).toBeCloseTo(-1.2646212474, 8);
    expect(radiusVector).toBeCloseTo(4.613385279, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(25.2381097198, 8);
    expect(lat).toBeCloseTo(-1.2646213353, 8);
    expect(radiusVector).toBeCloseTo(4.6133853201, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(23.854440786208922, 8);
    expect(declination).toBeCloseTo(8.587208960722492, 8);
    expect(radiusVector).toBeCloseTo(4.613385279, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(23.854643826, 8);
    expect(declination).toBeCloseTo(8.5865544488, 8);
    expect(radiusVector).toBeCloseTo(4.6133853201, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = jupiter.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(4.1721937166, 8);
    expect(y).toBeCloseTo(1.9662385774, 8);
    expect(z).toBeCloseTo(-0.1018294092, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(25.2331947659, 8);
    expect(lat).toBeCloseTo(-1.2647594464, 8);
    expect(radiusVector).toBeCloseTo(4.6134221334, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(23.850065859, 8);
    expect(declination).toBeCloseTo(8.5846378443, 8);
    expect(radiusVector).toBeCloseTo(4.6134221334, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        jupiter.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(23.84973933, 6);
    expect(declination).toBeCloseTo(8.58422468, 6);
    expect(radiusVector).toBeCloseTo(4.61341689, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = jupiter.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(274.87240163, 6);
    expect(altitude).toBeCloseTo(7.09199069, 6);
    expect(radiusVector).toBeCloseTo(4.61341689, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = jupiter.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(274.87240163, 6);
    expect(altitude).toBeCloseTo(7.21393842, 6);
    expect(radiusVector).toBeCloseTo(4.61341689, 6);
});

it('tests getDistanceToEarth', () => {
    const d = jupiter.getDistanceToEarth();

    expect(d).toBeCloseTo(690152620.60767269, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = jupiter.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(690158127.79850662, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = jupiter.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(690157343.72311032, 6);
});

it('tests getLightTime', () => {
    const lt = jupiter.getLightTime();

    expect(sec2string(lt)).toBe('0h 38m 22.1s');
});

it('tests getAngularDiameter', () => {
    const delta = jupiter.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 42.733"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = jupiter.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 42.733"');
});

it('tests getElongation', () => {
    const phi = jupiter.getElongation();

    expect(phi).toBeCloseTo(105.37012503, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = jupiter.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(105.36967234, 6);
});

it('tests getPhaseAngle', () => {
    const i = jupiter.getPhaseAngle();

    expect(i).toBeCloseTo(11.00839305, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = jupiter.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(11.00844443, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = jupiter.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9907996750661616, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = jupiter.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9907995894479522, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = jupiter.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(248.31416047, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = jupiter.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(248.31403899, 6);
});

it('tests isWaxing', () => {
    const isWaxing = jupiter.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = jupiter.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = jupiter.getApparentMagnitude();

    expect(V).toBeCloseTo(-2.51656506, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = jupiter.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-2.51654949, 6);
});

it('tests getTransit', () => {
    const toi = jupiter.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 17, min: 59, sec: 3});
});

it('tests getGeometricRise', () => {
    const toi = jupiter.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 11, min: 14, sec: 40});
});

it('tests getApparentRise', () => {
    const toi = jupiter.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 11, min: 10, sec: 49});
});

it('tests getGeometricSet', () => {
    const toi = jupiter.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 0, min: 47, sec: 12});
});

it('tests getApparentSet', () => {
    const toi = jupiter.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 0, min: 51, sec: 2});
});
