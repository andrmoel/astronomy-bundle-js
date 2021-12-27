import {round} from '../../utils/math';
import {TimeLocationCircumstances} from '../types/circumstancesTypes';
import {circumstancesToJulianDay, getTimeCircumstances, getTimeLocationCircumstances} from './circumstancesCalc';

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

const circumstances: TimeLocationCircumstances = {
    t: 0,
    h: -9.407488,
    u: -0.0555894700932891,
    v: 0.011295675571670327,
    a: 0.3639375042180445,
    b: -0.09889174084574227,
    l1Derived: 0.53934912025566,
    l2Derived: -0.0067554588016498825,
    n2: 0.14223008338396062,
}

it('tests getTimeCircumstances', () => {
    const t = 0.5;

    const {x, dX, y, dY, d, dD, mu, dMu, l1, dL1, l2, dL2} = getTimeCircumstances(besselianElements, t);

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

it('tests getTimeLocationCircumstances', () => {
    const {t, h, u, v, a, b, l1Derived, l2Derived, n2} = getTimeLocationCircumstances(besselianElements, location, 0);

    expect(round(t, 6)).toBe(0);
    expect(round(h, 6)).toBe(-9.407488);
    expect(round(u, 6)).toBe(-0.055589);
    expect(round(v, 6)).toBe(0.011296);
    expect(round(a, 6)).toBe(0.363938);
    expect(round(b, 6)).toBe(-0.098892);
    expect(round(l1Derived, 6)).toBe(0.539349);
    expect(round(l2Derived, 6)).toBe(-0.006755);
    expect(round(n2, 6)).toBe(0.14223);
});

it('tests circumstancesToJulianDay', () => {
    const jd = circumstancesToJulianDay(besselianElements, circumstances);

    expect(round(jd, 6)).toBe(2459198.165833);
});
