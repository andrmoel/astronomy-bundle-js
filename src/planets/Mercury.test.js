import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import {deg2angle} from '../utils/angleCalc';
import Mercury from './Mercury';
import Venus from './Venus';

const toi = createTimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mercury = new Mercury(toi);

it('tests getHeliocentricRectangularJ2000Coordinates', async () => {
    const coords = await mercury.getHeliocentricRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(-0.14072789);
    expect(round(coords.y, 8)).toBe(-0.44390102);
    expect(round(coords.z, 8)).toBe(-0.02334563);
});

it('tests getHeliocentricRectangularDateCoordinates', async () => {
    const coords = await mercury.getHeliocentricRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(-0.14072804);
    expect(round(coords.y, 8)).toBe(-0.44390097);
    expect(round(coords.z, 8)).toBe(-0.02334563);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await mercury.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(252.41006368);
    expect(round(coords.lat, 8)).toBe(-2.87000486);
    expect(round(coords.radiusVector, 8)).toBe(0.46625902);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await mercury.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(252.41004459);
    expect(round(coords.lat, 8)).toBe(-2.87000469);
    expect(round(coords.radiusVector, 8)).toBe(0.46625902);
});

it('tests getGeocentricRectangularJ2000Coordinates', async () => {
    const coords = await mercury.getGeocentricRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(0.02779712);
    expect(round(coords.y, 8)).toBe(-1.41268426);
    expect(round(coords.z, 8)).toBe(-0.02334169);
});

it('tests getGeocentricRectangularDateCoordinates', async () => {
    const coords = await mercury.getGeocentricRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(0.02779665);
    expect(round(coords.y, 8)).toBe(-1.41268427);
    expect(round(coords.z, 8)).toBe(-0.02334169);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await mercury.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(271.12725275);
    expect(round(coords.lat, 8)).toBe(-0.94642531);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await mercury.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(271.12723376);
    expect(round(coords.lat, 8)).toBe(-0.94642513);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getApparentGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await mercury.getApparentGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(271.12336622);
    expect(round(coords.lat, 8)).toBe(-0.94642513);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await mercury.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(271.23318761);
    expect(round(coords.declination, 8)).toBe(-24.37930694);
    expect(round(coords.radiusVector, 8)).toBe(1.4131505);
});

it('tests getDistanceToEarth', async () => {
    const d = await mercury.getDistanceToEarth();

    expect(round(d, 2)).toBe(211404305.73);
});

it('tests getAngularDiameter', async () => {
    const delta = await mercury.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 00\' 04.761"');
});

it('tests getPhaseAngle', async () => {
    const i = await mercury.getPhaseAngle();

    expect(round(i, 2)).toBe(18.8);
});

it('tests getIlluminatedFraction', async () => {
    const i = await mercury.getIlluminatedFraction();

    expect(round(i, 2)).toBe(0.97);
});

it('tests getConjunctionTo', async () => {
    const toiConjunction0 = createTimeOfInterest.fromTime(2020, 5, 22, 0, 0, 0);
    const mercury = new Mercury(toiConjunction0);

    const toiConjunction = await mercury.getConjunctionTo(Venus);

    expect(toiConjunction.time).toEqual({year: 2020, month: 5, day: 22, hour: 7, min: 47, sec: 14});
});
