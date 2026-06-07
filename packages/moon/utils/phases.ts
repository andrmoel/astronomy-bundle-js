import {DEG} from '@app/constants/math';
import {
    MOON_PHASE_FIRST_QUARTER,
    MOON_PHASE_FULL_MOON,
    MOON_PHASE_LAST_QUARTER,
    MOON_PHASE_NEW_MOON,
} from '@app/constants/moon';
import {round} from '@app/utils/math';
import TimeOfInterest from '@package/time/models/TimeOfInterest';

export function getTimeOfInterestOfUpcomingPhase(decimalYear: number, moonPhase: number): TimeOfInterest {
    const k = round((decimalYear - 2000) * 12.3685) + moonPhase;
    const T = k / 1236.85;

    const JDE = getJulianEphemerisDays(k, T);
    const corrections = getPeriodicTermCorrections(k, T, moonPhase);
    const wCorrections = getQuarterPhaseCorrections(k, T, moonPhase);
    const pCorrections = getPlanetaryCorrections(k, T);

    const jd = JDE + corrections + wCorrections + pCorrections;

    return TimeOfInterest.fromJulianDay(jd);
}

function getPeriodicTermCorrections(k: number, T: number, moonPhase: number): number {
    switch (moonPhase) {
        case MOON_PHASE_NEW_MOON:
            return getPeriodicTermCorrectionsForNewMoon(k, T);
        case MOON_PHASE_FULL_MOON:
            return getPeriodicTermCorrectionsForFullMoon(k, T);
        case MOON_PHASE_FIRST_QUARTER:
        case MOON_PHASE_LAST_QUARTER:
            return getPeriodicTermCorrectionsForQuarters(k, T);
        default:
            throw new Error(`Invalid moon phase: ${moonPhase}`);
    }
}

function getPeriodicTermCorrectionsForNewMoon(k: number, T: number): number {
    const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
    const Msun = getMeanAnomalySun(k, T);
    const Mmoon = getMeanAnomalyMoon(k, T);
    const F = getArgumentOfLatitudeMoon(k, T);
    const omega = getLongitudeOfAscendingNodeMoon(k, T);

    const MsunRad = Msun * DEG;
    const MmoonRad = Mmoon * DEG;
    const FRad = F * DEG;
    const omegaRad = omega * DEG;

    return (
        -0.4072 * Math.sin(MmoonRad)
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
        + 0.00002 * Math.sin(4.0 * MmoonRad)
    );
}

function getPeriodicTermCorrectionsForFullMoon(k: number, T: number): number {
    const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
    const Msun = getMeanAnomalySun(k, T);
    const Mmoon = getMeanAnomalyMoon(k, T);
    const F = getArgumentOfLatitudeMoon(k, T);
    const omega = getLongitudeOfAscendingNodeMoon(k, T);

    const MsunRad = Msun * DEG;
    const MmoonRad = Mmoon * DEG;
    const FRad = F * DEG;
    const omegaRad = omega * DEG;

    return (
        -0.40614 * Math.sin(MmoonRad)
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
        + 0.00002 * Math.sin(4.0 * MmoonRad)
    );
}

function getPeriodicTermCorrectionsForQuarters(k: number, T: number): number {
    const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
    const Msun = getMeanAnomalySun(k, T);
    const Mmoon = getMeanAnomalyMoon(k, T);
    const F = getArgumentOfLatitudeMoon(k, T);
    const omega = getLongitudeOfAscendingNodeMoon(k, T);

    const MsunRad = Msun * DEG;
    const MmoonRad = Mmoon * DEG;
    const FRad = F * DEG;
    const omegaRad = omega * DEG;

    return (
        -0.62801 * Math.sin(MmoonRad)
        + 0.17172 * E * Math.sin(MsunRad)
        - 0.01183 * E * Math.sin(MmoonRad + MsunRad)
        + 0.00862 * Math.sin(2.0 * MmoonRad)
        + 0.00804 * Math.sin(2.0 * FRad)
        + 0.00454 * E * Math.sin(MmoonRad - MsunRad)
        + 0.00204 * E * E * Math.sin(2.0 * MsunRad)
        - 0.0018 * Math.sin(MmoonRad - 2.0 * FRad)
        - 0.0007 * Math.sin(MmoonRad + 2.0 * FRad)
        - 0.0004 * Math.sin(3.0 * MmoonRad)
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
        - 0.00002 * Math.sin(3.0 * MmoonRad + MsunRad)
    );
}

