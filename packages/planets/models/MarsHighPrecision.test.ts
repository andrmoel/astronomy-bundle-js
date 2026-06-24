import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Mars} from '../index.mars.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mars = Mars.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(mars.name).toBe('mars');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.3903610917715943, 8);
    expect(y).toBeCloseTo(-0.021009111412799257, 8);
    expect(z).toBeCloseTo(-0.034618145673894256, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.39036108370167, 8);
    expect(y).toBeCloseTo(-0.021009560001360544, 8);
    expect(z).toBeCloseTo(-0.03461814597308324, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(359.1342955298515, 8);
    expect(lat).toBeCloseTo(-1.426131428910223, 8);
    expect(radiusVector).toBeCloseTo(1.3909506692491125, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(359.13427704303587, 8);
    expect(lat).toBeCloseTo(-1.426131442554353, 8);
    expect(radiusVector).toBeCloseTo(1.3909506679656711, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.5588860903072812, 8);
    expect(y).toBeCloseTo(-0.9897923585595585, 8);
    expect(z).toBeCloseTo(-0.034614210082463764, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.5588857624869958, 8);
    expect(y).toBeCloseTo(-0.9897928623532892, 8);
    expect(z).toBeCloseTo(-0.03461420741899043, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(327.5870801086171, 8);
    expect(lat).toBeCloseTo(-1.0738924890225576, 8);
    expect(radiusVector).toBeCloseTo(1.8468927687215757, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(327.58706145991033, 8);
    expect(lat).toBeCloseTo(-1.0738924103077234, 8);
    expect(radiusVector).toBeCloseTo(1.846892761966819, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(330.1563620049364, 8);
    expect(declination).toBeCloseTo(-13.318251379611558, 8);
    expect(radiusVector).toBeCloseTo(1.8468927687215757, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(330.1563439931506, 8);
    expect(declination).toBeCloseTo(-13.318257739616334, 8);
    expect(radiusVector).toBeCloseTo(1.846892761966819, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mars.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(1.5587435232615077, 8);
    expect(y).toBeCloseTo(-0.990166208969259, 8);
    expect(z).toBeCloseTo(-0.03461999049420882, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(327.57491677050183, 8);
    expect(lat).toBeCloseTo(-1.0740252182663343, 8);
    expect(radiusVector).toBeCloseTo(1.8469729387395128, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(330.14467916121833, 8);
    expect(declination).toBeCloseTo(-13.322572116838646, 8);
    expect(radiusVector).toBeCloseTo(1.8469729387395128, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mars.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(330.1441830176016, 6);
    expect(declination).toBeCloseTo(-13.32343984647706, 6);
    expect(radiusVector).toBeCloseTo(1.8470009637879634, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.39028843875997, 6);
    expect(altitude).toBeCloseTo(-41.08386832462348, 6);
    expect(radiusVector).toBeCloseTo(1.8470009637879634, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.39028843875997, 6);
    expect(altitude).toBeCloseTo(-41.08386832462348, 6);
    expect(radiusVector).toBeCloseTo(1.8470009637879634, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mars.getDistanceToEarth();

    expect(d).toBeCloseTo(276291224.60147804, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mars.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(276303218.87595266, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mars.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(276307411.3635271, 6);
});

it('tests getLightTime', () => {
    const lt = mars.getLightTime();

    expect(sec2string(lt)).toBe('0h 15m 21.61s');
});

it('tests getAngularDiameter', () => {
    const delta = mars.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 05.071"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = mars.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 05.071"');
});

it('tests getElongation', () => {
    const phi = mars.getElongation();

    expect(phi).toBeCloseTo(47.72559276999066, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mars.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(47.72485139674647, 6);
});

it('tests getPhaseAngle', () => {
    const i = mars.getPhaseAngle();

    expect(i).toBeCloseTo(31.53937455279174, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mars.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(31.53867309332618, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mars.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9261404469439822, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mars.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9261436489148724, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mars.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.79358407987058, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mars.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.79429899005274, 6);
});

it('tests isWaxing', () => {
    const isWaxing = mars.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = mars.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = mars.getApparentMagnitude();

    expect(V).toBeCloseTo(1.0333970262544598, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mars.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(1.0335130167790918, 6);
});
