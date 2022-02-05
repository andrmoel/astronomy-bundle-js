import {SolarEclipseType} from '../constants/solarEclipseTypes';
import {round} from '../../utils/math';
import {
    getEclipseType,
    getMagnitude,
    getMaximumEclipse,
    getMoonSunRatio,
    getObscuration,
    getTopocentricHorizontalCoordinates,
} from './observationalCircumstancesCalc';

// TSE 2020-12-14
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

const circumstancesNoEclipse = {
    t: -0.6157557359012282,
    h: -15.17919907,
    u: -0.27117343363648627,
    v: -0.7577231107198906,
    a: 0.31486969929335396,
    b: -0.11268536352471581,
    l1Derived: 0.5399940994544585,
    l2Derived: -0.006113658680568816,
    n2: 0.1118409186857845,
}

const circumstancesPartial = {
    t: 1.2555163742113822,
    h: 36.62239313,
    u: -0.024193949269768478,
    v: -0.31344968745463037,
    a: 0.36979881208723364,
    b: -0.028543310736849174,
    l1Derived: 0.5400101652811893,
    l2Derived: -0.006097661736670686,
    n2: 0.13756588200894948,
}

const circumstancesAnnular = {
    t: -1.024647932292263,
    h: 247.05746893876994,
    u: 0.0003771879709230097,
    v: -0.001470168001986627,
    a: 0.560161571759926,
    b: 0.14371568855535619,
    l1Derived: 0.5639161791727346,
    l2Derived: 0.0176895233963809,
    n2: 0.33443518561349084,
}

const circumstancesTotal = {
    t: 0.15055890323155477,
    h: -7.14963159,
    u: -0.0008852124445086068,
    v: -0.0033550231864724056,
    a: 0.36279652916104377,
    b: -0.09572273289195118,
    l1Derived: 0.5393443092306598,
    l2Derived: -0.006760247799288219,
    n2: 0.1407841631636039,
}

const location = {
    lat: -39.53940,
    lon: -70.37216,
    elevation: 450,
};

describe('tests for getEclipseType', () => {
    it('is not an eclipse', () => {
        expect(getEclipseType(circumstancesNoEclipse)).toBe(SolarEclipseType.None);
    });

    it('is a partial eclipse', () => {
        expect(getEclipseType(circumstancesPartial)).toBe(SolarEclipseType.Partial);
    });

    it('is an annular eclipse', () => {
        expect(getEclipseType(circumstancesAnnular)).toBe(SolarEclipseType.Annular);
    });

    it('is a total eclipse', () => {
        expect(getEclipseType(circumstancesTotal)).toBe(SolarEclipseType.Total);
    });
});

it('tests getMaximumEclipse', () => {
    const maxEclipse = getMaximumEclipse(circumstancesTotal);

    expect(round(maxEclipse, 5)).toBe(0.00347);
});

it('tests getMagnitude', () => {
    const maxEclipse = getMagnitude(circumstancesTotal);

    expect(round(maxEclipse, 5)).toBe(1.00618);
});

it('tests getMoonSunRatio', () => {
    const maxEclipse = getMoonSunRatio(circumstancesTotal);

    expect(round(maxEclipse, 5)).toBe(1.02539);
});

describe('tests getObscuration', () => {
    it('is not an eclipse', () => {
        const obscuration = getObscuration(circumstancesNoEclipse);

        expect(round(obscuration, 4)).toBe(0.0);
    });

    it('is a partial eclipse', () => {
        const obscuration = getObscuration(circumstancesPartial);

        expect(round(obscuration, 4)).toBe(0.31);
    });

    it('is an annular eclipse', () => {
        const obscuration = getObscuration(circumstancesAnnular);

        expect(round(obscuration, 4)).toBe(0.882);
    });

    it('is a total eclipse', () => {
        const obscuration = getObscuration(circumstancesTotal);

        expect(round(obscuration, 4)).toBe(1);
    });
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const result = getTopocentricHorizontalCoordinates(besselianElements, circumstancesTotal, location);

    expect(round(result.azimuth, 2)).toBe(22.52);
    expect(round(result.altitude, 2)).toBe(72.63);
});
