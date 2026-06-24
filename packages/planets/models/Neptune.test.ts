import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Neptune from './Neptune';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const neptune = Neptune.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(neptune.name).toBe('neptune');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.81087376476876, 8);
    expect(y).toBeCloseTo(-24.99250176040147, 8);
    expect(z).toBeCloseTo(0.12723164791747893, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.81086540737944, 8);
    expect(y).toBeCloseTo(-24.99250734321522, 8);
    expect(z).toBeCloseTo(0.12723172039641586, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.926224436456, 8);
    expect(lat).toBeCloseTo(0.24202283927038684, 8);
    expect(radiusVector).toBeCloseTo(30.120537991060072, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.9262053180425, 8);
    expect(lat).toBeCloseTo(0.24202297739760192, 8);
    expect(radiusVector).toBeCloseTo(30.12053795927902, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(16.979397624593876, 8);
    expect(y).toBeCloseTo(-25.961285085342784, 8);
    expect(z).toBeCloseTo(0.12723490345652466, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = neptune.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(16.979388943236934, 8);
    expect(y).toBeCloseTo(-25.96129072447627, 8);
    expect(z).toBeCloseTo(0.12723497894568925, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(303.1857947105053, 8);
    expect(lat).toBeCloseTo(0.23500324888084706, 8);
    expect(radiusVector).toBeCloseTo(31.021032473100625, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(303.1857755901488, 8);
    expect(lat).toBeCloseTo(0.23500338855342986, 8);
    expect(radiusVector).toBeCloseTo(31.02103244101269, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(305.4254072421235, 8);
    expect(declination).toBeCloseTo(-19.214904776630217, 8);
    expect(radiusVector).toBeCloseTo(31.021032473100625, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(305.42538750531764, 8);
    expect(declination).toBeCloseTo(-19.2149090489887, 8);
    expect(radiusVector).toBeCloseTo(31.02103244101269, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = neptune.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(16.974761599661644, 8);
    expect(y).toBeCloseTo(-25.96433265943588, 8);
    expect(z).toBeCloseTo(0.12725726681826174, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = neptune.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(303.1755474909156, 8);
    expect(lat).toBeCloseTo(0.23504445165786764, 8);
    expect(radiusVector).toBeCloseTo(31.021046020841304, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = neptune.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(305.41483771385583, 8);
    expect(declination).toBeCloseTo(-19.217226911793304, 8);
    expect(radiusVector).toBeCloseTo(31.021046020841304, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        neptune.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(305.41482710425055, 6);
    expect(declination).toBeCloseTo(-19.217270190432078, 6);
    expect(radiusVector).toBeCloseTo(31.02108111474832, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.69870084519766, 6);
    expect(altitude).toBeCloseTo(-55.40089246267078, 6);
    expect(radiusVector).toBeCloseTo(31.02108111474832, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = neptune.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(339.69870084519766, 6);
    expect(altitude).toBeCloseTo(-55.40089246267078, 6);
    expect(radiusVector).toBeCloseTo(31.02108111474832, 6);
});

it('tests getDistanceToEarth', () => {
    const d = neptune.getDistanceToEarth();

    expect(d).toBeCloseTo(4640680400.091122, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = neptune.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(4640682431.604567, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = neptune.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(4640687681.578331, 6);
});

it('tests getLightTime', () => {
    const lt = neptune.getLightTime();

    expect(sec2string(lt)).toBe('4h 17m 59.64s');
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

    expect(phi).toBeCloseTo(23.31824705462177, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = neptune.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(23.318226952864432, 6);
});

it('tests getPhaseAngle', () => {
    const i = neptune.getPhaseAngle();

    expect(i).toBeCloseTo(0.7404392019582905, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = neptune.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(0.7404377400438454, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = neptune.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.9999582489398345, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = neptune.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9999582491046977, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = neptune.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(256.128912497793, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = neptune.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(256.129007893843, 6);
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

    expect(V).toBeCloseTo(7.854594860419526, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = neptune.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(7.854598267578563, 6);
});
