import {fundamentalToLatLon} from '@package/solarEclipse/services/shadowGeometry/eclipsePaths';
import {solveSurfacePoint} from '@package/solarEclipse/services/shadowGeometry/surface';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';

// TSE 2021-12-04
const elements: BesselianElements = {
    t0Jde: 2459552.81572,
    t0Hours: 8,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [0.025209, 0.56830281, 0.0000391, -0.00000965],
    y: [-0.98365301, -0.13151421, 0.0002213, 0.0000024],
    d: [-22.27471924, -0.005178, 0.000006],
    mu: [302.45217896, 14.99728012, 0],
    l1: [0.53780502, -0.000016, -0.0000131],
    l2: [-0.008292, -0.000016, -0.0000131],
    tanF1: 0.0047434,
    tanF2: 0.0047198,
};

const e = getBesselianElementsAtTime(elements, 0);

describe('solveSurfacePoint', () => {
    it('projects the shadow axis onto the sunlit surface at greatest eclipse', () => {
        const solution = solveSurfacePoint(elements, e, e.x, e.y, false);

        expect(solution).not.toBeNull();
        expect(solution?.lat).toBeCloseTo(-76.94198676249182, 6);
        expect(solution?.lon).toBeCloseTo(-128.54830585164058, 6);
        expect(solution?.zeta).toBeGreaterThan(0);
    });

    it('agrees with fundamentalToLatLon on the near side', () => {
        const solution = solveSurfacePoint(elements, e, e.x, e.y, false);
        const point = fundamentalToLatLon(elements, e, e.x, e.y);

        expect(solution?.lat).toBe(point?.lat);
        expect(solution?.lon).toBe(point?.lon);
    });

    it('returns the night-side sheet with negative zeta when farSide is set', () => {
        const near = solveSurfacePoint(elements, e, e.x, e.y, false);
        const far = solveSurfacePoint(elements, e, e.x, e.y, true);

        expect(far).not.toBeNull();
        expect(near?.zeta).toBeGreaterThan(0);
        expect(far?.zeta).toBeLessThan(0);
    });

    it('returns null when the point misses the ellipsoid', () => {
        expect(solveSurfacePoint(elements, e, 2, 0, false)).toBeNull();
    });

    it('keeps latitude and longitude within their valid ranges', () => {
        const solution = solveSurfacePoint(elements, e, e.x + 0.3, e.y + 0.1, false);

        expect(solution).not.toBeNull();
        expect(solution?.lat).toBeGreaterThanOrEqual(-90);
        expect(solution?.lat).toBeLessThanOrEqual(90);
        expect(solution?.lon).toBeGreaterThanOrEqual(-180);
        expect(solution?.lon).toBeLessThanOrEqual(180);
    });
});
