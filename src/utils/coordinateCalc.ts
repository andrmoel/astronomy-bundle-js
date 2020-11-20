import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import ILocalHorizontalCoordinates from '../coordinates/interfaces/ILocalHorizontalCoordinates';
import {deg2rad, normalizeAngle, rad2deg, sec2deg} from './angleCalc';
import {earthCalc} from './index';
import {getLocalHourAngle} from './timeCalc';

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

export function equatorialSpherical2localHorizontal(
    rightAscension: number,
    declination: number,
    lat: number,
    lon: number,
    T: number
): ILocalHorizontalCoordinates {
    const H = getLocalHourAngle(T, lon, rightAscension);

    return equatorialSpherical2localHorizontalByLocalHourAngle(H, declination, lat);
}

export function equatorialSpherical2localHorizontalByLocalHourAngle(
    localHourAngle: number,
    declination: number,
    lat: number,
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
        azimuth: normalizeAngle(rad2deg(ARad)),
        altitude: rad2deg(hRad),
    }
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

export function eclipticJ20002eclipticDate(
    lon: number,
    lat: number,
    radiusVector: number,
    t: number,
): IEclipticSphericalCoordinates {
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

    const eta = sec2deg(47.0029) * t - sec2deg(0.03302) * Math.pow(t, 2) + sec2deg(0.00006) * Math.pow(t, 3);
    const Pi = 174.876384 - sec2deg(869.8089) * t + sec2deg(0.03536) * Math.pow(t, 2);
    const p = sec2deg(5029.0966) * t + sec2deg(1.11113) * Math.pow(t, 2) + sec2deg(0.000006) * Math.pow(t, 3);

    const etaRad = deg2rad(eta);
    const PiRad = deg2rad(Pi);

    // Meeus 21.7
    const A = Math.cos(etaRad) * Math.cos(latRad) * Math.sin(PiRad - lonRad) - Math.sin(etaRad) * Math.sin(latRad);
    const B = Math.cos(latRad) * Math.cos(PiRad - lonRad);
    const C = Math.cos(etaRad) * Math.sin(latRad) + Math.sin(etaRad) * Math.cos(latRad) * Math.sin(PiRad - lonRad);

    const lonDate = p + Pi - rad2deg(Math.atan2(A, B));
    const latDate = rad2deg(Math.asin(C));

    return {
        lon: normalizeAngle(lonDate),
        lat: latDate,
        radiusVector: radiusVector,
    }
}
