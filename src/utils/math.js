export function round(value, decimals = 0) {
    const p = Math.pow(10, decimals);

    return Math.round(value * p) / p;
}
