import {getRightAscensionInterpolationArray, tabularInterpolation5} from './interpolationCalc';

export async function getConjunctionInRightAscension(
    obj1Constructor: any,
    obj2Constructor: any,
    jd0: number,
): Promise<number> {
    const ephemerisObj1 = await getRightAscensionInterpolationArray(obj1Constructor, jd0, 2);
    const ephemerisObj2 = await getRightAscensionInterpolationArray(obj2Constructor, jd0, 2);
    const ephemerisDiff = _getRightAscensionDiff(ephemerisObj1, ephemerisObj2);

    if (!_isConjunctionPossible(ephemerisDiff)) {
        throw new Error('No conjunction possible for given objects at ' + jd0);
    }

    const n = tabularInterpolation5(ephemerisDiff);

    return jd0 + n;
}

function _isConjunctionPossible(diffArray: Array<number>): boolean {
    const ra1 = diffArray[2];
    const ra2 = diffArray[3];

    return ra1 < 0 && ra2 >= 0 || ra1 >= 0 && ra2 < 0;
}

function _getRightAscensionDiff(
    ephemeris1: Array<number>,
    ephemeris2: Array<number>,
): Array<number> {
    return ephemeris1.map((value1, key) => ephemeris2[key] - value1);
}
