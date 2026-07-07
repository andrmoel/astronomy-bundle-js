import {SolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import SolarEclipse from './SolarEclipse';

function isValidContour(contour: Array<{lat: number; lon: number}>): boolean {
    return (
        contour.length >= 3
        && contour.every(({lat, lon}) => Number.isFinite(lon) && Number.isFinite(lat) && lat >= -90 && lat <= 90)
    );
}

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
    expect(lon).toBeCloseTo(-108.999081, 6);
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

describe('getCenterLine', () => {
    it('returns the central line with default 10 sec steps', () => {
        const result = eclipse.getCentralLine();

        expect(result).toHaveLength(968);
    });

    it('returns the central line with custom 1 sec steps', () => {
        const result = eclipse.getCentralLine(1);

        expect(result).toHaveLength(9677);
    });
});

describe('getUmbraPath', () => {
    it('returns valid umbral region contours with the default step', () => {
        const result = eclipse.getUmbraPath();

        expect(result).toHaveLength(1964);
        expect(result.every(isValidContour)).toBe(true);
    });

    it('returns fewer contours with a coarser step', () => {
        const result = eclipse.getUmbraPath({stepsInSeconds: 30});

        expect(result).toHaveLength(327);
    });

    it('reaches further with refraction than with the geometric horizon', () => {
        const latSpan = (contours: Array<Array<{lat: number; lon: number}>>): number => {
            let min = Number.POSITIVE_INFINITY;
            let max = Number.NEGATIVE_INFINITY;
            for (const {lat} of contours.flat()) {
                min = Math.min(min, lat);
                max = Math.max(max, lat);
            }

            return max - min;
        };

        expect(latSpan(eclipse.getUmbraPath({refraction: true}))).toBeGreaterThan(latSpan(eclipse.getUmbraPath()));
    });
});

describe('getPenumbraPath', () => {
    it('returns valid penumbral region contours with the default step', () => {
        const result = eclipse.getPenumbraPath();

        expect(result).toHaveLength(295);
        expect(result.every(isValidContour)).toBe(true);
    });

    it('returns more contours with a finer step', () => {
        const result = eclipse.getPenumbraPath({stepsInSeconds: 30});

        expect(result).toHaveLength(591);
    });
});
