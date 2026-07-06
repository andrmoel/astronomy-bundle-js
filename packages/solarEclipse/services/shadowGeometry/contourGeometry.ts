import type {LatLon} from '@app/types/LocationTypes';

const POLE_EDGE_STEP_DEG = 5;

export function shortestLonDelta(from: number, to: number): number {
    let delta = to - from;
    while (delta > 180) {
        delta -= 360;
    }
    while (delta < -180) {
        delta += 360;
    }

    return delta;
}

// Rewrites longitudes so consecutive points never jump more than 180°, letting a contour
// that crosses the antimeridian keep a continuous coordinate run (values may leave ±180).
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

// Total longitude travel of the closed contour. ~0 for an ordinary loop; ~±360 when the
// contour winds around the globe, i.e. encloses a pole.
export function lonWinding(path: Array<LatLon>): number {
    let winding = shortestLonDelta(path[path.length - 1].lon, path[0].lon);
    for (let i = 1; i < path.length; i++) {
        winding += shortestLonDelta(path[i - 1].lon, path[i].lon);
    }

    return winding;
}

// A contour that winds a full 360° around the globe cannot be filled on an equirectangular
// map as-is, so it is closed explicitly: repeat the start point (the short hop from the last
// point back to the first is a real boundary segment), drop to the enclosed pole, and run
// along the pole back across the wound longitudes. The pole edge is emitted in small steps
// so longitude unwrapping follows it instead of collapsing the 360° travel to zero.
export function closeContourAroundPole(path: Array<LatLon>, poleLat: number, winding: number): Array<LatLon> {
    const start = path[0];
    const closed = [...path, {lat: start.lat, lon: start.lon}, {lat: poleLat, lon: start.lon}];
    const steps = Math.ceil(Math.abs(winding) / POLE_EDGE_STEP_DEG);
    for (let k = 1; k <= steps; k++) {
        closed.push({lat: poleLat, lon: start.lon - (winding * k) / steps});
    }

    return closed;
}

// Shoelace area over unwrapped lon/lat. Only the sign is meaningful; it is used to bring
// every contour to the same orientation so overlapping contours union under nonzero fill
// instead of cancelling.
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
