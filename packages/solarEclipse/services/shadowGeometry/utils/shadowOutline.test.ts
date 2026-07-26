import type {LatLon} from '@app/types/LocationTypes';
import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';
import {
    getLocalEclipseCircumstances,
    getLocalHorizontalCoordinates,
} from '@package/solarEclipse/utils/localCircumstances';
import {
    DEG,
    EARTH_ROTATION_DEG_PER_HOUR,
    GEOMETRIC_HORIZON_SIN_ALTITUDE,
    ONE_MINUS_F,
    REFRACTED_HORIZON_SIN_ALTITUDE,
} from './constants';
import {shortestLonDelta, signedUnwrappedArea} from './contourGeometry';
import isPointInPolygon from './pointInPolygon';
import {
    bisectEdgeBoundary,
    calculateShadowRegionContours,
    getInstantaneousUmbraOutline,
    shadowEdgePoint,
    terminatorRingPoint,
} from './shadowOutline';
import {solveSurfacePoint} from './surface';
import {ELEMENTS_2019_07_02 as elements} from './testSupport';

const e = getBesselianElementsAtTime(elements, 0);

describe('shadowEdgePoint', () => {
    it('converges onto the penumbra edge at the effective shadow radius', () => {
        const sample = shadowEdgePoint(elements, e, Math.PI / 2, false, false, 0);

        expect(sample).not.toBeNull();
        const radius = Math.hypot((sample?.xi ?? 0) - e.x, (sample?.eta ?? 0) - e.y);
        expect(radius).toBeCloseTo(Math.abs(e.l1 - (sample?.zeta ?? 0) * elements.tanF1), 6);
    });

    it('converges onto the umbra edge at the effective shadow radius', () => {
        const sample = shadowEdgePoint(elements, e, Math.PI / 2, true, false, 0);

        expect(sample).not.toBeNull();
        const radius = Math.hypot((sample?.xi ?? 0) - e.x, (sample?.eta ?? 0) - e.y);
        expect(radius).toBeCloseTo(Math.abs(e.l2 - (sample?.zeta ?? 0) * elements.tanF2), 6);
    });

    it('reports the zeta of the converged surface point', () => {
        const sample = shadowEdgePoint(elements, e, Math.PI / 2, false, false, 0);

        const solution = solveSurfacePoint(elements, e, sample?.xi ?? 0, sample?.eta ?? 0, false);
        expect(sample?.zeta).toBe(solution?.zeta);
    });

    it('returns null when the edge point misses the ellipsoid', () => {
        expect(shadowEdgePoint(elements, e, -Math.PI / 2, false, false, 0)).toBeNull();
    });

    it('returns null when the edge point lies below the visibility horizon', () => {
        expect(shadowEdgePoint(elements, e, Math.PI / 2, false, false, 0.99)).toBeNull();
    });

    it('returns null while the shadow has not reached the Earth', () => {
        const early = getBesselianElementsAtTime(elements, elements.tMin);

        for (const q of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
            expect(shadowEdgePoint(elements, early, q, false, false, 0)).toBeNull();
        }
    });
});

describe('bisectEdgeBoundary', () => {
    it('finds the acceptance boundary on the horizon between a good and a bad position angle', () => {
        const crossing = bisectEdgeBoundary(elements, e, Math.PI / 2, -Math.PI / 2, false, false, 0);

        expect(crossing).not.toBeNull();
        // The acceptance boundary is where the radius iteration first loses its surface
        // solution, slightly before the converged point itself reaches zeta = 0.
        expect(Math.abs(crossing?.sample.zeta ?? 1)).toBeLessThan(0.05);
    });
});

describe('terminatorRingPoint', () => {
    function sunAltitudeAt(theta: number, z0: number): number {
        const ring = terminatorRingPoint(elements, e, theta, 0, z0);
        const location = {...ring.point, elevation: 0};
        const circumstances = getLocalEclipseCircumstances(elements, location, 0);

        return getLocalHorizontalCoordinates(circumstances, location).altitude;
    }

    it('returns points where the Sun sits on the geometric horizon', () => {
        // The tolerance covers the deflection between the geodetic vertical of the altitude
        // formula and the geocentric direction that zeta = 0 refers to (up to ~0.2 degrees).
        for (const theta of [0, 1, 2.5, 4]) {
            expect(Math.abs(sunAltitudeAt(theta, 0))).toBeLessThan(0.25);
        }
    });

    it('depresses the ring by 50 arc minutes with refraction', () => {
        const depression = sunAltitudeAt(1, REFRACTED_HORIZON_SIN_ALTITUDE) - sunAltitudeAt(1, 0);

        expect(depression).toBeCloseTo(-50 / 60, 2);
    });
});

