import {SolarEclipseType} from '../constants/solarEclipseTypes';
import {round} from '../../utils/math';
import {
    getEclipseType,
    getMagnitude,
    getMaximumEclipse,
    getMoonSunRatio,
} from './observationalCircumstancesCalc';

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

it('tests getMaximumEclipse', () => {
    const maxEclipse = getMaximumEclipse(circumstances);

    expect(round(maxEclipse, 5)).toBe(0.00347);
});

it('tests getMagnitude', () => {
    const maxEclipse = getMagnitude(circumstances);

    expect(round(maxEclipse, 5)).toBe(1.00618);
});

it('tests getMoonSunRatio', () => {
    const maxEclipse = getMoonSunRatio(circumstances);

    expect(round(maxEclipse, 5)).toBe(1.02539);
});

describe('tests for getEclipseType', () => {
    it('is not an eclipse', () => {
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

        expect(getEclipseType(circumstances)).toBe(SolarEclipseType.none);
    });

    it('is a partial eclipse', () => {
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

        expect(getEclipseType(circumstances)).toBe(SolarEclipseType.partial);
    });

    it('is a total eclipse', () => {
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

        expect(getEclipseType(circumstances)).toBe(SolarEclipseType.total);
    });

    it('is an annular eclipse', () => {
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

        expect(getEclipseType(circumstances)).toBe(SolarEclipseType.annular);
    });
});
