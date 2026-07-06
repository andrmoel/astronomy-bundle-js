import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {
    getLocalEclipseCircumstances,
    getLocalHorizontalCoordinates,
    getMagnitude,
} from '@package/solarEclipse/utils/localCircumstances';
import isPointInPolygon from './pointInPolygon';
import calculateUmbraPathPolygon from './umbraPathPolygon';

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

const polygon = calculateUmbraPathPolygon(elements);

it('returns a closed ring', () => {
    expect(polygon.length).toBeGreaterThan(100);
    expect(polygon[0]).toEqual(polygon[polygon.length - 1]);
});

it('contains locations inside the path of totality', () => {
    expect(isPointInPolygon({lat: -17.388965, lon: -108.999081}, polygon)).toBe(true);
    expect(isPointInPolygon({lat: -29.9027, lon: -71.252}, polygon)).toBe(true);
});

it('excludes locations outside the path of totality', () => {
    expect(isPointInPolygon({lat: -14.388965, lon: -108.999081}, polygon)).toBe(false);
    expect(isPointInPolygon({lat: -20.388965, lon: -108.999081}, polygon)).toBe(false);
    expect(isPointInPolygon({lat: -33.447, lon: -70.673}, polygon)).toBe(false);
});

it('places every vertex on the edge of totality or on the horizon', () => {
    for (let i = 0; i < polygon.length; i += 25) {
        const {magnitude, altitude} = maxEclipseCircumstances(elements, polygon[i]);

        expect(magnitude).toBeGreaterThan(0.99);
        if (magnitude > 1.01) {
            expect(Math.abs(altitude)).toBeLessThan(1);
        }
    }
});

it('respects the refraction horizon convention', () => {
    const refracted = calculateUmbraPathPolygon(elements, {refraction: true});

    expect(refracted.length).toBeGreaterThan(100);
    expect(refracted).not.toEqual(polygon);
});

it('respects the step size', () => {
    const coarse = calculateUmbraPathPolygon(elements, {stepsInSeconds: 60});

    expect(coarse.length).toBeGreaterThan(100);
    expect(coarse.length).toBeLessThan(polygon.length / 3);
});

function maxEclipseCircumstances(eclipse: BesselianElements, point: LatLon): {magnitude: number; altitude: number} {
    const location = {...point, elevation: 0};
    let bestTau = eclipse.tMin;
    let bestDistance = Infinity;
    for (let tau = eclipse.tMin; tau <= eclipse.tMax; tau += 0.005) {
        const {distance} = getLocalEclipseCircumstances(eclipse, location, tau);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestTau = tau;
        }
    }
    let lower = bestTau - 0.005;
    let upper = bestTau + 0.005;
    for (let iter = 0; iter < 50; iter++) {
        const tau1 = lower + (upper - lower) / 3;
        const tau2 = upper - (upper - lower) / 3;
        const distance1 = getLocalEclipseCircumstances(eclipse, location, tau1).distance;
        const distance2 = getLocalEclipseCircumstances(eclipse, location, tau2).distance;
        if (distance1 < distance2) {
            upper = tau2;
        } else {
            lower = tau1;
        }
    }
    const circumstances = getLocalEclipseCircumstances(eclipse, location, (lower + upper) / 2);

    return {
        magnitude: getMagnitude(circumstances),
        altitude: getLocalHorizontalCoordinates(circumstances, location).altitude,
    };
}
