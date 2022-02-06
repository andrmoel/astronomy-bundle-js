import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '../types/CoordinateTypes';
import {Location} from '../../earth/types/LocationTypes';
import {earthCalc} from '../../earth/calculations';
import {
    getLocalApparentSiderealTime,
    getLocalHourAngle,
    julianCenturiesJ20002julianDay,
} from '../../time/calculations/timeCalc';
import {deg2rad, normalizeAngle, rad2deg, sec2deg} from '../../utils/angleCalc';
import {EARTH_AXIS_RATIO, EARTH_RADIUS} from '../../earth/constants/dimensions';
import {correctPrecessionForEclipticCoordinates} from './precessionCalc';

export function rectangular2spherical(coords: RectangularCoordinates): EclipticSphericalCoordinates {
    const {x, y, z} = coords;

    // Meeus 33.2
    const lonRad = Math.atan2(y, x);
    const lon = normalizeAngle(rad2deg(lonRad));

    const latRad = Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lat = rad2deg(latRad);

    const radiusVector = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

    return {lon, lat, radiusVector};
}

export function spherical2rectangular(coords: EclipticSphericalCoordinates): RectangularCoordinates {
    const {lon, lat, radiusVector} = coords;

    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

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

    const dRad = deg2rad(declination);

    elevation = elevation || 0.0;
    const rhoSinLat = getRhoSinLat(lat, elevation);
    const rhoCosLat = getRhoCosLat(lat, elevation);

    const pi = getEquatorialParallax(radiusVector);
    const piRad = deg2rad(pi);

    const LAST = getLocalApparentSiderealTime(T, lon);
    const H = getLocalHourAngle(T, lon, rightAscension);
    const HRad = deg2rad(H);

    // Meeus 40.6
    const A = Math.cos(dRad) * Math.sin(HRad);
    const B = Math.cos(dRad) * Math.cos(HRad) - rhoCosLat * Math.sin(piRad);
    const C = Math.sin(dRad) - rhoSinLat * Math.sin(piRad);

    // Meeus 40.7
    const q = Math.sqrt(A * A + B * B + C * C);

    const HTopo = rad2deg(Math.atan2(A, B));
    const dTopoRad = Math.asin(C / q);

    return {
        rightAscension: normalizeAngle(LAST - HTopo),
        declination: rad2deg(dTopoRad),
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
    const HRad = deg2rad(localHourAngle);
    const dRad = deg2rad(declination);
    const latRad = deg2rad(lat);

    // Meeus 13.5
    const ARad = Math.atan2(
        Math.sin(HRad),
        Math.cos(HRad) * Math.sin(latRad) - Math.tan(dRad) * Math.cos(latRad),
    );

    // Meeus 13.6
    const hRad = Math.asin(Math.sin(latRad) * Math.sin(dRad) + Math.cos(latRad) * Math.cos(dRad) * Math.cos(HRad));

    return {
        azimuth: normalizeAngle(rad2deg(ARad) + 180),
        altitude: rad2deg(hRad),
        radiusVector: radiusVector,
    };
}

export function eclipticSpherical2equatorialSpherical(
    coords: EclipticSphericalCoordinates,
    T: number,
    normalize = true,
): EquatorialSphericalCoordinates {
    const {lon, lat, radiusVector} = coords;

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
        Math.sin(latRad) * Math.cos(epsRad) + Math.cos(latRad) * Math.sin(epsRad) * Math.sin(lonRad),
    );
    const declination = rad2deg(declinationRad);

    return {rightAscension, declination, radiusVector};
}

export function equatorialSpherical2eclipticSpherical(
    coords: EquatorialSphericalCoordinates,
    T: number,
): EclipticSphericalCoordinates {
    const {rightAscension, declination, radiusVector} = coords;

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
        Math.sin(declinationRad) * Math.cos(epsRad)
        - Math.cos(declinationRad) * Math.sin(epsRad) * Math.sin(rightAscensionRad),
    );
    const lat = rad2deg(latRad);

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
    const angle = deg2rad(sec2deg(8.794));
    const piRad = Math.asin(Math.sin(angle) / d);

    return rad2deg(piRad);
}

export function getRhoSinLat(lat: number, elevation: number): number {
    const latRad = deg2rad(lat);

    // Meeus 11
    const uRad = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));

    return EARTH_AXIS_RATIO * Math.sin(uRad) + elevation / EARTH_RADIUS * Math.sin(latRad);
}

export function getRhoCosLat(lat: number, elevation: number): number {
    const latRad = deg2rad(lat);

    // Meeus 11
    const uRad = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));

    return Math.cos(uRad) + elevation / EARTH_RADIUS * Math.cos(latRad);
}
