import {SolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import SolarEclipse from './SolarEclipse';

// 2019-07-02
const elements: BesselianElements = {
    t0Jde: 2458667.30842,
    t0Hours: 19,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [-0.215634, 0.56620872, 0.0000274, -0.00000879],
    y: [-0.65070802, 0.0106399, -0.0001272, -2.7e-7],
    d: [23.0129509, -0.003187, -0.000005],
    mu: [103.9797287, 14.99950981, 0],
    l1: [0.53763098, -0.0000898, -0.000012],
    l2: [-0.008464, -0.0000894, -0.000012],
    tanF1: 0.0045984,
    tanF2: 0.0045755,
};

const eclipse = SolarEclipse.createFromBesselianElements(elements);

it('tests getType', () => {
    const result = eclipse.getType();

    expect(result).toBe(SolarEclipseType.Total);
});

it('tests getLocationOfGreatestEclipse', () => {
    const {lat, lon} = eclipse.getLocationOfGreatestEclipse();

    expect(lat).toBeCloseTo(-17.388965, 6);
    expect(lon).toBeCloseTo(-108.998649, 6);
});

it('tests getTimeOfGreatestEclipse', () => {
    const result = eclipse.getTimeOfGreatestEclipse();
    const time = result.getTime();

    expect(time.year).toBe(2019);
    expect(time.month).toBe(7);
    expect(time.day).toBe(2);
    expect(time.hour).toBe(19);
    expect(time.min).toBe(22);
    expect(time.sec).toBe(58);
});

it('tests getMaxMagnitude', () => {
    const result = eclipse.getMaxMagnitude();

    expect(result).toBeCloseTo(1.022966, 6);
});

it('tests getMaxMoonSunRatio', () => {
    const result = eclipse.getMaxMoonSunRatio();

    expect(result).toBeCloseTo(1.045932, 6);
});

it('tests getMaxObscuration', () => {
    const result = eclipse.getMaxObscuration();

    expect(result).toBe(1);
});

it('tests getMaxDuration', () => {
    const result = eclipse.getMaxDuration();

    expect(result).toBeCloseTo(11847.3, 1);
});

it('tests getMaxCentralDuration', () => {
    const result = eclipse.getMaxCentralDuration();

    expect(result).toBeCloseTo(272.8, 1);
});
