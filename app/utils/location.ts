export function normalizeLongitude(lon: number): number {
    let result = lon;
    while (result > 180) {
        result -= 360;
    }
    while (result < -180) {
        result += 360;
    }

    return result;
}
