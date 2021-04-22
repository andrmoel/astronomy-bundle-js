import {createTimeOfInterest} from '../time';
import TimeOfInterest from '../time/TimeOfInterest';
import {
    MOON_PHASE_FIRST_QUARTER,
    MOON_PHASE_FULL_MOON,
    MOON_PHASE_LAST_QUARTER,
    MOON_PHASE_NEW_MOON,
} from '../moon/constants/moonPhases';
import {round} from './math';
import {deg2rad} from './angleCalc';

export function getTimeOfInterestOfUpcomingPhase(decimalYear: number, moonPhase: number): TimeOfInterest {
    const k = round((decimalYear - 2000) * 12.3685) + moonPhase;
    const T = k / 1236.85;

    const JDE = _getJulianEphemerisDays(k, T);
    const corrections = _getPeriodicTermCorrections(k, T, moonPhase);
    const wCorrections = _getQuarterPhaseCorrections(k, T, moonPhase);
    const pCorrections = _getPlanetaryCorrections(k, T);

    const jd = JDE + corrections + wCorrections + pCorrections;

    return createTimeOfInterest.fromJulianDay(jd);
}

function _getPeriodicTermCorrections(k: number, T: number, moonPhase: number): number {
    switch (moonPhase) {
        case MOON_PHASE_NEW_MOON:
            return _getPeriodicTermCorrectionsForNewMoon(k, T);
        case MOON_PHASE_FULL_MOON:
            return _getPeriodicTermCorrectionsForFullMoon(k, T);
        case MOON_PHASE_FIRST_QUARTER:
        case MOON_PHASE_LAST_QUARTER:
            return _getPeriodicTermCorrectionsForQuarters(k, T);
        default:
            throw new Error(`Invalid moon phase: ${moonPhase}`);
    }
}

function _getPeriodicTermCorrectionsForNewMoon(k: number, T: number): number {
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    const Msun = _getMeanAnomalySun(k, T);
    const Mmoon = _getMeanAnomalyMoon(k, T);
    const F = _getArgumentOfLatitudeMoon(k, T);
    const omega = _getLongitudeOfAscendingNodeMoon(k, T);

    const MsunRad = deg2rad(Msun);
    const MmoonRad = deg2rad(Mmoon);
    const FRad = deg2rad(F);
    const omegaRad = deg2rad(omega);

    return -0.40720 * Math.sin(MmoonRad)
        + 0.17241 * E * Math.sin(MsunRad)
        + 0.01608 * Math.sin(2.0 * MmoonRad)
        + 0.01039 * Math.sin(2.0 * FRad)
        + 0.00739 * E * Math.sin(MmoonRad - MsunRad)
        - 0.00514 * E * Math.sin(MmoonRad + MsunRad)
        + 0.00208 * E * E * Math.sin(2.0 * MsunRad)
        - 0.00111 * Math.sin(MmoonRad - 2.0 * FRad)
        - 0.00057 * Math.sin(MmoonRad + 2.0 * FRad)
        + 0.00056 * E * Math.sin(2.0 * MmoonRad + MsunRad)
        - 0.00042 * Math.sin(3.0 * MmoonRad)
        + 0.00042 * E * Math.sin(MsunRad + 2.0 * FRad)
        + 0.00038 * E * Math.sin(MsunRad - 2.0 * FRad)
        - 0.00024 * E * Math.sin(2.0 * MmoonRad - MsunRad)
        - 0.00017 * Math.sin(omegaRad)
        - 0.00007 * Math.sin(MmoonRad + 2.0 * MsunRad)
        + 0.00004 * Math.sin(2.0 * MmoonRad - 2.0 * FRad)
        + 0.00004 * Math.sin(3.0 * MsunRad)
        + 0.00003 * Math.sin(MmoonRad + MsunRad - 2.0 * FRad)
        + 0.00003 * Math.sin(2.0 * MmoonRad + 2.0 * FRad)
        - 0.00003 * Math.sin(MmoonRad + MsunRad + 2.0 * FRad)
        + 0.00003 * Math.sin(MmoonRad - MsunRad + 2.0 * FRad)
        - 0.00002 * Math.sin(MmoonRad - MsunRad - 2.0 * FRad)
        - 0.00002 * Math.sin(3.0 * MmoonRad + MsunRad)
        + 0.00002 * Math.sin(4.0 * MmoonRad);
}

