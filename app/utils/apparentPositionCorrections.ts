import {DEG} from '@app/constants/math';
import {sec2deg} from '@app/utils/angle';
import * as earth from '@app/utils/earth';
import * as sun from '@app/utils/sun';
import type {EclipticSphericalCoordinates} from '../types/CoordinateTypes';

export function getLightTimeCorrectedJulianDay(jd: number, d: number): number {
    // Meeus 33.3
    const theta = 0.0057755183 * d;

    return jd - theta;
}

export function correctEffectOfNutation(coords: EclipticSphericalCoordinates, T: number): EclipticSphericalCoordinates {
    const phi = earth.getNutationInLongitude(T);

    return {
        lon: coords.lon + phi,
        lat: coords.lat,
        radiusVector: coords.radiusVector,
    };
}

export function correctEffectOfAberration(
    coords: EclipticSphericalCoordinates,
    T: number,
): EclipticSphericalCoordinates {
    // TODO Better formula with Ron-Vondrak expression
    const lonSun = sun.getTrueLongitude(T);
    const e = earth.getEccentricity(T);
    const pi = earth.getLongitudeOfPerihelionOfOrbit(T);
    const k = sec2deg(20.49552);

    const lonRad = coords.lon * DEG;
    const latRad = coords.lat * DEG;
    const lonSunRad = lonSun * DEG;
    const piRad = pi * DEG;

    const dLon = (-1 * k * Math.cos(lonSunRad - lonRad) + e * k * Math.cos(piRad - lonRad)) / Math.cos(latRad);
    const dLat = -1 * k * Math.sin(latRad) * (Math.sin(lonSunRad - lonRad) - e * Math.sin(piRad - lonRad));

    return {
        lon: coords.lon + dLon,
        lat: coords.lat + dLat,
        radiusVector: coords.radiusVector,
    };
}

export function correctEffectOfRefraction(altitude: number): number {
    if (altitude < -5) {
        return altitude;
    }

    // Meeus 16.4
    const R = 1.02 / Math.tan((altitude + 10.3 / (altitude + 5.11)) * DEG);

    return altitude + R / 60;
}
