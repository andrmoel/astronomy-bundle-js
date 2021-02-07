import {EquatorialSphericalCoordinates} from '../coordinates/coordinateTypes';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';

export function getElongation(
    equCoordsObj: EquatorialSphericalCoordinates,
    equCoordsSun: EquatorialSphericalCoordinates
): number {
    const raObjRad = deg2rad(equCoordsObj.rightAscension);
    const dObjRad = deg2rad(equCoordsObj.declination);

    const raSunRad = deg2rad(equCoordsSun.rightAscension);
    const dSunRad = deg2rad(equCoordsSun.declination);

    // Meeus 48.2
    const phiRad = Math.acos(
        Math.sin(dSunRad) * Math.sin(dObjRad) + Math.cos(dSunRad) * Math.cos(dObjRad) * Math.cos(raSunRad - raObjRad)
    );

    return rad2deg(phiRad);
}

export function getPhaseAngle(
    equCoordsObj: EquatorialSphericalCoordinates,
    equCoordsSun: EquatorialSphericalCoordinates
): number {
    const distObj = equCoordsObj.radiusVector;
    const distSun = equCoordsSun.radiusVector;

    const phi = getElongation(equCoordsObj, equCoordsSun);
    const phiRad = deg2rad(phi);

    // Meeus 48.3
    const i = Math.atan2(distSun * Math.sin(phiRad), distObj - distSun * Math.cos(phiRad));

    return rad2deg(i);
}

export function getIlluminatedFraction(phaseAngle: number): number {
    const iRad = deg2rad(phaseAngle);

    // Meeus 48.1
    return (1 + Math.cos(iRad)) / 2;
}

export function getPositionAngleOfBrightLimb(
    equCoordsObj: EquatorialSphericalCoordinates,
    equCoordsSun: EquatorialSphericalCoordinates
): number {
    const raObjRad = deg2rad(equCoordsObj.rightAscension);
    const dObjRad = deg2rad(equCoordsObj.declination);
    const raSunRad = deg2rad(equCoordsSun.rightAscension);
    const dSunRad = deg2rad(equCoordsSun.declination);

    const numerator = Math.cos(dSunRad) * Math.sin(raSunRad - raObjRad);
    const denominator = Math.sin(dSunRad) * Math.cos(dObjRad)
        - Math.cos(dSunRad) * Math.sin(dObjRad) * Math.cos(raSunRad - raObjRad);

    const chiRad = Math.atan2(numerator, denominator);

    return normalizeAngle(rad2deg(chiRad));
}

export function isWaxing(chi: number): boolean {
    return chi >= 180;
}

export function getAngularDiameter(distance: number, trueDiameter: number): number {
    const delta = 2 * Math.atan2(trueDiameter, 2 * distance);

    return rad2deg(delta);
}
