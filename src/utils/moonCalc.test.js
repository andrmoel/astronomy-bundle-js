import {
    getArgumentOfLatitude,
    getDistanceToEarth,
    getEquatorialHorizontalParallax,
    getLatitude,
    getLongitude,
    getMeanAnomaly,
    getMeanElongation,
    getMeanLongitude,
    getMeanLongitudeOfAscendingNode,
    getOpticalLiberationInLatitude,
    getOpticalLiberationInLongitude,
    getRadiusVector,
} from './moonCalc';
import {round} from './math';

const T = -0.077221081451;

it('tests getMeanElongation', () => {
    expect(round(getMeanElongation(T), 6)).toBe(113.842304);
});

it('tests getMeanAnomaly', () => {
    expect(round(getMeanAnomaly(T), 6)).toBe(5.150833);
});

it('tests getArgumentOfLatitude', () => {
    expect(round(getArgumentOfLatitude(T), 6)).toBe(219.889721);
});

it('tests getMeanLongitude', () => {
    expect(round(getMeanLongitude(T), 6)).toBe(134.290182);
});

it('tests getMeanLongitudeOfAscendingNode', () => {
    expect(round(getMeanLongitudeOfAscendingNode(T), 6)).toBe(274.400656);
});

it('tests getEquatorialHorizontalParallax', () => {
    expect(round(getEquatorialHorizontalParallax(T), 6)).toBe(0.991990);
});

it('tests getLongitude', () => {
    expect(round(getLongitude(T), 6)).toBe(133.162655);
});

it('tests getLatitude', () => {
    expect(round(getLatitude(T), 6)).toBe(-3.229126);
});

it('tests getRadiusVector', () => {
    expect(round(getRadiusVector(T), 6)).toBe(0.002463);
});

it('tests getDistanceToEarth', () => {
    expect(round(getDistanceToEarth(T), 1)).toBe(368409.7);
});

it('tests getOpticalLiberationInLongitude', () => {
    const lon = 133.167265;
    const lat = -3.229126;

    expect(round(getOpticalLiberationInLongitude(lon, lat, T), 6)).toBe(-1.205789);
});

it('tests getOpticalLiberationInLatitude', () => {
    const lon = 133.167265;
    const lat = -3.229126;

    expect(round(getOpticalLiberationInLatitude(lon, lat, T), 6)).toBe(4.194031);
});
