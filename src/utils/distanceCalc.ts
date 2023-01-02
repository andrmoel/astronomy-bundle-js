import {Location} from '../earth/types/LocationTypes';
import {EARTH_FLATTENING, EARTH_RADIUS} from '../earth/constants/dimensions';
import {deg2rad} from './angleCalc';
import {cos2, sin2} from './math';

const AU_UNIT_OF_LENGTH = 149597870700.0;

export function au2km(R: number): number {
    return R * (AU_UNIT_OF_LENGTH / 1000);
}

export function km2au(km: number): number {
    return km / (AU_UNIT_OF_LENGTH / 1000);
}

export function getDistanceInKm(location1: Location, location2: Location): number {
    const {lat: lat1, lon: lon1} = location1;
    const {lat: lat2, lon: lon2} = location2;

    // Meeus 11
    const F = (lat1 + lat2) / 2;
    const G = (lat1 - lat2) / 2;
    const lambda = (lon2 - lon1) / 2;

    const FRad = deg2rad(F);
    const GRad = deg2rad(G);
    const lambdaRad = deg2rad(lambda);

    const S = sin2(GRad) * cos2(lambdaRad) + cos2(FRad) * sin2(lambdaRad);
    const C = cos2(GRad) * cos2(lambdaRad) + sin2(FRad) * sin2(lambdaRad);

    const omegaRad = Math.atan(Math.sqrt(S / C));

    const R = Math.sqrt(S * C) / omegaRad;
    const D = 2 * omegaRad * EARTH_RADIUS / 1000;
    const H1 = (3 * R - 1) / (2 * C);
    const H2 = (3 * R + 1) / (2 * S);

    return D * (1 + EARTH_FLATTENING * H1 * sin2(FRad) * cos2(GRad) - EARTH_FLATTENING * H2 * cos2(FRad) * sin2(GRad));
}
