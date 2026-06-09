import {DEG} from '@app/constants/math';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime, parseBesselianElements, tau2julianDay} from '../utils/besselianElements';

// 28-element raw Besselian data for the 2017-08-21 total solar eclipse.
const rawElements: Array<number> = [
    2457987.27083, 18.5, -2.0, 2.0, 69.1, 0.0, 0.025209, 0.56830281, 0.0000391, -0.00000965, -0.98365301, -0.13151421,
    0.0002213, 0.0000024, -22.27471924, -0.005178, 0.000006, 302.45217896, 14.99728012, 0.0, 0.53780502, -0.000016,
    -0.0000131, -0.008292, -0.000016, -0.0000131, 0.0046, 0.0046,
];

describe('getBesselianElementsAtTime', () => {
    const elements = parseBesselianElements(rawElements);

    it('at tau=0 returns the constant term of each polynomial', () => {
        const result = getBesselianElementsAtTime(elements, 0);

        expect(result.x).toBeCloseTo(0.025209, 7);
        expect(result.y).toBeCloseTo(-0.98365301, 7);
        expect(result.l1).toBeCloseTo(0.53780502, 7);
        expect(result.l2).toBeCloseTo(-0.008292, 7);
    });

    it('at tau=0 converts d and mu from degrees to radians', () => {
        const result = getBesselianElementsAtTime(elements, 0);

        expect(result.d).toBeCloseTo(-22.27471924 * DEG, 10);
        expect(result.mu).toBeCloseTo(302.45217896 * DEG, 10);
    });

    it('at tau=0 computes sinD and cosD from d', () => {
        const result = getBesselianElementsAtTime(elements, 0);

        expect(result.sinD).toBeCloseTo(Math.sin(result.d), 10);
        expect(result.cosD).toBeCloseTo(Math.cos(result.d), 10);
    });

    it('at tau=1 evaluates the full polynomial', () => {
        const result = getBesselianElementsAtTime(elements, 1);

        expect(result.x).toBeCloseTo(0.59354126, 7);
        expect(result.y).toBeCloseTo(-1.11494352, 7);
        expect(result.l1).toBeCloseTo(0.53777592, 7);
        expect(result.l2).toBeCloseTo(-0.0083211, 7);
    });

    it('at tau=1 converts d and mu correctly', () => {
        const result = getBesselianElementsAtTime(elements, 1);

        expect(result.d).toBeCloseTo(-22.27989124 * DEG, 10);
        expect(result.mu).toBeCloseTo(317.44945908 * DEG, 10);
    });

    it('sinD and cosD are always consistent with d', () => {
        const tau = 1.5;
        const result = getBesselianElementsAtTime(elements, tau);

        expect(result.sinD).toBeCloseTo(Math.sin(result.d), 10);
        expect(result.cosD).toBeCloseTo(Math.cos(result.d), 10);
    });
});

describe('tau2julianDay', () => {
    // 2021-12-04 total solar eclipse
    const besselianElements: BesselianElements = {
        t0Jde: 2459552.816,
        t0Hours: 8,
        tMin: -76.8,
        tMax: -46.2,
        deltaT: 72.6,
        x: [0.025209, 0.5683028, 0.0000391, -0.0000097],
        y: [-0.983653, -0.1315142, 0.0002213, 0.0000024],
        d: [-22.2747192, -0.005178, 0.000006],
        mu: [302.452179, 14.99728, 0],
        l1: [0.537805, -0.000016, -0.0000131],
        l2: [-0.008292, -0.000016, -0.0000131],
        tanF1: 0.0047434,
        tanF2: 0.0047198,
    };

    it('returns the correct julian day for tau=0', () => {
        const result = tau2julianDay(besselianElements, 0);

        expect(result).toBeCloseTo(2459552.832493, 6);
    });

    it('returns the correct julian day for tau=-0.232001', () => {
        const result = tau2julianDay(besselianElements, -0.232001);

        expect(result).toBeCloseTo(2459552.822826, 6);
    });
});
