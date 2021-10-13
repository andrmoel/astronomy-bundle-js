import {round} from '../../utils/math';
import {getLongitudeOfAscendingNode, getRingInclination} from './saturnCalc';

const T = -0.070431193;

it('tests getRingInclination', () => {
    expect(round(getRingInclination(T), 6)).toBe(28.076131);
});

it('tests getLongitudeOfAscendingNode', () => {
    expect(round(getLongitudeOfAscendingNode(T), 6)).toBe(169.410243);
});
