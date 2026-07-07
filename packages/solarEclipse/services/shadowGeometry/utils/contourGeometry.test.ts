import {
    closeContourAroundPole,
    lonWinding,
    shortestAngleDelta,
    shortestLonDelta,
    signedUnwrappedArea,
    unwrapPoints,
} from './contourGeometry';

describe('shortestLonDelta', () => {
    it('returns the plain difference within half a turn', () => {
        expect(shortestLonDelta(10, 50)).toBe(40);
        expect(shortestLonDelta(50, 10)).toBe(-40);
        expect(shortestLonDelta(0, 180)).toBe(180);
    });

    it('crosses the antimeridian the short way', () => {
        expect(shortestLonDelta(170, -170)).toBe(20);
        expect(shortestLonDelta(-170, 170)).toBe(-20);
    });
});

describe('shortestAngleDelta', () => {
    it('wraps radians to the shortest turn', () => {
        expect(shortestAngleDelta(0, Math.PI / 2)).toBe(Math.PI / 2);
        expect(shortestAngleDelta(0, (3 * Math.PI) / 2)).toBeCloseTo(-Math.PI / 2, 12);
        expect(shortestAngleDelta(-Math.PI + 0.1, Math.PI - 0.1)).toBeCloseTo(-0.2, 12);
    });
});

describe('unwrapPoints', () => {
    it('keeps longitudes continuous across the antimeridian', () => {
        const result = unwrapPoints([
            {lat: 0, lon: 179},
            {lat: 1, lon: -179},
            {lat: 2, lon: -177},
        ]);

        expect(result.map(({lon}) => lon)).toEqual([179, 181, 183]);
        expect(result.map(({lat}) => lat)).toEqual([0, 1, 2]);
    });

    it('handles an empty path', () => {
        expect(unwrapPoints([])).toEqual([]);
    });
});

describe('lonWinding', () => {
    it('is ~0 for an ordinary loop', () => {
        expect(
            lonWinding([
                {lat: 0, lon: 0},
                {lat: 0, lon: 10},
                {lat: 10, lon: 10},
                {lat: 10, lon: 0},
            ]),
        ).toBe(0);
    });

    it('is ±360 for a loop winding around the globe', () => {
        const loop = [
            {lat: -60, lon: 0},
            {lat: -60, lon: 90},
            {lat: -60, lon: 180},
            {lat: -60, lon: -90},
        ];

        expect(lonWinding(loop)).toBe(360);
        expect(lonWinding([...loop].reverse())).toBe(-360);
    });
});

describe('closeContourAroundPole', () => {
    it('closes a winding contour with a run along the pole', () => {
        const loop = [
            {lat: -60, lon: 0},
            {lat: -60, lon: 90},
            {lat: -60, lon: 180},
            {lat: -60, lon: -90},
        ];

        const closed = closeContourAroundPole(loop, -90, 360);

        expect(closed.slice(0, 4)).toEqual(loop);
        expect(closed[4]).toEqual({lat: -60, lon: 0});
        expect(closed[5]).toEqual({lat: -90, lon: 0});
        expect(closed[closed.length - 1]).toEqual({lat: -90, lon: -360});
        const poleRun = closed.slice(5);
        expect(poleRun.every(({lat}) => lat === -90)).toBe(true);
        expect(poleRun.length).toBe(1 + Math.ceil(360 / 5));
    });
});

describe('signedUnwrappedArea', () => {
    const square = [
        {lat: 0, lon: 0},
        {lat: 0, lon: 10},
        {lat: 10, lon: 10},
        {lat: 10, lon: 0},
    ];

    it('is positive for a counterclockwise ring and negative reversed', () => {
        expect(signedUnwrappedArea(square)).toBe(100);
        expect(signedUnwrappedArea([...square].reverse())).toBe(-100);
    });

    it('unwraps before measuring, so antimeridian rings do not cancel', () => {
        const ring = [
            {lat: 0, lon: 175},
            {lat: 0, lon: -175},
            {lat: 10, lon: -175},
            {lat: 10, lon: 175},
        ];

        expect(signedUnwrappedArea(ring)).toBe(100);
    });
});
