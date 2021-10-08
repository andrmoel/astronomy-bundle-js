import createSolarEclipseCircumstances from './createSolarEclipseCircumstances';
import SolarEclipseCircumstances from './SolarEclipseCircumstances';

const circumstances = {
    tMax: 2459198.177,
    t0: 16,
    dT: 72.1,
    t: 0.15055890,
    u: -0.00088521,
    v: -0.00335502,
    a: 0.36279653,
    b: -0.09572273,
    n2: 0.14078416,
}

it('tests createSolarEclipseCircumstances', () => {
    const solarEclipseCircumstances = createSolarEclipseCircumstances(circumstances);

    expect(solarEclipseCircumstances).toBeInstanceOf(SolarEclipseCircumstances);
});
