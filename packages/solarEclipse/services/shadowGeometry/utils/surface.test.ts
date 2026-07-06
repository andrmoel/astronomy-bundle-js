import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {getTauOfGreatestEclipse} from '@package/solarEclipse/utils/greatestEclipse';
import {fundamentalToLatLon, solveSurfacePoint} from './surface';

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

it('fundamentalToLatLon mirrors the near-side solution', () => {
    const point = fundamentalToLatLon(elements, e, e.x, e.y);
    const solution = solveSurfacePoint(elements, e, e.x, e.y, false);

    expect(point).toEqual({lat: solution?.lat, lon: solution?.lon});
    expect(fundamentalToLatLon(elements, e, 2, 0)).toBeNull();
});
