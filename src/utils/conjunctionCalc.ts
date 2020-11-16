import {createTimeOfInterest} from '../time';
import {tabularInterpolation5} from './math';

export async function getConjunctionInRightAscension(
    obj1Constructor: any,
    obj2Constructor: any,
    jd0: number,
): Promise<number> {
    return await _getConjunction(obj1Constructor, obj2Constructor, jd0);
}

export async function getConjunctionInLongitude(
    obj1Constructor: any,
    obj2Constructor: any,
    jd0: number,
): Promise<number> {
    return await _getConjunction(obj1Constructor, obj2Constructor, jd0, true);
}

async function _getConjunction(
    obj1Constructor: any,
    obj2Constructor: any,
    jd0: number,
    inLongitude: boolean = false,
): Promise<number> {
    const ephemerisObj1 = await _getEphemeris(obj1Constructor, jd0, inLongitude);
    const ephemerisObj2 = await _getEphemeris(obj2Constructor, jd0, inLongitude);
    const ephemerisDiff = _getDiffArray(ephemerisObj1, ephemerisObj2);

    if (!_isConjunctionPossible(ephemerisDiff)) {
        throw new Error('No conjunction possible for given objects at ' + jd0);
    }

    const n = tabularInterpolation5(ephemerisDiff);

    return jd0 + n;
}

async function _getEphemeris(objConstructor: any, jd0: number, inLongitude: boolean = false): Promise<Array<number>> {
    const result = [];

    for (let n = -2; n <= 2; n++) {
        const jd = jd0 + n;
        const toi = createTimeOfInterest.fromJulianDay(jd);
        const object = new objConstructor(toi);

        if (inLongitude) {
            const {longitude} = await object.getApparentGeocentricEclipticSphericalCoordinates();

            result.push(longitude);
        } else {
            const {rightAscension} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

            result.push(rightAscension);
        }
    }

    return result;
}

function _isConjunctionPossible(diffArray: Array<number>): boolean {
    const ra1 = diffArray[2];
    const ra2 = diffArray[3];

    return ra1 < 0 && ra2 >= 0 || ra1 >= 0 && ra2 < 0;
}

function _getDiffArray(
    ephemeris1: Array<number>,
    ephemeris2: Array<number>,
): Array<number> {
    return ephemeris1.map((value1, key) => ephemeris2[key] - value1);
}
