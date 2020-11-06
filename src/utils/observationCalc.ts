import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';

export function getPhaseAngle(
    equCoordsObj: IEquatorialSphericalCoordinates,
    equCoordsSun: IEquatorialSphericalCoordinates
): number {
    const raObjRad = deg2rad(equCoordsObj.rightAscension);
    const dObjRad = deg2rad(equCoordsObj.declination);
    const distObj = equCoordsObj.radiusVector;

    const raSunRad = deg2rad(equCoordsSun.rightAscension);
    const dSunRad = deg2rad(equCoordsSun.declination);
    const distSun = equCoordsSun.radiusVector;

    // Meeus 48.2
    const phi = Math.acos(
        Math.sin(dSunRad) * Math.sin(dObjRad) + Math.cos(dSunRad) * Math.cos(dObjRad) * Math.cos(raSunRad - raObjRad)
    );

    // Meeus 48.3
    const i = Math.atan((distSun * Math.sin(phi)) / (distObj - distSun * Math.cos(phi)));

    return normalizeAngle(rad2deg(i));
}

export function getIlluminatedFraction(phaseAngle: number): number {
    const iRad = deg2rad(phaseAngle);

    // Meeus 48.1
    return (1 + Math.cos(iRad)) / 2;
}

export function getAngularDiameter(distance: number, trueDiameter: number): number {
    const delta = 2 * Math.atan2(trueDiameter, 2 * distance);

    return rad2deg(delta);
}
