import ILocation from '../earth/interfaces/ILocation';
import {createTimeOfInterest} from '../time';
import IAstronomicalObject from '../astronomicalObject/interfaces/IAstronomicalObject';
import {getDeltaT, getGreenwichApparentSiderealTime, julianDay2julianCenturiesJ2000, julianDay2time} from './timeCalc';
import {
    getDeclinationInterpolationArray,
    getRightAscensionInterpolationArray,
    tabularInterpolation3
} from './interpolationCalc';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';
import {equatorialSpherical2localHorizontalByLocalHourAngle} from './coordinateCalc';

export async function getTransit(
    objConstructor: any,
    location: ILocation,
    jd0: number,
): Promise<number> {
    let m0 = await _getApproximatedMTransit(objConstructor, location, jd0);
    let dm = 0;

    do {
        dm = await _getCorrectionsTransit(objConstructor, location, jd0, m0);
        m0 += dm;
    } while (Math.abs(dm) > 0.00001);

    return jd0 + m0;
}

export async function getRise(
    objConstructor: any,
    location: ILocation,
    jd0: number,
    h0: number,
): Promise<number> {
    const m0 = await _getApproximatedMTransit(objConstructor, location, jd0);
    const mH = await _getApproximatedMRiseSet(objConstructor, location, jd0, h0);

    if (isNaN(mH)) {
        throw new Error('Astronomical object cannot rise on given day ' + jd0);
    }

    let m1 = normalizeAngle(m0 - mH, 1);
    let dm = 0;

    do {
        dm = await _getCorrectionsRiseSet(objConstructor, location, jd0, h0, m1);
        m1 += dm;
    } while (Math.abs(dm) > 0.00001);

    return jd0 + m1;
}

export async function getSet(
    objConstructor: any,
    location: ILocation,
    jd0: number,
    h0: number,
): Promise<number> {
    const m0 = await _getApproximatedMTransit(objConstructor, location, jd0);
    const mH = await _getApproximatedMRiseSet(objConstructor, location, jd0, h0);

    if (isNaN(mH)) {
        throw new Error('Astronomical object cannot set on given day ' + jd0);
    }

    let m2 = normalizeAngle(m0 + mH, 1);
    let dm = 0;

    do {
        dm = await _getCorrectionsRiseSet(objConstructor, location, jd0, h0, m2);
        m2 += dm;
    } while (Math.abs(dm) > 0.00001);

    return jd0 + m2 + dm;
}

async function _getApproximatedMTransit(
    objConstructor: any,
    location: ILocation,
    jd0: number,
): Promise<number> {
    const object = _createAstronomicalObject(objConstructor, jd0);
    const {rightAscension} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

    const T = julianDay2julianCenturiesJ2000(jd0);
    const GAST = getGreenwichApparentSiderealTime(T);

    // Meeus 15.2
    const m0 = (rightAscension - location.lon - GAST) / 360;

    return normalizeAngle(m0, 1);
}

async function _getApproximatedMRiseSet(
    objConstructor: any,
    location: ILocation,
    jd0: number,
    h0: number,
): Promise<number> {
    const H0 = await _getH0(objConstructor, location, jd0, h0);

    return H0 / 360;
}

async function _getCorrectionsTransit(
    objConstructor: any,
    location: ILocation,
    jd0: number,
    m: number,
): Promise<number> {
    const rightAscensionArray = await getRightAscensionInterpolationArray(objConstructor, jd0, 1);

    const n0 = _getN0(jd0, m);

    const raInterpolated = tabularInterpolation3(rightAscensionArray, n0);
    const H = _getLocalHourAngle(raInterpolated, location.lon, jd0, m);

    return -H / 360;
}

async function _getCorrectionsRiseSet(
    objConstructor: any,
    location: ILocation,
    jd0: number,
    h0: number,
    m: number,
): Promise<number> {
    const {lat} = location;
    const latRad = deg2rad(lat);

    const rightAscensionArray = await getRightAscensionInterpolationArray(objConstructor, jd0, 1);
    const declinationArray = await getDeclinationInterpolationArray(objConstructor, jd0, 1);

    const n0 = _getN0(jd0, m);

    const raInterpolated = tabularInterpolation3(rightAscensionArray, n0);
    const decInterpolated = tabularInterpolation3(declinationArray, n0);
    const dRad = deg2rad(decInterpolated);

    const H = await _getLocalHourAngle(raInterpolated, location.lon, jd0, m);
    const HRad = deg2rad(H);

    const {altitude} = equatorialSpherical2localHorizontalByLocalHourAngle(H, decInterpolated, lat);

    return (altitude - h0) / (360 * Math.cos(dRad) * Math.cos(latRad) * Math.sin(HRad));
}

function _getLocalHourAngle(
    raInterpolated: number,
    longitude: number,
    jd0: number,
    m: number,
) {
    const T = julianDay2julianCenturiesJ2000(jd0);
    const GAST = getGreenwichApparentSiderealTime(T);
    const theta0 = normalizeAngle(GAST + 360.985647 * m);

    return theta0 + longitude - raInterpolated;
}

async function _getH0(objConstructor: any, location: ILocation, jd0: number, h0: number): Promise<number> {
    const object = _createAstronomicalObject(objConstructor, jd0);
    const {declination} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

    const latRad = deg2rad(location.lat);
    const dRad = deg2rad(declination);
    const h0Rad = deg2rad(h0);

    // Meeus 15.1
    const cosH0 = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(dRad)) / (Math.cos(latRad) * Math.cos(dRad));

    return rad2deg(Math.acos(cosH0));
}

function _getN0(jd: number, m: number): number {
    const {year, month} = julianDay2time(jd);
    const dT = getDeltaT(year, month);

    return m + dT / 86400;
}

function _createAstronomicalObject(objConstructor: any, jd: number): IAstronomicalObject {
    const toi = createTimeOfInterest.fromJulianDay(jd);

    return new objConstructor(toi);
}