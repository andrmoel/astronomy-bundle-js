import isPointInPolygon from './pointInPolygon';
import {ELEMENTS_2019_07_02 as elements, everInsideVisibleUmbra, maxEclipseCircumstances} from './testSupport';
import calculateUmbraPathPolygon from './umbraPathPolygon';

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

it('ends the path exactly where the umbra last shows above the horizon', () => {
    const west = polygon.reduce((extreme, vertex) => (vertex.lon < extreme.lon ? vertex : extreme));
    const east = polygon.reduce((extreme, vertex) => (vertex.lon > extreme.lon ? vertex : extreme));

    for (const {cap, inward} of [
        {cap: west, inward: 1},
        {cap: east, inward: -1},
    ]) {
        expect(everInsideVisibleUmbra(elements, {lat: cap.lat, lon: cap.lon + inward * 0.2})).toBe(true);
        expect(everInsideVisibleUmbra(elements, {lat: cap.lat, lon: cap.lon - inward * 0.2})).toBe(false);
    }
});

it('caps each end on the horizon', () => {
    const west = polygon.reduce((extreme, vertex) => (vertex.lon < extreme.lon ? vertex : extreme));
    const east = polygon.reduce((extreme, vertex) => (vertex.lon > extreme.lon ? vertex : extreme));

    for (const cap of [west, east]) {
        const {magnitude, altitude} = maxEclipseCircumstances(elements, cap);

        expect(magnitude).toBeGreaterThan(0.99);
        expect(altitude).toBeLessThan(0.5);
        expect(altitude).toBeGreaterThan(-3);
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
