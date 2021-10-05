import {round} from '../../utils/math';
import {
    circumstancesToJulianDay,
    getTimeDependentCircumstances,
    getTimeLocalDependentCircumstances,
    iterateCircumstancesMaximumEclipse,
} from './circumstancesCalc';

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

    const {x, dX, y, dY, d, dD, mu, dMu, l1, dL1, l2, dL2} = getTimeDependentCircumstances(besselianElements, t);

    expect(round(x, 6)).toBe(0.099859);
    expect(round(dX, 6)).toBe(0.563372);
    expect(round(y, 6)).toBe(-0.312504);
    expect(round(dY, 6)).toBe(-0.085623);
    expect(round(d, 6)).toBe(-23.258751);
    expect(round(dD, 6)).toBe(-0.00198);
    expect(round(mu, 6)).toBe(68.764161);
    expect(round(dMu, 6)).toBe(14.9965);
    expect(round(l1, 6)).toBe(0.543907);
    expect(round(dL1, 6)).toBe(0.000084);
    expect(round(l2, 6)).toBe(-0.00222);
    expect(round(dL2, 6)).toBe(0.000084);
});

it('tests getTimeLocalDependentCircumstances', () => {
    const t = 0;

    const {tMax, t0, dT, u, v, a, b, n2} = getTimeLocalDependentCircumstances(besselianElements, location, t);

    expect(round(tMax, 6)).toBe(2459198.177);
    expect(round(t0, 6)).toBe(16);
    expect(round(dT, 6)).toBe(72.1);
    expect(round(t, 6)).toBe(0);
    expect(round(u, 6)).toBe(-0.055589);
    expect(round(v, 6)).toBe(0.011296);
    expect(round(a, 6)).toBe(0.363938);
    expect(round(b, 6)).toBe(-0.098892);
    expect(round(n2, 6)).toBe(0.14223);
});

it('tests iterateCircumstancesMaximumEclipse', () => {
    const {tMax, t0, dT, t, u, v, a, b, n2} = iterateCircumstancesMaximumEclipse(besselianElements, location);

    expect(round(tMax, 6)).toBe(2459198.177);
    expect(round(t0, 6)).toBe(16);
    expect(round(dT, 6)).toBe(72.1);
    expect(round(t, 8)).toBe(0.1505589);
    expect(round(u, 6)).toBe(-0.000885);
    expect(round(v, 6)).toBe(-0.003355);
    expect(round(a, 6)).toBe(0.362797);
    expect(round(b, 6)).toBe(-0.095723);
    expect(round(n2, 6)).toBe(0.140784);
});

it('tests circumstancesToJulianDay', () => {
    const circumstances = {
        tMax: 2459198.177,
        t0: 16,
        dT: 72.1,
        t: 0.1505589,
        u: -0.000885,
        v: -0.003355,
        a: 0.362797,
        b: -0.095723,
        n2: 0.14078416,
    };

    const jd = circumstancesToJulianDay(circumstances);

    expect(round(jd, 6)).toBe(2459198.172106);
});
