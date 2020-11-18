import {createTimeOfInterest} from '../time';

export function tabularInterpolation3(values: Array<number>, n: number = 0.0): number {
    // Meeus 3.3
    const y2 = values[1];
    const A = values[1] - values[0];
    const B = values[2] - values[1];
    const C = B - A;

    return y2 + 0.5 * n * (A + B + n * C);
}

export function tabularInterpolation5(values: Array<number>, n: number = 0.0): number {
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

    while (true) {
        // Meeus 3.10
        const numerator = -24 * y3 + Math.pow(n, 2) * (K - 12 * F) - 2 * Math.pow(n, 3) * (H + J) - Math.pow(n, 4) * K;
        const denominator = 2 * (6 * B + 6 * C - H - J);
        const nNew = numerator / denominator;

        if (nNew === n) {
            return n;
        }

        n = nNew;
    }
}

export async function getRightAscensionInterpolationArray(
    objConstructor: any,
    jd0: number,
    nMax: number = 1.0,
): Promise<Array<number>> {
    const result = [];

    for (let n = -1 * nMax; n <= nMax; n++) {
        const jd = jd0 + n;
        const toi = createTimeOfInterest.fromJulianDay(jd);
        const object = new objConstructor(toi);

        const {rightAscension} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

        result.push(rightAscension);
    }

    return result;
}
