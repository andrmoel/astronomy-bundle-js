export function polynomial(coefs: Array<number>, tau: number): number {
    let value = 0;
    let power = 1;
    for (const c of coefs) {
        value += c * power;
        power *= tau;
    }

    return value;
}

export function polynomialDerivative(coefs: Array<number>, tau: number): number {
    let value = 0;
    let power = 1;
    for (let i = 1; i < coefs.length; i++) {
        value += i * coefs[i] * power;
        power *= tau;
    }

    return value;
}