describe('getInstantaneousUmbraOutline', () => {
    function visibleUmbraMargin(point: LatLon, tau: number, z0: number): number {
        const eAtTau = getBesselianElementsAtTime(elements, tau);
        const deltaTCorrection = (EARTH_ROTATION_DEG_PER_HOUR * getEclipseDeltaT(elements)) / 3600;
        const hourAngle = eAtTau.mu + (point.lon - deltaTCorrection) * DEG;
        const u = Math.atan(ONE_MINUS_F * Math.tan(point.lat * DEG));
        const rhoSinPhi = ONE_MINUS_F * Math.sin(u);
        const rhoCosPhi = Math.cos(u);
        const xi = rhoCosPhi * Math.sin(hourAngle);
        const eta = rhoSinPhi * eAtTau.cosD - rhoCosPhi * Math.cos(hourAngle) * eAtTau.sinD;
        const zeta = rhoSinPhi * eAtTau.sinD + rhoCosPhi * Math.cos(hourAngle) * eAtTau.cosD;
        const l2 = eAtTau.l2 - zeta * elements.tanF2;
        const distance = Math.hypot(eAtTau.x - xi, eAtTau.y - eta);

        return Math.min(Math.abs(l2) - distance, zeta - z0);
    }

    function turnAngles(outline: Array<LatLon>): Array<number> {
        return outline.map((point, i) => {
            const previous = outline[(i - 1 + outline.length) % outline.length];
            const next = outline[(i + 1) % outline.length];
            const cosLat = Math.cos(point.lat * DEG);
            const v1 = {x: shortestLonDelta(previous.lon, point.lon) * cosLat, y: point.lat - previous.lat};
            const v2 = {x: shortestLonDelta(point.lon, next.lon) * cosLat, y: next.lat - point.lat};
            if (Math.hypot(v1.x, v1.y) < 1e-12 || Math.hypot(v2.x, v2.y) < 1e-12) {
                return 0;
            }

            return (Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.x * v2.x + v1.y * v2.y) * 180) / Math.PI;
        });
    }

    function sunsetTau(): number {
        for (let tau = elements.tMax; tau >= elements.tMin; tau -= 0.02) {
            if (getInstantaneousUmbraOutline(elements, tau, REFRACTED_HORIZON_SIN_ALTITUDE) !== null) {
                return tau;
            }
        }
        throw new Error('no tau with a visible umbra found');
    }

    it('places every vertex exactly on the visible umbra boundary', () => {
        for (const z0 of [GEOMETRIC_HORIZON_SIN_ALTITUDE, REFRACTED_HORIZON_SIN_ALTITUDE]) {
            const outline = getInstantaneousUmbraOutline(elements, 0, z0);

            expect(outline).not.toBeNull();
            for (const point of outline ?? []) {
                expect(Math.abs(visibleUmbraMargin(point, 0, z0))).toBeLessThan(1e-8);
            }
        }
    });

    it('returns a positively oriented outline without concave artifacts', () => {
        for (const tau of [0, sunsetTau()]) {
            for (const z0 of [GEOMETRIC_HORIZON_SIN_ALTITUDE, REFRACTED_HORIZON_SIN_ALTITUDE]) {
                const outline = getInstantaneousUmbraOutline(elements, tau, z0);

                expect(outline).not.toBeNull();
                expect(signedUnwrappedArea(outline ?? [])).toBeGreaterThan(0);
                const turns = turnAngles(outline ?? []);
                expect(turns.filter((turn) => turn < -15)).toHaveLength(0);
                expect(turns.filter((turn) => Math.abs(turn) > 30).length).toBeLessThanOrEqual(2);
            }
        }
    });

    function distanceToPolylineDeg(point: LatLon, polygon: Array<LatLon>): number {
        const cosLat = Math.cos(point.lat * DEG);
        let best = Number.POSITIVE_INFINITY;
        for (let i = 0; i < polygon.length; i++) {
            const a = polygon[i];
            const b = polygon[(i + 1) % polygon.length];
            const ax = shortestLonDelta(point.lon, a.lon) * cosLat;
            const ay = a.lat - point.lat;
            const bx = shortestLonDelta(point.lon, b.lon) * cosLat;
            const by = b.lat - point.lat;
            const vx = bx - ax;
            const vy = by - ay;
            const t = Math.max(0, Math.min(1, -(ax * vx + ay * vy) / (vx * vx + vy * vy || 1)));
            best = Math.min(best, Math.hypot(ax + t * vx, ay + t * vy));
        }

        return best;
    }

    it('keeps the geometric footprint inside the refracted footprint at sunset', () => {
        const tau = sunsetTau();
        const refracted = getInstantaneousUmbraOutline(elements, tau, REFRACTED_HORIZON_SIN_ALTITUDE);
        const geometric = getInstantaneousUmbraOutline(elements, tau, GEOMETRIC_HORIZON_SIN_ALTITUDE);

        expect(refracted).not.toBeNull();
        expect(geometric).not.toBeNull();
        for (const point of geometric ?? []) {
            const onSharedEdge = distanceToPolylineDeg(point, refracted ?? []) < 0.002;
            expect(onSharedEdge || isPointInPolygon(point, refracted ?? [])).toBe(true);
        }
    });
});

describe('calculateShadowRegionContours', () => {
    const contours = calculateShadowRegionContours(elements, true, 0.25, 0);

    it('returns one closed positively oriented outline per instant the umbra is on the ground', () => {
        expect(contours.length).toBeGreaterThan(8);
        for (const contour of contours) {
            expect(contour.length).toBeGreaterThanOrEqual(3);
            expect(signedUnwrappedArea(contour)).toBeGreaterThan(0);
        }
    });

    it('surrounds the shadow axis at a sampled instant', () => {
        // tau = 0.5 lies on the tMin + k * 0.25 sampling grid of the contours above.
        const eSampled = getBesselianElementsAtTime(elements, 0.5);
        const axis = solveSurfacePoint(elements, eSampled, eSampled.x, eSampled.y, false);

        expect(axis).not.toBeNull();
        const containing = contours.filter((contour) =>
            isPointInPolygon({lat: axis?.lat ?? 0, lon: axis?.lon ?? 0}, contour),
        );
        expect(containing).toHaveLength(1);
    });
});
