import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Mercury from './Mercury';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mercury = Mercury.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(mercury.name).toBe('mercury');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.1408041484162177, 8);
    expect(y).toBeCloseTo(-0.4441403024757144, 8);
    expect(z).toBeCloseTo(-0.017650162278041264, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.14080429665210858, 8);
    expect(y).toBeCloseTo(-0.44414025553454417, 8);
    expect(z).toBeCloseTo(-0.01765016115767341, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(252.41001662207827, 8);
    expect(lat).toBeCloseTo(-2.16943876256543, 8);
    expect(radiusVector).toBeCloseTo(0.46625952507469115, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(252.40999750107576, 8);
    expect(lat).toBeCloseTo(-2.1694386247515935, 8);
    expect(radiusVector).toBeCloseTo(0.46625952508327057, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(0.027719711408895203, 8);
    expect(y).toBeCloseTo(-1.412923627417027, 8);
    expect(z).toBeCloseTo(-0.017646906738995535, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mercury.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(0.027719239205386492, 8);
    expect(y).toBeCloseTo(-1.4129236367955968, 8);
    expect(z).toBeCloseTo(-0.017646902608400038, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(271.1239239857216, 8);
    expect(lat).toBeCloseTo(-0.715428770653271, 8);
    expect(radiusVector).toBeCloseTo(1.413305689732882, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(271.1239048372013, 8);
    expect(lat).toBeCloseTo(-0.7154286031528954, 8);
    expect(radiusVector).toBeCloseTo(1.4133056897959095, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(271.23163149480865, 8);
    expect(declination).toBeCloseTo(-24.14831425795423, 8);
    expect(radiusVector).toBeCloseTo(1.413305689732882, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(271.2316105107215, 8);
    expect(declination).toBeCloseTo(-24.148314254167293, 8);
    expect(radiusVector).toBeCloseTo(1.4133056897959095, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mercury.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(0.027309825000885506, 8);
    expect(y).toBeCloseTo(-1.4128699164901137, 8);
    expect(z).toBeCloseTo(-0.017626053557261503, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mercury.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(271.1073509763793, 8);
    expect(lat).toBeCloseTo(-0.7146146303591142, 8);
    expect(radiusVector).toBeCloseTo(1.4132437529415665, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mercury.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(271.2134636283257, 8);
    expect(declination).toBeCloseTo(-24.147640791689003, 8);
    expect(radiusVector).toBeCloseTo(1.4132437529415665, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mercury.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(271.2138992884464, 6);
    expect(declination).toBeCloseTo(-24.148487307674493, 6);
    expect(radiusVector).toBeCloseTo(1.4132795010002364, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.219351641104254, 6);
    expect(altitude).toBeCloseTo(-57.021676054139974, 6);
    expect(radiusVector).toBeCloseTo(1.4132795010002364, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mercury.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(39.219351641104254, 6);
    expect(altitude).toBeCloseTo(-57.021676054139974, 6);
    expect(radiusVector).toBeCloseTo(1.4132795010002364, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mercury.getDistanceToEarth();

    expect(d).toBeCloseTo(211427521.84166276, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mercury.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(211418256.22013518, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mercury.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(211423604.05359387, 6);
});

it('tests getLightTime', () => {
    const lt = mercury.getLightTime();

    expect(sec2string(lt)).toBe('0h 11m 45.25s');
});

it('tests getAngularDiameter', () => {
    const delta = mercury.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 04.76"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = mercury.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 04.76"');
});

it('tests getElongation', () => {
    const phi = mercury.getElongation();

    expect(phi).toBeCloseTo(8.77998435981542, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mercury.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(8.77966393857442, 6);
});

it('tests getPhaseAngle', () => {
    const i = mercury.getPhaseAngle();

    expect(i).toBeCloseTo(18.77902217074897, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mercury.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(18.77700905329972, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mercury.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9733835942537239, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mercury.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9733892493598146, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mercury.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(84.88398343321204, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mercury.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(84.87811648567028, 6);
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

    expect(V).toBeCloseTo(-0.7224311635660818, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mercury.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-0.7225306898734715, 6);
});
