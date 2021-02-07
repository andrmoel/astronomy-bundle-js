import {EPOCH_J1950} from '../constants/epoch';
import {correctProperMotion} from './starCalc';
import {round} from './math';

describe('test for correctProperMotion', () => {
    const coords = {
        rightAscension: 41.04994167,
        declination: 49.2284667,
        radiusVector: 1,
    };

    const properMotion = {
        rightAscension: 0.000142708334,
        declination: -0.000024861111,
    };

    const jd = 2462088.69;

    it('uses default epoch J2000 as reference', () => {
        const result = correctProperMotion(
            coords,
            properMotion,
            jd,
        );

        expect(round(result.rightAscension, 6)).toBe(41.054061);
        expect(round(result.declination, 6)).toBe(49.227749);
        expect(result.radiusVector).toBe(1);
    });

    it('uses epoch J1950 as reference', () => {
        const result = correctProperMotion(
            coords,
            properMotion,
            jd,
            EPOCH_J1950,
        );

        expect(round(result.rightAscension, 6)).toBe(41.061197);
        expect(round(result.declination, 6)).toBe(49.226506);
        expect(result.radiusVector).toBe(1);
    });
});
