import {createTimeOfInterest} from '../time';
import Earth from './Earth';
import {round} from '../utils/math';

const toi = createTimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = new Earth(toi);

it('test getHeliocentricRectangularJ2000Coordinates', async () => {
    const coords = await earth.getHeliocentricRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(0.2070104);
    expect(round(coords.y, 8)).toBe(0.96282379);
    expect(round(coords.z, 8)).toBe(-0.00004247);
});

it('test getHeliocentricRectangularDateCoordinates', async () => {
    const coords = await earth.getHeliocentricRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(0.20279685);
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
