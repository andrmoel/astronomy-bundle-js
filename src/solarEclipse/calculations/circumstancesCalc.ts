import {BesselianElements} from '../types/besselianElementsTypes';
import {TimeDependentCircumstances, TimeLocalDependentCircumstances} from '../types/circumstancesTypes';
import {Location} from '../../earth/types/LocationTypes';
import {deg2rad} from '../../utils/angleCalc';
import {getRhoCosLat, getRhoSinLat} from '../../coordinates/calculations/coordinateCalc';
import {populate, populateD} from './besselianElementsCalc';

export function getTimeDependentCircumstances(
    besselianElements: BesselianElements,
    t: number,
): TimeDependentCircumstances {
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

export function getTimeLocalDependentCircumstances(
    besselianElements: BesselianElements,
    location: Location,
    t: number,
): TimeLocalDependentCircumstances {
    const {dT} = besselianElements;
    const {lat, lon, elevation} = location;

    const {x, dX, y, dY, mu, dMu, d, dD} = getTimeDependentCircumstances(besselianElements, t);
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

    return {u, v, a, b}
}
