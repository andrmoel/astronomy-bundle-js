import {round} from '../../utils/math';

import {populate, populateD} from './besselianElementsCalc';

describe('test for populate', () => {
    it('has t = 0', () => {
        const data = [-0.181824, 0.5633567, 0.0000216, -0.000009];

        expect(populate(data, 0)).toBe(-0.181824);
    });

    it('has t = 0.5', () => {
        const data = [-0.181824, 0.5633567, 0.0000216, -0.000009];

        expect(round(populate(data, 0.5), 6)).toBe(0.099859);
    });
});

describe('test for populateD', () => {
    it('has t = 0', () => {
        const data = [-0.181824, 0.5633567, 0.0000216, -0.000009];

        expect(populateD(data, 0)).toBe(0.5633567);
    });

    it('has t = 0.5', () => {
        const data = [-0.181824, 0.5633567, 0.0000216, -0.000009];

        expect(round(populateD(data, 0.5), 6)).toBe(0.563372);
    });
});
