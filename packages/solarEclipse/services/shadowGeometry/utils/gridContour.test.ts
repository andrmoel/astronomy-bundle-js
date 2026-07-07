import traceMaskContours from './gridContour';

function mask(width: number, height: number, pixels: Array<[number, number]>): Uint8Array {
    const result = new Uint8Array(width * height);
    for (const [x, y] of pixels) {
        result[y * width + x] = 1;
    }

    return result;
}

it('returns no loops for an empty mask', () => {
    expect(traceMaskContours(mask(10, 10, []), 10, 10)).toHaveLength(0);
});

it('traces a single pixel as one loop of its four crossing edges', () => {
    const loops = traceMaskContours(mask(10, 10, [[5, 5]]), 10, 10);

    expect(loops).toHaveLength(1);
    expect(loops[0]).toHaveLength(4);
    for (const crossing of loops[0]) {
        expect(crossing.insideX).toBe(5);
        expect(crossing.insideY).toBe(5);
    }
});

it('traces a 2x2 block as one loop of eight crossings', () => {
    const loops = traceMaskContours(
        mask(10, 10, [
            [4, 4],
            [5, 4],
            [4, 5],
            [5, 5],
        ]),
        10,
        10,
    );

    expect(loops).toHaveLength(1);
    expect(loops[0]).toHaveLength(8);
});

it('traces separate pixels as separate loops', () => {
    const loops = traceMaskContours(
        mask(10, 10, [
            [2, 2],
            [7, 7],
        ]),
        10,
        10,
    );

    expect(loops).toHaveLength(2);
});

it('traces a block crossing the x seam as a single loop', () => {
    const loops = traceMaskContours(
        mask(10, 10, [
            [9, 5],
            [0, 5],
        ]),
        10,
        10,
    );

    expect(loops).toHaveLength(1);
    expect(loops[0]).toHaveLength(6);
});

it('closes a region touching the top row against the virtual outside row', () => {
    const loops = traceMaskContours(mask(10, 10, [[5, 0]]), 10, 10);

    expect(loops).toHaveLength(1);
    expect(loops[0]).toHaveLength(4);
    expect(loops[0].some((crossing) => crossing.outsideY === -1)).toBe(true);
});

it('separates diagonally touching pixels into two loops', () => {
    const loops = traceMaskContours(
        mask(10, 10, [
            [3, 3],
            [4, 4],
        ]),
        10,
        10,
    );

    expect(loops).toHaveLength(2);
    expect(loops[0]).toHaveLength(4);
    expect(loops[1]).toHaveLength(4);
});

it('keeps unwrapped coordinates on seam crossings', () => {
    const loops = traceMaskContours(mask(10, 10, [[9, 5]]), 10, 10);

    const seamCrossing = loops[0].find((crossing) => crossing.outsideX === 10);
    expect(seamCrossing).toBeDefined();
    expect(seamCrossing?.insideX).toBe(9);
});
