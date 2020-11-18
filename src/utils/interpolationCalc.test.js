import {tabularInterpolation3, tabularInterpolation5} from './interpolationCalc';
import {round} from './math';

it('tests tabularInterpolation3', () => {
    const values = [1, 3, 7];

    const n = tabularInterpolation3(values, 0.7);

    expect(round(n, 6)).toBe(5.59);
});

it('tests tabularInterpolation5', () => {
    const values = [
        -177.050,
        -92.068,
        -16.527,
        49.044,
        104.161,
    ];

    const n = tabularInterpolation5(values);

    expect(round(n, 6)).toBe(0.237973);
});
