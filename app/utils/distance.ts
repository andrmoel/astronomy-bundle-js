import {cos2, sin2} from './math';
import {EARTH_FLATTENING, EARTH_EQUATORIAL_RADIUS_METERS} from '../constants/earth';
import {LatLon} from '../types/LocationTypes';
import {ASTRONOMICAL_UNIT_IN_METERS} from '../constants/units';
import {DEG} from '@app/constants/math';

export function au2km(R: number): number {
    return R * (ASTRONOMICAL_UNIT_IN_METERS / 1000);
}

export function km2au(km: number): number {
    return km / (ASTRONOMICAL_UNIT_IN_METERS / 1000);
}

export function getDistanceInKm(location1: LatLon, location2: LatLon): number {
    const {lat: lat1, lon: lon1} = location1;
    const {lat: lat2, lon: lon2} = location2;

    // Meeus 11
    const F = (lat1 + lat2) / 2;
    const G = (lat1 - lat2) / 2;
    const lambda = (lon2 - lon1) / 2;

    const FRad = F * DEG;
    const GRad = G * DEG;
    const lambdaRad = lambda * DEG;

    const S = sin2(GRad) * cos2(lambdaRad) + cos2(FRad) * sin2(lambdaRad);
    const C = cos2(GRad) * cos2(lambdaRad) + sin2(FRad) * sin2(lambdaRad);

    const omegaRad = Math.atan(Math.sqrt(S / C));

    const R = Math.sqrt(S * C) / omegaRad;
    const D = 2 * omegaRad * EARTH_EQUATORIAL_RADIUS_METERS / 1000;
    const H1 = (3 * R - 1) / (2 * C);
    const H2 = (3 * R + 1) / (2 * S);

    return D * (1 + EARTH_FLATTENING * H1 * sin2(FRad) * cos2(GRad) - EARTH_FLATTENING * H2 * cos2(FRad) * sin2(GRad));
}
