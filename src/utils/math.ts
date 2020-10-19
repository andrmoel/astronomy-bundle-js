export function round(value: number, decimals = 0): number {
    const p = Math.pow(10, decimals);

    return Math.round(value * p) / p;
}
