import {getArgumentOfLatitude, getMeanAnomaly, getMeanElongation} from './moon';
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
