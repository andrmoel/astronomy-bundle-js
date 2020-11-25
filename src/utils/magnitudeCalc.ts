import {au2km} from './distanceCalc';

export function getApparentMagnitudeMoon(
    distanceSun: number,
    distanceEarth: number,
    phaseAngle: number,
    isWaxing: boolean
): number {
    const signedPhaseAngle = isWaxing ? -1 * phaseAngle : phaseAngle;

    let V = 5 * (Math.log10(distanceSun) + Math.log10(au2km(distanceEarth) / 384400));

    // Numeric formula by. Dr. Elmar Schmidt (Arbeitskreis Meteore e.V.)
    if (phaseAngle > 160) {
        V += -279.45
            + 4.3336 * phaseAngle
            - 0.022743 * Math.pow(phaseAngle, 2)
            + 0.00004 * Math.pow(phaseAngle, 3);
    }

    if (phaseAngle > 40 && phaseAngle <= 160) {
        V += -12.14
            + 0.0017383 * signedPhaseAngle
            + 0.0003165 * Math.pow(signedPhaseAngle, 2)
            - 0.00000017742 * Math.pow(signedPhaseAngle, 3)
            - 0.0000000124265 * Math.pow(signedPhaseAngle, 4)
            + 0.0000000000042631 * Math.pow(signedPhaseAngle, 5)
            + 0.00000000000046026 * Math.pow(signedPhaseAngle, 6);
    }

    if (signedPhaseAngle > 1.5 && signedPhaseAngle <= 40) {
        V += -12.92
            + 0.0475 * signedPhaseAngle
            - 0.000769 * Math.pow(signedPhaseAngle, 2)
            + 0.000017998 * Math.pow(signedPhaseAngle, 3)
            - 0.0000001965 * Math.pow(signedPhaseAngle, 4);
    }

    if (signedPhaseAngle >= -40 && signedPhaseAngle < -1.5) {
        V += -12.91
            - 0.0441 * signedPhaseAngle
            - 0.000769 * Math.pow(signedPhaseAngle, 2)
            - 0.000017998 * Math.pow(signedPhaseAngle, 3)
            - 0.0000001965 * Math.pow(signedPhaseAngle, 4);
    }

    if (phaseAngle >= -1.5 && phaseAngle <= 1.5) {
        // TODO opposition and lunar eclipse. Use optimized formula
        V += -12.92
            + 0.0475 * phaseAngle
            - 0.000769 * Math.pow(phaseAngle, 2)
            + 0.000017998 * Math.pow(phaseAngle, 3)
            - 0.0000001965 * Math.pow(phaseAngle, 4);
    }

    return V;
}

export function getApparentMagnitudeMercury(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    V += -0.613
        + 6.3280E-2 * phaseAngle
        - 1.6336E-3 * Math.pow(phaseAngle, 2)
        + 3.3644E-5 * Math.pow(phaseAngle, 3)
        - 3.4265E-7 * Math.pow(phaseAngle, 4)
        + 1.6893E-9 * Math.pow(phaseAngle, 5)
        - 3.0334E-12 * Math.pow(phaseAngle, 6);

    return V;
}

export function getApparentMagnitudeVenus(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    if (phaseAngle <= 163.7) {
        V += -4.384
            - 1.044E-3 * phaseAngle
            + 3.687E-4 * Math.pow(phaseAngle, 2)
            - 2.814E-6 * Math.pow(phaseAngle, 3)
            + 8.938E-9 * Math.pow(phaseAngle, 4);
    } else {
        V += 236.05828
            - 2.81914 * phaseAngle
            + 8.39034E-3 * Math.pow(phaseAngle, 2)
    }

    return V;
}

export function getApparentMagnitudeMars(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    V += -1.52 + 0.016 * phaseAngle;

    return V;
}

export function getApparentMagnitudeJupiter(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    V += -9.395
        + 3.7E-4 * phaseAngle
        + 6.15E-4 * Math.pow(phaseAngle, 2);

    return V;
}

export function getApparentMagnitudeSaturn(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    return 999.9; // TODO
}

export function getApparentMagnitudeUranus(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    V += -7.19 + 0.002 * phaseAngle;

    return V;
}

export function getApparentMagnitudeNeptune(
    distanceSun: number,
    distanceEarth: number,
    phaseAngle: number,
    year: number
): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    if (year < 1980) {
        V += -6.9;
    } else if (year >= 1980 && year <= 2000) {
        V += -6.89 - 0.0054 * (year - 1980);
    } else {
        V += -7;
    }

    return V;
}
