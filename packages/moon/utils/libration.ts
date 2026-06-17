import {DEG, RAD} from '@app/constants/math';
import {INCLINATION_OF_MEAN_LUNAR_EQUATOR} from '@app/constants/moon';
import type {EclipticSphericalCoordinates, EquatorialSphericalCoordinates} from '@app/types/CoordinateTypes';
import {normalizeAngle} from '@app/utils/angle';
import {equatorialSpherical2eclipticSpherical} from '@app/utils/coordinateTransformation';
import {normalizeLongitude} from '@app/utils/location';
import * as moon from '@app/utils/moon';
import * as sun from '@app/utils/sun';
import type {SelenographicPoint} from '../types/LibrationTypes';

type Quantities = {
    rho: number;
    sigma: number;
    tau: number;
};

type WandA = {
    W: number;
    A: number;
};

export function getSelenographicLocation(coords: EclipticSphericalCoordinates, T: number): SelenographicPoint {
    const {lon: lonOpt, lat: latOpt} = getOpticalSelenographicLocation(coords, T);
    const {lon: lonPhy, lat: latPhy} = getPhysicalSelenographicLocation(coords, T);

    return {
        lon: normalizeLongitude(lonOpt + lonPhy),
        lat: latOpt + latPhy,
    };
}

export function getOpticalSelenographicLocation(coords: EclipticSphericalCoordinates, T: number): SelenographicPoint {
    const F = moon.getArgumentOfLatitude(T);
    const {W, A} = getWA(coords, T);

    const latMoonRad = coords.lat * DEG;
    const WRad = W * DEG;
    const IRad = INCLINATION_OF_MEAN_LUNAR_EQUATOR * DEG;

    const lon = A - F;
    const latRad = Math.asin(
        -1 * Math.sin(WRad) * Math.cos(latMoonRad) * Math.sin(IRad) - Math.sin(latMoonRad) * Math.cos(IRad),
    );
    const lat = latRad * RAD;

    return {
        lon: normalizeLongitude(lon),
        lat: lat,
    };
}

export function getPhysicalSelenographicLocation(coords: EclipticSphericalCoordinates, T: number): SelenographicPoint {
    const {lat: latOpt} = getOpticalSelenographicLocation(coords, T);
    const {A} = getWA(coords, T);
    const {rho, sigma, tau} = getQuantities(T);

    const latOptRad = latOpt * DEG;
    const ARad = A * DEG;

    // Meeus 53.2
    const lon = -1 * tau + (rho * Math.cos(ARad) + sigma * Math.sin(ARad)) * Math.tan(latOptRad);
    const lat = sigma * Math.cos(ARad) - rho * Math.sin(ARad);

    return {
        lon: normalizeLongitude(lon),
        lat: lat,
    };
}

export function getTopocentricSelenographicLocation(
    coords: EquatorialSphericalCoordinates,
    T: number,
): SelenographicPoint {
    const eclipticCoords = equatorialSpherical2eclipticSpherical(coords, T);
    const {lon: lonOpt, lat: latOpt} = getOpticalSelenographicLocation(eclipticCoords, T);
    const {lon: lonPhy, lat: latPhy} = getPhysicalSelenographicLocation(eclipticCoords, T);

    return {
        lon: normalizeLongitude(lonOpt + lonPhy),
        lat: latOpt + latPhy,
    };
}

export function getSelenographicMagnitude(lon: number, lat: number): number {
    return Math.hypot(lon, lat);
}

