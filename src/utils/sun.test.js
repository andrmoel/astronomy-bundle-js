import {getApparentLongitude, getEquationOfCenter, getMeanAnomaly, getTrueAnomaly, getTrueLongitude} from './sun';
import {round} from './math';

it('tests getMeanAnomaly', () => {
    expect(round(getMeanAnomaly(-0.127296372348), 6)).toBe(94.980597);
});

it('tests getTrueAnomaly', () => {
    expect(round(getTrueAnomaly(-0.072183436002738), 6)).toBe(277.096642);
});

it('tests getTrueLongitude', () => {
    expect(round(getTrueLongitude(-0.072183436), 6)).toBe(199.90987);
});

it('tests getApparentLongitude', () => {
    expect(round(getApparentLongitude(-0.072183436), 6)).toBe(199.908939);
});

it('tests getEquationOfCenter', () => {
    expect(round(getEquationOfCenter(-0.072183436002738), 6)).toBe(-1.897324);
});
