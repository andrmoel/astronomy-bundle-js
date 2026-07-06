import {lonWinding} from './contourGeometry';
import calculatePenumbraPathPolygon from './penumbraPathPolygon';
import isPointInPolygon from './pointInPolygon';
import {ELEMENTS_2029_12_05, ELEMENTS_2019_07_02 as elements, maxEclipseCircumstances} from './testSupport';

const polygon = calculatePenumbraPathPolygon(elements);

it('returns a closed ring', () => {
    expect(polygon.length).toBeGreaterThan(100);
    expect(polygon[0]).toEqual(polygon[polygon.length - 1]);
});

it('contains locations that saw the eclipse', () => {
    expect(isPointInPolygon({lat: -17.388965, lon: -108.999081}, polygon)).toBe(true);
    expect(isPointInPolygon({lat: -33.447, lon: -70.673}, polygon)).toBe(true);
    expect(isPointInPolygon({lat: -34.6037, lon: -58.3816}, polygon)).toBe(true);
});

it('excludes locations that saw no eclipse', () => {
    expect(isPointInPolygon({lat: 40.7128, lon: -74.006}, polygon)).toBe(false);
    expect(isPointInPolygon({lat: -33.9249, lon: 18.4241}, polygon)).toBe(false);
    expect(isPointInPolygon({lat: -33.8688, lon: 151.2093}, polygon)).toBe(false);
});

it('places every vertex on the penumbral limit or on the horizon at maximum eclipse', () => {
    for (let i = 0; i < polygon.length; i += 20) {
        const {magnitude, altitude} = maxEclipseCircumstances(elements, polygon[i]);

        const onPenumbralLimit = Math.abs(magnitude) < 0.02;
        const onHorizon = Math.abs(altitude) < 0.5;
        expect(onPenumbralLimit || onHorizon).toBe(true);
    }
});

describe('region containing a pole', () => {
    const polarPolygon = calculatePenumbraPathPolygon(ELEMENTS_2029_12_05);

    it('closes the winding contour around the enclosed pole', () => {
        expect(polarPolygon[0]).toEqual(polarPolygon[polarPolygon.length - 1]);
        expect(Math.abs(lonWinding(polarPolygon))).toBeLessThan(180);
        expect(Math.min(...polarPolygon.map(({lat}) => lat))).toBe(-90);
    });

    it('contains the pole and locations that saw the eclipse', () => {
        expect(isPointInPolygon({lat: -89.9, lon: 0}, polarPolygon)).toBe(true);
        expect(isPointInPolygon({lat: -75, lon: 100}, polarPolygon)).toBe(true);
        expect(isPointInPolygon({lat: -53.16, lon: -70.91}, polarPolygon)).toBe(true);
    });

    it('excludes locations that saw no eclipse', () => {
        expect(isPointInPolygon({lat: -34.6037, lon: -58.3816}, polarPolygon)).toBe(false);
        expect(isPointInPolygon({lat: -33.8688, lon: 151.2093}, polarPolygon)).toBe(false);
        expect(isPointInPolygon({lat: -33.9249, lon: 18.4241}, polarPolygon)).toBe(false);
    });
});

it('respects the refraction horizon convention', () => {
    const refracted = calculatePenumbraPathPolygon(elements, {refraction: true});

    expect(refracted.length).toBeGreaterThan(100);
    expect(refracted).not.toEqual(polygon);
});
