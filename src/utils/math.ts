export function round(value: number, decimals: number = 0): number {
    const p = Math.pow(10, decimals);

    return Math.round(value * p) / p;
}
