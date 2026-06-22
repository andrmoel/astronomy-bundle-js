import type {LatLon} from '@app/types/LocationTypes';
import {polynomialDerivative} from '@app/utils/polynoms';
import type {BesselianElements, BesselianElementsAtTime} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '../utils/besselianElements';
import {calculateShadowBoundaryPoint} from './shadowBoundary';

function shortestAngularDelta(from: number, to: number): number {
    let delta = to - from;
    while (delta > Math.PI) {
        delta -= 2 * Math.PI;
    }
    while (delta < -Math.PI) {
        delta += 2 * Math.PI;
    }

    return delta;
}

function findTerminatorBoundaryTowards(
    elements: BesselianElements,
    e: BesselianElementsAtTime,
    qTarget: number,
    useUmbra: boolean,
): LatLon | null {
    const qToEarthCenter = Math.atan2(-e.y, -e.x);
    if (calculateShadowBoundaryPoint(elements, e, qToEarthCenter, useUmbra) === null) {
        return null;
    }

    let qIn = qToEarthCenter;
    let qOut = qIn + shortestAngularDelta(qIn, qTarget);

    for (let iter = 0; iter < 50; iter++) {
        const qMid = (qIn + qOut) / 2;
        const p = calculateShadowBoundaryPoint(elements, e, qMid, useUmbra);
        if (p !== null) {
            qIn = qMid;
        } else {
            qOut = qMid;
        }
        if (Math.abs(qOut - qIn) < 1e-10) {
            break;
        }
    }

    return calculateShadowBoundaryPoint(elements, e, qIn, useUmbra);
}

function calculateLimitPoints(
    elements: BesselianElements,
    tau: number,
    useUmbra: boolean,
): {north: LatLon; south: LatLon} | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const dx = polynomialDerivative(elements.x, tau);
    const dy = polynomialDerivative(elements.y, tau);
    const qN = Math.atan2(dx, -dy);
    const qS = qN + Math.PI;

    let north = calculateShadowBoundaryPoint(elements, e, qN, useUmbra);
    if (north === null) {
        north = findTerminatorBoundaryTowards(elements, e, qN, useUmbra);
    }
    let south = calculateShadowBoundaryPoint(elements, e, qS, useUmbra);
    if (south === null) {
        south = findTerminatorBoundaryTowards(elements, e, qS, useUmbra);
    }

    if (north === null || south === null) {
        return null;
    }

    return {north, south};
}

export function calculateEdgePath(elements: BesselianElements, useUmbra: boolean, stepHours: number): Array<LatLon> {
    const north: Array<LatLon> = [];
    const south: Array<LatLon> = [];

    for (let tau = elements.tMin; tau <= elements.tMax; tau += stepHours) {
        const limits = calculateLimitPoints(elements, tau, useUmbra);
        if (limits === null) {
            continue;
        }
        north.push(limits.north);
        south.push(limits.south);
    }

    if (north.length < 2) {
        return [];
    }

    return [...north, ...south.slice().reverse()];
}
