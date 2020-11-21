import {
    earthEclipticSpherical2sunEclipticSpherical,
    eclipticJ20002eclipticDate,
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2eclipticSpherical,
    equatorialSpherical2topocentricHorizontal,
    equatorialSpherical2topocentricSpherical,
    getEquatorialParallax,
    rectangular2spherical,
    rectangularGeocentric2rectangularHeliocentric,
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

it('tests equatorialSpherical2topocentricSpherical', () => {
    const rightAscension = 339.530208;
    const declination = -15.771083;
    const radiusVector = 0.37276;
    const lat = 33.356111;
    const lon = -116.8625;
    const elevation = 1705;
    const T = 0.03654036428626374;

    const coords = equatorialSpherical2topocentricSpherical(
        rightAscension,
        declination,
        radiusVector,
        lat,
        lon,
        elevation,
        T,
    );

    expect(round(coords.rightAscension, 6)).toBe(339.5356);
    expect(round(coords.declination, 6)).toBe(-15.775012);
    expect(round(coords.radiusVector, 6)).toBe(0.372755);
});

it('tests equatorialSpherical2topocentricHorizontal', () => {
    const T = -0.12727429842573834;
    const rightAscension = 347.3193375;
    const declination = -6.71989167;
    const radiusVector = 0.37276;
    const lat = 38.921417;
    const lon = -77.065415;
    const elevation = 100;

    const coords = equatorialSpherical2topocentricHorizontal(
        rightAscension,
        declination,
        radiusVector,
        lat,
        lon,
        elevation,
        T,
    );

    expect(round(coords.azimuth, 6)).toBe(68.033688);
    expect(round(coords.altitude, 6)).toBe(15.124862);
    expect(round(coords.radiusVector, 6)).toBe(0.372749);
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

    const {x, y, z} = rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);

    expect(x).toBe(2);
    expect(y).toBe(1.5);
    expect(z).toBe(1.7);
});

it('tests rectangularGeocentric2rectangularHeliocentric', () => {
    const coordsPlanet = {x: 2.0, y: 1.5, z: 1.7};
    const coordsEarth = {x: -1.0, y: 0.5, z: 1.3};

    const {x, y, z} = rectangularGeocentric2rectangularHeliocentric(coordsPlanet, coordsEarth);

    expect(x).toBe(1);
    expect(y).toBe(2);
    expect(z).toBe(3);
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

it('tests getEquatorialParallax', () => {
    const pi = getEquatorialParallax(0.37276);

    expect(round(pi, 6)).toBe(0.006553);
});
