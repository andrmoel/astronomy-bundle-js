import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Mars from './Mars';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mars = Mars.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(mars.name).toBe('mars');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.3903624387191449, 8);
    expect(y).toBeCloseTo(-0.021009283105732936, 8);
    expect(z).toBeCloseTo(-0.034617937923554686, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.3903624319591363, 8);
    expect(y).toBeCloseTo(-0.02100974749903834, 8);
    expect(z).toBeCloseTo(-0.03461793812375174, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(359.134289294676, 8);
    expect(lat).toBeCloseTo(-1.4261214905829565, 8);
    expect(radiusVector).toBeCloseTo(1.3909520130485251, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(359.134270157541, 8);
    expect(lat).toBeCloseTo(-1.4261214985630692, 8);
    expect(radiusVector).toBeCloseTo(1.3909520133107531, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.5588862985442578, 8);
    expect(y).toBeCloseTo(-0.9897926080470454, 8);
    expect(z).toBeCloseTo(-0.03461468238450895, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.5588859678166314, 8);
    expect(y).toBeCloseTo(-0.9897931287600912, 8);
    expect(z).toBeCloseTo(-0.03461467957447837, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(327.5870770368054, 8);
    expect(lat).toBeCloseTo(-1.0739069586115895, 8);
    expect(radiusVector).toBeCloseTo(1.8468930870437976, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(327.5870578965589, 8);
    expect(lat).toBeCloseTo(-1.0739068715050115, 8);
    expect(radiusVector).toBeCloseTo(1.8468930868998155, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(330.15636417357854, 8);
    expect(declination).toBeCloseTo(-13.318266020249485, 8);
    expect(radiusVector).toBeCloseTo(1.8468930870437976, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(330.1563456848, 8);
    expect(declination).toBeCloseTo(-13.318272541961395, 8);
    expect(radiusVector).toBeCloseTo(1.8468930868998155, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mars.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(1.5587437307234153, 8);
    expect(y).toBeCloseTo(-0.9901664777955423, 8);
    expect(z).toBeCloseTo(-0.03462046289254219, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(327.5749131814925, 8);
    expect(lat).toBeCloseTo(-1.0740396845295113, 8);
    expect(radiusVector).toBeCloseTo(1.8469732667990826, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(330.14468082929704, 8);
    expect(declination).toBeCloseTo(-13.322586932860183, 8);
    expect(radiusVector).toBeCloseTo(1.8469732667990826, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mars.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(330.14418468571876, 6);
    expect(declination).toBeCloseTo(-13.323454662122899, 6);
    expect(radiusVector).toBeCloseTo(1.8470012918543257, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.3902770539113, 6);
    expect(altitude).toBeCloseTo(-41.083880511104894, 6);
    expect(radiusVector).toBeCloseTo(1.8470012918543257, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.3902770539113, 6);
    expect(altitude).toBeCloseTo(-41.083880511104894, 6);
    expect(radiusVector).toBeCloseTo(1.8470012918543257, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mars.getDistanceToEarth();

    expect(d).toBeCloseTo(276291273.21076244, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mars.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(276303267.95296574, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mars.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(276307460.44155633, 6);
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

    expect(phi).toBeCloseTo(47.72565480124185, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mars.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(47.72491342768881, 6);
});

it('tests getPhaseAngle', () => {
    const i = mars.getPhaseAngle();

    expect(i).toBeCloseTo(31.5393708714885, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mars.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(31.53866941311483, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mars.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9261404637482928, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mars.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9261436657138638, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mars.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.79354109645448, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mars.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.7942560046381, 6);
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

    expect(V).toBeCloseTo(1.0333994496660455, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mars.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(1.0335154438695855, 6);
});
