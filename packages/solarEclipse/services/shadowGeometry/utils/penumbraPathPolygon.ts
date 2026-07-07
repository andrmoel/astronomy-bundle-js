import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {ShadowPathOptions} from '../types/ShadowPathTypes';
import {horizonSinAltitude} from './constants';
import {closeContourAroundPole, lonWinding, signedUnwrappedArea} from './contourGeometry';
import traceMaskContours, {type GridCrossing} from './gridContour';
import {
    buildScanContext,
    computePenumbraInsideBand,
    isMaxEclipseVisibleAt,
    pixelCenterLat,
    pixelCenterLon,
    type ScanContext,
} from './penumbraVisibility';

const GRID_WIDTH = 720;
const GRID_HEIGHT = 360;
const REFINEMENT_ITERATIONS = 14;

export default function calculatePenumbraPathPolygon(
    elements: BesselianElements,
    options: ShadowPathOptions = {},
): Array<LatLon> {
    const z0 = horizonSinAltitude(options);
    const inside = new Uint8Array(GRID_WIDTH * GRID_HEIGHT);
    computePenumbraInsideBand(elements, GRID_WIDTH, GRID_HEIGHT, z0, 0, GRID_HEIGHT, inside);

    const loops = traceMaskContours(inside, GRID_WIDTH, GRID_HEIGHT);
    if (loops.length === 0) {
        return [];
    }

    const ctx = buildScanContext(elements, z0);
    const rings = loops.map((loop) =>
        closeAroundEnclosedPole(
            ctx,
            loop.map((crossing) => refineCrossing(ctx, crossing)),
        ),
    );
    const ring = rings.reduce((largest, candidate) =>
        Math.abs(signedUnwrappedArea(candidate)) > Math.abs(signedUnwrappedArea(largest)) ? candidate : largest,
    );

    if (signedUnwrappedArea(ring) < 0) {
        ring.reverse();
    }
    const normalized = ring.map(({lat, lon}) => ({lat, lon: normalizeLongitude(lon)}));
    normalized.push({...normalized[0]});

    return normalized;
}

function closeAroundEnclosedPole(ctx: ScanContext, ring: Array<LatLon>): Array<LatLon> {
    const winding = lonWinding(ring);
    if (Math.abs(winding) < 180) {
        return ring;
    }
    const poleLat = isMaxEclipseVisibleAt(ctx, 89.999, 0) ? 90 : isMaxEclipseVisibleAt(ctx, -89.999, 0) ? -90 : null;
    if (poleLat === null) {
        return ring;
    }

    return closeContourAroundPole(ring, poleLat, winding);
}

function refineCrossing(ctx: ScanContext, crossing: GridCrossing): LatLon {
    let inside = gridPointLatLon(crossing.insideX, crossing.insideY);
    let outside = gridPointLatLon(crossing.outsideX, crossing.outsideY);
    for (let iter = 0; iter < REFINEMENT_ITERATIONS; iter++) {
        const mid = {lat: (inside.lat + outside.lat) / 2, lon: (inside.lon + outside.lon) / 2};
        if (isMaxEclipseVisibleAt(ctx, mid.lat, mid.lon)) {
            inside = mid;
        } else {
            outside = mid;
        }
    }

    return {lat: (inside.lat + outside.lat) / 2, lon: (inside.lon + outside.lon) / 2};
}

function gridPointLatLon(x: number, y: number): LatLon {
    const lat = y < 0 ? 90 : y >= GRID_HEIGHT ? -90 : pixelCenterLat(y, GRID_HEIGHT);

    return {lat, lon: pixelCenterLon(x, GRID_WIDTH)};
}
