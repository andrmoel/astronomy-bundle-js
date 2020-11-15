import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import {deg2angle} from '../utils/angleCalc';
import {sec2string} from '../utils/timeCalc';
import Jupiter from './Jupiter';
import Saturn from './Saturn';

const toi = createTimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const jupiter = new Jupiter(toi);

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await jupiter.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(4.0034569);
    expect(round(coords.y, 8)).toBe(2.93535852);
    expect(round(coords.z, 8)).toBe(-0.10182146);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await jupiter.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(4.00345792);
    expect(round(coords.y, 8)).toBe(2.93535719);
    expect(round(coords.z, 8)).toBe(-0.10182147);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await jupiter.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(36.24909222);
    expect(round(coords.lat, 8)).toBe(-1.17502065);
    expect(round(coords.radiusVector, 8)).toBe(4.96531615);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await jupiter.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(36.24907292);
    expect(round(coords.lat, 8)).toBe(-1.17502077);
    expect(round(coords.radiusVector, 8)).toBe(4.96531618);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await jupiter.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(4.1719819);
    expect(round(coords.y, 8)).toBe(1.96657527);
    expect(round(coords.z, 8)).toBe(-0.10181753);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await jupiter.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(4.1719826);
    expect(round(coords.y, 8)).toBe(1.96657389);
    expect(round(coords.z, 8)).toBe(-0.10181753);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await jupiter.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(25.2381);
    expect(round(coords.lat, 8)).toBe(-1.26462508);
    expect(round(coords.radiusVector, 8)).toBe(4.61337383);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await jupiter.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(25.23808077);
    expect(round(coords.lat, 8)).toBe(-1.26462517);
    expect(round(coords.radiusVector, 8)).toBe(4.61337387);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const coords = await jupiter.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(coords.rightAscension, 8)).toBe(23.85463605);
    expect(round(coords.declination, 8)).toBe(8.58654743);
    expect(round(coords.radiusVector, 8)).toBe(4.61337383);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const coords = await jupiter.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(23.85461797);
    expect(round(coords.declination, 8)).toBe(8.58654035);
    expect(round(coords.radiusVector, 8)).toBe(4.61337387);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', async () => {
    const {x, y, z} = await jupiter.getApparentGeocentricEclipticRectangularCoordinates();

    expect(round(x, 8)).toBe(4.17218435);
    expect(round(y, 8)).toBe(1.96623159);
    expect(round(z, 8)).toBe(-0.10182946);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const coords = await jupiter.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(coords.lon, 8)).toBe(25.23316591);
    expect(round(coords.lat, 8)).toBe(-1.26476328);
    expect(round(coords.radiusVector, 8)).toBe(4.61341068);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await jupiter.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(23.85004009);
    expect(round(coords.declination, 8)).toBe(8.58462378);
    expect(round(coords.radiusVector, 8)).toBe(4.61341068);
});

it('tests getDistanceToEarth', async () => {
    const d = await jupiter.getDistanceToEarth();

    expect(round(d, 2)).toBe(690150907.85);
});

it('tests getLightTime', async () => {
    const lt = await jupiter.getLightTime();

    expect(sec2string(lt)).toBe('0h 38m 22.1s');
});

it('tests getAngularDiameter', async () => {
    const delta = await jupiter.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 00\' 42.733"');
});

it('tests getPhaseAngle', async () => {
    const i = await jupiter.getPhaseAngle();

    expect(round(i, 2)).toBe(11.01);
});

it('tests getIlluminatedFraction', async () => {
    const i = await jupiter.getIlluminatedFraction();

    expect(round(i, 2)).toBe(0.99);
});

it('tests getConjunctionInRightAscensionTo', async () => {
    const toiConjunction0 = createTimeOfInterest.fromTime(2020, 12, 21, 0, 0, 0);
    const jupiter = new Jupiter(toiConjunction0);

    const toiConjunction = await jupiter.getConjunctionInRightAscensionTo(Saturn);

    expect(toiConjunction.time).toEqual({year: 2020, month: 12, day: 21, hour: 13, min: 33, sec: 22});
});
