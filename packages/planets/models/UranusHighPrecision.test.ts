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

    expect(x).toBeCloseTo(14.430553871368845, 8);
    expect(y).toBeCloseTo(-13.735652336982506, 8);
    expect(z).toBeCloseTo(-0.23812985943991055, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.430550255485928, 8);
    expect(y).toBeCloseTo(-13.73565667720361, 8);
    expect(z).toBeCloseTo(-0.23812974527010336, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(316.41328404522187, 8);
    expect(lat).toBeCloseTo(-0.684810352505467, 8);
    expect(radiusVector).toBeCloseTo(19.923998995856437, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(316.413267834407, 8);
    expect(lat).toBeCloseTo(-0.6848100113793235, 8);
    expect(radiusVector).toBeCloseTo(19.92399936773979, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(14.599078869904533, 8);
    expect(y).toBeCloseTo(-14.704435584129264, 8);
    expect(z).toBeCloseTo(-0.23812592384848005, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = uranus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(14.599074934271254, 8);
    expect(y).toBeCloseTo(-14.704439979555538, 8);
    expect(z).toBeCloseTo(-0.23812580671601055, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(314.7940018741568, 8);
    expect(lat).toBeCloseTo(-0.6584194836311452, 8);
    expect(radiusVector).toBeCloseTo(20.72221594456318, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(314.7939855882721, 8);
    expect(lat).toBeCloseTo(-0.6584191487847408, 8);
    expect(radiusVector).toBeCloseTo(20.72221628949574, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(317.45967767476515, 8);
    expect(declination).toBeCloseTo(-17.024869294453723, 8);
    expect(radiusVector).toBeCloseTo(20.72221594456318, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(317.4596612888673, 8);
    expect(declination).toBeCloseTo(-17.024873747117287, 8);
    expect(radiusVector).toBeCloseTo(20.72221628949574, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = uranus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(14.596541517734432, 8);
    expect(y).toBeCloseTo(-14.70695623587461, 8);
    expect(z).toBeCloseTo(-0.23813658416452357, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = uranus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(314.784112208734, 8);
    expect(lat).toBeCloseTo(-0.6584489136976424, 8);
    expect(radiusVector).toBeCloseTo(20.722217425642302, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = uranus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(317.44979847142554, 8);
    expect(declination).toBeCloseTo(-17.027795507942773, 8);
    expect(radiusVector).toBeCloseTo(20.722217425642302, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        uranus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(317.4497678007532, 6);
    expect(declination).toBeCloseTo(-17.02786532369055, 6);
    expect(radiusVector).toBeCloseTo(20.72224998300646, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.8342366961016, 6);
    expect(altitude).toBeCloseTo(-49.781055616624975, 6);
    expect(radiusVector).toBeCloseTo(20.72224998300646, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = uranus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(322.8342366961016, 6);
    expect(altitude).toBeCloseTo(-49.781055616624975, 6);
    expect(radiusVector).toBeCloseTo(20.72224998300646, 6);
});

it('tests getDistanceToEarth', () => {
    const d = uranus.getDistanceToEarth();

    expect(d).toBeCloseTo(3099999433.093417, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = uranus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(3099999603.0585237, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = uranus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(3100004473.5708776, 6);
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

    expect(phi).toBeCloseTo(34.93105134524443, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = uranus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(34.93100381190323, 6);
});

it('tests getPhaseAngle', () => {
    const i = uranus.getPhaseAngle();

    expect(i).toBeCloseTo(1.619377336549272, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = uranus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(1.619372806126538, 6);
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

    expect(chi).toBeCloseTo(253.90339705352363, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = uranus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(253.90349043725587, 6);
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

    expect(V).toBeCloseTo(5.892302362905254, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = uranus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(5.8923058845704865, 6);
});
