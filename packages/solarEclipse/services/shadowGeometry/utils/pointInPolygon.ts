import type {LatLon} from '@app/types/LocationTypes';
import {unwrapPoints} from './contourGeometry';

export default function isPointInPolygon(point: LatLon, polygon: Array<LatLon>): boolean {
    if (polygon.length < 3) {
        return false;
    }
    const ring = unwrapPoints(polygon);

    let minLon = Infinity;
    let maxLon = -Infinity;
    for (const {lon} of ring) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
    }
    const centre = (minLon + maxLon) / 2;
    let pointLon = point.lon;
    while (pointLon < centre - 180) {
        pointLon += 360;
    }
    while (pointLon > centre + 180) {
        pointLon -= 360;
    }

    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i++) {
        const a = ring[j];
        const b = ring[i];
        if (a.lat > point.lat === b.lat > point.lat) {
            continue;
        }
        const crossingLon = a.lon + ((b.lon - a.lon) * (point.lat - a.lat)) / (b.lat - a.lat);
        if (crossingLon > pointLon) {
            inside = !inside;
        }
    }

    return inside;
}
