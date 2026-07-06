import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {
    getLocalEclipseCircumstances,
    getLocalHorizontalCoordinates,
} from '@package/solarEclipse/utils/localCircumstances';
import {REFRACTED_HORIZON_SIN_ALTITUDE} from './constants';
import {signedUnwrappedArea} from './contourGeometry';
import isPointInPolygon from './pointInPolygon';
import {bisectEdgeBoundary, calculateShadowRegionContours, shadowEdgePoint, terminatorRingPoint} from './shadowOutline';
import {solveSurfacePoint} from './surface';

// 2019-07-02 (total, South Pacific / Chile / Argentina)
const elements: BesselianElements = {
    t0Jde: 2458667.30842,
    t0Hours: 19,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [-0.215634, 0.56620872, 0.0000274, -0.00000879],
    y: [-0.65070802, 0.0106399, -0.0001272, -2.7e-7],
    d: [23.0129509, -0.003187, -0.000005],
    mu: [103.9797287, 14.99950981, 0],
    l1: [0.53763098, -0.0000898, -0.000012],
    l2: [-0.008464, -0.0000894, -0.000012],
    tanF1: 0.0045984,
    tanF2: 0.0045755,
};

const e = getBesselianElementsAtTime(elements, 0);

describe('shadowEdgePoint', () => {
    it('converges onto the penumbra edge at the effective shadow radius', () => {
        const sample = shadowEdgePoint(elements, e, Math.PI / 2, false, false, 0);

        expect(sample).not.toBeNull();
        const zeta = solveSurfacePoint(elements, e, sample?.xi ?? 0, sample?.eta ?? 0, false)?.zeta ?? 0;
        const radius = Math.hypot((sample?.xi ?? 0) - e.x, (sample?.eta ?? 0) - e.y);
        expect(radius).toBeCloseTo(Math.abs(e.l1 - zeta * elements.tanF1), 6);
    });

    it('converges onto the umbra edge at the effective shadow radius', () => {
        const sample = shadowEdgePoint(elements, e, Math.PI / 2, true, false, 0);

        expect(sample).not.toBeNull();
        const zeta = solveSurfacePoint(elements, e, sample?.xi ?? 0, sample?.eta ?? 0, false)?.zeta ?? 0;
        const radius = Math.hypot((sample?.xi ?? 0) - e.x, (sample?.eta ?? 0) - e.y);
        expect(radius).toBeCloseTo(Math.abs(e.l2 - zeta * elements.tanF2), 6);
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
        const zeta = solveSurfacePoint(elements, e, crossing?.sample.xi ?? 0, crossing?.sample.eta ?? 0, false)?.zeta;
        expect(Math.abs(zeta ?? 1)).toBeLessThan(0.05);
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
