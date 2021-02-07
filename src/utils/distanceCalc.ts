import {EquatorialSphericalCoordinates} from '../coordinates/coordinateTypes';
import {deg2rad, rad2deg} from './angleCalc';

const AU_UNIT_OF_LENGTH = 149597870700.0;

export function au2km(R: number): number {
    return R * (AU_UNIT_OF_LENGTH / 1000);
}

export function km2au(km: number): number {
    return km / (AU_UNIT_OF_LENGTH / 1000);
}

export function getAngularSeparation(
    coords1: EquatorialSphericalCoordinates,
    coords2: EquatorialSphericalCoordinates,
): number {
    const raRad1 = deg2rad(coords1.rightAscension);
    const dRad1 = deg2rad(coords1.declination);
    const raRad2 = deg2rad(coords2.rightAscension);
    const dRad2 = deg2rad(coords2.declination);

    const dRad = Math.acos(
        Math.sin(dRad1) * Math.sin(dRad2)
        + Math.cos(dRad1) * Math.cos(dRad2) * Math.cos(raRad1 - raRad2)
    );

    return rad2deg(dRad);
}
