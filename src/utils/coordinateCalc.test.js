import {
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
