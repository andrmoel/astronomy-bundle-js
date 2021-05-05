export function populate(data: Array<number>, t: number): number {
    let result = 0.0;

    data.forEach((n, key) => {
        result += n * Math.pow(t, key);
    });

    return result;
}

export function populateD(data: Array<number>, t: number): number {
    let result = 0.0;

    data.forEach((n, key) => {
        if (key >= 1) {
            result += key * n * Math.pow(t, key - 1);
        }
    });

    return result;
}
