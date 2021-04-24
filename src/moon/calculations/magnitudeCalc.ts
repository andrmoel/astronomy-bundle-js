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
