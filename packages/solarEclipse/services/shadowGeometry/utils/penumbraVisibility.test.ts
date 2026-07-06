import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import calculatePenumbraVisibilityAlpha, {
    buildScanContext,
    computePenumbraAlphaBand,
    computePenumbraInsideBand,
    isMaxEclipseVisibleAt,
} from './penumbraVisibility';

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

const WIDTH = 80;
const HEIGHT = 40;

function pixelIndex(lat: number, lon: number): number {
    const px = Math.floor(((lon + 180) / 360) * WIDTH);
    const py = Math.floor(((90 - lat) / 180) * HEIGHT);

    return py * WIDTH + px;
}

describe('isMaxEclipseVisibleAt', () => {
    const ctx = buildScanContext(elements, 0);

    it('accepts locations that saw the eclipse', () => {
        expect(isMaxEclipseVisibleAt(ctx, -17.388965, -108.999081)).toBe(true);
        expect(isMaxEclipseVisibleAt(ctx, -33.447, -70.673)).toBe(true);
        expect(isMaxEclipseVisibleAt(ctx, -34.6037, -58.3816)).toBe(true);
    });

    it('rejects locations that saw no eclipse', () => {
        expect(isMaxEclipseVisibleAt(ctx, 40.7128, -74.006)).toBe(false);
        expect(isMaxEclipseVisibleAt(ctx, -33.9249, 18.4241)).toBe(false);
        expect(isMaxEclipseVisibleAt(ctx, -33.8688, 151.2093)).toBe(false);
    });
});

describe('calculatePenumbraVisibilityAlpha', () => {
    const alpha = calculatePenumbraVisibilityAlpha(elements, WIDTH, HEIGHT, 0);

    it('is fully opaque inside, transparent outside and antialiased on the border', () => {
        expect(alpha).toHaveLength(WIDTH * HEIGHT);
        expect(alpha[pixelIndex(-17.388965, -108.999081)]).toBe(255);
        expect(alpha[pixelIndex(40.7128, -74.006)]).toBe(0);
        expect(alpha.some((value) => value > 0 && value < 255)).toBe(true);
    });
});

describe('band-wise computation', () => {
    it('computes the inside mask bit-identically in tile-aligned bands', () => {
        const full = new Uint8Array(WIDTH * HEIGHT);
        computePenumbraInsideBand(elements, WIDTH, HEIGHT, 0, 0, HEIGHT, full);

        const banded = new Uint8Array(WIDTH * HEIGHT);
        computePenumbraInsideBand(elements, WIDTH, HEIGHT, 0, 0, 16, banded);
        computePenumbraInsideBand(elements, WIDTH, HEIGHT, 0, 16, HEIGHT, banded);

        expect(banded).toEqual(full);
    });

    it('computes the alpha mask bit-identically in row bands', () => {
        const inside = new Uint8Array(WIDTH * HEIGHT);
        computePenumbraInsideBand(elements, WIDTH, HEIGHT, 0, 0, HEIGHT, inside);

        const full = new Uint8ClampedArray(WIDTH * HEIGHT);
        computePenumbraAlphaBand(elements, WIDTH, HEIGHT, 0, 0, HEIGHT, inside, full);

        const banded = new Uint8ClampedArray(WIDTH * HEIGHT);
        computePenumbraAlphaBand(elements, WIDTH, HEIGHT, 0, 0, 16, inside, banded);
        computePenumbraAlphaBand(elements, WIDTH, HEIGHT, 0, 16, HEIGHT, inside, banded);

        expect(banded).toEqual(full);
        expect(full).toEqual(calculatePenumbraVisibilityAlpha(elements, WIDTH, HEIGHT, 0));
    });
});
