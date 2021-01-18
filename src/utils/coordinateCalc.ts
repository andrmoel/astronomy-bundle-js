import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import ILocalHorizontalCoordinates from '../coordinates/interfaces/ILocalHorizontalCoordinates';
import {deg2rad, normalizeAngle, rad2deg, sec2deg} from './angleCalc';
import {getLocalApparentSiderealTime, getLocalHourAngle, julianCenturiesJ20002julianDay} from './timeCalc';
import {correctPrecessionForEclipticCoordinates} from './precessionCalc';
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

export function equatorialSpherical2topocentricSpherical(
    T: number,
    rightAscension: number,
    declination: number,
    radiusVector: number,
    lat: number,
    lon: number,
    elevation?: number,
): IEquatorialSphericalCoordinates {
    const dRad = deg2rad(declination);

    elevation = elevation || 0.0;
    const pSinLat = getPSinLat(lat, elevation);
    const pCosLat = getPCosLat(lat, elevation);

    const pi = getEquatorialParallax(radiusVector);
    const piRad = deg2rad(pi);

    const LAST = getLocalApparentSiderealTime(T, lon);
    const H = getLocalHourAngle(T, lon, rightAscension);
    const HRad = deg2rad(H);

    // Meeus 40.6
    const A = Math.cos(dRad) * Math.sin(HRad);
    const B = Math.cos(dRad) * Math.cos(HRad) - pCosLat * Math.sin(piRad);
    const C = Math.sin(dRad) - pSinLat * Math.sin(piRad);

    // Meeus 40.7
    const q = Math.sqrt(A * A + B * B + C * C);

    const HTopo = rad2deg(Math.atan2(A, B));
    const dTopoRad = Math.asin(C / q);

    return {
        rightAscension: normalizeAngle(LAST - HTopo),
        declination: rad2deg(dTopoRad),
        radiusVector: q * radiusVector,
    }
}

export function equatorialSpherical2topocentricHorizontal(
    T: number,
    rightAscension: number,
    declination: number,
    radiusVector: number,
    lat: number,
    lon: number,
    elevation?: number
): ILocalHorizontalCoordinates {
    const coords = equatorialSpherical2topocentricSpherical(
        T,
        rightAscension,
        declination,
        radiusVector,
        lat,
        lon,
        elevation,
    );
    const H = getLocalHourAngle(T, lon, rightAscension);

    return equatorialSpherical2topocentricHorizontalByLocalHourAngle(H, declination, lat, coords.radiusVector);
}

export function equatorialSpherical2topocentricHorizontalByLocalHourAngle(
    localHourAngle: number,
    declination: number,
    lat: number,
    radiusVector: number = 0,
): ILocalHorizontalCoordinates {
    const HRad = deg2rad(localHourAngle);
    const dRad = deg2rad(declination);
    const latRad = deg2rad(lat);

    // Meeus 13.5
    const ARad = Math.atan2(
        Math.sin(HRad),
        Math.cos(HRad) * Math.sin(latRad) - Math.tan(dRad) * Math.cos(latRad)
    );

    // Meeus 13.6
    const hRad = Math.asin(Math.sin(latRad) * Math.sin(dRad) + Math.cos(latRad) * Math.cos(dRad) * Math.cos(HRad));

    return {
        azimuth: normalizeAngle(rad2deg(ARad) + 180),
        altitude: rad2deg(hRad),
        radiusVector: radiusVector,
    }
}

export function eclipticSpherical2equatorialSpherical(
    lon: number,
    lat: number,
    radiusVector: number,
    T: number,
    normalize: boolean = true,
): IEquatorialSphericalCoordinates {
    const eps = earthCalc.getTrueObliquityOfEcliptic(T);
    const epsRad = deg2rad(eps);
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

    // Meeus 13.3
    const n = Math.sin(lonRad) * Math.cos(epsRad) - (Math.sin(latRad) / Math.cos(latRad)) * Math.sin(epsRad);
    const d = Math.cos(lonRad);
    const rightAscensionRad = Math.atan2(n, d);
    const rightAscension = normalize ? normalizeAngle(rad2deg(rightAscensionRad)) : rad2deg(rightAscensionRad);

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

export function rectangularHeliocentric2rectangularGeocentric(
    heliocentricCoords: IRectangularCoordinates,
    heliocentricCoordsEarth: IRectangularCoordinates
): IRectangularCoordinates {
    return {
        x: heliocentricCoords.x - heliocentricCoordsEarth.x,
        y: heliocentricCoords.y - heliocentricCoordsEarth.y,
        z: heliocentricCoords.z - heliocentricCoordsEarth.z,
    }
}

export function rectangularGeocentric2rectangularHeliocentric(
    geocentricCoords: IRectangularCoordinates,
    heliocentricCoordsEarth: IRectangularCoordinates
): IRectangularCoordinates {
    return {
        x: geocentricCoords.x + heliocentricCoordsEarth.x,
        y: geocentricCoords.y + heliocentricCoordsEarth.y,
        z: geocentricCoords.z + heliocentricCoordsEarth.z,
    }
}

export function earthEclipticSpherical2sunEclipticSpherical(
    coordsEarth: IEclipticSphericalCoordinates
): IEclipticSphericalCoordinates {
    const {lon, lat, radiusVector} = coordsEarth;

    return {
        lon: normalizeAngle(lon + 180),
        lat: -1 * lat,
        radiusVector: radiusVector,
    }
}

/**
 * @deprecated Use correctPrecessionForEclipticCoordinates()
 */
export function eclipticJ20002eclipticDate(
    lon: number,
    lat: number,
    radiusVector: number,
    T: number,
): IEclipticSphericalCoordinates {
    const jd = julianCenturiesJ20002julianDay(T);

    return correctPrecessionForEclipticCoordinates(lon, lat, radiusVector, jd);
}

export function getEquatorialParallax(d: number): number {
    // Meeus 40.1
    const angle = deg2rad(sec2deg(8.794));
    const piRad = Math.asin(Math.sin(angle) / d);

    return rad2deg(piRad);
}

export function getPSinLat(lat: number, elevation: number): number {
    const latRad = deg2rad(lat);

    const a = 6378.14;
    const f = 1 / 298.257;
    const b = a * (1 - f);

    // Meeus 11
    const uRad = Math.atan(b / a * Math.tan(latRad));

    return b / a * Math.sin(uRad) + elevation / 6378140 * Math.sin(latRad);
}

export function getPCosLat(lat: number, elevation: number): number {
    const latRad = deg2rad(lat);

    const a = 6378.14;
    const f = 1 / 298.257;
    const b = a * (1 - f);

    // Meeus 11
    const uRad = Math.atan(b / a * Math.tan(latRad));

    return Math.cos(uRad) + elevation / 6378140 * Math.cos(latRad);
}
