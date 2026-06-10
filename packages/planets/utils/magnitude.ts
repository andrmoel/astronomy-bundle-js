export function getApparentMagnitudeMercury(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    V +=
        -0.613
        + 6.328e-2 * phaseAngle
        - 1.6336e-3 * phaseAngle ** 2
        + 3.3644e-5 * phaseAngle ** 3
        - 3.4265e-7 * phaseAngle ** 4
        + 1.6893e-9 * phaseAngle ** 5
        - 3.0334e-12 * phaseAngle ** 6;

    return V;
}

export function getApparentMagnitudeVenus(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    if (phaseAngle <= 163.7) {
        V +=
            -4.384
            - 1.044e-3 * phaseAngle
            + 3.687e-4 * phaseAngle ** 2
            - 2.814e-6 * phaseAngle ** 3
            + 8.938e-9 * phaseAngle ** 4;
    } else {
        V += 236.05828 - 2.81914 * phaseAngle + 8.39034e-3 * phaseAngle ** 2;
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

    V += -9.395 + 3.7e-4 * phaseAngle + 6.15e-4 * phaseAngle ** 2;

    return V;
}

export function getApparentMagnitudeSaturn(
    distanceSun: number,
    distanceEarth: number,
    phaseAngle: number,
    ringInclination: number,
): number {
    const V = 5 * Math.log10(distanceSun * distanceEarth);
    const B = (Math.abs(ringInclination) * Math.PI) / 180;

    return V - 8.88 + 0.044 * phaseAngle - 2.6 * Math.sin(B) + 1.25 * Math.sin(B) ** 2;
}

export function getApparentMagnitudeUranus(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
    let V = 5 * Math.log10(distanceSun * distanceEarth);

    V += -7.19 + 0.002 * phaseAngle;

    return V;
}

export function getApparentMagnitudeNeptune(distanceSun: number, distanceEarth: number, year: number): number {
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
