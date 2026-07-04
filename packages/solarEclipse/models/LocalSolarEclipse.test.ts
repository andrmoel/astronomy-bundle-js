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

// ASE 2013-05-10
const elements2013: BesselianElements = {
    t0Jde: 2456422.51829,
    t0Hours: 0,
    tMin: -3,
    tMax: 3,
    deltaT: 67.1,
    x: [-0.17518, 0.50528872, 0.0000144, -0.00000591],
    y: [-0.30430099, 0.0888899, -0.0000959, -9.7e-7],
    d: [17.60548019, 0.010701, -0.000004],
    mu: [180.9034729, 15.00166035, 0],
    l1: [0.56367201, 0.0000788, -0.00001],
    l2: [0.017447, 0.0000784, -0.00001],
    tanF1: 0.0046313,
    tanF2: 0.0046082,
};

const elements2026 = {
    t0Jde: 2468382.4629999995,
    t0Hours: 23,
    tMin: -4,
    tMax: 4,
    deltaT: 89.5,
    x: [-0.19963200390338898, 0.4641093863679644, -0.00003710135196996979, -0.000005200045655662309],
    y: [0.32384899258613586, 0.20130375470367962, 0.00007380313670197668, -0.000002399943601828912],
    d: [-15.647270202636719, 0.012328077739212543, 0.000004000064088918797],
    mu: [161.5113525390625, 15.000450064850844, 0],
    l1: [0.5733615261821894, 0.00004559916135263931, -0.000009999999999999999],
    l2: [0.0270879848628193, 0.00004539773949745247, -0.000009900021362956633],
    tanF1: 0.004743198290989548,
    tanF2: 0.0047195002670328825,
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

describe('visibility above the horizon', () => {
    it('reports only the above-horizon eclipse for an observer whose eclipse begins at sunrise', () => {
        // Perth
        const location = Location.create(-31.9523, 115.8613, 15);
        const localEclipse = SolarEclipse.createFromBesselianElements(elements2013).getLocalEclipse(location);
        const contactTimes = localEclipse.getContactTimes();

        expect(localEclipse.getType()).toBe(LocalSolarEclipseType.Partial);
        expect(localEclipse.getDuration()).toBeCloseTo(3057.94, 2);
        expect(contactTimes?.c1.getTime()).toEqual({year: 2013, month: 5, day: 9, hour: 21, min: 33, sec: 38});
        expect(contactTimes?.sunrise?.getTime()).toEqual({year: 2013, month: 5, day: 9, hour: 22, min: 54, sec: 4});
        expect(contactTimes?.sunset).toBeNull();
    });

    it('throws for an eclipse that stays below the horizon', () => {
        // Burgos, Spain
        const location = Location.create(42.350466, -3.689354);
        const eclipse = SolarEclipse.createFromBesselianElements(elements2026);

        expect(() => eclipse.getLocalEclipse(location)).toThrow('No solar eclipse visible at this location');
    });
});
