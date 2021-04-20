import {Conjunction, Position} from '../planets/types/PlanetTypes';
import {createTimeOfInterest} from '../time';
import {
    getDeclinationInterpolationArray,
    getInterpolateValue5,
    getLatitudeInterpolationArray,
    getLongitudeInterpolationArray,
    getRightAscensionInterpolationArray,
    tabularInterpolation5,
} from './interpolationCalc';

export async function getConjunctionInRightAscension(
    obj1Constructor: any,
    obj2Constructor: any,
    jd0: number,
): Promise<Conjunction> {
    const raEphemerisObj1 = await getRightAscensionInterpolationArray(obj1Constructor, jd0, 2);
    const raEphemerisObj2 = await getRightAscensionInterpolationArray(obj2Constructor, jd0, 2);
    const raEphemerisDiff = _getEphemerisDiff(raEphemerisObj1, raEphemerisObj2);

    if (!_isConjunctionPossible(raEphemerisDiff)) {
        throw new Error('No conjunction in right ascension possible for given objects at ' + jd0);
    }

    const n = tabularInterpolation5(raEphemerisDiff);

    const decEphemerisObj1 = await getDeclinationInterpolationArray(obj1Constructor, jd0, 2);
    const decEphemerisObj2 = await getDeclinationInterpolationArray(obj2Constructor, jd0, 2);
    const decEphemerisDiff = _getEphemerisDiff(decEphemerisObj1, decEphemerisObj2);
    const declination = getInterpolateValue5(decEphemerisDiff, n);

    return {
        toi: createTimeOfInterest.fromJulianDay(jd0 + n),
        position: declination >= 0 ? Position.north : Position.south,
        angularDistance: Math.abs(declination),
    };
}

export async function getConjunctionInLongitude(
    obj1Constructor: any,
    obj2Constructor: any,
    jd0: number,
): Promise<Conjunction> {
    const lonEphemerisObj1 = await getLongitudeInterpolationArray(obj1Constructor, jd0, 2);
    const lonEphemerisObj2 = await getLongitudeInterpolationArray(obj2Constructor, jd0, 2);
    const lonEphemerisDiff = _getEphemerisDiff(lonEphemerisObj1, lonEphemerisObj2);

    if (!_isConjunctionPossible(lonEphemerisDiff)) {
        throw new Error('No conjunction in longitude possible for given objects at ' + jd0);
    }

    const n = tabularInterpolation5(lonEphemerisDiff);

    const latEphemerisObj1 = await getLatitudeInterpolationArray(obj1Constructor, jd0, 2);
    const latEphemerisObj2 = await getLatitudeInterpolationArray(obj2Constructor, jd0, 2);
    const latEphemerisDiff = _getEphemerisDiff(latEphemerisObj1, latEphemerisObj2);
    const latitude = getInterpolateValue5(latEphemerisDiff, n);

    return {
        toi: createTimeOfInterest.fromJulianDay(jd0 + n),
        position: latitude >= 0 ? Position.north : Position.south,
        angularDistance: Math.abs(latitude),
    };
}

function _isConjunctionPossible(diffArray: Array<number>): boolean {
    const ra1 = diffArray[2];
    const ra2 = diffArray[3];

    return ra1 < 0 && ra2 >= 0 || ra1 >= 0 && ra2 < 0;
}

function _getEphemerisDiff(
    ephemeris1: Array<number>,
    ephemeris2: Array<number>,
): Array<number> {
    return ephemeris1.map((value1, key) => value1 - ephemeris2[key]);
}
