
export function getDeltaT(year: number, month = 0): number {
    // https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
    const y = year + (month - 0.5) / 12;

    let t;
    let deltaT = 0;

    if (year < -500) {
        t = (y - 1820) / 100;
        deltaT = -20
            + 32 * Math.pow(t, 2);
    }

    if (year >= -500 && year < 500) {
        t = y / 100;
        deltaT = 10583.6
            - 1014.41 * t
            + 33.78311 * Math.pow(t, 2)
            - 5.952053 * Math.pow(t, 3)
            - 0.1798452 * Math.pow(t, 4)
            + 0.022174192 * Math.pow(t, 5)
            + 0.0090316521 * Math.pow(t, 6);
    }

    if (year >= 500 && year < 1600) {
        t = (y - 1000) / 100;
        deltaT = 1574.2
            - 556.01 * t
            + 71.23472 * Math.pow(t, 2)
            + 0.319781 * Math.pow(t, 3)
            - 0.8503463 * Math.pow(t, 4)
            - 0.005050998 * Math.pow(t, 5)
            + 0.0083572073 * Math.pow(t, 6);
    }

    if (year >= 1600 && year < 1700) {
        t = y - 1600;
        deltaT = 120
            - 0.9808 * t
            - 0.01532 * Math.pow(t, 2)
            + Math.pow(t, 3) / 7129;
    }

    if (year >= 1700 && year < 1800) {
        t = y - 1700;
        deltaT = 8.83
            + 0.1603 * t
            - 0.0059285 * Math.pow(t, 2)
            + 0.00013336 * Math.pow(t, 3)
            - Math.pow(t, 4) / 1174000;
    }

    if (year >= 1800 && year < 1860) {
        t = y - 1800;
        deltaT = 13.72
            - 0.332447 * t
            + 0.0068612 * Math.pow(t, 2)
            + 0.0041116 * Math.pow(t, 3)
            - 0.00037436 * Math.pow(t, 4)
            + 0.0000121272 * Math.pow(t, 5)
            - 0.0000001699 * Math.pow(t, 6)
            + 0.000000000875 * Math.pow(t, 7);
    }

    if (year >= 1860 && year < 1900) {
        t = y - 1860;

        deltaT = 7.62
            + 0.5737 * t
            - 0.251754 * Math.pow(t, 2)
            + 0.01680668 * Math.pow(t, 3)
            - 0.0004473624 * Math.pow(t, 4)
            + Math.pow(t, 5) / 233174;
    }

    if (year >= 1900 && year < 1920) {
        t = y - 1900;
        deltaT = -2.79
            + 1.494119 * t
            - 0.0598939 * Math.pow(t, 2)
            + 0.0061966 * Math.pow(t, 3)
            - 0.000197 * Math.pow(t, 4);
    }

    if (year >= 1920 && year < 1941) {
        t = y - 1920;
        deltaT = 21.20
            + 0.84493 * t
            - 0.076100 * Math.pow(t, 2)
            + 0.0020936 * Math.pow(t, 3);
    }

    if (year >= 1941 && year < 1961) {
        t = y - 1950;
        deltaT = 29.07
            + 0.407 * t
            - Math.pow(t, 2) / 233
            + Math.pow(t, 3) / 2547;
    }

    if (year >= 1961 && year < 1986) {
        t = y - 1975;
        deltaT = 45.45
            + 1.067 * t
            - Math.pow(t, 2) / 260
            - Math.pow(t, 3) / 718;
    }

    if (year >= 1986 && year < 2005) {
        t = y - 2000;
        deltaT = 63.86
            + 0.3345 * t
            - 0.060374 * Math.pow(t, 2)
            + 0.0017275 * Math.pow(t, 3)
            + 0.000651814 * Math.pow(t, 4)
            + 0.00002373599 * Math.pow(t, 5);
    }

    if (year >= 2005 && year < 2050) {
        t = y - 2000;
        deltaT = 62.92
            + 0.32217 * t
            + 0.005589 * Math.pow(t, 2);
    }

    if (year >= 2050) {
        t = (y - 1820) / 100;
        deltaT = -20
            + 32 * Math.pow(t, 2);
    }

    return deltaT;
}
