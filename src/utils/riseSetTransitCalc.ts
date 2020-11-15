import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import {getGreenwichApparentSiderealTime, julianDay2julianCenturiesJ2000} from './timeCalc';
import ILocation from '../earth/interfaces/ILocation';
import {normalizeAngle} from './angleCalc';

export function getTransit(
    appGeoEquCoords: IEquatorialSphericalCoordinates,
    location: ILocation,
    jd0: number,
): number {
    const m0 = _getApproximatedMTransit(appGeoEquCoords, location, jd0);
    const m = 0.0; // TODO Corrections

    return jd0 + m0 + m;
}

function _getApproximatedMTransit(
    appGeoEquCoords: IEquatorialSphericalCoordinates,
    location: ILocation,
    jd0: number,
): number {
    const T = julianDay2julianCenturiesJ2000(jd0);
    const GAST = getGreenwichApparentSiderealTime(T);

    const m0 = (appGeoEquCoords.rightAscension - location.lon - GAST) / 360;

    return normalizeAngle(m0, 1);
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
