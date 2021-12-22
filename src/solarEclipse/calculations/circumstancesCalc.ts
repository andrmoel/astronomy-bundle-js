import {BesselianElements} from '../types/besselianElementsTypes';
import {ObservationalCircumstances, TimeCircumstances, TimeLocationCircumstances} from '../types/circumstancesTypes';
import {Location} from '../../earth/types/LocationTypes';
import {deg2rad} from '../../utils/angleCalc';
import {getRhoCosLat, getRhoSinLat} from '../../coordinates/calculations/coordinateCalc';
import {SolarEclipseEventType} from '../constants/solarEclipseEvents';
import {populate, populateD} from './besselianElementsCalc';

export function getTimeCircumstances(
    besselianElements: BesselianElements,
    t: number,
): TimeCircumstances {
    const {x, y, d, mu, l1, l2} = besselianElements;

    return {
        x: populate(x, t),
        dX: populateD(x, t),
        y: populate(y, t),
        dY: populateD(y, t),
        d: populate(d, t),
        dD: populateD(d, t),
        mu: populate(mu, t),
        dMu: populateD(mu, t),
        l1: populate(l1, t),
        dL1: populateD(l1, t),
        l2: populate(l2, t),
        dL2: populateD(l2, t),
    }
}

export function getTimeLocationCircumstances(
    besselianElements: BesselianElements,
    location: Location,
    t: number,
): TimeLocationCircumstances {
    const {tMax, t0, dT, tanF1, tanF2} = besselianElements;
    const {lat, lon, elevation} = location;

    const {x, dX, y, dY, mu, dMu, d, dD, l1, l2} = getTimeCircumstances(besselianElements, t);
    const rhoSinLat = getRhoSinLat(lat, elevation);
    const rhoCosLat = getRhoCosLat(lat, elevation);

    const muRad = deg2rad(mu);
    const dMuRad = deg2rad(dMu);
    const dRad = deg2rad(d);
    const dDRad = deg2rad(dD);
    const lonRad = deg2rad(lon);

    const hRad = muRad + lonRad - (dT / 13713.440924999626077);

    const xi = rhoCosLat * Math.sin(hRad);
    const eta = rhoSinLat * Math.cos(dRad) - rhoCosLat * Math.cos(hRad) * Math.sin(dRad);
    const zeta = rhoSinLat * Math.sin(dRad) + rhoCosLat * Math.cos(hRad) * Math.cos(dRad);
    const dXi = dMuRad * rhoCosLat * Math.cos(hRad);
    const dEta = dMuRad * xi * Math.sin(dRad) - zeta * dDRad;

    const u = x - xi;
    const v = y - eta;
    const a = dX - dXi;
    const b = dY - dEta;

    // TODO If condition
    const l1Derived = l1 - zeta * tanF1;
    const l2Derived = l2 - zeta * tanF2;

    const n2 = Math.pow(a, 2) + Math.pow(b, 2);

    return {tMax, t0, dT, t, u, v, a, b, l1Derived, l2Derived, n2}
}

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

export function getTimeLocationCircumstancesC4(
    besselianElements: BesselianElements,
    location: Location,
): TimeLocationCircumstances {
    return iterateCircumstancesC1C4(besselianElements, location, SolarEclipseEventType.c4);
}

export function getObservationalCircumstances(
    circumstances: TimeLocationCircumstances,
): ObservationalCircumstances {
    const {u, v, l1Derived, l2Derived} = circumstances;

    const maximumEclipse = Math.sqrt(Math.pow(u, 2) + Math.pow(v, 2));
    const magnitude = (l1Derived - maximumEclipse) / (l1Derived + l2Derived);
    const moonSunRatio = (l1Derived - l2Derived) / (l1Derived + l2Derived);

    return {
        maximumEclipse,
        magnitude,
        moonSunRatio,
    }
}

export function circumstancesToJulianDay(circumstances: TimeLocationCircumstances): number {
    let {tMax, t0, dT, t} = circumstances;

    let jd = Math.floor(tMax - t0 / 24.0);
    t = t + t0 - ((dT - 0.05) / 3600.0);

    if (t < 0.0) {
        jd--;
    } else if (t >= 24.0) {
        jd++;
    }

    return jd + (t + 12) / 24;
}

function iterateCircumstancesC1C4(
    besselianElements: BesselianElements,
    location: Location,
    eventType: SolarEclipseEventType,
): TimeLocationCircumstances {
    const circumstancesMaximumEclipse = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);
    const tauC1C4 = getTauForContact1AndContact4(circumstancesMaximumEclipse);

    let t = circumstancesMaximumEclipse.t - tauC1C4;
    let tau = 1;
    let cnt = 0;
    const sign = eventType === SolarEclipseEventType.c1 ? -1 : 1;

    let circumstances = getTimeLocationCircumstances(besselianElements, location, t);

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

function getTauForContact1AndContact4(circumstancesMaximumEclipse: TimeLocationCircumstances): number {
    const {u, v, a, b, l1Derived, n2} = circumstancesMaximumEclipse;

    const n = Math.sqrt(n2);
    const tau = (v * a - u * b) / (n * l1Derived);

    if (Math.abs(tau) > 1.0) {
        return 0.0;
    }

    return Math.sqrt(1.0 - Math.pow(tau, 2)) * l1Derived / n;
}