function getQuarterPhaseCorrections(k: number, T: number, moonPhase: number): number {
    if (moonPhase === MOON_PHASE_FULL_MOON || moonPhase === MOON_PHASE_NEW_MOON) {
        return 0.0;
    }

    const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
    const Msun = getMeanAnomalySun(k, T);
    const Mmoon = getMeanAnomalyMoon(k, T);
    const F = getArgumentOfLatitudeMoon(k, T);

    const MsunRad = Msun * DEG;
    const MmoonRad = Mmoon * DEG;
    const FRad = F * DEG;

    const w =
        0.00306
        - 0.00038 * E * Math.cos(MsunRad)
        + 0.00026 * Math.cos(MmoonRad)
        - 0.00002 * Math.cos(MmoonRad - MsunRad)
        + 0.00002 * Math.cos(MmoonRad + MsunRad)
        + 0.00002 * Math.cos(2 * FRad);

    return moonPhase === MOON_PHASE_FIRST_QUARTER ? w : -1 * w;
}

function getPlanetaryCorrections(k: number, T: number): number {
    const A1 = (299.77 + 0.107408 * k - 0.009173 * T ** 2) * DEG;
    const A2 = (251.88 + 0.016321 * k) * DEG;
    const A3 = (251.83 + 26.651776 * k) * DEG;
    const A4 = (349.42 + 36.412478 * k) * DEG;
    const A5 = (84.66 + 18.206239 * k) * DEG;
    const A6 = (141.74 + 53.303771 * k) * DEG;
    const A7 = (207.84 + 2.453732 * k) * DEG;
    const A8 = (154.84 + 7.30686 * k) * DEG;
    const A9 = (34.52 + 27.261239 * k) * DEG;
    const A10 = (207.19 + 0.121824 * k) * DEG;
    const A11 = (291.34 + 1.844379 * k) * DEG;
    const A12 = (161.72 + 24.198154 * k) * DEG;
    const A13 = (239.56 + 25.513099 * k) * DEG;
    const A14 = (331.55 + 3.592518 * k) * DEG;

    return (
        0.000325 * Math.sin(A1)
        + 0.000165 * Math.sin(A2)
        + 0.000164 * Math.sin(A3)
        + 0.000126 * Math.sin(A4)
        + 0.00011 * Math.sin(A5)
        + 0.000062 * Math.sin(A6)
        + 0.00006 * Math.sin(A7)
        + 0.000056 * Math.sin(A8)
        + 0.000047 * Math.sin(A9)
        + 0.000042 * Math.sin(A10)
        + 0.00004 * Math.sin(A11)
        + 0.000037 * Math.sin(A12)
        + 0.000035 * Math.sin(A13)
        + 0.000023 * Math.sin(A14)
    );
}

function getJulianEphemerisDays(k: number, T: number): number {
    return 2451550.09766 + 29.530588861 * k + 0.00015437 * T ** 2 + 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
}

function getMeanAnomalySun(k: number, T: number): number {
    return 2.5534 + 29.1053567 * k - 0.0000014 * T ** 2 - 0.00000011 * T ** 3;
}

function getMeanAnomalyMoon(k: number, T: number): number {
    return 201.5643 + 385.81693528 * k + 0.0107582 * T ** 2 + 0.00001238 * T ** 3 + 0.000000058 * T ** 4;
}

function getArgumentOfLatitudeMoon(k: number, T: number): number {
    return 160.7108 + 390.67050284 * k + 0.0016118 * T ** 2 + 0.00000227 * T ** 3 + 0.000000011 * T ** 4;
}

function getLongitudeOfAscendingNodeMoon(k: number, T: number): number {
    return 124.7746 + 390.67050284 * k + 0.0020672 * T ** 2 + 0.00000215 * T ** 3;
}
