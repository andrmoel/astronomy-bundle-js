import {createTimeOfInterest} from '../time';
import {tabularInterpolation5} from './math';

export async function getConjunctionInRightAscension(
    obj1Constructor: Function,
    obj2Constructor: Function,
    jd0: number,
): Promise<number> {
    const ephemerisObj1 = await _getRightAscensionEphemeris(obj1Constructor, jd0);
    const ephemerisObj2 = await _getRightAscensionEphemeris(obj2Constructor, jd0);
    const ephemerisDiff = _getRightAscensionDiff(ephemerisObj1, ephemerisObj2);

    if (!_isConjunctionPossible(ephemerisDiff)) {
        throw new Error('No conjunction possible for given objects at ' + jd0);
    }

    const n = tabularInterpolation5(ephemerisDiff);

    return jd0 + n;
}

function _isConjunctionPossible(rightAscensionDiffArray: Array<number>): boolean {
    const ra1 = rightAscensionDiffArray[2];
    const ra2 = rightAscensionDiffArray[3];

    return ra1 < 0 && ra2 >= 0 || ra1 >= 0 && ra2 < 0;
}

async function _getRightAscensionEphemeris(objConstructor: Function, jd0: number): Promise<Array<number>> {
    const result = [];

    for (let n = -2; n <= 2; n++) {
        const jd = jd0 + n;
        const toi = createTimeOfInterest.fromJulianDay(jd);
        const object = new objConstructor(toi);

        const {rightAscension} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

        result.push(rightAscension);
    }

    return result;
}

function _getRightAscensionDiff(
    rightAscensionEphemeris1: Array<number>,
    rightAscensionEphemeris2: Array<number>,
): Array<number> {
    return rightAscensionEphemeris1.map((rightAscension1, key) => {
        return rightAscensionEphemeris2[key] - rightAscension1;
    });
}
