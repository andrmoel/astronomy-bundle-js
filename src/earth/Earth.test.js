import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import Earth from './Earth';

const toi = createTimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = new Earth(toi);

it('get name should return expected value', () => {
    expect(earth.name).toBe('earth');
});

it('test getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await earth.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(0.20701041);
    expect(round(coords.y, 8)).toBe(0.96282379);
    expect(round(coords.z, 8)).toBe(-0.00004247);
});

it('test getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await earth.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(0.20279686);
    expect(round(coords.y, 8)).toBe(0.96372008);
    expect(round(coords.z, 8)).toBe(-0.00000252);
});

it('test getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await earth.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(77.86593249);
    expect(round(coords.lat, 8)).toBe(-0.00247079);
    expect(round(coords.radiusVector, 8)).toBe(0.98482636);
});

it('test getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await earth.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(78.11655576);
    expect(round(coords.lat, 8)).toBe(-0.00014636);
    expect(round(coords.radiusVector, 8)).toBe(0.98482636);
});

it('tests getNutationInLongitude', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getNutationInLongitude(), 6)).toBe(-0.004946);
});

it('tests getNutationInObliquity', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getNutationInObliquity(), 6)).toBe(0.000478);
});

it('tests getMeanObliquityOfEcliptic', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getMeanObliquityOfEcliptic(), 6)).toBe(23.436593);
});

it('tests getTrueObliquityOfEcliptic', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getTrueObliquityOfEcliptic(), 6)).toBe(23.43707);
});
