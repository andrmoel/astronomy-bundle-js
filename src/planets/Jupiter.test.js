import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import Jupiter from './Jupiter';
import {deg2angle} from '../utils/angleCalc';
import Saturn from './Saturn';

const toi = createTimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const jupiter = new Jupiter(toi);

it('tests getHeliocentricRectangularJ2000Coordinates', async () => {
    const coords = await jupiter.getHeliocentricRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(4.00345698);
    expect(round(coords.y, 8)).toBe(2.93535852);
    expect(round(coords.z, 8)).toBe(-0.10182151);
});

it('tests getHeliocentricRectangularDateCoordinates', async () => {
    const coords = await jupiter.getHeliocentricRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(4.0034579);
    expect(round(coords.y, 8)).toBe(2.9353572);
    expect(round(coords.z, 8)).toBe(-0.10182152);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await jupiter.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(36.24909169);
    expect(round(coords.lat, 8)).toBe(-1.17502118);
    expect(round(coords.radiusVector, 8)).toBe(4.96531621);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await jupiter.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(36.2490731);
    expect(round(coords.lat, 8)).toBe(-1.17502131);
    expect(round(coords.radiusVector, 8)).toBe(4.96531617);
});

it('tests getGeocentricRectangularJ2000Coordinates', async () => {
    const coords = await jupiter.getGeocentricRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(4.17198199);
    expect(round(coords.y, 8)).toBe(1.96657527);
    expect(round(coords.z, 8)).toBe(-0.10181757);
});

it('tests getGeocentricRectangularDateCoordinates', async () => {
    const coords = await jupiter.getGeocentricRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(4.17198259);
    expect(round(coords.y, 8)).toBe(1.9665739);
    expect(round(coords.z, 8)).toBe(-0.10181758);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await jupiter.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(25.23809956);
    expect(round(coords.lat, 8)).toBe(-1.26462564);
    expect(round(coords.radiusVector, 8)).toBe(4.61337391);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await jupiter.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(25.23808092);
    expect(round(coords.lat, 8)).toBe(-1.26462574);
    expect(round(coords.radiusVector, 8)).toBe(4.61337387);
});

it('tests getApparentGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await jupiter.getApparentGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(25.23421337);
    expect(round(coords.lat, 8)).toBe(-1.26462574);
    expect(round(coords.radiusVector, 8)).toBe(4.61337387);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await jupiter.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(23.85097595);
    expect(round(coords.declination, 8)).toBe(8.58513294);
    expect(round(coords.radiusVector, 8)).toBe(4.61337387);
});

it('tests getDistanceToEarth', async () => {
    const d = await jupiter.getDistanceToEarth();

    expect(round(d, 2)).toBe(690150907.8);
});

it('tests getAngularDiameter', async () => {
    const delta = await jupiter.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 00\' 42.734"');
});

it('tests getPhaseAngle', async () => {
    const i = await jupiter.getPhaseAngle();

    expect(round(i, 2)).toBe(11.01);
});

it('tests getIlluminatedFraction', async () => {
    const i = await jupiter.getIlluminatedFraction();

    expect(round(i, 2)).toBe(0.99);
});

it('tests getConjunctionTo', async () => {
    const toiConjunction0 = createTimeOfInterest.fromTime(2020, 12, 21, 0, 0, 0);
    const jupiter = new Jupiter(toiConjunction0);

    const toiConjunction = await jupiter.getConjunctionTo(Saturn);

    expect(toiConjunction.time).toEqual({year: 2020, month: 12, day: 21, hour: 13, min: 23, sec: 32});
});
