import {rectangular2spherical, spherical2rectangular} from './coordinateCalc';
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
