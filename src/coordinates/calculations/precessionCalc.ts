import {EPOCH_J2000} from '../../constants/epoch';
import {getEpochInterval, getEpochIntervalToJ2000} from '../../time/calculations/timeCalc';
import {deg2rad, normalizeAngle, rad2deg, sec2deg} from '../../utils/angleCalc';
import {EclipticSphericalCoordinates, EquatorialSphericalCoordinates} from '../types/CoordinateTypes';

export function correctPrecessionForEclipticCoordinates(
    coords: EclipticSphericalCoordinates,
    jd: number,
    startingEpoch: number = EPOCH_J2000,
): EclipticSphericalCoordinates {
    const lonRad = deg2rad(coords.lon);
    const latRad = deg2rad(coords.lat);

    const T = getEpochIntervalToJ2000(startingEpoch);
    const t = getEpochInterval(jd, startingEpoch);

    const eta = (sec2deg(47.0029) - sec2deg(0.06603) * T + sec2deg(0.00006) * Math.pow(T, 2)) * t
        + (sec2deg(-0.03302) + sec2deg(0.000598) * T) * Math.pow(t, 2)
        + sec2deg(0.00006) * Math.pow(t, 3);

    const Pi = 174.876384 + sec2deg(3289.4789) * T + sec2deg(0.60622) * Math.pow(T, 2)
        - (sec2deg(869.8089) + sec2deg(0.50498) * T) * t
        + sec2deg(0.03536) * Math.pow(t, 2);

    const p = (sec2deg(5029.0966) + sec2deg(2.22226) * T - sec2deg(0.000042) * Math.pow(T, 2)) * t
        + (sec2deg(1.11113) - sec2deg(0.000042) * T) * Math.pow(t, 2)
        + sec2deg(0.000006) * Math.pow(t, 3);

    const etaRad = deg2rad(eta);
    const PiRad = deg2rad(Pi);

    // Meeus 21.7
    const A = Math.cos(etaRad) * Math.cos(latRad) * Math.sin(PiRad - lonRad) - Math.sin(etaRad) * Math.sin(latRad);
    const B = Math.cos(latRad) * Math.cos(PiRad - lonRad);
    const C = Math.cos(etaRad) * Math.sin(latRad) + Math.sin(etaRad) * Math.cos(latRad) * Math.sin(PiRad - lonRad);

    const lon = p + Pi - rad2deg(Math.atan2(A, B));
    const lat = rad2deg(Math.asin(C));

    return {
        lon: normalizeAngle(lon),
        lat: lat,
        radiusVector: coords.radiusVector,
    };
}

export function correctPrecessionForEquatorialCoordinates(
    coords: EquatorialSphericalCoordinates,
    jd: number,
    startingEpoch: number = EPOCH_J2000,
): EquatorialSphericalCoordinates {
    const raRad = deg2rad(coords.rightAscension);
    const dRad = deg2rad(coords.declination);

    const T = getEpochIntervalToJ2000(startingEpoch);
    const t = getEpochInterval(jd, startingEpoch);

    const xi = (sec2deg(2306.2181) + sec2deg(1.39656) * T - sec2deg(0.000139) * Math.pow(T, 2)) * t
        + (sec2deg(0.30188) - sec2deg(0.000344) * T) * Math.pow(t, 2)
        + sec2deg(0.017988) * Math.pow(t, 3);

    const zeta = (sec2deg(2306.2181) + sec2deg(1.39656) * T - sec2deg(0.000139) * Math.pow(T, 2)) * t
        + (sec2deg(1.09468) + sec2deg(0.000066) * T) * Math.pow(t, 2)
        + sec2deg(0.018203) * Math.pow(t, 3);

    const theta = (sec2deg(2004.3109) - sec2deg(0.8533) * T - sec2deg(0.000217) * Math.pow(T, 2)) * t
        - (sec2deg(0.42665) + sec2deg(0.000217) * T) * Math.pow(t, 2)
        - sec2deg(0.041833) * Math.pow(t, 3);

    const xiRad = deg2rad(xi);
    const thetaRad = deg2rad(theta);

    // Meeus 21.4
    const A = Math.cos(dRad) * Math.sin(raRad + xiRad);
    const B = Math.cos(thetaRad) * Math.cos(dRad) * Math.cos(raRad + xiRad) - Math.sin(thetaRad) * Math.sin(dRad);
    const C = Math.sin(thetaRad) * Math.cos(dRad) * Math.cos(raRad + xiRad) + Math.cos(thetaRad) * Math.sin(dRad);

    const rightAscension = rad2deg(Math.atan2(A, B)) + zeta;
    const declination = rad2deg(Math.asin(C));

    return {
        rightAscension: normalizeAngle(rightAscension),
        declination: declination,
        radiusVector: coords.radiusVector,
    };
}
