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

    expect(x).toBeCloseTo(1.3903629914, 8);
    expect(y).toBeCloseTo(-0.020998062, 8);
    expect(z).toBeCloseTo(-0.0346177163, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.3903629847, 8);
    expect(y).toBeCloseTo(-0.0209985258, 8);
    expect(z).toBeCloseTo(-0.0346177165, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(359.1347519633, 8);
    expect(lat).toBeCloseTo(-1.4261119769, 8);
    expect(radiusVector).toBeCloseTo(1.3909523905, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(359.1347328545, 8);
    expect(lat).toBeCloseTo(-1.4261119849, 8);
    expect(radiusVector).toBeCloseTo(1.3909523908, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(1.558899585, 8);
    expect(y).toBeCloseTo(-0.9897791646, 8);
    expect(z).toBeCloseTo(-0.0346144607, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = mars.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(1.5588992546, 8);
    expect(y).toBeCloseTo(-0.9897796846, 8);
    expect(z).toBeCloseTo(-0.0346144579, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(327.5876501726, 8);
    expect(lat).toBeCloseTo(-1.073897751, 8);
    expect(radiusVector).toBeCloseTo(1.8468970949, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(327.5876310606, 8);
    expect(lat).toBeCloseTo(-1.073897664, 8);
    expect(radiusVector).toBeCloseTo(1.8468970948, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(330.1569136121, 8);
    expect(declination).toBeCloseTo(-13.3180596455, 8);
    expect(radiusVector).toBeCloseTo(1.8468970949, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(330.1568951507, 8);
    expect(declination).toBeCloseTo(-13.318066158, 8);
    expect(radiusVector).toBeCloseTo(1.8468970948, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = mars.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(1.55875702, 8);
    expect(y).toBeCloseTo(-0.9901530404, 8);
    expect(z).toBeCloseTo(-0.0346202414, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = mars.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(327.5754861882, 8);
    expect(lat).toBeCloseTo(-1.0740304791, 8);
    expect(radiusVector).toBeCloseTo(1.8469772767, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = mars.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(330.1452301632, 8);
    expect(declination).toBeCloseTo(-13.322380628, 8);
    expect(radiusVector).toBeCloseTo(1.8469772767, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        mars.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(330.1447343, 6);
    expect(declination).toBeCloseTo(-13.32324825, 6);
    expect(radiusVector).toBeCloseTo(1.8470053, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.3897926, 6);
    expect(altitude).toBeCloseTo(-41.08443433, 6);
    expect(radiusVector).toBeCloseTo(1.8470053, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = mars.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(309.3897926, 6);
    expect(altitude).toBeCloseTo(-41.08443433, 6);
    expect(radiusVector).toBeCloseTo(1.8470053, 6);
});

it('tests getDistanceToEarth', () => {
    const d = mars.getDistanceToEarth();

    expect(d).toBeCloseTo(276291872.4793434, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = mars.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(276303867.5739881, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = mars.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(276308060.0257899, 6);
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

    expect(phi).toBeCloseTo(47.7254744, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = mars.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(47.72473302, 6);
});

it('tests getPhaseAngle', () => {
    const i = mars.getPhaseAngle();

    expect(i).toBeCloseTo(31.53926043, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = mars.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(31.53855898, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = mars.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.92614097, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = mars.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.92614417, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = mars.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.793423, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = mars.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.79413791, 6);
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

    expect(V).toBeCloseTo(1.03340298, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = mars.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(1.03351898, 6);
});

it('tests getTransit', () => {
    const toi = mars.getTransit(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 14, min: 26, sec: 30});
});

it('tests getGeometricRise', () => {
    const toi = mars.getGeometricRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 38, sec: 0});
});

it('tests getApparentRise', () => {
    const toi = mars.getApparentRise(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 9, min: 34, sec: 0});
});

it('tests getGeometricSet', () => {
    const toi = mars.getGeometricSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 19, min: 15, sec: 39});
});

it('tests getApparentSet', () => {
    const toi = mars.getApparentSet(location);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 19, min: 19, sec: 39});
});
