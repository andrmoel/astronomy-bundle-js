import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {deg2rad, sec2deg} from './angleCalc';
import {getEccentricity, getLongitudeOfPerihelionOfOrbit, getNutationInLongitude} from './earthCalc';
import {sunCalc} from './index';

export function getLightTimeCorrectedJulianDay(jd: number, d: number): number {
    // Meeus 33.3
    const theta = 0.0057755183 * d;

    return jd - theta;
}

export function correctEffectOfNutation(
    coords: EclipticSphericalCoordinates,
    T: number
): EclipticSphericalCoordinates {
    const phi = getNutationInLongitude(T);

    return {
        lon: coords.lon + phi,
        lat: coords.lat,
        radiusVector: coords.radiusVector,
    };
}

export function correctEffectOfAberration(
    coords: EclipticSphericalCoordinates,
    T: number
): EclipticSphericalCoordinates {
    // TODO Better formula with Ron-Vondrak expression
    const lonSun = sunCalc.getTrueLongitude(T);
    const e = getEccentricity(T);
    const pi = getLongitudeOfPerihelionOfOrbit(T);
    const k = sec2deg(20.49552);

    const lonRad = deg2rad(coords.lon);
    const latRad = deg2rad(coords.lat);
    const lonSunRad = deg2rad(lonSun);
    const piRad = deg2rad(pi);

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
    const R = 1.02 / Math.tan(deg2rad(altitude + (10.3 / (altitude + 5.11))));

    return altitude + R / 60;
}
