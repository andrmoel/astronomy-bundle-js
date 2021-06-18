import {deg2rad, rad2deg} from '../../utils/angleCalc';

export function getRingInclination(T: number): number {
    return 28.075216
        - 0.012998 * T
        + 0.000004 * Math.pow(T, 2);
}

export function getLongitudeOfAscendingNode(T: number): number {
    return 169.508470
        + 1.394681 * T
        + 0.000412 * Math.pow(T, 2)
}

export function getB(T: number): number {
    const lon = 314.777850; // TODO
    const lat = -1.013885;
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

    const i = getRingInclination(T);
    const Omega = getLongitudeOfAscendingNode(T);
    const iRad = deg2rad(i);
    const OmegaRad = deg2rad(Omega);

    const BRad = Math.asin(
        Math.sin(iRad) * Math.cos(latRad) * Math.sin(lonRad - OmegaRad) - Math.cos(iRad) * Math.sin(latRad)
    );

    return rad2deg(BRad);
}

export function getDeltaU(T: number): number {
    const i = getRingInclination(T);
    const Omega = getLongitudeOfAscendingNode(T);

    // TODO
    const lon = 314.777850; // TODO
    const lat = -1.013885;
    const l = 319.189853; // TODO
    const b = -1.075113;

    const U1 = _getU(lon, lat, i, Omega);
    const U2 = _getU(l, b, i, Omega);

    return Math.abs(U1 - U2);
}

function _getU(lon: number, lat: number, inclination: number, longitudeInAscendingNode: number): number {
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);
    const iRad = deg2rad(inclination);
    const OmegaRad = deg2rad(longitudeInAscendingNode);

    // Meeus 45
    const URad = Math.atan2(
        Math.sin(iRad) * Math.sin(latRad) + Math.cos(iRad) * Math.cos(latRad) * Math.sin(lonRad - OmegaRad),
        Math.cos(latRad) * Math.cos(lonRad - OmegaRad)
    );

    return rad2deg(URad);
}
