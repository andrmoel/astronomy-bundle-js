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

    expect(x).toBeCloseTo(-0.7186302018270743, 8);
    expect(y).toBeCloseTo(-0.02250410029247524, 8);
    expect(z).toBeCloseTo(0.04117195757947235, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.7186302099430709, 8);
    expect(y).toBeCloseTo(-0.022503854789468314, 8);
    expect(z).toBeCloseTo(0.0411719578519518, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(181.79364676652102, 8);
    expect(lat).toBeCloseTo(3.2774177801090896, 8);
    expect(radiusVector).toBeCloseTo(0.720160351309985, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(181.79362719170592, 8);
    expect(lat).toBeCloseTo(3.2774177998060323, 8);
    expect(radiusVector).toBeCloseTo(0.7201603517526985, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.5501052032913873, 8);
    expect(y).toBeCloseTo(-0.9912873474392345, 8);
    expect(z).toBeCloseTo(0.04117589317090284, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.550105531157745, 8);
    expect(y).toBeCloseTo(-0.991287157141397, 8);
    expect(z).toBeCloseTo(0.04117589640604462, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(240.97234462338446, 8);
    expect(lat).toBeCloseTo(2.080071373036279, 8);
    expect(radiusVector).toBeCloseTo(1.1344433851276112, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(240.9723254681096, 8);
    expect(lat).toBeCloseTo(2.080071549708076, 8);
    expect(radiusVector).toBeCloseTo(1.1344433779473786, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(239.2835510047812, 8);
    expect(declination).toBeCloseTo(-18.31600121463605, 8);
    expect(radiusVector).toBeCloseTo(1.1344433851276112, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(239.28353129950364, 8);
    expect(declination).toBeCloseTo(-18.31599714992532, 8);
    expect(radiusVector).toBeCloseTo(1.1344433779473786, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = venus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.5502537506045755, 8);
    expect(y).toBeCloseTo(-0.9910735884398656, 8);
    expect(z).toBeCloseTo(0.041175297964759154, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(240.96053701345426, 8);
    expect(lat).toBeCloseTo(2.080251803482277, 8);
    expect(radiusVector).toBeCloseTo(1.1343286353257425, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(239.27141987329873, 8);
    expect(declination).toBeCloseTo(-18.313425204789144, 8);
    expect(radiusVector).toBeCloseTo(1.1343286353257425, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        venus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(239.27254034349562, 6);
    expect(declination).toBeCloseTo(-18.314798142923696, 6);
    expect(radiusVector).toBeCloseTo(1.1343536898433138, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.95468078203012, 6);
    expect(altitude).toBeCloseTo(-36.02053170698376, 6);
    expect(radiusVector).toBeCloseTo(1.1343536898433138, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.95468078203012, 6);
    expect(altitude).toBeCloseTo(-36.02053170698376, 6);
    expect(radiusVector).toBeCloseTo(1.1343536898433138, 6);
});

it('tests getDistanceToEarth', () => {
    const d = venus.getDistanceToEarth();

    expect(d).toBeCloseTo(169710313.77064317, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = venus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(169693148.51876786, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = venus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(169696896.62124795, 6);
});

it('tests getLightTime', () => {
    const lt = venus.getLightTime();

    expect(sec2string(lt)).toBe('0h 9m 26.09s');
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

    expect(phi).toBeCloseTo(38.94470930253523, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = venus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(38.943339261006784, 6);
});

it('tests getPhaseAngle', () => {
    const i = venus.getPhaseAngle();

    expect(i).toBeCloseTo(59.12605790952435, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = venus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(59.12460958736703, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = venus.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.7565754771010327, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = venus.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.7565863250480296, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = venus.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(104.3099264006543, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = venus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(104.30825349901292, 6);
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

    expect(V).toBeCloseTo(-4.068147824172863, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = venus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-4.068349099296549, 6);
});
