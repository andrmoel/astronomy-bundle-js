import {
    getApparentDeclination,
    getApparentLongitude,
    getApparentRightAscension,
    getDistanceToEarth,
    getEquationOfCenter,
    getMeanAnomaly,
    getRadiusVector,
    getTrueAnomaly,
    getTrueLongitude,
} from './sunCalc';
import {round} from './math';

it('tests getMeanAnomaly', () => {
    const T = -0.127296372348;

    expect(round(getMeanAnomaly(T), 6)).toBe(94.980597);
});

it('tests getTrueAnomaly', () => {
    const T = -0.072183436002738;

    expect(round(getTrueAnomaly(T), 6)).toBe(277.096642);
});

it('tests getTrueLongitude', () => {
    const T = -0.072183436;

    expect(round(getTrueLongitude(T), 6)).toBe(199.90987);
});

it('tests getApparentLongitude', () => {
    const T = -0.072183436;

    expect(round(getApparentLongitude(T), 6)).toBe(199.908939);
});

it('tests getEquationOfCenter', () => {
    const T = -0.072183436002738;

    expect(round(getEquationOfCenter(T), 6)).toBe(-1.897324);
});

it('tests getRadiusVector', () => {
    const T = -0.072183436002738;

    expect(round(getRadiusVector(T), 6)).toBe(0.997662);
});

it('tests getDistanceToEarth', () => {
    const T = -0.072183436002738;

    expect(round(getDistanceToEarth(T), 6)).toBe(149248103.436694);
});

it('tests getApparentRightAscension', () => {
    const T = -0.072183436002738;

    expect(round(getApparentRightAscension(T), 6)).toBe(198.380822);
});

it('tests getApparentDeclination', () => {
    const T = -0.072183436002738;

    expect(round(getApparentDeclination(T), 6)).toBe(-7.785069);
});
