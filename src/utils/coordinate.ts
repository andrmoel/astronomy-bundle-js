import {deg2rad, normalizeAngle, rad2deg} from './angle';

export function rectangular2spherical(x: number, y: number, z: number): {
    lon: number,
    lat: number,
    radiusVector: number
} {
    // Meeus 33.2
    const lonRad = Math.atan2(y, x);
    const lon = normalizeAngle(rad2deg(lonRad));

    const latRad = Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    const lat = rad2deg(latRad);

    const radiusVector = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

    return {lon, lat, radiusVector};
}

export function spherical2rectangular(lon: number, lat: number, radiusVector: number): {
    x: number,
    y: number,
    z: number
} {
    const lonRad = deg2rad(lon);
    const latRad = deg2rad(lat);

    const x = radiusVector * Math.cos(latRad) * Math.cos(lonRad);
    const y = radiusVector * Math.cos(latRad) * Math.sin(lonRad);
    const z = radiusVector * Math.sin(latRad);

    return {x, y, z};
}
