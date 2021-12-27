import {round} from '../utils/math';
import ObservationalCircumstances from './ObservationalCircumstances';
import {SolarEclipseType} from './constants/solarEclipseTypes';

const circumstances = {
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

const obsCircumstances = new ObservationalCircumstances(circumstances);

it('tests getEclipseType', () => {
    const eclipseType = obsCircumstances.getEclipseType();

    expect(eclipseType).toBe(SolarEclipseType.total);
});

it('tests getMagnitude', () => {
    const magnitude = obsCircumstances.getMagnitude();

    expect(round(magnitude, 5)).toBe(1.00618);
});

it('tests getMoonSunRatio', () => {
    const moonSunRatio = obsCircumstances.getMoonSunRatio();

    expect(round(moonSunRatio, 5)).toBe(1.02539);
});

it('tests getObscuration', () => {
    const moonSunRatio = obsCircumstances.getObscuration();

    expect(round(moonSunRatio, 5)).toBe(1);
});
