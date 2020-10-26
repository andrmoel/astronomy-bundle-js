export function round(value: number, decimals = 0): number {
    const p = Math.pow(10, decimals);

    return Math.round(value * p) / p;
}

export function pad(num: number|string, size: number): string {
    let numStr = num.toString();

    while (numStr.length < size) {
        numStr = '0' + numStr;
    }

    return numStr;
}
