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

    expect(x).toBeCloseTo(4.003456902363304, 8);
    expect(y).toBeCloseTo(2.9353585202775956, 8);
    expect(z).toBeCloseTo(-0.1018214621269272, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = jupiter.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(4.0034579192208595, 8);
    expect(y).toBeCloseTo(2.935357192574014, 8);
    expect(z).toBeCloseTo(-0.10182147308852867, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(36.24909221743406, 8);
    expect(lat).toBeCloseTo(-1.1750206492821342, 8);
    expect(radiusVector).toBeCloseTo(4.965316145201263, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(36.24907291987289, 8);
    expect(lat).toBeCloseTo(-1.1750207674658666, 8);
    expect(radiusVector).toBeCloseTo(4.965316180400814, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = jupiter.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(4.171981900898991, 8);
    expect(y).toBeCloseTo(1.9665752731308364, 8);
    expect(z).toBeCloseTo(-0.10181752653549672, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = jupiter.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(4.171982598006186, 8);
    expect(y).toBeCloseTo(1.9665738902220853, 8);
    expect(z).toBeCloseTo(-0.10181753453443586, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(25.238099998202056, 8);
    expect(lat).toBeCloseTo(-1.2646250789391755, 8);
    expect(radiusVector).toBeCloseTo(4.613373829967411, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(25.238080766465735, 8);
    expect(lat).toBeCloseTo(-1.2646251670420847, 8);
    expect(radiusVector).toBeCloseTo(4.613373871052328, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(23.854636047490978, 8);
    expect(declination).toBeCloseTo(8.586547426968087, 8);
    expect(radiusVector).toBeCloseTo(4.613373829967411, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(23.854617967809173, 8);
    expect(declination).toBeCloseTo(8.586540348910297, 8);
    expect(radiusVector).toBeCloseTo(4.613373871052328, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = jupiter.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(4.172184346201586, 8);
    expect(y).toBeCloseTo(1.9662315933211585, 8);
    expect(z).toBeCloseTo(-0.10182946486052069, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(25.2331659081847, 8);
    expect(lat).toBeCloseTo(-1.2647632778830022, 8);
    expect(radiusVector).toBeCloseTo(4.613410683775898, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(23.85004009101485, 8);
    expect(declination).toBeCloseTo(8.58462377911319, 8);
    expect(radiusVector).toBeCloseTo(4.613410683775898, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        jupiter.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(23.849713565906995, 6);
    expect(declination).toBeCloseTo(8.58421061317837, 6);
    expect(radiusVector).toBeCloseTo(4.613405442575329, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = jupiter.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(274.87241149993577, 6);
    expect(altitude).toBeCloseTo(7.092488309099274, 6);
    expect(radiusVector).toBeCloseTo(4.613405442575329, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = jupiter.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(274.87241149993577, 6);
    expect(altitude).toBeCloseTo(7.214428829196881, 6);
    expect(radiusVector).toBeCloseTo(4.613405442575329, 6);
});

it('tests getDistanceToEarth', () => {
    const d = jupiter.getDistanceToEarth();

    expect(d).toBeCloseTo(690150907.8524446, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = jupiter.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(690156414.9575053, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = jupiter.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(690155630.8850602, 6);
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

    expect(phi).toBeCloseTo(105.37084956694571, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = jupiter.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(105.37039687888748, 6);
});

it('tests getPhaseAngle', () => {
    const i = jupiter.getPhaseAngle();

    expect(i).toBeCloseTo(11.008354603921077, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = jupiter.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(11.008405983821946, 6);
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

    expect(chi).toBeCloseTo(248.31413772347938, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = jupiter.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(248.31401624222121, 6);
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

    expect(V).toBeCloseTo(-2.5165710271190873, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = jupiter.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-2.5165554520358464, 6);
});
