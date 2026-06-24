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

    expect(x).toBeCloseTo(14.430105791613041, 8);
    expect(y).toBeCloseTo(-13.736351492874865, 8);
    expect(z).toBeCloseTo(-0.2258647039102368, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.430101242826902, 8);
    expect(y).toBeCloseTo(-13.736356295750388, 8);
    expect(z).toBeCloseTo(-0.22586467248499012, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(316.4109391802156, 8);
    expect(lat).toBeCloseTo(-0.649536368120995, 8);
    expect(radiusVector).toBeCloseTo(19.92401366084209, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(316.41092015601816, 8);
    expect(lat).toBeCloseTo(-0.6495362772093376, 8);
    expect(radiusVector).toBeCloseTo(19.92401367727679, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(14.598629651438154, 8);
    expect(y).toBeCloseTo(-14.705134817816178, 8);
    expect(z).toBeCloseTo(-0.22586144837119107, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.598624778684398, 8);
    expect(y).toBeCloseTo(-14.705139677011442, 8);
    expect(z).toBeCloseTo(-0.22586141393571674, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(314.79175816586695, 8);
    expect(lat).toBeCloseTo(-0.6245054842967145, 8);
    expect(radiusVector).toBeCloseTo(20.72225834951054, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(314.7917391377635, 8);
    expect(lat).toBeCloseTo(-0.6245053886255386, 8);
    expect(radiusVector).toBeCloseTo(20.722258364559092, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(317.44704128900025, 8);
    expect(declination).toBeCloseTo(-16.99310172918761, 8);
    expect(radiusVector).toBeCloseTo(20.72225834951054, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(317.4470222373741, 8);
    expect(declination).toBeCloseTo(-16.993107213038357, 8);
    expect(radiusVector).toBeCloseTo(20.722258364559092, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = uranus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(14.596091211216255, 8);
    expect(y).toBeCloseTo(-14.707655903702173, 8);
    expect(z).toBeCloseTo(-0.2258714938407163, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(314.7818656053375, 8);
    expect(lat).toBeCloseTo(-0.6245332264004316, 8);
    expect(radiusVector).toBeCloseTo(20.72225949937843, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(317.4371600882691, 8);
    expect(declination).toBeCloseTo(-16.99602659083006, 8);
    expect(radiusVector).toBeCloseTo(20.72225949937843, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        uranus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(317.437129438, 6);
    expect(declination).toBeCloseTo(-16.99609645444799, 6);
    expect(radiusVector).toBeCloseTo(20.72229204497382, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.8704128826139, 6);
    expect(altitude).toBeCloseTo(-49.75636991106345, 6);
    expect(radiusVector).toBeCloseTo(20.72229204497382, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.8704128826139, 6);
    expect(altitude).toBeCloseTo(-49.75636991106345, 6);
    expect(radiusVector).toBeCloseTo(20.72229204497382, 6);
});

it('tests getDistanceToEarth', () => {
    const d = uranus.getDistanceToEarth();

    expect(d).toBeCloseTo(3100005727.4333043, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = uranus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(3100005897.199861, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = uranus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(3100010765.951632, 6);
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

    expect(phi).toBeCloseTo(34.92832682070381, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = uranus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(34.92827924185908, 6);
});

it('tests getPhaseAngle', () => {
    const i = uranus.getPhaseAngle();

    expect(i).toBeCloseTo(1.6192656917736197, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = uranus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(1.6192611606197356, 6);
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

    expect(chi).toBeCloseTo(253.8585177003094, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = uranus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(253.85861108865754, 6);
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

    expect(V).toBeCloseTo(5.892308108203656, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = uranus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(5.892311628487938, 6);
});
