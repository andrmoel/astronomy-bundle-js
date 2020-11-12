import {
    earthEclipticSpherical2sunEclipticSpherical,
    ecliptic2apparentEcliptic,
    eclipticJ20002eclipticDate,
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2eclipticSpherical,
    rectangular2spherical,
    rectangularHeliocentric2rectangularGeocentric,
    spherical2rectangular,
} from './coordinateCalc';
import {round} from './math';

it('tests rectangular2spherical', () => {
    const x = 0.621746;
    const y = -0.66481;
    const z = -0.033134;

    const spherical = rectangular2spherical(x, y, z);

    expect(round(spherical.lon, 6)).toBe(313.082894);
    expect(round(spherical.lat, 6)).toBe(-2.084721);
    expect(round(spherical.radiusVector, 6)).toBe(0.910845);
});

it('tests spherical2rectangular', () => {
    const lon = 313.082894;
    const lat = -2.084721;
    const radiusVector = 0.910845;

    const rectangular = spherical2rectangular(lon, lat, radiusVector);

    expect(round(rectangular.x, 6)).toBe(0.621746);
    expect(round(rectangular.y, 6)).toBe(-0.66481);
    expect(round(rectangular.z, 6)).toBe(-0.033134);
});

it('tests eclipticSpherical2equatorialSpherical', () => {
    const T = -0.070321697467488; // 1992-12-20 00:00:00
    const lon = 313.082894;
    const lat = -2.084721;
    const radiusVector = 0.910845;

    const coords = eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, T);

    expect(round(coords.rightAscension, 6)).toBe(316.174262);
    expect(round(coords.declination, 6)).toBe(-18.887468);
    expect(round(coords.radiusVector, 6)).toBe(0.910845);
});

it('tests equatorialSpherical2eclipticSpherical', () => {
    const T = -0.070321697467488; // 1992-12-20 00:00:00
    const rightAscension = 316.174262;
    const declination = -18.887468;
    const radiusVector = 0.910845;

    const coords = equatorialSpherical2eclipticSpherical(rightAscension, declination, radiusVector, T);

    expect(round(coords.lon, 6)).toBe(313.082894);
    expect(round(coords.lat, 6)).toBe(-2.084721);
    expect(round(coords.radiusVector, 6)).toBe(0.910845);
});

it('tests rectangularHeliocentric2rectangularGeocentric', () => {
    const coordsPlanet = {x: 1.0, y: 2.0, z: 3.0};
    const coordsEarth = {x: -1.0, y: 0.5, z: 1.3};

    const coords = rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);

    expect(coords.x).toBe(2);
    expect(coords.y).toBe(1.5);
    expect(coords.z).toBe(1.7);
});

it('tests earthEclipticSpherical2sunEclipticSpherical', () => {
    const coordsEarth = {
        lon: 56.45049,
        lat: 0.00564,
        radiusVector: 0.9848,
    };

    const coordsSun = earthEclipticSpherical2sunEclipticSpherical(coordsEarth);

    expect(coordsSun.lon).toBe(236.45049);
    expect(coordsSun.lat).toBe(-0.00564);
    expect(coordsSun.radiusVector).toBe(0.9848);
});

it('tests ecliptic2apparentEcliptic', () => {
    const lon = 25.23808092;
    const lat = -1.26462574;
    const radiusVector = 4.61337387;
    const T = -0.00001368925;

    const coords = ecliptic2apparentEcliptic(lon, lat, radiusVector, T);

    expect(round(coords.lon, 8)).toBe(25.23421338);
    expect(round(coords.lat, 8)).toBe(-1.26462574);
    expect(round(coords.radiusVector, 8)).toBe(4.61337387);
});

it('tests eclipticJ20002eclipticDate', () => {
    const lon = 149.48194;
    const lat = 1.76549;
    const radiusVector = 1;
    const t = -22.134716;

    const coords = eclipticJ20002eclipticDate(lon, lat, radiusVector, t);

    expect(round(coords.lon, 8)).toBe(118.70413153);
    expect(round(coords.lat, 8)).toBe(1.61533201);
    expect(round(coords.radiusVector, 8)).toBe(1);
});
