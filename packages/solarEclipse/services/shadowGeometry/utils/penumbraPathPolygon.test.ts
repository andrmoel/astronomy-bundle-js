import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {
    getLocalEclipseCircumstances,
    getLocalHorizontalCoordinates,
    getMagnitude,
} from '@package/solarEclipse/utils/localCircumstances';
import {lonWinding} from './contourGeometry';
import calculatePenumbraPathPolygon from './penumbraPathPolygon';
import isPointInPolygon from './pointInPolygon';

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
    // 2029-12-05 (partial, southern South America and Antarctica, south pole inside)
    const polarElements: BesselianElements = {
        t0Jde: 2462476.128000021,
        t0Hours: 15,
        tMin: -4,
        tMax: 4,
        deltaT: 77.5,
        x: [-0.06383299827575684, 0.5766354487614564, -0.0000027008880886257518, -0.00000950007049771386],
        y: [-1.0596660375595093, -0.014017194180712853, 0.00022950294351922212, 1.0003961300112125e-7],
        d: [-22.445449829101562, -0.0050537751560335575, 0.000006000096133378196],
        mu: [47.30984878540039, 14.997170428015565, 0],
        l1: [0.5406419206627513, 0.00006989796151927013, -0.000012799829096346935],
        l2: [-0.005469252601702933, 0.0000694996955783325, -0.000012799829096346935],
        tanF1: 0.00474459830624857,
        tanF2: 0.004720900282291905,
    };
    const polarPolygon = calculatePenumbraPathPolygon(polarElements);

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
