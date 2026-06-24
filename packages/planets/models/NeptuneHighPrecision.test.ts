import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Neptune} from '../index.neptune.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const neptune = Neptune.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(neptune.name).toBe('neptune');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.81082165076938, 8);
    expect(y).toBeCloseTo(-24.992551702578464, 8);
    expect(z).toBeCloseTo(0.12726703746504228, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.810813176288132, 8);
    expect(y).toBeCloseTo(-24.99255728880408, 8);
    expect(z).toBeCloseTo(0.1272671091453251, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.92608915742727, 8);
    expect(lat).toBeCloseTo(0.2420900579530369, 8);
    expect(radiusVector).toBeCloseTo(30.12055049428644, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.92606985058205, 8);
    expect(lat).toBeCloseTo(0.2420901950633765, 8);
    expect(radiusVector).toBeCloseTo(30.12055040000575, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.979346649305068, 8);
    expect(y).toBeCloseTo(-25.961334949725224, 8);
    expect(z).toBeCloseTo(0.12727097305647278, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.979337855073457, 8);
    expect(y).toBeCloseTo(-25.96134059115601, 8);
    expect(z).toBeCloseTo(0.1272710476994179, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.18566550315353, 8);
    expect(lat).toBeCloseTo(0.23506976399302695, 8);
    expect(radiusVector).toBeCloseTo(31.021046450912554, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.18564620600495, 8);
    expect(lat).toBeCloseTo(0.23506990255608834, 8);
    expect(radiusVector).toBeCloseTo(31.02104635898534, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(305.42525785938705, 8);
    expect(declination).toBeCloseTo(-19.21486984266614, 8);
    expect(radiusVector).toBeCloseTo(31.021046450912554, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(305.42523794067586, 8);
    expect(declination).toBeCloseTo(-19.21487415684797, 8);
    expect(radiusVector).toBeCloseTo(31.02104635898534, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = neptune.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(16.974710507284897, 8);
    expect(y).toBeCloseTo(-25.96438252323445, 8);
    expect(z).toBeCloseTo(0.1272933356674473, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(303.1754181077688, 8);
    expect(lat).toBeCloseTo(0.2351109657302688, 8);
    expect(radiusVector).toBeCloseTo(31.02105994662781, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(305.4146881503826, 8);
    expect(declination).toBeCloseTo(-19.21719201069239, 8);
    expect(radiusVector).toBeCloseTo(31.02105994662781, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        neptune.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(305.4146775409141, 6);
    expect(declination).toBeCloseTo(-19.217235289342607, 6);
    expect(radiusVector).toBeCloseTo(31.021095040533925, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.698957008549, 6);
    expect(altitude).toBeCloseTo(-55.40089002112281, 6);
    expect(radiusVector).toBeCloseTo(31.021095040533925, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.698957008549, 6);
    expect(altitude).toBeCloseTo(-55.40089002112281, 6);
    expect(radiusVector).toBeCloseTo(31.021095040533925, 6);
});

it('tests getDistanceToEarth', () => {
    const d = neptune.getDistanceToEarth();

    expect(d).toBeCloseTo(4640682482.190194, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = neptune.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(4640684514.872576, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = neptune.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(4640689764.846205, 6);
});

it('tests getLightTime', () => {
    const lt = neptune.getLightTime();

    expect(sec2string(lt)).toBe('4h 17m 59.65s');
});

it('tests getAngularDiameter', () => {
    const delta = neptune.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 02.201"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = neptune.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 02.201"');
});

it('tests getElongation', () => {
    const phi = neptune.getElongation();

    expect(phi).toBeCloseTo(23.31805150648821, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = neptune.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(23.318031404844877, 6);
});

it('tests getPhaseAngle', () => {
    const i = neptune.getPhaseAngle();

    expect(i).toBeCloseTo(0.7404331218618746, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = neptune.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(0.7404316599575247, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = neptune.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9999582496254975, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = neptune.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9999582497903583, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = neptune.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(256.1289029237588, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = neptune.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(256.12899832070923, 6);
});

it('tests isWaxing', () => {
    const isWaxing = neptune.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = neptune.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = neptune.getApparentMagnitude();

    expect(V).toBeCloseTo(7.85459673156347, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = neptune.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(7.854600139267886, 6);
});
