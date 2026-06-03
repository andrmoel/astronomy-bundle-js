import * as earth from '@app/utils/earth';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '../types/CoordinateTypes';
import {DEG, RAD} from '@app/constants/math';
import {normalizeAngle, sec2deg} from '@app/utils/angle';
import {Location} from '@app/types/LocationTypes';
import {EARTH_AXIS_RATIO, EARTH_EQUATORIAL_RADIUS_METERS} from '@app/constants/earth';
import {correctPrecessionForEclipticCoordinates} from '@app/utils/precession';
import {getLocalApparentSiderealTime, getLocalHourAngle} from '@app/utils/siderealTime';
import {julianCenturiesJ20002julianDay} from '@package/time/utils/dateTime';

export function rectangular2spherical(coords: RectangularCoordinates): EclipticSphericalCoordinates {
    const {x, y, z} = coords;

    // Meeus 33.2
    const lonRad = Math.atan2(y, x);
    const lon = normalizeAngle(lonRad * RAD);

    const latRad = Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lat = latRad * RAD;

    const radiusVector = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

    return {lon, lat, radiusVector};
}

export function spherical2rectangular(coords: EclipticSphericalCoordinates): RectangularCoordinates {
    const {lon, lat, radiusVector} = coords;

    const lonRad = lon * DEG;
    const latRad = lat * DEG;

    const x = radiusVector * Math.cos(latRad) * Math.cos(lonRad);
    const y = radiusVector * Math.cos(latRad) * Math.sin(lonRad);
    const z = radiusVector * Math.sin(latRad);

    return {x, y, z};
}

export function equatorialSpherical2topocentricSpherical(
    coords: EquatorialSphericalCoordinates,
    location: Location,
    T: number,
): EquatorialSphericalCoordinates {
    const {rightAscension, declination, radiusVector} = coords;
    let {lat, lon, elevation} = location;

    const dRad = declination * DEG;

    elevation = elevation || 0.0;
    const rhoSinLat = getRhoSinLat(lat, elevation);
    const rhoCosLat = getRhoCosLat(lat, elevation);

    const pi = getEquatorialParallax(radiusVector);
    const piRad = pi * DEG;

    const LAST = getLocalApparentSiderealTime(T, lon);
    const H = getLocalHourAngle(T, lon, rightAscension);
    const HRad = H * DEG;

    // Meeus 40.6
    const A = Math.cos(dRad) * Math.sin(HRad);
    const B = Math.cos(dRad) * Math.cos(HRad) - rhoCosLat * Math.sin(piRad);
    const C = Math.sin(dRad) - rhoSinLat * Math.sin(piRad);

    // Meeus 40.7
    const q = Math.sqrt(A * A + B * B + C * C);

    const HTopo = Math.atan2(A, B) * RAD;
    const dTopoRad = Math.asin(C / q);

    return {
        rightAscension: normalizeAngle(LAST - HTopo),
        declination: dTopoRad * RAD,
        radiusVector: q * radiusVector,
    };
}

export function equatorialSpherical2topocentricHorizontal(
    coords: EquatorialSphericalCoordinates,
    location: Location,
    T: number,
): LocalHorizontalCoordinates {
    const {rightAscension, declination} = coords;
    const {lat, lon} = location;

    const topoCoords = equatorialSpherical2topocentricSpherical(coords, location, T);
    const H = getLocalHourAngle(T, lon, rightAscension);

    return equatorialSpherical2topocentricHorizontalByLocalHourAngle(H, declination, lat, topoCoords.radiusVector);
}

export function equatorialSpherical2topocentricHorizontalByLocalHourAngle(
    localHourAngle: number,
    declination: number,
    lat: number,
    radiusVector = 0,
): LocalHorizontalCoordinates {
    const HRad = localHourAngle * DEG;
    const dRad = declination * DEG;
    const latRad = lat * DEG;

    // Meeus 13.5
    const ARad = Math.atan2(
        Math.sin(HRad),
        Math.cos(HRad) * Math.sin(latRad) - Math.tan(dRad) * Math.cos(latRad),
    );

    // Meeus 13.6
    const hRad = Math.asin(Math.sin(latRad) * Math.sin(dRad) + Math.cos(latRad) * Math.cos(dRad) * Math.cos(HRad));

    return {
        azimuth: normalizeAngle(ARad * RAD + 180),
        altitude: hRad * RAD,
        radiusVector: radiusVector,
    };
}

