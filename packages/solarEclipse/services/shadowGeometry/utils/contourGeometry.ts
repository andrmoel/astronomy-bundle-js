import type {LatLon} from '@app/types/LocationTypes';
import {DEG} from './constants';

const POLE_EDGE_STEP_DEG = 5;

export function latLonChordDeg(a: LatLon, b: LatLon): number {
    const dLat = b.lat - a.lat;
    const dLon = shortestLonDelta(a.lon, b.lon) * Math.cos(((a.lat + b.lat) / 2) * DEG);

    return Math.hypot(dLat, dLon);
}

export function shortestLonDelta(from: number, to: number): number {
    return shortestPeriodicDelta(to - from, 360);
}

export function shortestAngleDelta(from: number, to: number): number {
    return shortestPeriodicDelta(to - from, 2 * Math.PI);
}

function shortestPeriodicDelta(delta: number, period: number): number {
    let result = delta;
    while (result > period / 2) {
        result -= period;
    }
    while (result < -period / 2) {
        result += period;
    }

    return result;
}

export function unwrapPoints(points: Array<LatLon>): Array<LatLon> {
    if (points.length === 0) {
        return points;
    }
    const result: Array<LatLon> = [points[0]];
    for (let i = 1; i < points.length; i++) {
        result.push({lat: points[i].lat, lon: result[i - 1].lon + shortestLonDelta(result[i - 1].lon, points[i].lon)});
    }

    return result;
}

export function lonWinding(path: Array<LatLon>): number {
    let winding = shortestLonDelta(path[path.length - 1].lon, path[0].lon);
    for (let i = 1; i < path.length; i++) {
        winding += shortestLonDelta(path[i - 1].lon, path[i].lon);
    }

    return winding;
}

export function closeContourAroundPole(path: Array<LatLon>, poleLat: number, winding: number): Array<LatLon> {
    const start = path[0];
    const closed = [...path, {lat: start.lat, lon: start.lon}, {lat: poleLat, lon: start.lon}];
    const steps = Math.ceil(Math.abs(winding) / POLE_EDGE_STEP_DEG);
    for (let k = 1; k <= steps; k++) {
        closed.push({lat: poleLat, lon: start.lon - (winding * k) / steps});
    }

    return closed;
}

export function signedUnwrappedArea(path: Array<LatLon>): number {
    const unwrapped = unwrapPoints(path);
    let area = 0;
    for (let i = 0; i < unwrapped.length; i++) {
        const a = unwrapped[i];
        const b = unwrapped[(i + 1) % unwrapped.length];
        area += a.lon * b.lat - b.lon * a.lat;
    }

    return area / 2;
}
