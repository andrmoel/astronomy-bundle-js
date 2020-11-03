import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import Mercury from './Mercury';

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
