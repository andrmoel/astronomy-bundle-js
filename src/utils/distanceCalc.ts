import {deg2rad, rad2deg} from './angleCalc';

const AU_UNIT_OF_LENGTH = 149597870700.0;

export function au2km(R: number): number {
    return R * (AU_UNIT_OF_LENGTH / 1000);
}

export function km2au(km: number): number {
    return km / (AU_UNIT_OF_LENGTH / 1000);
}


export function getAngularDistance(
    rightAscension1: number,
    declination1: number,
    rightAscension2: number,
    declination2: number
): number {
    const ra1Rad = deg2rad(rightAscension1);
    const dec1Rad = deg2rad(declination1);
    const ra2Rad = deg2rad(rightAscension2);
    const dec2Rad = deg2rad(declination2);

    // Meeus 17
    const x = Math.cos(dec1Rad) * Math.sin(dec2Rad) - Math.sin(dec1Rad) * Math.cos(dec2Rad) * Math.cos(ra2Rad - ra1Rad);
    const y = Math.cos(dec2Rad) * Math.sin(ra2Rad - ra1Rad);
    const z = Math.sin(dec1Rad) * Math.sin(dec2Rad) + Math.cos(dec1Rad) * Math.cos(dec2Rad) * Math.cos(ra2Rad - ra1Rad);

    const dRad = Math.atan2(Math.sqrt(x * x + y * y), z);

    return rad2deg(dRad);
}
