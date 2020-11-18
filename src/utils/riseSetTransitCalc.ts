import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import ILocation from '../earth/interfaces/ILocation';
import {createTimeOfInterest} from '../time';
import IAstronomicalObject from '../astronomicalObject/interfaces/IAstronomicalObject';
import {getDeltaT, getGreenwichApparentSiderealTime, julianDay2julianCenturiesJ2000} from './timeCalc';
import {getRightAscensionInterpolationArray, tabularInterpolation3} from './interpolationCalc';
import {normalizeAngle} from './angleCalc';

export async function getTransit(
    objConstructor: any,
    location: ILocation,
    jd0: number,
): Promise<number> {
    const m0 = await _getApproximatedMTransit(objConstructor, location, jd0);
    const m = await _getCorrections(objConstructor, location, jd0, m0);

    return jd0 + m0 + m;
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


async function _getCorrections(
    objConstructor: any,
    location: ILocation,
    jd0: number,
    m0: number,
): Promise<number> {
    const rightAscensionArray = await getRightAscensionInterpolationArray(objConstructor, jd0, 1);

    const dT = getDeltaT(1988, 3);
    const n0 = m0 + dT / 86400;

    const raInterpolated = tabularInterpolation3(rightAscensionArray, n0);

    const T = julianDay2julianCenturiesJ2000(jd0);
    const GAST = getGreenwichApparentSiderealTime(T);
    const theta0 = normalizeAngle(GAST + 360.985647 * m0);
    const H = theta0 + location.lon - raInterpolated;

    return -H / 360;
}

function _getApproximatedMRise(
    geoEquCoords: IEquatorialSphericalCoordinates,
    location: ILocation,
    T: number,
): number {
    const m0 = _getApproximatedMTransit(geoEquCoords, location, T);

    // const dRad = deg2rad(declination);
    // const latRad = deg2rad(lat);
    // const h0Rad = deg2rad(_getStandardAltitude());

    // Meeus 15.1
    // const cosH0 = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(dRad)) / (Math.cos(latRad) * Math.cos(dRad));
    // const H0 = rad2deg(Math.acos(cosH0));

    return 0.0;
}

function _getStandardAltitude() {
    return -0.5667; // TODO
}

function _createAstronomicalObject(objConstructor: any, jd: number): IAstronomicalObject {
    const toi = createTimeOfInterest.fromJulianDay(jd);

    return new objConstructor(toi);
}
