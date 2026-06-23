export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

export function parseRgba(color: string): Rgba {
    if (color.startsWith('#')) {
        return {
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16),
            a: 255,
        };
    }
    const match = color.match(/^rgba?\(([^)]+)\)$/);
    if (match !== null) {
        const parts = match[1].split(',').map((s) => parseFloat(s.trim()));

        return {
            r: Math.round(parts[0]),
            g: Math.round(parts[1]),
            b: Math.round(parts[2]),
            a: parts.length > 3 ? Math.round(parts[3] * 255) : 255,
        };
    }

    return {r: 0, g: 0, b: 0, a: 255};
}
