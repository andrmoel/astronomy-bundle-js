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

    expect(x).toBeCloseTo(6.40853144820667, 8);
    expect(y).toBeCloseTo(6.568045716292366, 8);
    expect(z).toBeCloseTo(-0.36912524139068303, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.408533634424003, 8);
    expect(y).toBeCloseTo(6.568043598694549, 8);
    expect(z).toBeCloseTo(-0.3691252655688873, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(45.70427154389688, 8);
    expect(lat).toBeCloseTo(-2.3034794314003784, 8);
    expect(radiusVector).toBeCloseTo(9.183939965929225, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(45.70425254031011, 8);
    expect(lat).toBeCloseTo(-2.3034795793326053, 8);
    expect(radiusVector).toBeCloseTo(9.183939978003856, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.577055308031783, 8);
    expect(y).toBeCloseTo(5.599262391351054, 8);
    expect(z).toBeCloseTo(-0.3691219858516373, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.577057170281498, 8);
    expect(y).toBeCloseTo(5.599260217433496, 8);
    expect(z).toBeCloseTo(-0.36912200701961395, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(40.408837929519514, 8);
    expect(lat).toBeCloseTo(-2.446986791497263, 8);
    expect(radiusVector).toBeCloseTo(8.645556482525949, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(40.40881894196927, 8);
    expect(lat).toBeCloseTo(-2.44698692917099, 8);
    expect(radiusVector).toBeCloseTo(8.645556492195912, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(38.77891222464767, 8);
    expect(declination).toBeCloseTo(12.616831452997937, 8);
    expect(radiusVector).toBeCloseTo(8.645556482525949, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(38.77889378871283, 8);
    expect(declination).toBeCloseTo(12.61682543456533, 8);
    expect(radiusVector).toBeCloseTo(8.645556492195912, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = saturn.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(6.577361387521755, 8);
    expect(y).toBeCloseTo(5.598958161193493, 8);
    expect(z).toBeCloseTo(-0.36915925593568577, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(40.40598521818855, 8);
    expect(lat).toBeCloseTo(-2.4472234153742716, 8);
    expect(radiusVector).toBeCloseTo(8.645593899154662, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(38.77621107859644, 8);
    expect(declination).toBeCloseTo(12.615721944100507, 8);
    expect(radiusVector).toBeCloseTo(8.645593899154662, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        saturn.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(38.77604086595046, 6);
    expect(declination).toBeCloseTo(12.615514141872872, 6);
    expect(radiusVector).toBeCloseTo(8.64557980482118, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57554869599613, 6);
    expect(altitude).toBeCloseTo(19.33251628445321, 6);
    expect(radiusVector).toBeCloseTo(8.64557980482118, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57554869599613, 6);
    expect(altitude).toBeCloseTo(19.379855040220633, 6);
    expect(radiusVector).toBeCloseTo(8.64557980482118, 6);
});

it('tests getDistanceToEarth', () => {
    const d = saturn.getDistanceToEarth();

    expect(d).toBeCloseTo(1293356842.2490695, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = saturn.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(1293362438.2504478, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = saturn.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(1293360329.76817, 6);
});

it('tests getLightTime', () => {
    const lt = saturn.getLightTime();

    expect(sec2string(lt)).toBe('1h 11m 54.17s');
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

    expect(phi).toBeCloseTo(120.51674348764534, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = saturn.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(120.51651748513522, 6);
});

it('tests getPhaseAngle', () => {
    const i = saturn.getPhaseAngle();

    expect(i).toBeCloseTo(5.292377228956161, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = saturn.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(5.292399497243733, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = saturn.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.99786848929088, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = saturn.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9978684713664434, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = saturn.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.47520961520837, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = saturn.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.47508971856686, 6);
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

    expect(V).toBeCloseTo(0.1350609423969089, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = saturn.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(0.1350677775394299, 6);
});
