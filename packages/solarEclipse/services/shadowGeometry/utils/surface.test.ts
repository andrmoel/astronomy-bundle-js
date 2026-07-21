import {getBesselianElementsAtTime, getEclipseDeltaT} from '@package/solarEclipse/utils/besselianElements';
import {getTauOfGreatestEclipse} from '@package/solarEclipse/utils/greatestEclipse';
import {EARTH_ROTATION_DEG_PER_HOUR} from './constants';
import {fundamentalToLatLon, solveLimbClampedSurfacePoint, solveSurfacePoint} from './surface';
import {ELEMENTS_2019_07_02 as elements} from './testSupport';

const tau = getTauOfGreatestEclipse(elements);
const e = getBesselianElementsAtTime(elements, tau);

it('projects the shadow axis onto the location of greatest eclipse', () => {
    const solution = solveSurfacePoint(elements, e, e.x, e.y, false);

    expect(solution).not.toBeNull();
    expect(solution?.lat).toBeCloseTo(-17.388965, 5);
    expect(solution?.lon).toBeCloseTo(-108.999081, 2);
});

it('returns a point on the ellipsoid with the Sun up on the near side', () => {
    const solution = solveSurfacePoint(elements, e, e.x, e.y, false);

    expect(solution?.zeta).toBeGreaterThan(0);
    const radiusSq = e.x * e.x + e.y * e.y + (solution?.zeta ?? 0) ** 2;
    expect(radiusSq).toBeGreaterThan(0.99);
    expect(radiusSq).toBeLessThanOrEqual(1);
});

it('selects the night-side intersection with farSide', () => {
    const solution = solveSurfacePoint(elements, e, e.x, e.y, true);

    expect(solution).not.toBeNull();
    expect(solution?.zeta).toBeLessThan(0);
    expect(solution?.lat).not.toBeCloseTo(-17.388965, 1);
});

it('returns null when the point misses the ellipsoid', () => {
    expect(solveSurfacePoint(elements, e, 2, 0, false)).toBeNull();
    expect(solveSurfacePoint(elements, e, 0.9, 0.9, false)).toBeNull();
});

it('refers the longitude to the given deltaT', () => {
    const reference = solveSurfacePoint(elements, e, e.x, e.y, false);
    const shifted = solveSurfacePoint(elements, e, e.x, e.y, false, getEclipseDeltaT(elements) + 3600);

    expect(shifted?.lat).toBe(reference?.lat);
    expect(shifted?.lon).toBeCloseTo((reference?.lon ?? 0) + EARTH_ROTATION_DEG_PER_HOUR, 8);
});

describe('solveLimbClampedSurfacePoint', () => {
    it('matches the exact solution on the disk', () => {
        const clamped = solveLimbClampedSurfacePoint(elements, e, e.x, e.y);
        const exact = solveSurfacePoint(elements, e, e.x, e.y, false);

        expect(clamped.lat).toBe(exact?.lat);
        expect(clamped.lon).toBe(exact?.lon);
        expect(clamped.zeta).toBe(exact?.zeta);
    });

    it('clamps a point beyond the ellipsoid onto the limb', () => {
        const clamped = solveLimbClampedSurfacePoint(elements, e, 0.8, 0.6);

        expect(clamped.zeta).toBe(0);
        expect(Math.abs(clamped.lat)).toBeLessThanOrEqual(90);
    });
});

it('fundamentalToLatLon mirrors the near-side solution', () => {
    const point = fundamentalToLatLon(elements, e, e.x, e.y);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, false);

    expect(point).toEqual({lat: solution?.lat, lon: solution?.lon});
    expect(fundamentalToLatLon(elements, e, 2, 0)).toBeNull();
});