function _getPeriodicTermCorrectionsForFullMoon(k: number, T: number): number {
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    const Msun = _getMeanAnomalySun(k, T);
    const Mmoon = _getMeanAnomalyMoon(k, T);
    const F = _getArgumentOfLatitudeMoon(k, T);
    const omega = _getLongitudeOfAscendingNodeMoon(k, T);

    const MsunRad = deg2rad(Msun);
    const MmoonRad = deg2rad(Mmoon);
    const FRad = deg2rad(F);
    const omegaRad = deg2rad(omega);

    return -0.40614 * Math.sin(MmoonRad)
        + 0.17302 * E * Math.sin(MsunRad)
        + 0.01614 * Math.sin(2.0 * MmoonRad)
        + 0.01043 * Math.sin(2.0 * FRad)
        + 0.00734 * E * Math.sin(MmoonRad - MsunRad)
        - 0.00515 * E * Math.sin(MmoonRad + MsunRad)
        + 0.00209 * E * E * Math.sin(2.0 * MsunRad)
        - 0.00111 * Math.sin(MmoonRad - 2.0 * FRad)
        - 0.00057 * Math.sin(MmoonRad + 2.0 * FRad)
        + 0.00056 * E * Math.sin(2.0 * MmoonRad + MsunRad)
        - 0.00042 * Math.sin(3.0 * MmoonRad)
        + 0.00042 * E * Math.sin(MsunRad + 2.0 * FRad)
        + 0.00038 * E * Math.sin(MsunRad - 2.0 * FRad)
        - 0.00024 * E * Math.sin(2.0 * MmoonRad - MsunRad)
        - 0.00017 * Math.sin(omegaRad)
        - 0.00007 * Math.sin(MmoonRad + 2.0 * MsunRad)
        + 0.00004 * Math.sin(2.0 * MmoonRad - 2.0 * FRad)
        + 0.00004 * Math.sin(3.0 * MsunRad)
        + 0.00003 * Math.sin(MmoonRad + MsunRad - 2.0 * FRad)
        + 0.00003 * Math.sin(2.0 * MmoonRad + 2.0 * FRad)
        - 0.00003 * Math.sin(MmoonRad + MsunRad + 2.0 * FRad)
        + 0.00003 * Math.sin(MmoonRad - MsunRad + 2.0 * FRad)
        - 0.00002 * Math.sin(MmoonRad - MsunRad - 2.0 * FRad)
        - 0.00002 * Math.sin(3.0 * MmoonRad + MsunRad)
        + 0.00002 * Math.sin(4.0 * MmoonRad);
}

function _getPeriodicTermCorrectionsForQuarters(k: number, T: number): number {
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    const Msun = _getMeanAnomalySun(k, T);
    const Mmoon = _getMeanAnomalyMoon(k, T);
    const F = _getArgumentOfLatitudeMoon(k, T);
    const omega = _getLongitudeOfAscendingNodeMoon(k, T);

    const MsunRad = deg2rad(Msun);
    const MmoonRad = deg2rad(Mmoon);
    const FRad = deg2rad(F);
    const omegaRad = deg2rad(omega);

    return -0.62801 * Math.sin(MmoonRad)
        + 0.17172 * E * Math.sin(MsunRad)
        - 0.01183 * E * Math.sin(MmoonRad + MsunRad)
        + 0.00862 * Math.sin(2.0 * MmoonRad)
        + 0.00804 * Math.sin(2.0 * FRad)
        + 0.00454 * E * Math.sin(MmoonRad - MsunRad)
        + 0.00204 * E * E * Math.sin(2.0 * MsunRad)
        - 0.00180 * Math.sin(MmoonRad - 2.0 * FRad)
        - 0.00070 * Math.sin(MmoonRad + 2.0 * FRad)
        - 0.00040 * Math.sin(3.0 * MmoonRad)
        - 0.00034 * E * Math.sin(2.0 * MmoonRad - MsunRad)
        + 0.00032 * E * Math.sin(MsunRad + 2.0 * FRad)
        + 0.00032 * E * Math.sin(MsunRad - 2.0 * FRad)
        - 0.00028 * E * E * Math.sin(MmoonRad + 2.0 * MsunRad)
        + 0.00027 * E * Math.sin(2.0 * MmoonRad + MsunRad)
        - 0.00017 * Math.sin(omegaRad)
        - 0.00005 * Math.sin(MmoonRad - MsunRad - 2.0 * FRad)
        + 0.00004 * Math.sin(2.0 * MmoonRad + 2.0 * FRad)
        - 0.00004 * Math.sin(MmoonRad + MsunRad + 2.0 * FRad)
        + 0.00004 * Math.sin(MmoonRad - 2.0 * MsunRad)
        + 0.00003 * Math.sin(MmoonRad + MsunRad - 2.0 * FRad)
        + 0.00003 * Math.sin(3.0 * MsunRad)
        + 0.00002 * Math.sin(2.0 * MmoonRad - 2.0 * FRad)
        + 0.00002 * Math.sin(MmoonRad - MsunRad + 2.0 * FRad)
        - 0.00002 * Math.sin(3.0 * MmoonRad + MsunRad);
}

