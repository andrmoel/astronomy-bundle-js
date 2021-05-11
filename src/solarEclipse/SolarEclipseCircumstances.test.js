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

const solarEclipseCircumstances = new SolarEclipseCircumstances(circumstances);

it('tests getTimeOfInterest', () => {
    const toi = solarEclipseCircumstances.getTimeOfInterest();

    expect(toi.time).toEqual({year: 2020, month: 12, day: 14, hour: 16, min: 7, sec: 49});
});
