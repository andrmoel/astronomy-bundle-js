import {TWO_PI, WGS72_RADIUS_KM, WGS72_XKE, X2O3} from '../constants/sgp4';

export function getOrbitalPeriod(meanMotion: number): number {
    return TWO_PI / meanMotion;
}

export function getApogeeHeight(meanMotion: number, eccentricity: number): number {
    return getSemiMajorAxis(meanMotion) * (1 + eccentricity) - WGS72_RADIUS_KM;
}

export function getPerigeeHeight(meanMotion: number, eccentricity: number): number {
    return getSemiMajorAxis(meanMotion) * (1 - eccentricity) - WGS72_RADIUS_KM;
}

export function getSemiMajorAxis(meanMotion: number): number {
    return (WGS72_XKE / meanMotion) ** X2O3 * WGS72_RADIUS_KM;
}
