import {BesselianElements} from '../types/besselianElementsTypes';
import {Location} from '../../earth/types/LocationTypes';
import {TimeLocationCircumstances} from '../types/circumstancesTypes';
import {SolarEclipseEventType} from '../constants/solarEclipseEvents';
import {round} from '../../utils/math';
import {SolarEclipseType} from '../constants/solarEclipseTypes';
import {getTimeLocationCircumstances} from './circumstancesCalc';
import {getEclipseType} from './observationalCircumstancesCalc';

export function getTimeLocationCircumstancesMaxEclipse(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    const circumstances = iterateCircumstancesMax(besselianElements, location);

    validateCircumstances(circumstances, location, SolarEclipseEventType.Mid);

    return circumstances;
}

export function getTimeLocationCircumstancesC1(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    const circumstances = iterateCircumstancesMax(besselianElements, location);

    validateCircumstances(circumstances, location, SolarEclipseEventType.C1);

    return iterateCircumstancesForContact(besselianElements, location, SolarEclipseEventType.C1);
}

export function getTimeLocationCircumstancesC2(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    const circumstances = iterateCircumstancesMax(besselianElements, location);

    validateCircumstances(circumstances, location, SolarEclipseEventType.C2);

    return iterateCircumstancesForContact(besselianElements, location, SolarEclipseEventType.C2);
}

export function getTimeLocationCircumstancesC3(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    const circumstances = iterateCircumstancesMax(besselianElements, location);

    validateCircumstances(circumstances, location, SolarEclipseEventType.C3);

    return iterateCircumstancesForContact(besselianElements, location, SolarEclipseEventType.C3);
}

export function getTimeLocationCircumstancesC4(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    const circumstances = iterateCircumstancesMax(besselianElements, location);

    validateCircumstances(circumstances, location, SolarEclipseEventType.C4);

    return iterateCircumstancesForContact(besselianElements, location, SolarEclipseEventType.C4);
}

function iterateCircumstancesMax(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    let t = 0;
    let tau = 1;
    let cnt = 0;

    let circumstances = getTimeLocationCircumstances(besselianElements, location, t);

    while (Math.abs(tau) > 0.000001 && cnt < 50) {
        const {u, v, a, b, n2} = circumstances;

        tau = (u * a + v * b) / n2;
        t -= tau;

        circumstances = getTimeLocationCircumstances(besselianElements, location, t);

        cnt++;
    }

    return circumstances;
}

function iterateCircumstancesForContact(
    besselianElements: BesselianElements,
    location: Location,
    eventType: SolarEclipseEventType,
): TimeLocationCircumstances {
    const circumstancesMax = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

    let t = getTForContacts(circumstancesMax, eventType);
    const sign = getSign(circumstancesMax, eventType);

    let circumstances = getTimeLocationCircumstances(besselianElements, location, t);
    let tau = 1;
    let cnt = 0;

    while (Math.abs(tau) > 0.000001 && cnt < 50) {
        const {u, v, a, b, n2} = circumstances;
        const lParamDerived = getLDerived(circumstances, eventType);

        const n = Math.sqrt(n2);
        tau = (v * a - u * b) / (n * lParamDerived);

        if (Math.abs(tau) <= 1.0) {
            tau = sign * Math.sqrt(1.0 - Math.pow(tau, 2)) * lParamDerived / n;
        } else {
            tau = 0.0;
        }

        t -= (u * a + v * b) / n2 - tau;

        circumstances = getTimeLocationCircumstances(besselianElements, location, t);

        cnt++;
    }

    return circumstances;
}

function getTForContacts(
    circumstancesMax: TimeLocationCircumstances,
    eventType: SolarEclipseEventType,
): number {
    const {t, l2Derived} = circumstancesMax;
    const tauD = getTauForEclipseContacts(circumstancesMax, eventType);

    if (eventType === SolarEclipseEventType.C2 || eventType === SolarEclipseEventType.C3) {
        if (l2Derived < 0.0) {
            return t + tauD;
        }
    }

    return t - tauD;
}

function getTauForEclipseContacts(
    circumstancesMax: TimeLocationCircumstances,
    eventType: SolarEclipseEventType,
): number {
    const {u, v, a, b, n2} = circumstancesMax;
    const lDerived = getLDerived(circumstancesMax, eventType);

    const n = Math.sqrt(n2);
    const tau = (v * a - u * b) / (n * lDerived);

    if (Math.abs(tau) > 1.0) {
        return 0.0;
    }

    return Math.sqrt(1.0 - Math.pow(tau, 2)) * lDerived / n;
}

function getSign(
    circumstancesMax: TimeLocationCircumstances,
    eventType: SolarEclipseEventType,
): number {
    const sign = (eventType === SolarEclipseEventType.C1 || eventType === SolarEclipseEventType.C2) ? -1 : 1;

    if (eventType === SolarEclipseEventType.C2 || eventType === SolarEclipseEventType.C3) {
        const {l2Derived} = circumstancesMax;

        if (l2Derived < 0.0) {
            return -1 * sign;
        }
    }

    return sign;
}

function getLDerived(
    circumstances: TimeLocationCircumstances,
    eventType: SolarEclipseEventType,
): number {
    const {l1Derived, l2Derived} = circumstances;

    if (eventType === SolarEclipseEventType.C1 || eventType === SolarEclipseEventType.C4) {
        return l1Derived;
    }

    return l2Derived;
}

function validateCircumstances(
    circumstances: TimeLocationCircumstances,
    location: Location,
    eventType: SolarEclipseEventType,
): void {
    const {lat, lon} = location;
    const eclipseType = getEclipseType(circumstances);

    if (eclipseType === SolarEclipseType.None) {
        throw new Error(`No eclipse visible at ${round(lat, 5)}, ${round(lon, 5)}`);
    }

    if (eclipseType === SolarEclipseType.Partial) {
        if (eventType === SolarEclipseEventType.C2) {
            throw new Error(`No C2 possible. Eclipse is only partial at ${round(lat, 5)}, ${round(lon, 5)}`);
        }

        if (eventType === SolarEclipseEventType.C3) {
            throw new Error(`No C3 possible. Eclipse is only partial at ${round(lat, 5)}, ${round(lon, 5)}`);
        }
    }
}