export function eclipticSpherical2equatorialSpherical(
    coords: EclipticSphericalCoordinates,
    T: number,
    normalize = true,
): EquatorialSphericalCoordinates {
    const {lon, lat, radiusVector} = coords;

    const eps = earth.getTrueObliquityOfEcliptic(T);
    const epsRad = eps * DEG;
    const lonRad = lon * DEG;
    const latRad = lat * DEG;

    // Meeus 13.3
    const n = Math.sin(lonRad) * Math.cos(epsRad) - Math.sin(latRad) / Math.cos(latRad) * Math.sin(epsRad);
    const d = Math.cos(lonRad);
    const rightAscensionRad = Math.atan2(n, d);
    const rightAscension = normalize
        ? normalizeAngle(rightAscensionRad * RAD)
        : rightAscensionRad * RAD;

    // Meeus 13.4
    const declinationRad = Math.asin(
        Math.sin(latRad) * Math.cos(epsRad) + Math.cos(latRad) * Math.sin(epsRad) * Math.sin(lonRad),
    );
    const declination = declinationRad * RAD;

    return {rightAscension, declination, radiusVector};
}

export function equatorialSpherical2eclipticSpherical(
    coords: EquatorialSphericalCoordinates,
    T: number,
): EclipticSphericalCoordinates {
    const {rightAscension, declination, radiusVector} = coords;

    const eps = earth.getTrueObliquityOfEcliptic(T);
    const epsRad = eps * DEG;
    const rightAscensionRad = rightAscension * DEG;
    const declinationRad = declination * DEG;

    // Meeus 13.1
    const n = Math.sin(rightAscensionRad) * Math.cos(epsRad) + Math.tan(declinationRad) * Math.sin(epsRad);
    const d = Math.cos(rightAscensionRad);
    const lonRad = Math.atan2(n, d);
    const lon = normalizeAngle(lonRad * RAD);

    // Meeus 13.2
    const latRad = Math.asin(
        Math.sin(declinationRad) * Math.cos(epsRad)
        - Math.cos(declinationRad) * Math.sin(epsRad) * Math.sin(rightAscensionRad),
    );
    const lat = latRad * RAD;

    return {lon, lat, radiusVector};
}

export function rectangularHeliocentric2rectangularGeocentric(
    heliocentricCoords: RectangularCoordinates,
    heliocentricCoordsEarth: RectangularCoordinates,
): RectangularCoordinates {
    return {
        x: heliocentricCoords.x - heliocentricCoordsEarth.x,
        y: heliocentricCoords.y - heliocentricCoordsEarth.y,
        z: heliocentricCoords.z - heliocentricCoordsEarth.z,
    };
}

export function rectangularGeocentric2rectangularHeliocentric(
    geocentricCoords: RectangularCoordinates,
    heliocentricCoordsEarth: RectangularCoordinates,
): RectangularCoordinates {
    return {
        x: geocentricCoords.x + heliocentricCoordsEarth.x,
        y: geocentricCoords.y + heliocentricCoordsEarth.y,
        z: geocentricCoords.z + heliocentricCoordsEarth.z,
    };
}

export function earthEclipticSpherical2sunEclipticSpherical(
    coordsEarth: EclipticSphericalCoordinates,
): EclipticSphericalCoordinates {
    const {lon, lat, radiusVector} = coordsEarth;

    return {
        lon: normalizeAngle(lon + 180),
        lat: -1 * lat,
        radiusVector: radiusVector,
    };
}

/**
 * @deprecated Use correctPrecessionForEclipticCoordinates()
 */
export function eclipticJ20002eclipticDate(
    lon: number,
    lat: number,
    radiusVector: number,
    T: number,
): EclipticSphericalCoordinates {
    const jd = julianCenturiesJ20002julianDay(T);

    return correctPrecessionForEclipticCoordinates({lon, lat, radiusVector}, jd);
}

export function getEquatorialParallax(d: number): number {
    // Meeus 40.1
    const angle = sec2deg(8.794) * DEG;
    const piRad = Math.asin(Math.sin(angle) / d);

    return piRad * RAD;
}

export function getRhoSinLat(lat: number, elevation: number): number {
    const latRad = lat * DEG;

    // Meeus 11
    const uRad = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));

    return EARTH_AXIS_RATIO * Math.sin(uRad) + elevation / EARTH_EQUATORIAL_RADIUS_METERS * Math.sin(latRad);
}

export function getRhoCosLat(lat: number, elevation: number): number {
    const latRad = lat * DEG;

    // Meeus 11
    const uRad = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));

    return Math.cos(uRad) + elevation / EARTH_EQUATORIAL_RADIUS_METERS * Math.cos(latRad);
}
