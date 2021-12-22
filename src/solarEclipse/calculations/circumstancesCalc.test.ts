import {round} from '../../utils/math';
import {TimeLocationCircumstances} from '../types/circumstancesTypes';
import {SolarEclipseType} from '../constants/solarEclipseTypes';
import {
    circumstancesToJulianDay,
    getObservationalCircumstances,
    getTimeCircumstances,
    getTimeLocationCircumstances,
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

const circumstances: TimeLocationCircumstances = {
    t: 0,
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
    const {t, u, v, a, b, l1Derived, l2Derived, n2} = getTimeLocationCircumstances(besselianElements, location, 0);

    expect(round(t, 6)).toBe(0);
    expect(round(u, 6)).toBe(-0.055589);
    expect(round(v, 6)).toBe(0.011296);
    expect(round(a, 6)).toBe(0.363938);
    expect(round(b, 6)).toBe(-0.098892);
    expect(round(l1Derived, 6)).toBe(0.539349);
    expect(round(l2Derived, 6)).toBe(-0.006755);
    expect(round(n2, 6)).toBe(0.14223);
});

describe('tests for getObservationalCircumstances', () => {
    it('has a no eclipse', () => {
        const circumstances = {
            t: -0.6157557359012282,
            u: -0.27117343363648627,
            v: -0.7577231107198906,
            a: 0.31486969929335396,
            b: -0.11268536352471581,
            l1Derived: 0.5399940994544585,
            l2Derived: -0.006113658680568816,
            n2: 0.1118409186857845,
        }

        const {eclipseType} = getObservationalCircumstances(circumstances);

        expect(eclipseType).toBe(SolarEclipseType.none);
    });

    it('has a partial eclipse', () => {
        const circumstances = {
            t: 1.2555163742113822,
            u: -0.024193949269768478,
            v: -0.31344968745463037,
            a: 0.36979881208723364,
            b: -0.028543310736849174,
            l1Derived: 0.5400101652811893,
            l2Derived: -0.006097661736670686,
            n2: 0.13756588200894948,
        }

        const {eclipseType, maximumEclipse, magnitude, moonSunRatio} = getObservationalCircumstances(circumstances);

        expect(eclipseType).toBe(SolarEclipseType.partial);
        expect(round(maximumEclipse, 5)).toBe(0.31438);
        expect(round(magnitude, 5)).toBe(0.42259);
        expect(round(moonSunRatio, 5)).toBe(1.02284);
    });

    it('has a total eclipse', () => {
        const circumstances = {
            t: 0.15055890323155477,
            u: -0.0008852124445086068,
            v: -0.0033550231864724056,
            a: 0.36279652916104377,
            b: -0.09572273289195118,
            l1Derived: 0.5393443092306598,
            l2Derived: -0.006760247799288219,
            n2: 0.1407841631636039,
        }

        const {eclipseType, maximumEclipse, magnitude, moonSunRatio} = getObservationalCircumstances(circumstances);

        expect(eclipseType).toBe(SolarEclipseType.total);
        expect(round(maximumEclipse, 5)).toBe(0.00347);
        expect(round(magnitude, 5)).toBe(1.00618);
        expect(round(moonSunRatio, 5)).toBe(1.02539);
    });

    it('has an annular eclipse', () => {
        const circumstances = {
            t: -1.024647932292263,
            u: 0.0003771879709230097,
            v: -0.001470168001986627,
            a: 0.560161571759926,
            b: 0.14371568855535619,
            l1Derived: 0.5639161791727346,
            l2Derived: 0.0176895233963809,
            n2: 0.33443518561349084,
        }

        const {eclipseType, maximumEclipse, magnitude, moonSunRatio} = getObservationalCircumstances(circumstances);

        expect(eclipseType).toBe(SolarEclipseType.annular);
        expect(round(maximumEclipse, 5)).toBe(0.00152);
        expect(round(magnitude, 5)).toBe(0.96698);
        expect(round(moonSunRatio, 5)).toBe(0.93917);
    });
});

it('tests circumstancesToJulianDay', () => {
    const jd = circumstancesToJulianDay(besselianElements, circumstances);

    expect(round(jd, 6)).toBe(2459198.165833);
});
