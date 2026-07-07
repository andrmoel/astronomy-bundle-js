import {
    closeContourAroundPole,
    lonWinding,
    shortestLonDelta,
    signedUnwrappedArea,
    unwrapPoints,
} from '@package/solarEclipse/services/shadowGeometry/contourGeometry';

describe('shortestLonDelta', () => {
    it('returns the plain difference away from the antimeridian', () => {
        expect(shortestLonDelta(0, 10)).toBe(10);
        expect(shortestLonDelta(10, 0)).toBe(-10);
    });

    it('takes the short way across the antimeridian', () => {
        expect(shortestLonDelta(170, -170)).toBe(20);
        expect(shortestLonDelta(-170, 170)).toBe(-20);
    });
});

describe('unwrapPoints', () => {
    it('returns an empty array unchanged', () => {
        expect(unwrapPoints([])).toEqual([]);
    });

    it('keeps consecutive longitudes continuous across the antimeridian', () => {
        const result = unwrapPoints([
            {lat: 0, lon: 179},
            {lat: 0, lon: -179},
        ]);

        expect(result[0]).toEqual({lat: 0, lon: 179});
        expect(result[1]).toEqual({lat: 0, lon: 181});
    });
});

describe('lonWinding', () => {
    it('is near zero for an ordinary loop', () => {
        const winding = lonWinding([
            {lat: 0, lon: 0},
            {lat: 1, lon: 1},
            {lat: 0, lon: 2},
            {lat: -1, lon: 1},
        ]);

        expect(Math.abs(winding)).toBeLessThan(1);
    });

    it('is a full turn for a contour that wraps the globe', () => {
        const winding = lonWinding([
            {lat: 80, lon: 0},
            {lat: 80, lon: 90},
            {lat: 80, lon: 180},
            {lat: 80, lon: 270},
        ]);

        expect(winding).toBeCloseTo(360, 6);
    });
});

describe('closeContourAroundPole', () => {
    it('drops to the pole and runs back across the wound longitudes', () => {
        const path = [
            {lat: 80, lon: 0},
            {lat: 80, lon: 90},
            {lat: 80, lon: 180},
            {lat: 80, lon: 270},
        ];
        const closed = closeContourAroundPole(path, 90, 360);

        expect(closed.length).toBeGreaterThan(path.length);
        expect(closed.slice(0, path.length)).toEqual(path);
        expect(closed.some((point) => point.lat === 90)).toBe(true);
    });
});

describe('signedUnwrappedArea', () => {
    const square = [
        {lat: 0, lon: 0},
        {lat: 0, lon: 1},
        {lat: 1, lon: 1},
        {lat: 1, lon: 0},
    ];

    it('is positive for a counter-clockwise ring and negative when reversed', () => {
        expect(signedUnwrappedArea(square)).toBeCloseTo(1, 6);
        expect(signedUnwrappedArea([...square].reverse())).toBeCloseTo(-1, 6);
    });

    it('measures area over unwrapped longitudes across the antimeridian', () => {
        const straddling = [
            {lat: 0, lon: 179},
            {lat: 0, lon: -179},
            {lat: 1, lon: -179},
            {lat: 1, lon: 179},
        ];

        expect(signedUnwrappedArea(straddling)).toBeCloseTo(2, 6);
    });
});
