import {DEG} from '@app/constants/math';
import type {LatLon} from '@app/types/LocationTypes';
import {getDistanceInKm} from '@app/utils/distance';
import {shortestLonDelta} from '@package/solarEclipse/services/shadowGeometry/utils/contourGeometry';
import {solveSurfacePoint} from '@package/solarEclipse/services/shadowGeometry/utils/surface';
import {getUmbraLimitPoints} from '@package/solarEclipse/services/shadowGeometry/utils/umbraPathPolygon';
import type {BesselianElements} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime} from './besselianElements';

const MOTION_STEP_HOURS = 1 / 3600;

export function getUmbraPathWidth(elements: BesselianElements, tau: number): number {
    const {a, b} = getUmbraLimitPoints(elements, tau, 0);
    if (a === null || b === null) {
        return 0;
    }

    const separation = getDistanceInKm(a, b) * 1000;

    return separation * perpendicularFraction(elements, tau, a, b);
}

function perpendicularFraction(elements: BesselianElements, tau: number, a: LatLon, b: LatLon): number {
    const before = centralLinePoint(elements, tau - MOTION_STEP_HOURS);
    const after = centralLinePoint(elements, tau + MOTION_STEP_HOURS);
    if (before === null || after === null) {
        return 1;
    }

    const cosLat = Math.cos(((a.lat + b.lat) / 2) * DEG);
    const motionEast = shortestLonDelta(before.lon, after.lon) * cosLat;
    const motionNorth = after.lat - before.lat;
    const spanEast = shortestLonDelta(b.lon, a.lon) * cosLat;
    const spanNorth = a.lat - b.lat;

    const motionLength = Math.hypot(motionEast, motionNorth);
    const spanLength = Math.hypot(spanEast, spanNorth);
    if (motionLength === 0 || spanLength === 0) {
        return 1;
    }

    return Math.abs(spanEast * motionNorth - spanNorth * motionEast) / (motionLength * spanLength);
}

function centralLinePoint(elements: BesselianElements, tau: number): LatLon | null {
    const e = getBesselianElementsAtTime(elements, tau);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, false);

    return solution !== null ? {lat: solution.lat, lon: solution.lon} : null;
}
