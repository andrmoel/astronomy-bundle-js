// https://maia.usno.navy.mil/ser7/deltat.data
const OBSERVED_DELTA_T: Record<number, number> = {
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
};

const OBSERVED_YEARS = Object.keys(OBSERVED_DELTA_T).map(Number);
const OBSERVED_MIN_YEAR = Math.min(...OBSERVED_YEARS);
const OBSERVED_MAX_YEAR = Math.max(...OBSERVED_YEARS);

export function getDeltaT(year: number, month = 0): number {
    // https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
    const y = year + (month - 0.5) / 12;

    if (year >= OBSERVED_MIN_YEAR && year <= OBSERVED_MAX_YEAR) {
        return getObservedDeltaT(y);
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

    if (year >= 2005 && year < 2050) {
        t = y - 2000;
        deltaT = 62.92 + 0.32217 * t + 0.005589 * t ** 2;
    }

    if (year >= 2050 && year < 2150) {
        t = (y - 1820) / 100;
        deltaT = -20 + 32 * t ** 2 - 0.5628 * (2150 - y);
    }

    if (year >= 2150) {
        t = (y - 1820) / 100;
        deltaT = -20 + 32 * t ** 2;
    }

    return deltaT;
}

function getObservedDeltaT(y: number): number {
    const clamped = Math.max(OBSERVED_MIN_YEAR, Math.min(OBSERVED_MAX_YEAR, y));
    const y0 = Math.min(Math.floor(clamped), OBSERVED_MAX_YEAR - 1);
    const fraction = clamped - y0;

    return OBSERVED_DELTA_T[y0] + fraction * (OBSERVED_DELTA_T[y0 + 1] - OBSERVED_DELTA_T[y0]);
}

