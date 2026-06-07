import * as vsop87Date from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87J2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import Earth from './Earth';

const toi = TimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = new Earth(toi, vsop87Date, vsop87J2000);

it('tests if name is correct', () => {
    expect(earth.name).toBe('earth');
});

it('test getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const coords = earth.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(coords.x).toBeCloseTo(0.20701041, 8);
    expect(coords.y).toBeCloseTo(0.96282379, 8);
    expect(coords.z).toBeCloseTo(-0.00004247, 8);
});

it('test getHeliocentricEclipticRectangularDateCoordinates', () => {
    const coords = earth.getHeliocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBeCloseTo(0.20279686, 8);
    expect(coords.y).toBeCloseTo(0.96372008, 8);
    expect(coords.z).toBeCloseTo(-0.00000251, 8);
});

it('test getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = earth.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBeCloseTo(77.86593249, 8);
    expect(coords.lat).toBeCloseTo(-0.00247079, 8);
    expect(coords.radiusVector).toBeCloseTo(0.98482636, 8);
});

it('test getHeliocentricEclipticSphericalDateCoordinates', () => {
    const coords = earth.getHeliocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBeCloseTo(78.11655576, 8);
    expect(coords.lat).toBeCloseTo(-0.00014629, 8);
    expect(coords.radiusVector).toBeCloseTo(0.98482636, 8);
});

it('test getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const coords = earth.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(coords.x).toBe(0);
    expect(coords.y).toBe(0);
    expect(coords.z).toBe(0);
});

it('test getGeocentricEclipticRectangularDateCoordinates', () => {
    const coords = earth.getGeocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBe(0);
    expect(coords.y).toBe(0);
    expect(coords.z).toBe(0);
});

it('test getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = earth.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('test getGeocentricEclipticSphericalDateCoordinates', () => {
    const coords = earth.getGeocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('test getApparentGeocentricEclipticSphericalCoordinates', () => {
    const coords = earth.getApparentGeocentricEclipticSphericalCoordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('tests getNutationInLongitude', () => {
    const toi = TimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi, vsop87Date, vsop87J2000);

    expect(earth.getNutationInLongitude()).toBeCloseTo(-0.004946, 6);
});

it('tests getNutationInObliquity', () => {
    const toi = TimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi, vsop87Date, vsop87J2000);

    expect(earth.getNutationInObliquity()).toBeCloseTo(0.000478, 6);
});

it('tests getMeanObliquityOfEcliptic', () => {
    const toi = TimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi, vsop87Date, vsop87J2000);

    expect(earth.getMeanObliquityOfEcliptic()).toBeCloseTo(23.436593, 6);
});

it('tests getTrueObliquityOfEcliptic', () => {
    const toi = TimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi, vsop87Date, vsop87J2000);

    expect(earth.getTrueObliquityOfEcliptic()).toBeCloseTo(23.43707, 6);
});
