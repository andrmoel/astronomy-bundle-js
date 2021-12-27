import {createLocation} from '../earth';
import LocalCircumstances from './LocalCircumstances';
import ObservationalCircumstances from './ObservationalCircumstances';

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

const location = createLocation(-39.53940, -70.37216, 450);

const localCircumstances = new LocalCircumstances(besselianElements, location);

it('tests getObservationalCircumstancesForC1', () => {
    const obsCircumstances = localCircumstances.getObservationalCircumstancesForC1();

    expect(obsCircumstances).toBeInstanceOf(ObservationalCircumstances);
});

it('tests getObservationalCircumstancesForC2', () => {
    const obsCircumstances = localCircumstances.getObservationalCircumstancesForC2();

    expect(obsCircumstances).toBeInstanceOf(ObservationalCircumstances);
});

it('tests getObservationalCircumstancesForMaxEclipse', () => {
    const obsCircumstances = localCircumstances.getObservationalCircumstancesForMaxEclipse();

    expect(obsCircumstances).toBeInstanceOf(ObservationalCircumstances);
});

it('tests getObservationalCircumstancesForC3', () => {
    const obsCircumstances = localCircumstances.getObservationalCircumstancesForC3();

    expect(obsCircumstances).toBeInstanceOf(ObservationalCircumstances);
});

it('tests getObservationalCircumstancesForC4', () => {
    const obsCircumstances = localCircumstances.getObservationalCircumstancesForC4();

    expect(obsCircumstances).toBeInstanceOf(ObservationalCircumstances);
});
