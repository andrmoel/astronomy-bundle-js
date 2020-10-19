import {normalizeAngle} from './angle';

export function getMeanElongation(T: number): number {
    // Meeus 47.2
    const D = 297.8501921
        + 445267.1114034 * T
        - 0.0018819 * Math.pow(T, 2)
        + Math.pow(T, 3) / 545868
        - Math.pow(T, 4) / 113065000;

    return normalizeAngle(D);
}

export function getMeanAnomaly(T: number): number {
    // Meeus 47.2
    const Mmoon = 134.9633964
        + 477198.8675055 * T
        + 0.0087414 * Math.pow(T, 2)
        + Math.pow(T, 3) / 69699
        - Math.pow(T, 4) / 1471200;

    return normalizeAngle(Mmoon);
}

export function getArgumentOfLatitude(T: number): number {
    // Meeus 47.5
    const F = 93.2720950
        + 483202.0175233 * T
        - 0.0036539 * Math.pow(T, 2)
        - Math.pow(T, 3) / 352600
        + Math.pow(T, 4) / 86331000;

    return normalizeAngle(F);
}
