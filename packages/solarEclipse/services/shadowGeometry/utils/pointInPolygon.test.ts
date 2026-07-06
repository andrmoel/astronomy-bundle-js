import isPointInPolygon from './pointInPolygon';

const square = [
    {lat: -5, lon: -5},
    {lat: -5, lon: 5},
    {lat: 5, lon: 5},
    {lat: 5, lon: -5},
    {lat: -5, lon: -5},
];

it('detects points inside and outside a simple ring', () => {
    expect(isPointInPolygon({lat: 0, lon: 0}, square)).toBe(true);
    expect(isPointInPolygon({lat: 0, lon: 6}, square)).toBe(false);
    expect(isPointInPolygon({lat: -6, lon: 0}, square)).toBe(false);
});

it('treats an unclosed ring as closed', () => {
    const openSquare = square.slice(0, -1);

    expect(isPointInPolygon({lat: 0, lon: 0}, openSquare)).toBe(true);
    expect(isPointInPolygon({lat: 0, lon: 6}, openSquare)).toBe(false);
});

it('rejects degenerate polygons', () => {
    expect(isPointInPolygon({lat: 0, lon: 0}, [])).toBe(false);
    expect(
        isPointInPolygon({lat: 0, lon: 0}, [
            {lat: -5, lon: -5},
            {lat: 5, lon: 5},
        ]),
    ).toBe(false);
});

it('handles rings crossing the antimeridian', () => {
    const ring = [
        {lat: -5, lon: 175},
        {lat: -5, lon: -175},
        {lat: 5, lon: -175},
        {lat: 5, lon: 175},
        {lat: -5, lon: 175},
    ];

    expect(isPointInPolygon({lat: 0, lon: 180}, ring)).toBe(true);
    expect(isPointInPolygon({lat: 0, lon: -178}, ring)).toBe(true);
    expect(isPointInPolygon({lat: 0, lon: 170}, ring)).toBe(false);
    expect(isPointInPolygon({lat: 0, lon: -170}, ring)).toBe(false);
    expect(isPointInPolygon({lat: 7, lon: 180}, ring)).toBe(false);
});
