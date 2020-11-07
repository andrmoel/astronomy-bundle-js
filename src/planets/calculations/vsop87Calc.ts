import {rad2deg} from '../../utils/angleCalc';

export function calculateVSOP87Angle(terms: Array<Array<Array<number>>>, t: number): number {
    const result = calculateVSOP87(terms, t);

    return rad2deg(result);
}

export function calculateVSOP87(terms: Array<Array<Array<number>>>, t: number): number {
    let result = 0.0;

    terms.forEach(
        (term: Array<Array<number>>, key: number) => {
            result += _sumUpTerm(term, t) * Math.pow(t, key)
        }
    );

    return result;
}

function _sumUpTerm(terms: Array<Array<number>>, t: number): number {
    let result = 0.0;

    terms.forEach((term: Array<number>) => {
        const a = term[0] || 0;
        const b = term[1] || 0;
        const c = term[2] || 0;

        result += a * Math.cos(b + c * t)
    });

    return result;
}
