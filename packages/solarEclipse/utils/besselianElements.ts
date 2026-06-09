import {DEG} from '@app/constants/math';
import {polynomial} from '@app/utils/polynoms';
import type {BesselianElements, BesselianElementsAtTime, Catalogue} from '../types/BesselianElementTypes';

export function getBesselianElementsFromCatalogue(catalogue: Catalogue, julianDay: number): BesselianElements {
    const raw = catalogue[julianDay];

    if (!raw) {
        throw new Error(`No Besselian elements found for eclipse on JD ${julianDay}`);
    }

    return parseBesselianElements(raw);
}

export function parseBesselianElements(raw: Array<number>): BesselianElements {
    if (raw.length !== 28) {
        throw new Error(`Expected 28 Besselian element values, got ${raw.length}`);
    }

    return {
        t0Jde: raw[0],
        t0Hours: raw[1],
        tMin: raw[2],
        tMax: raw[3],
        deltaT: raw[4],
        x: [raw[6], raw[7], raw[8], raw[9]],
        y: [raw[10], raw[11], raw[12], raw[13]],
        d: [raw[14], raw[15], raw[16]],
        mu: [raw[17], raw[18], raw[19]],
        l1: [raw[20], raw[21], raw[22]],
        l2: [raw[23], raw[24], raw[25]],
        tanF1: raw[26],
        tanF2: raw[27],
    };
}

export function getBesselianElementsAtTime(elements: BesselianElements, tau: number): BesselianElementsAtTime {
    const d = polynomial(elements.d, tau) * DEG;
    const mu = polynomial(elements.mu, tau) * DEG;

    return {
        x: polynomial(elements.x, tau),
        y: polynomial(elements.y, tau),
        d,
        mu,
        l1: polynomial(elements.l1, tau),
        l2: polynomial(elements.l2, tau),
        sinD: Math.sin(d),
        cosD: Math.cos(d),
    };
}

export function tau2julianDay(elements: BesselianElements, tau: number): number {
    const polyRefJd = Math.floor(elements.t0Jde - elements.t0Hours / 24) + 0.5 + elements.t0Hours / 24;

    return polyRefJd + (tau - elements.deltaT / 3600) / 24;
}

export function julianDay2tau(elements: BesselianElements, jd: number): number {
    const polyRefJd = Math.floor(elements.t0Jde - elements.t0Hours / 24) + 0.5 + elements.t0Hours / 24;
    return (jd - polyRefJd) * 24 + elements.deltaT / 3600;
}
