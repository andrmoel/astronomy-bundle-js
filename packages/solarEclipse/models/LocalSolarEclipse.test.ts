import Location from '@package/location/models/Location';
import {SolarEclipse} from '@package/solarEclipse';
import {LocalSolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';

// ASE 2016-09-01
const elements: BesselianElements = {
    t0Jde: 2457632.88058,
    t0Hours: 9,
    tMin: -3,
    tMax: 3,
    deltaT: 68.4,
    x: [-0.161396, 0.50406349, -0.0000214, -0.00000631],
    y: [-0.29965001, -0.1481521, -0.0000258, 0.00000178],
    d: [8.06330013, -0.014802, -0.000002],
    mu: [315.03155518, 15.00454044, 0],
    l1: [0.55792803, 0.0001115, -0.0000105],
    l2: [0.011731, 0.000111, -0.0000104],
    tanF1: 0.0046339,
    tanF2: 0.0046109,
};

// Reunion
const location = Location.create(-21.32947, 55.45174, 43);
const solarEclipse = SolarEclipse.createFromBesselianElements(elements);
const localSolarEclipse = solarEclipse.getLocalEclipse(location);

it('tests getType', () => {
    const result = localSolarEclipse.getType();

    expect(result).toBe(LocalSolarEclipseType.Annular);
});

it('tests getContactTaus', () => {
    const result = localSolarEclipse.getContactTaus();

    expect(result?.c1).toBeCloseTo(-0.587733, 6);
    expect(result?.c2).toBeCloseTo(1.161358, 6);
    expect(result?.max).toBeCloseTo(1.185232, 6);
    expect(result?.c3).toBeCloseTo(1.209146, 6);
    expect(result?.c4).toBeCloseTo(2.730092, 6);
});

it('tests getContactTimes', () => {
    const result = localSolarEclipse.getContactTimes();

    expect(result?.c1.getTime()).toEqual({year: 2016, month: 9, day: 1, hour: 8, min: 23, sec: 35});
    expect(result?.c2?.getTime()).toEqual({year: 2016, month: 9, day: 1, hour: 10, min: 8, sec: 32});
    expect(result?.max.getTime()).toEqual({year: 2016, month: 9, day: 1, hour: 10, min: 9, sec: 58});
    expect(result?.c3?.getTime()).toEqual({year: 2016, month: 9, day: 1, hour: 10, min: 11, sec: 24});
    expect(result?.c4.getTime()).toEqual({year: 2016, month: 9, day: 1, hour: 11, min: 42, sec: 39});
});

it('tests getMaxMagnitude', () => {
    const result = localSolarEclipse.getMaxMagnitude();

    expect(result).toBeCloseTo(0.980731, 6);
});

it('tests getMaxMoonSunRatio', () => {
    const result = localSolarEclipse.getMaxMoonSunRatio();

    expect(result).toBeCloseTo(0.970421, 6);
});

it('tests getMaxObscuration', () => {
    const result = localSolarEclipse.getMaxObscuration();

    expect(result).toBeCloseTo(0.941717, 6);
});

it('tests getDuration', () => {
    const result = localSolarEclipse.getDuration();

    expect(result).toBeCloseTo(11944.2, 1);
});

it('tests getCentralDuration', () => {
    const result = localSolarEclipse.getCentralDuration();

    expect(result).toBeCloseTo(172.0, 1);
});
