import {EARTH_AXIS_RATIO, EARTH_EQUATORIAL_RADIUS_METERS, EARTH_ROTATION_DEG_PER_HOUR} from '@app/constants/earth';
import {DEG} from '@app/constants/math';
import type {Location} from '@app/types/LocationTypes';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {BesselianElements} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime} from './besselianElements';

export interface LocalSnapshot {
    u: number;
    v: number;
    l1: number;
    l2: number;
    distance: number;
    hourAngle: number;
    sinD: number;
    cosD: number;
}

export function getTauFromToi(elements: BesselianElements, toi: TimeOfInterest): number {
    return (toi.getJulianDay() - elements.t0Jde) * 24;
}

export function getLocalSnapshot(elements: BesselianElements, location: Location, tau: number): LocalSnapshot {
    const e = getBesselianElementsAtTime(elements, tau);
    const deltaTCorrection = (EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600;
    const hourAngle = e.mu + (location.lon - deltaTCorrection) * DEG;

    const latRad = location.lat * DEG;
    const h = location.elevation / EARTH_EQUATORIAL_RADIUS_METERS;
    const u = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));
    const rhoSinPhi = EARTH_AXIS_RATIO * Math.sin(u) + h * Math.sin(latRad);
    const rhoCosPhi = Math.cos(u) + h * Math.cos(latRad);

    const sinH = Math.sin(hourAngle);
    const cosH = Math.cos(hourAngle);

    const xi = rhoCosPhi * sinH;
    const eta = rhoSinPhi * e.cosD - rhoCosPhi * cosH * e.sinD;
    const zeta = rhoSinPhi * e.sinD + rhoCosPhi * cosH * e.cosD;

    const uVal = e.x - xi;
    const vVal = e.y - eta;

    return {
        u: uVal,
        v: vVal,
        l1: e.l1 - zeta * elements.tanF1,
        l2: e.l2 - zeta * elements.tanF2,
        distance: Math.sqrt(uVal * uVal + vVal * vVal),
        hourAngle,
        sinD: e.sinD,
        cosD: e.cosD,
    };
}

// Eclipse magnitude: fraction of solar diameter covered. Values > 1 indicate totality.
// Convention: l2 < 0 for total eclipses (umbra), l2 > 0 for annular (antumbra).
export function getMagnitude(l1: number, l2: number, distance: number): number {
    if (distance >= l1) return 0;
    return (l1 - distance) / (l1 + l2);
}

// Fraction of the solar disk area covered by the moon, in [0, 1].
export function getObscuration(l1: number, l2: number, distance: number): number {
    if (distance >= l1) return 0;

    // Apparent radii derived from the shadow cone radii.
    // rs = sun, rm = moon in fundamental-plane units.
    const rs = (l1 + l2) / 2;
    const rm = (l1 - l2) / 2;

    // Total: moon larger than sun and fully overlapping
    if (rm >= rs && distance <= rm - rs) return 1;
    // Annular: sun larger than moon and moon fully inside sun
    if (rs > rm && distance <= rs - rm) return (rm * rm) / (rs * rs);

    // Partial phase: circle–circle intersection area / sun disk area
    const cosA = (distance * distance + rs * rs - rm * rm) / (2 * distance * rs);
    const cosB = (distance * distance + rm * rm - rs * rs) / (2 * distance * rm);
    if (Math.abs(cosA) > 1 || Math.abs(cosB) > 1) return 0;

    const A = Math.acos(cosA);
    const B = Math.acos(cosB);
    const area = rs * rs * (A - Math.sin(A) * cosA) + rm * rm * (B - Math.sin(B) * cosB);
    return area / (Math.PI * rs * rs);
}

// Altitude of the sun in degrees, computed from the Besselian elements at the given tau.
export function getSunAltitudeDeg(elements: BesselianElements, location: Location, tau: number): number {
    const e = getBesselianElementsAtTime(elements, tau);
    const deltaTCorrection = (EARTH_ROTATION_DEG_PER_HOUR * elements.deltaT) / 3600;
    const hourAngle = e.mu + (location.lon - deltaTCorrection) * DEG;
    const latRad = location.lat * DEG;
    const sinAlt = Math.sin(latRad) * e.sinD + Math.cos(latRad) * e.cosD * Math.cos(hourAngle);
    return Math.asin(Math.max(-1, Math.min(1, sinAlt))) / DEG;
}