function getQuantities(T: number): Quantities {
    const F = moon.getArgumentOfLatitude(T);
    const D = moon.getMeanElongation(T);
    const MSun = sun.getMeanAnomaly(T);
    const MMoon = moon.getMeanAnomaly(T);
    const O = moon.getMeanLongitudeOfAscendingNode(T);

    const FRad = F * DEG;
    const DRad = D * DEG;
    const MSunRad = MSun * DEG;
    const MMoonRad = MMoon * DEG;
    const ORad = O * DEG;

    const K1 = 119.75 + 131.849 * T;
    const K2 = 72.56 + 20.186 * T;

    const K1Rad = K1 * DEG;
    const K2Rad = K2 * DEG;

    const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;

    const rho =
        -0.02752 * Math.cos(MMoonRad)
        - 0.02245 * Math.sin(FRad)
        + 0.00684 * Math.cos(MMoonRad - 2 * FRad)
        - 0.00293 * Math.cos(2 * FRad)
        - 0.00085 * Math.cos(2 * FRad - 2 * DRad)
        - 0.00054 * Math.cos(MMoonRad - 2 * DRad)
        - 0.0002 * Math.sin(MMoonRad + FRad)
        - 0.0002 * Math.cos(MMoonRad + 2 * FRad)
        - 0.0002 * Math.cos(MMoonRad - FRad)
        + 0.00014 * Math.cos(MMoonRad + 2 * FRad - 2 * DRad);

    const sigma =
        0
        - 0.02816 * Math.sin(MMoonRad)
        + 0.02244 * Math.cos(FRad)
        - 0.00682 * Math.sin(MMoonRad - 2 * FRad)
        - 0.00279 * Math.sin(2 * FRad)
        - 0.00083 * Math.sin(2 * FRad - 2 * DRad)
        + 0.00069 * Math.sin(MMoonRad - 2 * DRad)
        + 0.0004 * Math.cos(MMoonRad + FRad)
        - 0.00025 * Math.sin(2 * MMoonRad)
        - 0.00023 * Math.sin(MMoonRad + 2 * FRad)
        + 0.0002 * Math.cos(MMoonRad - FRad)
        + 0.00019 * Math.sin(MMoonRad - FRad)
        + 0.00013 * Math.sin(MMoonRad + 2 * FRad - 2 * DRad)
        - 0.0001 * Math.cos(MMoonRad - 3 * FRad);

    const tau =
        0.0252 * E * Math.sin(MSunRad)
        + 0.00473 * Math.sin(2 * MMoonRad - 2 * FRad)
        - 0.00467 * Math.sin(MMoonRad)
        + 0.00396 * Math.sin(K1Rad)
        + 0.00276 * Math.sin(2 * MMoonRad - 2 * DRad)
        + 0.00196 * Math.sin(ORad)
        - 0.00183 * Math.cos(MMoonRad - FRad)
        + 0.00115 * Math.sin(MMoonRad - 2 * DRad)
        - 0.00096 * Math.sin(MMoonRad - DRad)
        + 0.00046 * Math.sin(2 * FRad - 2 * DRad)
        - 0.00039 * Math.sin(MMoonRad - FRad)
        - 0.00032 * Math.sin(MMoonRad - MSunRad - DRad)
        + 0.00027 * Math.sin(2 * MMoonRad - MSunRad - 2 * DRad)
        + 0.00023 * Math.sin(K2Rad)
        - 0.00014 * Math.sin(2 * DRad)
        + 0.00014 * Math.cos(2 * MMoonRad - 2 * FRad)
        - 0.00012 * Math.sin(MMoonRad - 2 * FRad)
        - 0.00012 * Math.sin(2 * MMoonRad)
        + 0.00011 * Math.sin(2 * MMoonRad - 2 * MSunRad - 2 * DRad);

    return {rho, sigma, tau};
}

function getWA(coords: EclipticSphericalCoordinates, T: number): WandA {
    const omega = moon.getMeanLongitudeOfAscendingNode(T);

    const latMoonRad = coords.lat * DEG;
    const IRad = INCLINATION_OF_MEAN_LUNAR_EQUATOR * DEG;

    // Meeus 53.1
    const W = normalizeAngle(coords.lon - omega);
    const WRad = W * DEG;

    const numerator = Math.sin(WRad) * Math.cos(latMoonRad) * Math.cos(IRad) - Math.sin(latMoonRad) * Math.sin(IRad);
    const denominator = Math.cos(WRad) * Math.cos(latMoonRad);

    const ARad = Math.atan2(numerator, denominator);
    const A = normalizeAngle(ARad * RAD);

    return {W, A};
}
