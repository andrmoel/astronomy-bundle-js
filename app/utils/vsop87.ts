import {RAD} from '@app/constants/math';

export function calculateVSOP87Angle(terms: Array<Array<Array<number>>>, t: number): number {
    const result = calculateVSOP87(terms, t);

    return result * RAD;
}

export function calculateVSOP87(terms: Array<Array<Array<number>>>, t: number): number {
    let result = 0.0;

    terms.forEach((term: Array<Array<number>>, key: number) => {
        result += sumUpTerm(term, t) * t ** key;
    });

    return result;
}

function sumUpTerm(terms: Array<Array<number>>, t: number): number {
    let result = 0.0;

    terms.forEach((term: Array<number>) => {
        const a = term[0] || 0;
        const b = term[1] || 0;
        const c = term[2] || 0;

        result += a * Math.cos(b + c * t);
    });

    return result;
}
