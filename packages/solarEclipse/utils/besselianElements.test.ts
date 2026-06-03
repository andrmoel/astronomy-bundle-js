import {parseBesselianElements, getBesselianElementsAtTime} from '../utils/besselianElements';
import {DEG} from '@app/constants/math';

// 28-element raw Besselian data for the 2017-08-21 total solar eclipse.
const rawElements: Array<number> = [
    2457987.27083, 18.5, -2.0, 2.0, 69.1, 0.0,
    0.02520900, 0.56830281, 0.00003910, -0.00000965,
    -0.98365301, -0.13151421, 0.00022130, 0.00000240,
    -22.27471924, -0.00517800, 0.00000600,
    302.45217896, 14.99728012, 0.00000000,
    0.53780502, -0.00001600, -0.00001310,
    -0.00829200, -0.00001600, -0.00001310,
    0.0046, 0.0046,
];

describe('getBesselianElementsAtTime', () => {
    const elements = parseBesselianElements(rawElements);

    it('at tau=0 returns the constant term of each polynomial', () => {
        const result = getBesselianElementsAtTime(elements, 0);

        expect(result.x).toBeCloseTo(0.02520900, 7);
        expect(result.y).toBeCloseTo(-0.98365301, 7);
        expect(result.l1).toBeCloseTo(0.53780502, 7);
        expect(result.l2).toBeCloseTo(-0.00829200, 7);
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

        // x: 0.02520900 + 0.56830281 + 0.00003910 + (-0.00000965)
        expect(result.x).toBeCloseTo(0.59354126, 7);
        // y: -0.98365301 + (-0.13151421) + 0.00022130 + 0.00000240
        expect(result.y).toBeCloseTo(-1.11494352, 7);
        // l1: 0.53780502 + (-0.00001600) + (-0.00001310)
        expect(result.l1).toBeCloseTo(0.53777592, 7);
        // l2: -0.00829200 + (-0.00001600) + (-0.00001310)
        expect(result.l2).toBeCloseTo(-0.00832110, 7);
    });

    it('at tau=1 converts d and mu correctly', () => {
        const result = getBesselianElementsAtTime(elements, 1);

        // d: -22.27471924 + (-0.00517800) + 0.00000600 = -22.27989124 degrees
        expect(result.d).toBeCloseTo(-22.27989124 * DEG, 10);
        // mu: 302.45217896 + 14.99728012 + 0 = 317.44945908 degrees
        expect(result.mu).toBeCloseTo(317.44945908 * DEG, 10);
    });

    it('sinD and cosD are always consistent with d', () => {
        const tau = 1.5;
        const result = getBesselianElementsAtTime(elements, tau);

        expect(result.sinD).toBeCloseTo(Math.sin(result.d), 10);
        expect(result.cosD).toBeCloseTo(Math.cos(result.d), 10);
    });
});
