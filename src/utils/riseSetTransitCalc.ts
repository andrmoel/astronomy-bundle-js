import {Location} from '../earth/types/LocationTypes';
import {createTimeOfInterest} from '../time';
import IAstronomicalObject from '../astronomicalObject/interfaces/IAstronomicalObject';
import {getDeltaT, getGreenwichApparentSiderealTime, julianDay2julianCenturiesJ2000, julianDay2time} from './timeCalc';
import {
    getDeclinationInterpolationArray,
    getRightAscensionInterpolationArray,
    tabularInterpolation3,
} from './interpolationCalc';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';
import {equatorialSpherical2topocentricHorizontalByLocalHourAngle} from './coordinateCalc';

export async function getTransit(
    ObjConstructor: any,
    location: Location,
    jd0: number,
): Promise<number> {
    let m0 = await _getApproximatedMTransit(ObjConstructor, location, jd0);
    let dm = 0;

    let cnt = 0;
    do {
        dm = await _getCorrectionsTransit(ObjConstructor, location, jd0, m0);
        m0 += dm;

        if (cnt++ > 100) {
            throw new Error(`While loop overflow. Astronomical object has no transit on given day ${jd0}.`);
        }
    } while (Math.abs(dm) > 0.00001);

    if (m0 < 0 || m0 >= 1) {
        throw new Error(`Astronomical object has no transit on given day ${jd0}.`);
    }

    return jd0 + m0;
}

export async function getRise(
    ObjConstructor: any,
    location: Location,
    jd0: number,
    h0: number,
): Promise<number> {
    const m0 = await _getApproximatedMTransit(ObjConstructor, location, jd0);
    const mH = await _getApproximatedMRiseSet(ObjConstructor, location, jd0, h0);

    if (isNaN(mH)) {
        throw new Error(`Astronomical object cannot rise on given day ${jd0}.`);
    }

    let m1 = normalizeAngle(m0 - mH, 1);
    let dm = 0;

    let cnt = 0;
    do {
        dm = await _getCorrectionsRiseSet(ObjConstructor, location, jd0, h0, m1);
        m1 += dm;

        if (cnt++ > 100) {
            throw new Error(`While loop overflow. Astronomical object cannot rise on given day ${jd0}.`);
        }
    } while (Math.abs(dm) > 0.00001);

    if (m1 < 0) {
        throw new Error(`Astronomical object cannot rise on given day ${jd0}. Rise happens the day before.`);
    }

    if (m1 >= 1) {
        throw new Error(`Astronomical object cannot rise on given day ${jd0}. Rise happens the next day.`);
    }

    return jd0 + m1;
}

export async function getSet(
    ObjConstructor: any,
    location: Location,
    jd0: number,
    h0: number,
): Promise<number> {
    const m0 = await _getApproximatedMTransit(ObjConstructor, location, jd0);
    const mH = await _getApproximatedMRiseSet(ObjConstructor, location, jd0, h0);

    if (isNaN(mH)) {
        throw new Error(`Astronomical object cannot set on given day ${jd0}.`);
    }

    let m2 = normalizeAngle(m0 + mH, 1);
    let dm = 0;

    let cnt = 0;
    do {
        dm = await _getCorrectionsRiseSet(ObjConstructor, location, jd0, h0, m2);
        m2 += dm;

        if (cnt++ > 100) {
            throw new Error(`While loop overflow. Astronomical object cannot set on given day ${jd0}.`);
        }
    } while (Math.abs(dm) > 0.00001);

    if (m2 < 0) {
        throw new Error(`Astronomical object cannot set on given day ${jd0}. Set happens the day before.`);
    }

    if (m2 >= 1) {
        throw new Error(`Astronomical object cannot set on given day ${jd0}. Set happens the next day.`);
    }

    return jd0 + m2;
}

async function _getApproximatedMTransit(
    ObjConstructor: any,
    location: Location,
    jd0: number,
): Promise<number> {
    const object = _createAstronomicalObject(ObjConstructor, jd0);
    const {rightAscension} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

    const T = julianDay2julianCenturiesJ2000(jd0);
    const GAST = getGreenwichApparentSiderealTime(T);

    // Meeus 15.2
    const m0 = (rightAscension - location.lon - GAST) / 360;

    return normalizeAngle(m0, 1);
}

async function _getApproximatedMRiseSet(
    ObjConstructor: any,
    location: Location,
    jd0: number,
    h0: number,
): Promise<number> {
    const H0 = await _getH0(ObjConstructor, location, jd0, h0);

    return H0 / 360;
}

async function _getCorrectionsTransit(
    ObjConstructor: any,
    location: Location,
    jd0: number,
    m: number,
): Promise<number> {
    const rightAscensionArray = await getRightAscensionInterpolationArray(ObjConstructor, jd0, 1);

    const n0 = _getN0(jd0, m);

    const raInterpolated = normalizeAngle(tabularInterpolation3(rightAscensionArray, n0));
    const H = _getLocalHourAngle(raInterpolated, location.lon, jd0, m);

    return -H / 360;
}

async function _getCorrectionsRiseSet(
    ObjConstructor: any,
    location: Location,
    jd0: number,
    h0: number,
    m: number,
): Promise<number> {
    const {lat} = location;
    const latRad = deg2rad(lat);

    const rightAscensionArray = await getRightAscensionInterpolationArray(ObjConstructor, jd0, 1);
    const declinationArray = await getDeclinationInterpolationArray(ObjConstructor, jd0, 1);

    const n0 = _getN0(jd0, m);

    const raInterpolated = normalizeAngle(tabularInterpolation3(rightAscensionArray, n0));
    const decInterpolated = tabularInterpolation3(declinationArray, n0);
    const dRad = deg2rad(decInterpolated);

    const H = await _getLocalHourAngle(raInterpolated, location.lon, jd0, m);
    const HRad = deg2rad(H);

    const {altitude} = equatorialSpherical2topocentricHorizontalByLocalHourAngle(H, decInterpolated, lat);

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
    const theta0 = GAST + 360.985647 * m;

    const H = theta0 + longitude - raInterpolated;

    return normalizeAngle(H + 180) - 180;
}

async function _getH0(ObjConstructor: any, location: Location, jd0: number, h0: number): Promise<number> {
    const object = _createAstronomicalObject(ObjConstructor, jd0);
    const {declination} = await object.getApparentGeocentricEquatorialSphericalCoordinates();

    const latRad = deg2rad(location.lat);
    const dRad = deg2rad(declination);
    const h0Rad = deg2rad(h0);

    // Meeus 15.1
    const cosH0 = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(dRad)) / (Math.cos(latRad) * Math.cos(dRad));

    if (Math.abs(cosH0) > 1 && Math.abs(cosH0) <= 1.1) {
        return 0;
    }

    return rad2deg(Math.acos(cosH0));
}

function _getN0(jd: number, m: number): number {
    const {year, month} = julianDay2time(jd);
    const dT = getDeltaT(year, month);

    return m + dT / 86400;
}

function _createAstronomicalObject(ObjConstructor: any, jd: number): IAstronomicalObject {
    const toi = createTimeOfInterest.fromJulianDay(jd);

    return new ObjConstructor(toi);
}
