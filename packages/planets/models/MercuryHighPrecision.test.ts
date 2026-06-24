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

    expect(x).toBeCloseTo(-0.14072788730501432, 8);
    expect(y).toBeCloseTo(-0.4439010163820121, 8);
    expect(z).toBeCloseTo(-0.023345630598038087, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.14072803581152432, 8);
    expect(y).toBeCloseTo(-0.44390096932771683, 8);
    expect(z).toBeCloseTo(-0.023345629113111062, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(252.4100636689023, 8);
    expect(lat).toBeCloseTo(-2.8700048497394293, 8);
    expect(radiusVector).toBeCloseTo(0.4662590150102583, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(252.4100445016416, 8);
    expect(lat).toBeCloseTo(-2.87000466734164, 8);
    expect(radiusVector).toBeCloseTo(0.4662590149607224, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(0.027797111230672633, 8);
    expect(y).toBeCloseTo(-1.4126842635287713, 8);
    expect(z).toBeCloseTo(-0.0233416950066076, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(0.027796642973801605, 8);
    expect(y).toBeCloseTo(-1.4126842716796455, 8);
    expect(z).toBeCloseTo(-0.02334169055901825, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(271.1272523510654, 8);
    expect(lat).toBeCloseTo(-0.9464253298290725, 8);
    expect(radiusVector).toBeCloseTo(1.413150502437861, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(271.1272333603076, 8);
    expect(lat).toBeCloseTo(-0.9464251502390931, 8);
    expect(radiusVector).toBeCloseTo(1.413150501301902, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(271.2374534448313, 8);
    expect(declination).toBeCloseTo(-24.37927381038372, 8);
    expect(radiusVector).toBeCloseTo(1.413150502437861, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(271.23743259687313, 8);
    expect(declination).toBeCloseTo(-24.37927379392628, 8);
    expect(radiusVector).toBeCloseTo(1.413150501301902, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mercury.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(0.02738727659977397, 8);
    expect(y).toBeCloseTo(-1.4126308369519498, 8);
    expect(z).toBeCloseTo(-0.023320712947011213, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(271.11067857335473, 8);
    expect(lat).toBeCloseTo(-0.9456158315944231, 8);
    expect(radiusVector).toBeCloseTo(1.4130887445873581, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(271.21925277050553, 8);
    expect(declination).toBeCloseTo(-24.378605660624803, 8);
    expect(radiusVector).toBeCloseTo(1.4130887445873581, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mercury.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(271.2196891624987, 6);
    expect(declination).toBeCloseTo(-24.37944640323934, 6);
    expect(radiusVector).toBeCloseTo(1.4131245774268764, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.39045296958801, 6);
    expect(altitude).toBeCloseTo(-57.233213404310874, 6);
    expect(radiusVector).toBeCloseTo(1.4131245774268764, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.39045296958801, 6);
    expect(altitude).toBeCloseTo(-57.233213404310874, 6);
    expect(radiusVector).toBeCloseTo(1.4131245774268764, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mercury.getDistanceToEarth();

    expect(d).toBeCloseTo(211404305.97340208, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mercury.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(211395067.3004049, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mercury.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(211400427.81689796, 6);
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

    expect(phi).toBeCloseTo(8.798395015102251, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mercury.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(8.79809697108433, 6);
});

it('tests getPhaseAngle', () => {
    const i = mercury.getPhaseAngle();

    expect(i).toBeCloseTo(18.819580479876727, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mercury.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(18.81760319271452, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mercury.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.973269536260827, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mercury.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9732751022830634, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mercury.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(83.3918624409064, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mercury.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(83.38599080169584, 6);
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

    expect(V).toBeCloseTo(-0.7214781272515682, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mercury.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-0.721576138493624, 6);
});
