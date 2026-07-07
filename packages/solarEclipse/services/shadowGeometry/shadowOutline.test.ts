import {signedUnwrappedArea} from '@package/solarEclipse/services/shadowGeometry/contourGeometry';
import {calculateShadowRegionContours} from '@package/solarEclipse/services/shadowGeometry/shadowOutline';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';

// TSE 2021-12-04 (total, crossing Antarctica)
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

// Latitude is always a real angle; longitude may leave ±180 for pole-enclosing contours,
// which carry unwrapped coordinates so they stay fillable on an equirectangular map.
const isValidContour = (contour: Array<{lat: number; lon: number}>): boolean =>
    contour.length >= 3
    && contour.every(({lat, lon}) => Number.isFinite(lon) && Number.isFinite(lat) && lat >= -90 && lat <= 90);

const latSpan = (contours: Array<Array<{lat: number; lon: number}>>): number => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const {lat} of contours.flat()) {
        min = Math.min(min, lat);
        max = Math.max(max, lat);
    }

    return max - min;
};

describe('calculateShadowRegionContours', () => {
    it('returns valid closed umbral contours', () => {
        const contours = calculateShadowRegionContours(elements, true, 10 / 3600, 0);

        expect(contours).toHaveLength(399);
        expect(contours.every(isValidContour)).toBe(true);
    });

    it('returns valid penumbral contours that span more latitude than the umbra', () => {
        const umbra = calculateShadowRegionContours(elements, true, 10 / 3600, 0);
        const penumbra = calculateShadowRegionContours(elements, false, 60 / 3600, 0);

        expect(penumbra).toHaveLength(248);
        expect(penumbra.every(isValidContour)).toBe(true);
        expect(latSpan(penumbra)).toBeGreaterThan(latSpan(umbra));
    });

    it('traces fewer outlines with a coarser time step', () => {
        const fine = calculateShadowRegionContours(elements, true, 10 / 3600, 0);
        const coarse = calculateShadowRegionContours(elements, true, 30 / 3600, 0);

        expect(coarse.length).toBeLessThan(fine.length);
    });

    it('extends the region when the horizon is lowered below the geometric terminator', () => {
        const geometric = calculateShadowRegionContours(elements, true, 10 / 3600, 0);
        const refracted = calculateShadowRegionContours(
            elements,
            true,
            10 / 3600,
            Math.sin((-50 / 60) * (Math.PI / 180)),
        );

        expect(latSpan(refracted)).toBeGreaterThan(latSpan(geometric));
    });

    it('orients every contour consistently so overlapping outlines union under a nonzero fill', () => {
        const contours = calculateShadowRegionContours(elements, true, 30 / 3600, 0);

        expect(contours.every((contour) => signedUnwrappedArea(contour) >= 0)).toBe(true);
    });
});
