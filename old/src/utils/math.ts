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

export function sin2(number: number): number {
    return Math.sin(number) * Math.sin(number);
}

export function cos2(number: number): number {
    return Math.cos(number) * Math.cos(number);
}
