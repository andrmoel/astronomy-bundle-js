import {BesselianElements} from '../types/besselianElementsTypes';
import {ObservationalCircumstances, TimeCircumstances, TimeLocationCircumstances} from '../types/circumstancesTypes';
import {Location} from '../../earth/types/LocationTypes';
import {deg2rad} from '../../utils/angleCalc';
import {getRhoCosLat, getRhoSinLat} from '../../coordinates/calculations/coordinateCalc';
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
