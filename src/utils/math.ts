export function round(value: number, decimals = 0): number {
    const p = Math.pow(10, decimals);

    return Math.round(value * p) / p;
}

export function pad(num: number | string, size: number): string {
    let numStr = num.toString();

    while (numStr.length < size) {
        numStr = '0' + numStr;
    }

    return numStr;
}

export function tabularInterpolation5(values: Array<number>): number {
    const y3 = values[2];
    const A = values[1] - values[0];
    const B = values[2] - values[1];
    const C = values[3] - values[2];
    const D = values[4] - values[3];
    const E = B - A;
    const F = C - B;
    const G = D - C;
    const H = F - E;
    const J = G - F;
    const K = J - H;

    let n0 = 0.0;

    while (true) {
        // Meeus 3.10
        const numerator = -24 * y3 + Math.pow(n0, 2) * (K - 12 * F) - 2 * Math.pow(n0, 3) * (H + J) - Math.pow(n0, 4) * K;
        const denominator = 2 * (6 * B + 6 * C - H - J);
        const n0New = numerator / denominator;

        if (n0New === n0) {
            return n0;
        }

        n0 = n0New;
    }
}
