import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Venus from './Venus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const venus = Venus.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(venus.name).toBe('venus');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.7186164739515919, 8);
    expect(y).toBeCloseTo(-0.02250360127957238, 8);
    expect(z).toBeCloseTo(0.04140799570576854, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.7186164816912622, 8);
    expect(y).toBeCloseTo(-0.022503362548552692, 8);
    expect(z).toBeCloseTo(0.04140799599153624, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(181.793641260876, 8);
    expect(lat).toBeCloseTo(3.2962286868421087, 8);
    expect(radiusVector).toBeCloseTo(0.7201601702493258, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(181.79362222603174, 8);
    expect(lat).toBeCloseTo(3.2962287083339046, 8);
    expect(radiusVector).toBeCloseTo(0.7201601705289976, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.550092614126479, 8);
    expect(y).toBeCloseTo(-0.9912869262208849, 8);
    expect(z).toBeCloseTo(0.04141125124481427, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = venus.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.5500929458337671, 8);
    expect(y).toBeCloseTo(-0.9912867438096055, 8);
    expect(z).toBeCloseTo(0.04141125454080961, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(240.97289061860587, 8);
    expect(lat).toBeCloseTo(2.0919622999899965, 8);
    expect(radiusVector).toBeCloseTo(1.1344454794932255, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(240.97287148689122, 8);
    expect(lat).toBeCloseTo(2.0919624636652445, 8);
    expect(radiusVector).toBeCloseTo(1.1344454810661313, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(239.28665999472082, 8);
    expect(declination).toBeCloseTo(-18.304469517613896, 8);
    expect(radiusVector).toBeCloseTo(1.1344454794932255, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(239.28664031232913, 8);
    expect(declination).toBeCloseTo(-18.304465470769376, 8);
    expect(radiusVector).toBeCloseTo(1.1344454810661313, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = venus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.5502411660580616, 8);
    expect(y).toBeCloseTo(-0.9910731798340454, 8);
    expect(z).toBeCloseTo(0.04141064098244532, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = venus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(240.96108310184755, 8);
    expect(lat).toBeCloseTo(2.0921431526396375, 8);
    expect(radiusVector).toBeCloseTo(1.1343307409207768, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = venus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(239.27452990235437, 8);
    expect(declination).toBeCloseTo(-18.301893331790428, 8);
    expect(radiusVector).toBeCloseTo(1.1343307409207768, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        venus.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(239.27565025183492, 6);
    expect(declination).toBeCloseTo(-18.3032665039248, 6);
    expect(radiusVector).toBeCloseTo(1.134355791052357, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.94309822683418, 6);
    expect(altitude).toBeCloseTo(-36.01318775844667, 6);
    expect(radiusVector).toBeCloseTo(1.134355791052357, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = venus.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(71.94309822683418, 6);
    expect(altitude).toBeCloseTo(-36.01318775844667, 6);
    expect(radiusVector).toBeCloseTo(1.134355791052357, 6);
});

it('tests getDistanceToEarth', () => {
    const d = venus.getDistanceToEarth();

    expect(d).toBeCloseTo(169710628.39273039, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = venus.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(169693463.51130155, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = venus.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(169697210.9576467, 6);
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

    expect(phi).toBeCloseTo(38.94463604433437, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = venus.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(38.94326572986695, 6);
});

it('tests getPhaseAngle', () => {
    const i = venus.getPhaseAngle();

    expect(i).toBeCloseTo(59.12591886028489, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = venus.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(59.12447088516766, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = venus.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.7565765185882986, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = venus.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.756587363920245, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = venus.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(104.32374763011843, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = venus.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(104.32207509206289, 6);
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

    expect(V).toBeCloseTo(-4.068147186179235, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = venus.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-4.068348457526326, 6);
});
