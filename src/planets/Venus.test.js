import {round} from '../utils/math';
import {createTimeOfInterest} from '../time';
import {deg2angle} from '../utils/angleCalc';
import {sec2string} from '../utils/timeCalc';
import Venus from './Venus';
import Neptune from './Neptune';

const toi = createTimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const venus = new Venus(toi);

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await venus.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(-0.7186302);
    expect(round(coords.y, 8)).toBe(-0.0225041);
    expect(round(coords.z, 8)).toBe(0.04117196);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await venus.getHeliocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(-0.71863021);
    expect(round(coords.y, 8)).toBe(-0.02250385);
    expect(round(coords.z, 8)).toBe(0.04117196);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await venus.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(181.79364677);
    expect(round(coords.lat, 8)).toBe(3.27741778);
    expect(round(coords.radiusVector, 8)).toBe(0.72016035);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await venus.getHeliocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(181.79362719);
    expect(round(coords.lat, 8)).toBe(3.2774178);
    expect(round(coords.radiusVector, 8)).toBe(0.72016035);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', async () => {
    const coords = await venus.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(round(coords.x, 8)).toBe(-0.5501052);
    expect(round(coords.y, 8)).toBe(-0.99128735);
    expect(round(coords.z, 8)).toBe(0.04117589);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', async () => {
    const coords = await venus.getGeocentricEclipticRectangularDateCoordinates();

    expect(round(coords.x, 8)).toBe(-0.55010553);
    expect(round(coords.y, 8)).toBe(-0.99128716);
    expect(round(coords.z, 8)).toBe(0.0411759);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', async () => {
    const coords = await venus.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(round(coords.lon, 8)).toBe(240.97234462);
    expect(round(coords.lat, 8)).toBe(2.08007137);
    expect(round(coords.radiusVector, 8)).toBe(1.13444339);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', async () => {
    const coords = await venus.getGeocentricEclipticSphericalDateCoordinates();

    expect(round(coords.lon, 8)).toBe(240.97232547);
    expect(round(coords.lat, 8)).toBe(2.08007155);
    expect(round(coords.radiusVector, 8)).toBe(1.13444338);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', async () => {
    const coords = await venus.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(round(coords.rightAscension, 8)).toBe(239.283551);
    expect(round(coords.declination, 8)).toBe(-18.31600121);
    expect(round(coords.radiusVector, 8)).toBe(1.13444339);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', async () => {
    const coords = await venus.getGeocentricEquatorialSphericalDateCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(239.2835313);
    expect(round(coords.declination, 8)).toBe(-18.31599715);
    expect(round(coords.radiusVector, 8)).toBe(1.13444338);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', async () => {
    const {x, y, z} = await venus.getApparentGeocentricEclipticRectangularCoordinates();

    expect(round(x, 8)).toBe(-0.55025375);
    expect(round(y, 8)).toBe(-0.99107359);
    expect(round(z, 8)).toBe(0.0411753);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', async () => {
    const coords = await venus.getApparentGeocentricEclipticSphericalCoordinates();

    expect(round(coords.lon, 8)).toBe(240.96053701);
    expect(round(coords.lat, 8)).toBe(2.0802518);
    expect(round(coords.radiusVector, 8)).toBe(1.13432864);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', async () => {
    const coords = await venus.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(round(coords.rightAscension, 8)).toBe(239.27141987);
    expect(round(coords.declination, 8)).toBe(-18.3134252);
    expect(round(coords.radiusVector, 8)).toBe(1.13432864);
});

it('tests getDistanceToEarth', async () => {
    const d = await venus.getDistanceToEarth();

    expect(round(d, 2)).toBe(169710313.77);
});

it('tests getLightTime', async () => {
    const lt = await venus.getLightTime();

    expect(sec2string(lt)).toBe('0h 9m 26.09s');
});

it('tests getAngularDiameter', async () => {
    const delta = await venus.getAngularDiameter();

    expect(deg2angle(delta)).toBe('0° 00\' 14.711"');
});

it('tests getPhaseAngle', async () => {
    const i = await venus.getPhaseAngle();

    expect(round(i, 2)).toBe(59.13);
});

it('tests getIlluminatedFraction', async () => {
    const i = await venus.getIlluminatedFraction();

    expect(round(i, 2)).toBe(0.76);
});

it('tests getConjunctionInRightAscensionTo', async () => {
    const toiConjunction0 = createTimeOfInterest.fromTime(2020, 1, 27, 0, 0, 0);
    const venus = new Venus(toiConjunction0);

    const toiConjunction = await venus.getConjunctionInRightAscensionTo(Neptune);

    expect(toiConjunction.time).toEqual({year: 2020, month: 1, day: 27, hour: 19, min: 25, sec: 49});
});
