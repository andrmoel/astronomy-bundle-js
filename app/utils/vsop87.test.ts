import {
    VSOP87_X as X_DATE,
    VSOP87_Y as Y_DATE,
    VSOP87_Z as Z_DATE,
} from '@app/resources/vsop87/vsop87EarthSphericalDate';
import {
    VSOP87_X as X_J2000,
    VSOP87_Y as Y_J2000,
    VSOP87_Z as Z_J2000,
} from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import {normalizeAngle} from '@app/utils/angle';
import {calculateVSOP87, calculateVSOP87Angle} from './vsop87';

// 2017-12-10 00:00:00 UT → JDE 2458097.5
const t = (2458097.5 - 2451545.0) / 365250;

describe('calculateVSOP87', () => {
    it('evaluates a single constant term', () => {
        expect(calculateVSOP87([[[1.0, 0.0, 0.0]]], 0)).toBe(1.0);
    });

    it('evaluates a constant term at arbitrary t', () => {
        expect(calculateVSOP87([[[2.5]]], 99)).toBe(2.5);
    });

    it('accumulates across higher-order power terms', () => {
        // L0: 1 * cos(0) * t^0 = 1, L1: 1 * cos(0) * t^1 = 3 → sum = 4
        expect(calculateVSOP87([[[1.0, 0.0, 0.0]], [[1.0, 0.0, 0.0]]], 3)).toBe(4.0);
    });

    it('evaluates cosine with B phase offset', () => {
        // cos(π) = -1
        expect(calculateVSOP87([[[1.0, Math.PI, 0.0]]], 0)).toBeCloseTo(-1.0, 8);
    });

    it('evaluates cosine with C frequency term', () => {
        // cos(0 + 1 * π) = -1
        expect(calculateVSOP87([[[1.0, 0.0, 1.0]]], Math.PI)).toBeCloseTo(-1.0, 8);
    });

    it('sums multiple terms within the same power', () => {
        // cos(0) + cos(π) = 1 + (-1) = 0
        expect(
            calculateVSOP87(
                [
                    [
                        [1.0, 0.0, 0.0],
                        [1.0, Math.PI, 0.0],
                    ],
                ],
                0,
            ),
        ).toBeCloseTo(0.0, 10);
    });
});

describe('calculateVSOP87Angle', () => {
    it('converts the radian result to degrees', () => {
        // result = π radians → angle = 180°
        expect(calculateVSOP87Angle([[[Math.PI, 0.0, 0.0]]], 0)).toBeCloseTo(180.0, 8);
    });

    it('returns 0 degrees when the result is zero', () => {
        // cos(π/2) = 0
        expect(calculateVSOP87Angle([[[1.0, Math.PI / 2, 0.0]]], 0)).toBeCloseTo(0.0, 8);
    });
});

describe('Earth spherical Date coordinates', () => {
    it('computes heliocentric longitude', () => {
        expect(normalizeAngle(calculateVSOP87Angle(X_DATE, t))).toBeCloseTo(78.11655576, 8);
    });

    it('computes heliocentric latitude', () => {
        expect(calculateVSOP87Angle(Y_DATE, t)).toBeCloseTo(-0.00014636, 8);
    });

    it('computes radius vector', () => {
        expect(calculateVSOP87(Z_DATE, t)).toBeCloseTo(0.98482636, 8);
    });
});

describe('Earth spherical J2000 coordinates', () => {
    it('computes heliocentric longitude', () => {
        expect(normalizeAngle(calculateVSOP87Angle(X_J2000, t))).toBeCloseTo(77.86593249, 8);
    });

    it('computes heliocentric latitude', () => {
        expect(calculateVSOP87Angle(Y_J2000, t)).toBeCloseTo(-0.00247079, 8);
    });

    it('computes radius vector', () => {
        expect(calculateVSOP87(Z_J2000, t)).toBeCloseTo(0.98482636, 8);
    });
});
