import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';
import {earthCalc} from './index';

export function rectangular2spherical(x: number, y: number, z: number): IEclipticSphericalCoordinates {
    // Meeus 33.2
    const lonRad = Math.atan2(y, x);
    const lon = normalizeAngle(rad2deg(lonRad));

    const latRad = Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lat = rad2deg(latRad);

    const radiusVector = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

    return {lon, lat, radiusVector};
}

export function spherical2rectangular(lon: number, lat: number, radiusVector: number): IRectangularCoordinates {
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

    const x = radiusVector * Math.cos(latRad) * Math.cos(lonRad);
    const y = radiusVector * Math.cos(latRad) * Math.sin(lonRad);
    const z = radiusVector * Math.sin(latRad);

    return {x, y, z};
}

export function eclipticSpherical2equatorialSpherical(
    lon: number,
    lat: number,
    radiusVector: number,
    T: number,
): IEquatorialSphericalCoordinates {
    const eps = earthCalc.getTrueObliquityOfEcliptic(T);
    const epsRad = deg2rad(eps);
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

    // Meeus 13.3
    const n = Math.sin(lonRad) * Math.cos(epsRad) - (Math.sin(latRad) / Math.cos(latRad)) * Math.sin(epsRad);
    const d = Math.cos(lonRad);
    const rightAscensionRad = Math.atan2(n, d);
    const rightAscension = normalizeAngle(rad2deg(rightAscensionRad));

    // Meeus 13.4
    const declinationRad = Math.asin(
        Math.sin(latRad) * Math.cos(epsRad) + Math.cos(latRad) * Math.sin(epsRad) * Math.sin(lonRad)
    );
    const declination = rad2deg(declinationRad);

    return {rightAscension, declination, radiusVector};
}

export function equatorialSpherical2eclipticSpherical(
    rightAscension: number,
    declination: number,
    radiusVector: number,
    T: number,
): IEclipticSphericalCoordinates {
    const eps = earthCalc.getTrueObliquityOfEcliptic(T);
    const epsRad = deg2rad(eps);
    const rightAscensionRad = deg2rad(rightAscension);
    const declinationRad = deg2rad(declination);

    // Meeus 13.1
    const n = Math.sin(rightAscensionRad) * Math.cos(epsRad) + Math.tan(declinationRad) * Math.sin(epsRad);
    const d = Math.cos(rightAscensionRad);
    const lonRad = Math.atan2(n, d);
    const lon = normalizeAngle(rad2deg(lonRad));

    // Meeus 13.2
    const latRad = Math.asin(
        Math.sin(declinationRad) * Math.cos(epsRad) - Math.cos(declinationRad) * Math.sin(epsRad) * Math.sin(rightAscensionRad)
    );
    const lat = rad2deg(latRad);

    return {lon, lat, radiusVector};
}
