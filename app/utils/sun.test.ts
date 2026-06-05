import {getApparentLongitude, getEquationOfCenter, getMeanAnomaly, getTrueAnomaly, getTrueLongitude} from './sun';

it('tests getMeanAnomaly', () => {
    const T = -0.127296372348;

    expect(getMeanAnomaly(T)).toBeCloseTo(94.980597, 6);
});

it('tests getTrueAnomaly', () => {
    const T = -0.072183436002738;

    expect(getTrueAnomaly(T)).toBeCloseTo(277.096642, 6);
});

it('tests getTrueLongitude', () => {
    const T = -0.072183436;

    expect(getTrueLongitude(T)).toBeCloseTo(199.90987, 6);
});

it('tests getApparentLongitude', () => {
    const T = -0.072183436;

    expect(getApparentLongitude(T)).toBeCloseTo(199.908939, 6);
});

it('tests getEquationOfCenter', () => {
    const T = -0.072183436002738;

    expect(getEquationOfCenter(T)).toBeCloseTo(-1.897324, 6);
});
