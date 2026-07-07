// 2021-12-04 total solar eclipse

import {
    getCentralLine,
    getPenumbraPath,
    getUmbraPath,
} from '@package/solarEclipse/services/shadowGeometry/eclipsePaths';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';

function isValidContour(contour: Array<{lat: number; lon: number}>): boolean {
    return (
        contour.length >= 3
        && contour.every(({lat, lon}) => Number.isFinite(lon) && Number.isFinite(lat) && lat >= -90 && lat <= 90)
    );
}

function latSpan(contours: Array<Array<{lat: number; lon: number}>>): number {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const {lat} of contours.flat()) {
        min = Math.min(min, lat);
        max = Math.max(max, lat);
    }

    return max - min;
}

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

describe('getCenterLine', () => {
    it('returns the central line with default 10 sec steps', () => {
        const result = getCentralLine(elements);

        expect(result).toHaveLength(365);
        expect(result[0]).toEqual({lat: -54.04560676491059, lon: -49.35755916158149});
    });

    it('returns the central line with custom 1 sec steps', () => {
        const result = getCentralLine(elements, 1);

        expect(result).toHaveLength(3654);
        expect(result[0]).toEqual({lat: -53.42722771691792, lon: -50.51787435672037});
    });
});

describe('getUmbraPath', () => {
    it('returns valid umbral region contours with the default 5 sec step', () => {
        const result = getUmbraPath(elements);

        expect(result.length).toBeGreaterThan(0);
        expect(result.every(isValidContour)).toBe(true);
    });

    it('brackets the central line within the umbral latitude band', () => {
        const contours = getUmbraPath(elements);
        const centralLine = getCentralLine(elements);
        const midCentral = centralLine[Math.floor(centralLine.length / 2)];
        const enclosingLats = contours
            .flat()
            .filter((point) => Math.abs(point.lon - midCentral.lon) < 5)
            .map((point) => point.lat);

        expect(Math.min(...enclosingLats)).toBeLessThanOrEqual(midCentral.lat);
        expect(Math.max(...enclosingLats)).toBeGreaterThanOrEqual(midCentral.lat);
    });

    it('samples fewer contours with a coarser step', () => {
        const fine = getUmbraPath(elements, {stepsInSeconds: 5});
        const coarse = getUmbraPath(elements, {stepsInSeconds: 30});

        expect(coarse.length).toBeLessThan(fine.length);
    });

    it('extends the region further with refraction than with the geometric horizon', () => {
        const geometric = getUmbraPath(elements);
        const refracted = getUmbraPath(elements, {refraction: true});

        expect(latSpan(refracted)).toBeGreaterThan(latSpan(geometric));
    });
});

describe('getPenumbraPath', () => {
    it('returns valid penumbral region contours with the default 60 sec step', () => {
        const result = getPenumbraPath(elements);

        expect(result.length).toBeGreaterThan(0);
        expect(result.every(isValidContour)).toBe(true);
    });

    it('spans more latitude than the umbral region', () => {
        const penumbra = getPenumbraPath(elements);
        const umbra = getUmbraPath(elements);

        expect(latSpan(penumbra)).toBeGreaterThan(latSpan(umbra));
    });

    it('samples more contours with a finer step', () => {
        const coarse = getPenumbraPath(elements, {stepsInSeconds: 60});
        const fine = getPenumbraPath(elements, {stepsInSeconds: 30});

        expect(fine.length).toBeGreaterThan(coarse.length);
    });
});
