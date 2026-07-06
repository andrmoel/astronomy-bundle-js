// 2005-2026 observed: https://maia.usno.navy.mil/ser7/deltat.data
// 2027-2033 predicted: https://maia.usno.navy.mil/ser7/deltat.preds
const REFERENCE_DELTA_T: Record<number, number> = {
    2005: 64.6876,
    2006: 64.8452,
    2007: 65.1464,
    2008: 65.4573,
    2009: 65.7768,
    2010: 66.0699,
    2011: 66.3246,
    2012: 66.603,
    2013: 66.9069,
    2014: 67.281,
    2015: 67.6439,
    2016: 68.1024,
    2017: 68.5927,
    2018: 68.9676,
    2019: 69.2202,
    2020: 69.3612,
    2021: 69.3594,
    2022: 69.2945,
    2023: 69.2039,
    2024: 69.1752,
    2025: 69.1377,
    2026: 69.1099,
    2027: 69.14,
    2028: 69.34,
    2029: 69.63,
    2030: 69.97,
    2031: 70.32,
    2032: 70.62,
    2033: 70.98,
};

const REFERENCE_YEARS = Object.keys(REFERENCE_DELTA_T).map(Number);
const REFERENCE_MIN_YEAR = Math.min(...REFERENCE_YEARS);
const REFERENCE_MAX_YEAR = Math.max(...REFERENCE_YEARS);

// Cubic least-squares fit to the reference values, used to extrapolate ΔT beyond the tabulated years.
const FUTURE_DELTA_T_COEFFICIENTS = fitPolynomial(
    REFERENCE_YEARS.map((year) => [year - 2000, REFERENCE_DELTA_T[year]]),
    3,
);

export function getDeltaT(year: number, month = 0): number {
    // https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
    const y = year + (month - 0.5) / 12;

    if (year >= REFERENCE_MIN_YEAR && year <= REFERENCE_MAX_YEAR) {
        return getReferenceDeltaT(y);
    }

    if (year > REFERENCE_MAX_YEAR) {
        return evaluatePolynomial(FUTURE_DELTA_T_COEFFICIENTS, y - 2000);
    }

    let t: number;
    let deltaT = 0;

    if (year < -500) {
        t = (y - 1820) / 100;
        deltaT = -20 + 32 * t ** 2;
    }

    if (year >= -500 && year < 500) {
        t = y / 100;
        deltaT =
            10583.6
            - 1014.41 * t
            + 33.78311 * t ** 2
            - 5.952053 * t ** 3
            - 0.1798452 * t ** 4
            + 0.022174192 * t ** 5
            + 0.0090316521 * t ** 6;
    }

    if (year >= 500 && year < 1600) {
        t = (y - 1000) / 100;
        deltaT =
            1574.2
            - 556.01 * t
            + 71.23472 * t ** 2
            + 0.319781 * t ** 3
            - 0.8503463 * t ** 4
            - 0.005050998 * t ** 5
            + 0.0083572073 * t ** 6;
    }

    if (year >= 1600 && year < 1700) {
        t = y - 1600;
        deltaT = 120 - 0.9808 * t - 0.01532 * t ** 2 + t ** 3 / 7129;
    }

    if (year >= 1700 && year < 1800) {
        t = y - 1700;
        deltaT = 8.83 + 0.1603 * t - 0.0059285 * t ** 2 + 0.00013336 * t ** 3 - t ** 4 / 1174000;
    }

    if (year >= 1800 && year < 1860) {
        t = y - 1800;
        deltaT =
            13.72
            - 0.332447 * t
            + 0.0068612 * t ** 2
            + 0.0041116 * t ** 3
            - 0.00037436 * t ** 4
            + 0.0000121272 * t ** 5
            - 0.0000001699 * t ** 6
            + 0.000000000875 * t ** 7;
    }

    if (year >= 1860 && year < 1900) {
        t = y - 1860;

        deltaT = 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3 - 0.0004473624 * t ** 4 + t ** 5 / 233174;
    }

    if (year >= 1900 && year < 1920) {
        t = y - 1900;
        deltaT = -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4;
    }

    if (year >= 1920 && year < 1941) {
        t = y - 1920;
        deltaT = 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3;
    }

    if (year >= 1941 && year < 1961) {
        t = y - 1950;
        deltaT = 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
    }

    if (year >= 1961 && year < 1986) {
        t = y - 1975;
        deltaT = 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
    }

    if (year >= 1986 && year < 2005) {
        t = y - 2000;
        deltaT =
            63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5;
    }

    return deltaT;
}

function getReferenceDeltaT(y: number): number {
    const clamped = Math.max(REFERENCE_MIN_YEAR, Math.min(REFERENCE_MAX_YEAR, y));
    const y0 = Math.min(Math.floor(clamped), REFERENCE_MAX_YEAR - 1);
    const fraction = clamped - y0;

    return REFERENCE_DELTA_T[y0] + fraction * (REFERENCE_DELTA_T[y0 + 1] - REFERENCE_DELTA_T[y0]);
}

function evaluatePolynomial(coefficients: number[], x: number): number {
    return coefficients.reduce((sum, coefficient, power) => sum + coefficient * x ** power, 0);
}

function fitPolynomial(points: Array<[number, number]>, degree: number): number[] {
    const size = degree + 1;
    const matrix: number[][] = [];
    const vector: number[] = [];

    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            matrix[i][j] = points.reduce((sum, [x]) => sum + x ** (i + j), 0);
        }
        vector[i] = points.reduce((sum, [x, value]) => sum + value * x ** i, 0);
    }

    for (let i = 0; i < size; i++) {
        let pivot = i;
        for (let row = i + 1; row < size; row++) {
            if (Math.abs(matrix[row][i]) > Math.abs(matrix[pivot][i])) {
                pivot = row;
            }
        }
        [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];
        [vector[i], vector[pivot]] = [vector[pivot], vector[i]];

        for (let row = 0; row < size; row++) {
            if (row === i) {
                continue;
            }
            const factor = matrix[row][i] / matrix[i][i];
            for (let col = i; col < size; col++) {
                matrix[row][col] -= factor * matrix[i][col];
            }
            vector[row] -= factor * vector[i];
        }
    }

    return matrix.map((_, i) => vector[i] / matrix[i][i]);
}
