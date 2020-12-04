import {round} from './math';
import {getB, getDeltaU, getLongitudeOfAscendingNode, getRingInclination} from './saturnCalc';

const T = -0.070431193;

it('tests getRingInclination', () => {
    expect(round(getRingInclination(T), 6)).toBe(28.076131);
});

it('tests getLongitudeOfAscendingNode', () => {
    expect(round(getLongitudeOfAscendingNode(T), 6)).toBe(169.410243);
});

it('tests getB', () => {
    expect(round(getB(T), 6)).toBe(16.441846);
});

it('tests getDeltaU', () => {
    expect(round(getDeltaU(T), 6)).toBe(4.198275);
});