function _getQuarterPhaseCorrections(k: number, T: number, moonPhase: number): number {
    if (moonPhase === MOON_PHASE_FULL_MOON || moonPhase === MOON_PHASE_NEW_MOON) {
        return 0.0;
    }

    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    const Msun = _getMeanAnomalySun(k, T);
    const Mmoon = _getMeanAnomalyMoon(k, T);
    const F = _getArgumentOfLatitudeMoon(k, T);

    const MsunRad = deg2rad(Msun);
    const MmoonRad = deg2rad(Mmoon);
    const FRad = deg2rad(F);

    const w = 0.00306
        - 0.00038 * E * Math.cos(MsunRad)
        + 0.00026 * Math.cos(MmoonRad)
        - 0.00002 * Math.cos(MmoonRad - MsunRad)
        + 0.00002 * Math.cos(MmoonRad + MsunRad)
        + 0.00002 * Math.cos(2 * FRad);

    return moonPhase === MOON_PHASE_FIRST_QUARTER ? w : -1 * w;
}

function _getPlanetaryCorrections(k: number, T: number): number {
    const A1 = deg2rad(299.77 + 0.107408 * k - 0.009173 * Math.pow(T, 2));
    const A2 = deg2rad(251.88 + 0.016321 * k);
    const A3 = deg2rad(251.83 + 26.651776 * k);
    const A4 = deg2rad(349.42 + 36.412478 * k);
    const A5 = deg2rad(84.66 + 18.206239 * k);
    const A6 = deg2rad(141.74 + 53.303771 * k);
    const A7 = deg2rad(207.84 + 2.453732 * k);
    const A8 = deg2rad(154.84 + 7.306860 * k);
    const A9 = deg2rad(34.52 + 27.261239 * k);
    const A10 = deg2rad(207.19 + 0.121824 * k);
    const A11 = deg2rad(291.34 + 1.844379 * k);
    const A12 = deg2rad(161.72 + 24.198154 * k);
    const A13 = deg2rad(239.56 + 25.513099 * k);
    const A14 = deg2rad(331.55 + 3.592518 * k);

    return 0.000325 * Math.sin(A1)
        + 0.000165 * Math.sin(A2)
        + 0.000164 * Math.sin(A3)
        + 0.000126 * Math.sin(A4)
        + 0.000110 * Math.sin(A5)
        + 0.000062 * Math.sin(A6)
        + 0.000060 * Math.sin(A7)
        + 0.000056 * Math.sin(A8)
        + 0.000047 * Math.sin(A9)
        + 0.000042 * Math.sin(A10)
        + 0.000040 * Math.sin(A11)
        + 0.000037 * Math.sin(A12)
        + 0.000035 * Math.sin(A13)
        + 0.000023 * Math.sin(A14);
}

function _getJulianEphemerisDays(k: number, T: number): number {
    return 2451550.09766
        + 29.530588861 * k
        + 0.00015437 * Math.pow(T, 2)
        + 0.000000150 * Math.pow(T, 3)
        + 0.00000000073 * Math.pow(T, 4);
}

function _getMeanAnomalySun(k: number, T: number): number {
    return 2.5534
        + 29.10535670 * k
        - 0.0000014 * Math.pow(T, 2)
        - 0.00000011 * Math.pow(T, 3);
}

function _getMeanAnomalyMoon(k: number, T: number): number {
    return 201.5643
        + 385.81693528 * k
        + 0.0107582 * Math.pow(T, 2)
        + 0.00001238 * Math.pow(T, 3)
        + 0.000000058 * Math.pow(T, 4);
}

function _getArgumentOfLatitudeMoon(k: number, T: number): number {
    return 160.7108
        + 390.67050284 * k
        + 0.0016118 * Math.pow(T, 2)
        + 0.00000227 * Math.pow(T, 3)
        + 0.000000011 * Math.pow(T, 4);
}

function _getLongitudeOfAscendingNodeMoon(k: number, T: number): number {
    return 124.7746
        + 390.67050284 * k
        + 0.0020672 * Math.pow(T, 2)
        + 0.00000215 * Math.pow(T, 3);
}
