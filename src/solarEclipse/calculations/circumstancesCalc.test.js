import {round} from '../../utils/math';
import {getTimeDependentCircumstances, getTimeLocalDependentCircumstances} from './circumstancesCalc';

const besselianElements = {
    tMax: 2459198.177,
    t0: 16,
    dT: 72.1,
    x: [-0.181824, 0.5633567, 0.0000216, -0.000009],
    y: [-0.269645, -0.0858122, 0.0001884, 0.0000015],
    d: [-23.2577591, -0.001986, 0.000006, 0],
    l1: [0.543862, 0.000097, -0.0000126, 0],
    l2: [-0.002265, 0.0000965, -0.0000125, 0],
    mu: [61.265911, 14.9965, 0, 0],
    tanF1: 0.0047502,
    tanF2: 0.0047266,
    latGreatestEclipse: -40.3,
    lonGreatestEclipse: -67.9,
};

const location = {
    lat: -39.53940,
    lon: -70.37216,
    elevation: 450,
}

it('tests getTimeDependentCircumstances', () => {
    const t = 0.5;

    const circumstances = getTimeDependentCircumstances(besselianElements, t);

    expect(circumstances).toEqual({
        x: 0.099858625,
        dX: 0.5633715499999999,
        y: -0.3125038125,
        dY: -0.085622675,
        d: -23.258750600000003,
        dD: -0.00198,
        mu: 68.764161,
        dMu: 14.9965,
        l1: 0.54390735,
        dL1: 0.0000844,
        l2: -0.002219875,
        dL2: 0.000084,
    });
});

it('tests getTimeLocalDependentCircumstances', () => {
    const t = 0;

    const {u, v, a, b} = getTimeLocalDependentCircumstances(besselianElements, location, t);

    expect(round(u, 6)).toBe(-0.055589);
    expect(round(v, 6)).toBe(0.011296);
    expect(round(a, 6)).toBe(0.363938);
    expect(round(b, 6)).toBe(-0.098892);
});
