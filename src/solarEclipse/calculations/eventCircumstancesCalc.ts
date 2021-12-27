import {BesselianElements} from '../types/besselianElementsTypes';
import {Location} from '../../earth/types/LocationTypes';
import {TimeLocationCircumstances} from '../types/circumstancesTypes';
import {SolarEclipseEventType} from '../constants/solarEclipseEvents';
import {getTimeLocationCircumstances} from './circumstancesCalc';

export function getTimeLocationCircumstancesMaxEclipse(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    let t = 0;
    let tau = 1;

    let circumstances = getTimeLocationCircumstances(besselianElements, location, t);

    let cnt = 0;
    while (Math.abs(tau) > 0.000001 && cnt < 50) {
        const {u, v, a, b, n2} = circumstances;

        tau = (u * a + v * b) / n2;
        t -= tau;

        circumstances = getTimeLocationCircumstances(besselianElements, location, t);

        cnt++;
    }

    return circumstances;
}

export function getTimeLocationCircumstancesC1(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    return iterateCircumstancesC1C4(besselianElements, location, SolarEclipseEventType.c1);
}

export function getTimeLocationCircumstancesC2(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    return iterateCircumstancesC2C3(besselianElements, location, SolarEclipseEventType.c2);
}

export function getTimeLocationCircumstancesC3(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    return iterateCircumstancesC2C3(besselianElements, location, SolarEclipseEventType.c3);
}

export function getTimeLocationCircumstancesC4(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    return iterateCircumstancesC1C4(besselianElements, location, SolarEclipseEventType.c4);
}

function iterateCircumstancesC1C4(
    besselianElements: BesselianElements,
    location: Location,
    eventType: SolarEclipseEventType,
): TimeLocationCircumstances {
    const circumstancesMaximumEclipse = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);
    const tauD = getTauForEclipseContacts(circumstancesMaximumEclipse, eventType);

    let t = circumstancesMaximumEclipse.t - tauD;
    let tau = 1;
    const sign = eventType === SolarEclipseEventType.c1 ? -1 : 1;

    let circumstances = getTimeLocationCircumstances(besselianElements, location, t);

    let cnt = 0;
    while (Math.abs(tau) > 0.000001 && cnt < 50) {
        const {u, v, a, b, l1Derived, n2} = circumstances;
        const n = Math.sqrt(n2);

        tau = (v * a - u * b) / (n * l1Derived);

        if (Math.abs(tau) <= 1.0) {
            tau = sign * Math.sqrt(1.0 - Math.pow(tau, 2)) * l1Derived / n;
        } else {
            tau = 0.0;
        }

        t -= (u * a + v * b) / n2 - tau;

        circumstances = getTimeLocationCircumstances(besselianElements, location, t);

        cnt++;
    }

    return circumstances;
}

function iterateCircumstancesC2C3(
    besselianElements: BesselianElements,
    location: Location,
    eventType: SolarEclipseEventType,
): TimeLocationCircumstances {
    const circumstancesMaximumEclipse = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);
    const tauD = getTauForEclipseContacts(circumstancesMaximumEclipse, eventType);

    const {l2Derived} = circumstancesMaximumEclipse;

    let t = circumstancesMaximumEclipse.t + (isTotalSolarEclipse(circumstancesMaximumEclipse) ? tauD : -1 * tauD);

    let sign = eventType === SolarEclipseEventType.c2 ? -1 : 1;
    if (l2Derived < 0.0) {
        sign = -1 * sign;
    }

    let circumstances = getTimeLocationCircumstances(besselianElements, location, t);
    let tau = 1;
    let cnt = 0;
    while (Math.abs(tau) > 0.000001 && cnt < 50) {
        const {u, v, a, b, l2Derived, n2} = circumstances;
        const n = Math.sqrt(n2);

        tau = (v * a - u * b) / (n * l2Derived);

        if (Math.abs(tau) <= 1.0) {
            tau = sign * Math.sqrt(1.0 - Math.pow(tau, 2)) * l2Derived / n;
        } else {
            tau = 0.0;
        }

        t -= (u * a + v * b) / n2 - tau;

        circumstances = getTimeLocationCircumstances(besselianElements, location, t);
        cnt++;
    }

    return circumstances;
}

function getTauForEclipseContacts(
    circumstancesMaximumEclipse: TimeLocationCircumstances,
    eventType: SolarEclipseEventType,
): number {
    const {u, v, a, b, l1Derived, l2Derived, n2} = circumstancesMaximumEclipse;
    const n = Math.sqrt(n2);

    const lDerived = eventType === SolarEclipseEventType.c1 || eventType === SolarEclipseEventType.c4
        ? l1Derived
        : l2Derived;

    const tau = (v * a - u * b) / (n * lDerived);

    if (Math.abs(tau) > 1.0) {
        return 0.0;
    }

    return Math.sqrt(1.0 - Math.pow(tau, 2)) * lDerived / n;
}

function isTotalSolarEclipse(circumstances: TimeLocationCircumstances): boolean {
    return circumstances.l2Derived < 0.0;
}