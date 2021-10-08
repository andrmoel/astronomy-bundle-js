import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import Star from './Star';

const toi = createTimeOfInterest.fromJulianDay(2462088.69);

const coords = {
    rightAscension: 41.04994167,
    declination: 49.22846667,
    radiusVector: 1,
};

const properMotion = {
    rightAscension: 0.0001427083,
    declination: -0.000024861,
};

const star = new Star(coords, toi, properMotion);

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await star.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(0.49248525);
    expect(round(coords.y, 8)).toBe(0.69469303);
    expect(round(coords.z, 8)).toBe(0.52427081);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await star.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(0.48755632);
    expect(round(coords.y, 8)).toBe(0.69817704);
    expect(round(coords.z, 8)).toBe(0.52424961);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await star.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(54.66621932);
    expect(round(coords.lat, 8)).toBe(31.61916719);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await star.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(55.07233845);
    expect(round(coords.lat, 8)).toBe(31.61774121);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await star.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(0.49248525);
    expect(round(coords.y, 8)).toBe(0.69469303);
    expect(round(coords.z, 8)).toBe(0.52427081);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await star.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(0.48755632);
    expect(round(coords.y, 8)).toBe(0.69817704);
    expect(round(coords.z, 8)).toBe(0.52424961);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await star.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(54.66621932);
    expect(round(coords.lat, 8)).toBe(31.61916719);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await star.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(55.07233845);
    expect(round(coords.lat, 8)).toBe(31.61774121);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const coords = await star.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(coords.rightAscension, 8)).toBe(41.04994167);
    expect(round(coords.declination, 8)).toBe(49.22846667);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const coords = await star.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(41.5472126);
    expect(round(coords.declination, 8)).toBe(49.34848212);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', async () => {
    const {x, y, z} = await star.getApparentGeocentricEclipticRectangularCoordinates();

    expect(round(x, 8)).toBe(0.48742464);
    expect(round(y, 8)).toBe(0.69827074);
    expect(round(z, 8)).toBe(0.52424727);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const coords = await star.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(coords.lon, 8)).toBe(55.08321198);
    expect(round(coords.lat, 8)).toBe(31.61758356);
    expect(round(coords.radiusVector, 8)).toBe(1);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await star.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(41.56061474);
    expect(round(coords.declination, 8)).toBe(49.35157074);
    expect(round(coords.radiusVector, 8)).toBe(1);
});
