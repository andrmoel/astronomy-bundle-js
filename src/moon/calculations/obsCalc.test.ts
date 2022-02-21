import {round} from '../../utils/math';

import {getQuantities} from './obsCalc';

it('tests getQuantities', () => {
    const T = -0.07722108145106092;

    const {rho, sigma, tau} = getQuantities(T);

    expect(round(rho, 5)).toBe(-0.01042);
    expect(round(sigma, 5)).toBe(-0.01574);
    expect(round(tau, 5)).toBe(0.02673);
});
