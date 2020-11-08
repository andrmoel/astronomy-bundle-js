import {
    getArgumentOfLatitude,
    getDistanceToEarth,
    getEquatorialHorizontalParallax,
    getLatitude,
    getLongitude,
    getMeanAnomaly,
    getMeanElongation,
    getMeanLongitude,
    getRadiusVector,
} from './moonCalc';
import {round} from './math';

it('tests getMeanElongation', () => {
    const T = -0.077221081451;

    expect(round(getMeanElongation(T), 6)).toBe(113.842304);
});

it('tests getMeanAnomaly', () => {
    const T = -0.077221081451;

    expect(round(getMeanAnomaly(T), 6)).toBe(5.150833);
});

it('tests getArgumentOfLatitude', () => {
    const T = -0.077221081451;

    expect(round(getArgumentOfLatitude(T), 6)).toBe(219.889721);
});

it('tests getMeanLongitude', () => {
    const T = -0.077221081451;

    expect(round(getMeanLongitude(T), 6)).toBe(134.290182);
});

it('tests getEquatorialHorizontalParallax', () => {
    const T = -0.077221081451;

    expect(round(getEquatorialHorizontalParallax(T), 6)).toBe(0.991990);
});

it('tests getLongitude', () => {
    const T = -0.077221081451;

    expect(round(getLongitude(T), 6)).toBe(133.162655);
});

it('tests getLatitude', () => {
    const T = -0.077221081451;

    expect(round(getLatitude(T), 6)).toBe(-3.229126);
});

it('tests getRadiusVector', () => {
    const T = -0.077221081451;

    expect(round(getRadiusVector(T), 6)).toBe(0.002463);
});

it('tests getDistanceToEarth', () => {
    const T = -0.077221081451;

    expect(round(getDistanceToEarth(T), 1)).toBe(368409.7);
});
