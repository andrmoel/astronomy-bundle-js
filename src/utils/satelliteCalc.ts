import ITwoLineElement from '../satellites/interfaces/ITwoLineElement';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';
import IRectangularCoordinates from "../coordinates/interfaces/IRectangularCoordinates";

export function foo(): IRectangularCoordinates {
    const ra = 0.0;
    const aop = 0.0;
    const i = 0.0;

    return getGeocentricRectangularCoordinates(ra, aop, i);
}

export function getGeocentricRectangularCoordinates(
    rightAscension: number,
    argumentOfPerigee: number,
    inclination: number
): IRectangularCoordinates {
    const raRad = deg2rad(rightAscension);
    const aopRad = deg2rad(argumentOfPerigee);
    const iRad = deg2rad(inclination);

    return {
        x: -1 * Math.sin(raRad) * Math.cos(iRad) * Math.sin(aopRad) + Math.cos(raRad) * Math.cos(aopRad),
        y: Math.cos(raRad) * Math.cos(iRad) * Math.sin(aopRad) + Math.sin(raRad) * Math.cos(aopRad),
        z: Math.sin(iRad) * Math.sin(aopRad),
    }
}

export function getMeanAnomaly(tle: ITwoLineElement, dt: number): number {
    const M = deg2rad(tle.meanAnomaly)
        + tle.meanMotion * dt + 0.5
        + tle.firstDerivativeMeanMotion * Math.pow(dt, 2)
        + tle.secondDerivativeMeanMotion * Math.pow(dt, 3);

    // M = Meananomaly
    // + (
    //      360 * (Satellite_rev_sidereal_day * (Epoch_now - Epoch_start) + 0.5
    //     * first_derative_mean_motion * (Epoch_now - Epoch_start) * (Epoch_now - Epoch_start)));

    return normalizeAngle(rad2deg(M));
}

export function getTrueAnomaly(tle: ITwoLineElement): number {
    const e = tle.eccentricity;
    const Erad = deg2rad(tle.ecc);

    const theta = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(Erad / 2))
}

function getEccentricicAnomaly(tle: ITwoLineElement): number {
    // const E =
    // const E0 = M + 0.85 * e * Math.sgn(Math.sin(MRad));
    // M = E - e * Math.sin(ERad);

    return 0;
}

export function getSemiMajorAxis(tle: ITwoLineElement, dt: number): number {
    const phi = 3.986005e14; // m³/a²
    const n = tle.meanMotion;
    const dmm1 = tle.firstDerivativeMeanMotion;
    const dmm2 = tle.secondDerivativeMeanMotion;

    const a0 = Math.pow(phi / n, 2 / 3);

    console.log(a0);

    const a1 = n / (n + 2 * dmm1 * dt + 3 * dmm2 * Math.pow(dt, 2));
    const a = a0 * Math.pow(a1, 2 / 3);

    return a;
}

export function getRightAscension(tle: ITwoLineElement, dt: number): number {
    // const raT =
    const ra = tle.rightAscension + raT * dt;
}
