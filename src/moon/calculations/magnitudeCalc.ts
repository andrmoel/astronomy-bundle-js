import {au2km} from '../../utils/distanceCalc';

export function getApparentMagnitudeMoon(
    distanceSun: number,
    distanceEarth: number,
    phaseAngle: number,
    isWaxing: boolean
): number {
    const signedPhaseAngle = isWaxing ? -1 * phaseAngle : phaseAngle;

    let V = 5 * (Math.log10(distanceSun) + Math.log10(au2km(distanceEarth) / 384400));

    // Numeric formula by. Dr. Elmar Schmidt (Arbeitskreis Meteore e.V.)

    // Area A
    if (phaseAngle >= 160) {
        V += -449.88
            + 7.1112 * phaseAngle
            - 0.037714 * Math.pow(phaseAngle, 2)
            + 0.000066667 * Math.pow(phaseAngle, 3);
    }

    // Area B
    if (phaseAngle >= 40 && phaseAngle < 160) {
        V += -12.07857
            + 0.002175199 * signedPhaseAngle
            + 0.0002859289 * Math.pow(signedPhaseAngle, 2)
            - 2.495124E-07 * Math.pow(signedPhaseAngle, 3)
            - 8.699235E-09 * Math.pow(signedPhaseAngle, 4)
            + 7.606291E-12 * Math.pow(signedPhaseAngle, 5)
            + 3.403311E-13 * Math.pow(signedPhaseAngle, 6);
    }

    // Area C2
    if (signedPhaseAngle >= 0 && signedPhaseAngle < 40) {
        V += -12.861
            + 0.037 * phaseAngle
            - 0.00012 * Math.pow(phaseAngle, 2)
    }

    // Area C1
    if (signedPhaseAngle > -40 && signedPhaseAngle < 0) {
        V += -12.85
            - 0.037 * signedPhaseAngle
            - 0.000235 * Math.pow(signedPhaseAngle, 2)
    }

    return V;
}
