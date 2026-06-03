import {polynomial, polynomialDerivative} from './polynoms';

describe('polynomial', () => {
    it('returns constant for single coefficient', () => {
        expect(polynomial([5], 3)).toBe(5);
    });

    it('evaluates linear polynomial', () => {
        // 2 + 3*tau = 2 + 3*4 = 14
        expect(polynomial([2, 3], 4)).toBe(14);
    });

    it('evaluates quadratic polynomial', () => {
        // 1 + 2*tau + 3*tau^2 at tau=2 = 1 + 4 + 12 = 17
        expect(polynomial([1, 2, 3], 2)).toBe(17);
    });

    it('returns 0 for zero coefficients', () => {
        expect(polynomial([0, 0, 0], 99)).toBe(0);
    });

    it('evaluates at tau=0', () => {
        // Result should be first coefficient only
        expect(polynomial([7, 4, 2], 0)).toBe(7);
    });

    it('handles negative tau', () => {
        // 1 + 2*(-1) + 3*(-1)^2 = 1 - 2 + 3 = 2
        expect(polynomial([1, 2, 3], -1)).toBe(2);
    });
});

describe('polynomialDerivative', () => {
    it('returns 0 for constant polynomial', () => {
        expect(polynomialDerivative([5], 3)).toBe(0);
    });

    it('returns constant for linear polynomial', () => {
        // d/dtau (2 + 3*tau) = 3
        expect(polynomialDerivative([2, 3], 99)).toBe(3);
    });

    it('evaluates derivative of quadratic polynomial', () => {
        // d/dtau (1 + 2*tau + 3*tau^2) = 2 + 6*tau at tau=2 = 14
        expect(polynomialDerivative([1, 2, 3], 2)).toBe(14);
    });

    it('evaluates at tau=0', () => {
        // d/dtau (1 + 4*tau + 5*tau^2) at tau=0 = 4
        expect(polynomialDerivative([1, 4, 5], 0)).toBe(4);
    });

    it('handles negative tau', () => {
        // d/dtau (1 + 2*tau + 3*tau^2) = 2 + 6*tau at tau=-1 = -4
        expect(polynomialDerivative([1, 2, 3], -1)).toBe(-4);
    });
});
