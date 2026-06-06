import {DEG, RAD} from '@app/constants/math';
import type {EquatorialSphericalCoordinates} from '@app/types/CoordinateTypes';
import {normalizeAngle} from '@app/utils/angle';

export function getElongation(
    equCoordsObj: EquatorialSphericalCoordinates,
    equCoordsSun: EquatorialSphericalCoordinates,
): number {
    const raObjRad = equCoordsObj.rightAscension * DEG;
    const dObjRad = equCoordsObj.declination * DEG;

    const raSunRad = equCoordsSun.rightAscension * DEG;
    const dSunRad = equCoordsSun.declination * DEG;

    // Meeus 48.2
    const phiRad = Math.acos(
        Math.sin(dSunRad) * Math.sin(dObjRad) + Math.cos(dSunRad) * Math.cos(dObjRad) * Math.cos(raSunRad - raObjRad),
    );

    return phiRad * RAD;
}

export function getPhaseAngle(
    equCoordsObj: EquatorialSphericalCoordinates,
    equCoordsSun: EquatorialSphericalCoordinates,
): number {
    const distObj = equCoordsObj.radiusVector;
    const distSun = equCoordsSun.radiusVector;

    const phi = getElongation(equCoordsObj, equCoordsSun);
    const phiRad = phi * DEG;

    // Meeus 48.3
    const i = Math.atan2(distSun * Math.sin(phiRad), distObj - distSun * Math.cos(phiRad));

    return i * RAD;
}

export function getIlluminatedFraction(phaseAngle: number): number {
    const iRad = phaseAngle * DEG;

    // Meeus 48.1
    return (1 + Math.cos(iRad)) / 2;
}

export function getPositionAngleOfBrightLimb(
    equCoordsObj: EquatorialSphericalCoordinates,
    equCoordsSun: EquatorialSphericalCoordinates,
): number {
    const raObjRad = equCoordsObj.rightAscension * DEG;
    const dObjRad = equCoordsObj.declination * DEG;
    const raSunRad = equCoordsSun.rightAscension * DEG;
    const dSunRad = equCoordsSun.declination * DEG;

    const numerator = Math.cos(dSunRad) * Math.sin(raSunRad - raObjRad);
    const denominator =
        Math.sin(dSunRad) * Math.cos(dObjRad) - Math.cos(dSunRad) * Math.sin(dObjRad) * Math.cos(raSunRad - raObjRad);

    const chiRad = Math.atan2(numerator, denominator);

    return normalizeAngle(chiRad * RAD);
}

export function isWaxing(chi: number): boolean {
    return chi >= 180;
}

export function getAngularDiameter(distance: number, trueDiameter: number): number {
    const delta = 2 * Math.atan2(trueDiameter, 2 * distance);

    return delta * RAD;
}

export function getAngularSeparation(
    coords1: EquatorialSphericalCoordinates,
    coords2: EquatorialSphericalCoordinates,
): number {
    const raRad1 = coords1.rightAscension * DEG;
    const dRad1 = coords1.declination * DEG;
    const raRad2 = coords2.rightAscension * DEG;
    const dRad2 = coords2.declination * DEG;

    const dRad = Math.acos(
        Math.sin(dRad1) * Math.sin(dRad2) + Math.cos(dRad1) * Math.cos(dRad2) * Math.cos(raRad1 - raRad2),
    );

    return dRad * RAD;
}
