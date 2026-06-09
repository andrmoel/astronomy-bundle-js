import {EARTH_AXIS_RATIO, EARTH_EQUATORIAL_RADIUS_METERS, EARTH_ROTATION_DEG_PER_HOUR} from '@app/constants/earth';
import {DEG} from '@app/constants/math';
import type {Location} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements} from '../types/BesselianElementTypes';
import type {EclipseContacts} from '../types/EclipseContactTypes';
import {getBesselianElementsAtTime, tau2julianDay} from './besselianElements';

const ITERATION_TOLERANCE_HOURS = 1e-8;
const MAX_ITERATIONS = 30;
const TIME_MARGIN_HOURS = 0.5;
const SEARCH_RANGE_HOURS = 4;

interface ObserverGeocentric {
    rhoSinPhi: number;
    rhoCosPhi: number;
    lon: number;
}

interface FundamentalSnapshot {
    u: number;
    v: number;
    uDot: number;
    vDot: number;
    nSq: number;
    l1: number;
    l2: number;
}

export function getContactTaus(elements: BesselianElements, location: Location): EclipseContacts | null {
    const obs = computeObserverGeocentric(location);

    const max = findMaximum(elements, obs, 0);
    if (max === null) {
        return null;
    }

    const atMax = snapshot(elements, max, obs);
    const minDistSq = atMax.u * atMax.u + atMax.v * atMax.v;
    if (minDistSq > atMax.l1 * atMax.l1) {
        return null;
    }

    const c1 = findContact(elements, obs, max, false, false);
    const c4 = findContact(elements, obs, max, false, true);
    if (c1 === null || c4 === null) {
        return null;
    }

    let c2: number | null = null;
    let c3: number | null = null;
    if (minDistSq < atMax.l2 * atMax.l2) {
        const tauC2 = findContact(elements, obs, max, true, false);
        const tauC3 = findContact(elements, obs, max, true, true);
        if (tauC2 !== null && tauC3 !== null) {
            c2 = tauC2;
            c3 = tauC3;
        }
    }

    return {c1, c2, max, c3, c4};
}

export function contactTausToContactJulianDays(
    elements: BesselianElements,
    contactTaus: EclipseContacts,
): EclipseContacts | null {
    if (!contactTaus) {
        return null;
    }

    return {
        c1: tau2julianDay(elements, contactTaus.c1),
        c2: contactTaus.c2 ? tau2julianDay(elements, contactTaus.c2) : null,
        max: tau2julianDay(elements, contactTaus.max),
        c3: contactTaus.c3 ? tau2julianDay(elements, contactTaus.c3) : null,
        c4: tau2julianDay(elements, contactTaus.c4),
    };
}

function computeObserverGeocentric(location: Location): ObserverGeocentric {
    const latRad = location.lat * DEG;
    const h = location.elevation / EARTH_EQUATORIAL_RADIUS_METERS;
    const u = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));

    return {
        rhoSinPhi: EARTH_AXIS_RATIO * Math.sin(u) + h * Math.sin(latRad),
        rhoCosPhi: Math.cos(u) + h * Math.cos(latRad),
        lon: location.lon,
    };
}

function findMaximum(elements: BesselianElements, obs: ObserverGeocentric, startTau: number): number | null {
    let tau = startTau;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const s = snapshot(elements, tau, obs);
        if (s.nSq === 0) {
            return null;
        }
        const delta = -(s.u * s.uDot + s.v * s.vDot) / s.nSq;
        tau += delta;
        if (!inBounds(tau)) {
            return null;
        }
        if (Math.abs(delta) < ITERATION_TOLERANCE_HOURS) {
            return tau;
        }
    }

    return inBounds(tau) ? tau : null;
}

function snapshot(elements: BesselianElements, tau: number, obs: ObserverGeocentric): FundamentalSnapshot {
    const e = getBesselianElementsAtTime(elements, tau);
    const dMuDt = polynomialDerivative(elements.mu, tau) * DEG;
    const dDDt = polynomialDerivative(elements.d, tau) * DEG;

    const deltaTCorrection = (EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600;
    const hourAngle = e.mu + (obs.lon - deltaTCorrection) * DEG;
    const sinH = Math.sin(hourAngle);
    const cosH = Math.cos(hourAngle);

    const xi = obs.rhoCosPhi * sinH;
    const eta = obs.rhoSinPhi * e.cosD - obs.rhoCosPhi * cosH * e.sinD;
    const zeta = obs.rhoSinPhi * e.sinD + obs.rhoCosPhi * cosH * e.cosD;

    const xiDot = dMuDt * obs.rhoCosPhi * cosH;
    const etaDot = dMuDt * xi * e.sinD - zeta * dDDt;

    const dx = polynomialDerivative(elements.x, tau);
    const dy = polynomialDerivative(elements.y, tau);

    const u = e.x - xi;
    const v = e.y - eta;
    const uDot = dx - xiDot;
    const vDot = dy - etaDot;

    return {
        u,
        v,
        uDot,
        vDot,
        nSq: uDot * uDot + vDot * vDot,
        l1: e.l1 - zeta * elements.tanF1,
        l2: e.l2 - zeta * elements.tanF2,
    };
}

function findContact(
    elements: BesselianElements,
    obs: ObserverGeocentric,
    startTau: number,
    useUmbra: boolean,
    isAfterMax: boolean,
): number | null {
    let tau = startTau;
    const sign = isAfterMax ? 1 : -1;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const s = snapshot(elements, tau, obs);
        if (s.nSq === 0) {
            return null;
        }
        const l = useUmbra ? s.l2 : s.l1;
        const cross = s.u * s.vDot - s.v * s.uDot;
        const discriminant = s.nSq * l * l - cross * cross;
        if (discriminant < 0) {
            return null;
        }
        const sqrtDisc = Math.sqrt(discriminant);
        const delta = (-(s.u * s.uDot + s.v * s.vDot) + sign * sqrtDisc) / s.nSq;
        tau += delta;
        if (!inBounds(tau)) {
            return null;
        }
        if (Math.abs(delta) < ITERATION_TOLERANCE_HOURS) {
            return tau;
        }
    }

    return inBounds(tau) ? tau : null;
}

function inBounds(tau: number): boolean {
    return Math.abs(tau) <= SEARCH_RANGE_HOURS + TIME_MARGIN_HOURS;
}
