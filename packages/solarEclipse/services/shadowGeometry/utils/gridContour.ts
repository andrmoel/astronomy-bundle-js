// Marching squares over a raster mask of pixel centres, returning the inside/outside
// boundaries as closed loops of edge crossings. The x axis wraps (longitude); the rows above
// and below the grid (beyond the poles) count as outside, so every boundary closes into a
// loop even when the region touches a pole or crosses the antimeridian. Crossings keep
// unwrapped pixel coordinates (x may reach width, y may be -1 or height) so a caller can
// interpolate positions continuously across the seams.

export interface GridCrossing {
    insideX: number;
    insideY: number;
    outsideX: number;
    outsideY: number;
}

export default function traceMaskContours(
    inside: Uint8Array,
    width: number,
    height: number,
): Array<Array<GridCrossing>> {
    const {adjacency, crossings} = collectCellSegments(inside, width, height);

    const loops: Array<Array<GridCrossing>> = [];
    const visited = new Set<string>();
    for (const start of adjacency.keys()) {
        if (visited.has(start)) {
            continue;
        }
        const loop: Array<GridCrossing> = [];
        let previous: string | null = null;
        let current = start;
        do {
            visited.add(current);
            const crossing = crossings.get(current);
            const neighbors = adjacency.get(current);
            if (crossing === undefined || neighbors === undefined || neighbors.length !== 2) {
                break;
            }
            loop.push(crossing);
            const next = neighbors[0] === previous ? neighbors[1] : neighbors[0];
            previous = current;
            current = next;
        } while (current !== start);
        if (loop.length >= 3) {
            loops.push(loop);
        }
    }

    return loops;
}

interface CellSegments {
    adjacency: Map<string, Array<string>>;
    crossings: Map<string, GridCrossing>;
}

// Every cell between four neighbouring pixel centres contributes the marching-squares
// segments for its corner pattern. Each crossing edge borders exactly two cells and gains
// one segment from each, so each node's adjacency has degree two and the walk above always
// returns to its start.
function collectCellSegments(inside: Uint8Array, width: number, height: number): CellSegments {
    const at = (x: number, y: number): number =>
        y < 0 || y >= height ? 0 : inside[y * width + (((x % width) + width) % width)];

    const adjacency = new Map<string, Array<string>>();
    const crossings = new Map<string, GridCrossing>();

    const edge = (horizontal: boolean, x: number, y: number): string => {
        const key = `${horizontal ? 'h' : 'v'}${((x % width) + width) % width},${y}`;
        if (!crossings.has(key)) {
            const x2 = horizontal ? x + 1 : x;
            const y2 = horizontal ? y : y + 1;
            crossings.set(
                key,
                at(x, y) === 1
                    ? {insideX: x, insideY: y, outsideX: x2, outsideY: y2}
                    : {insideX: x2, insideY: y2, outsideX: x, outsideY: y},
            );
        }

        return key;
    };
    const link = (a: string, b: string): void => {
        adjacency.set(a, [...(adjacency.get(a) ?? []), b]);
        adjacency.set(b, [...(adjacency.get(b) ?? []), a]);
    };

    for (let cy = -1; cy < height; cy++) {
        for (let cx = 0; cx < width; cx++) {
            const pattern = at(cx, cy) + at(cx + 1, cy) * 2 + at(cx + 1, cy + 1) * 4 + at(cx, cy + 1) * 8;
            if (pattern === 0 || pattern === 15) {
                continue;
            }
            const top = (): string => edge(true, cx, cy);
            const bottom = (): string => edge(true, cx, cy + 1);
            const left = (): string => edge(false, cx, cy);
            const right = (): string => edge(false, cx + 1, cy);
            switch (pattern) {
                case 1:
                case 14:
                    link(left(), top());
                    break;
                case 2:
                case 13:
                    link(top(), right());
                    break;
                case 3:
                case 12:
                    link(left(), right());
                    break;
                case 4:
                case 11:
                    link(right(), bottom());
                    break;
                case 6:
                case 9:
                    link(top(), bottom());
                    break;
                case 7:
                case 8:
                    link(bottom(), left());
                    break;
                case 5:
                    link(left(), top());
                    link(right(), bottom());
                    break;
                case 10:
                    link(top(), right());
                    link(bottom(), left());
                    break;
            }
        }
    }

    return {adjacency, crossings};
}
