import {deg2rad, normalizeAngle, rad2deg} from '../../utils/angleCalc';
import {INCLINATION_OF_MEAN_LUNAR_EQUATOR} from '../constants/calculations';
import * as sunCalc from '../../sun/calculations/sunCalc';
import {Quantities, SelenographicCoordinates, WandA} from '../types/CalculationTypes';
import {EclipticSphericalCoordinates} from '../../coordinates/types/CoordinateTypes';
import {getArgumentOfLatitude, getMeanAnomaly, getMeanElongation, getMeanLongitudeOfAscendingNode} from './moonCalc';

export function getLibration(T: number, coords: EclipticSphericalCoordinates): SelenographicCoordinates {
    const {lon: lonOpt, lat: latOpt} = getOpticalLibration(T, coords);
    const {lon: lonPhy, lat: latPhy} = getPhysicalLibration(T, coords);

    return {
        lon: lonOpt + lonPhy,
        lat: latOpt + latPhy,
    };
}

export function getPhysicalLibration(T: number, coords: EclipticSphericalCoordinates): SelenographicCoordinates {
    const {lat: latOpt} = getOpticalLibration(T, coords);
    const {A} = getWandA(T, coords);
    const {rho, sigma, tau} = getQuantities(T);

    const latOptRad = deg2rad(latOpt);
    const ARad = deg2rad(A);

    // Meeus 53.2
    const lon = -1 * tau + (rho * Math.cos(ARad) + sigma * Math.sin(ARad)) * Math.tan(latOptRad);
    const lat = sigma * Math.cos(ARad) - rho * Math.sin(ARad);

    return {lon, lat};
}

export function getOpticalLibration(T: number, coords: EclipticSphericalCoordinates): SelenographicCoordinates {
    const F = getArgumentOfLatitude(T);
    const {W, A} = getWandA(T, coords);

    const latMoonRad = deg2rad(coords.lat);
    const WRad = deg2rad(W);
    const IRad = deg2rad(INCLINATION_OF_MEAN_LUNAR_EQUATOR);

    const lon = A - F;
    const latRad = Math.asin(
        -1 * Math.sin(WRad) * Math.cos(latMoonRad) * Math.sin(IRad) - Math.sin(latMoonRad) * Math.cos(IRad),
    );
    const lat = rad2deg(latRad);

    return {lon, lat};
}

export function getQuantities(T: number): Quantities {
    const F = getArgumentOfLatitude(T);
    const D = getMeanElongation(T);
    const MSun = sunCalc.getMeanAnomaly(T);
    const MMoon = getMeanAnomaly(T);
    const O = getMeanLongitudeOfAscendingNode(T);

    const FRad = deg2rad(F);
    const DRad = deg2rad(D);
    const MSunRad = deg2rad(MSun);
    const MMoonRad = deg2rad(MMoon);
    const ORad = deg2rad(O);

    const K1 = 119.75 + 131.849 * T;
    const K2 = 72.56 + 20.186 * T;

    const K1Rad = deg2rad(K1);
    const K2Rad = deg2rad(K2);

    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);

    const rho = -0.02752 * Math.cos(MMoonRad)
        - 0.02245 * Math.sin(FRad)
        + 0.00684 * Math.cos(MMoonRad - 2 * FRad)
        - 0.00293 * Math.cos(2 * FRad)
        - 0.00085 * Math.cos(2 * FRad - 2 * DRad)
        - 0.00054 * Math.cos(MMoonRad - 2 * DRad)
        - 0.00020 * Math.sin(MMoonRad + FRad)
        - 0.00020 * Math.cos(MMoonRad + 2 * FRad)
        - 0.00020 * Math.cos(MMoonRad - FRad)
        + 0.00014 * Math.cos(MMoonRad + 2 * FRad - 2 * DRad);

    const sigma = 0
        - 0.02816 * Math.sin(MMoonRad)
        + 0.02244 * Math.cos(FRad)
        - 0.00682 * Math.sin(MMoonRad - 2 * FRad)
        - 0.00279 * Math.sin(2 * FRad)
        - 0.00083 * Math.sin(2 * FRad - 2 * DRad)
        + 0.00069 * Math.sin(MMoonRad - 2 * DRad)
        + 0.00040 * Math.cos(MMoonRad + FRad)
        - 0.00025 * Math.sin(2 * MMoonRad)
        - 0.00023 * Math.sin(MMoonRad + 2 * FRad)
        + 0.00020 * Math.cos(MMoonRad - FRad)
        + 0.00019 * Math.sin(MMoonRad - FRad)
        + 0.00013 * Math.sin(MMoonRad + 2 * FRad - 2 * DRad)
        - 0.00010 * Math.cos(MMoonRad - 3 * FRad);

    const tau = 0.02520 * E * Math.sin(MSunRad)
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

function getWandA(T: number, coords: EclipticSphericalCoordinates): WandA {
    const omega = getMeanLongitudeOfAscendingNode(T);

    const latMoonRad = deg2rad(coords.lat);
    const IRad = deg2rad(INCLINATION_OF_MEAN_LUNAR_EQUATOR);

    // Meeus 53.1
    const W = normalizeAngle(coords.lon - omega);
    const WRad = deg2rad(W);

    const numerator = Math.sin(WRad) * Math.cos(latMoonRad) * Math.cos(IRad) - Math.sin(latMoonRad) * Math.sin(IRad);
    const denominator = Math.cos(WRad) * Math.cos(latMoonRad);

    const ARad = Math.atan2(numerator, denominator);
    const A = normalizeAngle(rad2deg(ARad));

    return {W, A};
}
