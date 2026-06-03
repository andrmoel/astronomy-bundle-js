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
} from './moon';

const T = -0.077221081451;

it('tests getMeanElongation', () => {
    expect(getMeanElongation(T)).toBeCloseTo(113.842304);
});

it('tests getMeanAnomaly', () => {
    expect(getMeanAnomaly(T)).toBeCloseTo(5.150833);
});

it('tests getArgumentOfLatitude', () => {
    expect(getArgumentOfLatitude(T)).toBeCloseTo(219.889721);
});

it('tests getMeanLongitude', () => {
    expect(getMeanLongitude(T)).toBeCloseTo(134.290182);
});

it('tests getMeanLongitudeOfAscendingNode', () => {
    expect(getMeanLongitudeOfAscendingNode(T)).toBeCloseTo(274.400656);
});

it('tests getEquatorialHorizontalParallax', () => {
    expect(getEquatorialHorizontalParallax(T)).toBeCloseTo(0.991990);
});

it('tests getLongitude', () => {
    expect(getLongitude(T)).toBeCloseTo(133.162655);
});

it('tests getLatitude', () => {
    expect(getLatitude(T)).toBeCloseTo(-3.229126);
});

it('tests getRadiusVector', () => {
    expect(getRadiusVector(T)).toBeCloseTo(0.002463);
});

it('tests getDistanceToEarth', () => {
    expect(getDistanceToEarth(T)).toBeCloseTo(368409.68);
});

it('tests getOpticalLiberationInLongitude', () => {
    const lon = 133.167265;
    const lat = -3.229126;

    expect(getOpticalLiberationInLongitude(lon, lat, T)).toBeCloseTo(-1.205789);
});

it('tests getOpticalLiberationInLatitude', () => {
    const lon = 133.167265;
    const lat = -3.229126;

    expect(getOpticalLiberationInLatitude(lon, lat, T)).toBeCloseTo(4.194031);
});
