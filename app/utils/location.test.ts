import {normalizeLongitude} from './location';

describe('normalizeLongitude', () => {
    it('returns value unchanged when already in range', () => {
        expect(normalizeLongitude(0)).toBe(0);
        expect(normalizeLongitude(90)).toBe(90);
        expect(normalizeLongitude(-90)).toBe(-90);
        expect(normalizeLongitude(180)).toBe(180);
        expect(normalizeLongitude(-180)).toBe(-180);
    });

    it('wraps values above 180', () => {
        expect(normalizeLongitude(181)).toBe(-179);
        expect(normalizeLongitude(270)).toBe(-90);
        expect(normalizeLongitude(360)).toBe(0);
    });

    it('wraps values below -180', () => {
        expect(normalizeLongitude(-181)).toBe(179);
        expect(normalizeLongitude(-270)).toBe(90);
        expect(normalizeLongitude(-360)).toBe(0);
    });

    it('handles multiple wraps', () => {
        expect(normalizeLongitude(540)).toBe(180);
        expect(normalizeLongitude(-540)).toBe(-180);
        expect(normalizeLongitude(720)).toBe(0);
    });
});
