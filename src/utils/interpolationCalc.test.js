import {getRightAscensionInterpolationArray, tabularInterpolation3, tabularInterpolation5} from './interpolationCalc';
import {round} from './math';
import Moon from '../moon/Moon';

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

describe('test for getRightAscensionInterpolationArray', () => {
    it('tests getRightAscensionInterpolationArray', async () => {
        const jd0 = 2459193.5;

        const result = await getRightAscensionInterpolationArray(Moon, jd0, 2);

        expect(result).toEqual([
            169.20451880199832,
            182.05644388267154,
            194.98092065202152,
            208.22538027297074,
            222.02840557282443,
        ]);
    });

    it('crosses 360° positive', async () => {
        const jd0 = 2459205.5;

        const result = await getRightAscensionInterpolationArray(Moon, jd0, 2);

        expect(result).toEqual([
            339.74445062990964,
            351.53298310963294,
            362.737037337235,
            373.60774485669054,
            384.3924109361075,
        ]);
    });
});
