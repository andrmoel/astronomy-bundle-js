import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Jupiter from './Jupiter';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const jupiter = Jupiter.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(jupiter.name).toBe('jupiter');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = jupiter.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(4.003452725841249, 8);
    expect(y).toBeCloseTo(2.9353576775745673, 8);
    expect(z).toBeCloseTo(-0.10182238209267469, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = jupiter.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(4.003453713888496, 8);
    expect(y).toBeCloseTo(2.9353563418141313, 8);
    expect(z).toBeCloseTo(-0.10182239259269561, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(36.249112876539186, 8);
    expect(lat).toBeCloseTo(-1.1750321776451635, 8);
    expect(radiusVector).toBeCloseTo(4.965312298419578, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(36.24909370058818, 8);
    expect(lat).toBeCloseTo(-1.1750322971291483, 8);
    expect(radiusVector).toBeCloseTo(4.965312305616771, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = jupiter.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(4.1719765856663615, 8);
    expect(y).toBeCloseTo(1.9665743526332549, 8);
    expect(z).toBeCloseTo(-0.10181912655362896, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = jupiter.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(4.171977249745991, 8);
    expect(y).toBeCloseTo(1.9665729605530786, 8);
    expect(z).toBeCloseTo(-0.10181913404342224, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(25.238117808184224, 8);
    expect(lat).toBeCloseTo(-1.2646463709523539, 8);
    expect(radiusVector).toBeCloseTo(4.613368666204273, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(25.23809864830741, 8);
    expect(lat).toBeCloseTo(-1.2646464619942213, 8);
    expect(radiusVector).toBeCloseTo(4.613368673500306, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(23.854660655785775, 8);
    expect(declination).toBeCloseTo(8.586534073257761, 8);
    expect(radiusVector).toBeCloseTo(4.613368666204273, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(23.854642644861723, 8);
    expect(declination).toBeCloseTo(8.586527018604366, 8);
    expect(radiusVector).toBeCloseTo(4.613368673500306, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = jupiter.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(4.172178993940584, 8);
    expect(y).toBeCloseTo(1.9662306631547972, 8);
    expect(z).toBeCloseTo(-0.10183106433595428, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = jupiter.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(25.233183799905426, 8);
    expect(lat).toBeCloseTo(-1.2647845734882739, 8);
    expect(radiusVector).toBeCloseTo(4.613405482273698, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = jupiter.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(23.850064777672372, 8);
    expect(declination).toBeCloseTo(8.584610452129663, 8);
    expect(radiusVector).toBeCloseTo(4.613405482273698, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        jupiter.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(23.849738252209008, 6);
    expect(declination).toBeCloseTo(8.584197285734632, 6);
    expect(radiusVector).toBeCloseTo(4.61340024106979, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = jupiter.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(274.87238383375893, 6);
    expect(altitude).toBeCloseTo(7.092492748931246, 6);
    expect(radiusVector).toBeCloseTo(4.61340024106979, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = jupiter.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(274.87238383375893, 6);
    expect(altitude).toBeCloseTo(7.214433204712797, 6);
    expect(radiusVector).toBeCloseTo(4.61340024106979, 6);
});

it('tests getDistanceToEarth', () => {
    const d = jupiter.getDistanceToEarth();

    expect(d).toBeCloseTo(690150130.3097292, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = jupiter.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(690155636.8238517, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = jupiter.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(690154852.7509073, 6);
});

it('tests getLightTime', () => {
    const lt = jupiter.getLightTime();

    expect(sec2string(lt)).toBe('0h 38m 22.09s');
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

    expect(phi).toBeCloseTo(105.37093279809292, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = jupiter.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(105.3704801093203, 6);
});

it('tests getPhaseAngle', () => {
    const i = jupiter.getPhaseAngle();

    expect(i).toBeCloseTo(11.008357520154576, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = jupiter.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(11.008408900284783, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = jupiter.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9907996702066321, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = jupiter.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.990799584588018, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = jupiter.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(248.3140928674576, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = jupiter.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(248.31397138582474, 6);
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

    expect(V).toBeCloseTo(-2.516575127547206, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = jupiter.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-2.516559554304723, 6);
});
