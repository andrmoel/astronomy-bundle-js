import {EARTH_AXIS_RATIO, EARTH_EQUATORIAL_RADIUS_METERS, EARTH_ROTATION_DEG_PER_HOUR} from '@app/constants/earth';
import {DEG, RAD} from '@app/constants/math';
import type {LocalHorizontalCoordinates} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import {normalizeAngle} from '@app/utils/angle';
import {correctEffectOfRefraction} from '@app/utils/apparentPositionCorrections';
import {LocalSolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {LocalEclipseCircumstances} from '@package/solarEclipse/types/EclipseCircumstances';
import type {EclipseContacts} from '@package/solarEclipse/types/EclipseContactTypes';
import Sun from '@package/sun/models/Sun';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {BesselianElements} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime, tau2julianDay} from './besselianElements';

export function getLocalEclipseCircumstances(
    elements: BesselianElements,
    location: Location,
    tau: number,
): LocalEclipseCircumstances {
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

export function isEclipseVisible(
    elements: BesselianElements,
    location: Location,
    contactTaus: EclipseContacts,
): boolean {
    const taus = [contactTaus.c1, contactTaus.max, contactTaus.c4];

    return taus.some((tau) => {
        if (tau === null) {
            return false;
        }

        const circumstances = getLocalEclipseCircumstances(elements, location, tau);
        const {altitude} = getLocalHorizontalCoordinates(circumstances, location);
        const sunUpperLimbAltitude = getUpperSunLimbAltitude(elements, location, tau, altitude);

        return sunUpperLimbAltitude > 0;
    });
}

export function getLocalEclipseType(circumstances: LocalEclipseCircumstances): LocalSolarEclipseType {
    const {l2, distance} = circumstances;
    const magnitude = getMagnitude(circumstances);

    if (magnitude <= 0.0) {
        return LocalSolarEclipseType.None;
    }

    if (distance < l2 || distance < -1 * l2) {
        if (l2 < 0.0) {
            return LocalSolarEclipseType.Total;
        }

        return LocalSolarEclipseType.Annular;
    }

    return LocalSolarEclipseType.Partial;
}

export function getMaximumEclipse(circumstances: LocalEclipseCircumstances): number {
    return circumstances.distance;
}

export function getMagnitude(circumstances: LocalEclipseCircumstances): number {
    const {l1, l2, distance} = circumstances;

    return (l1 - distance) / (l1 + l2);
}

export function getMoonSunRatio(circumstances: LocalEclipseCircumstances): number {
    const {l1, l2} = circumstances;

    return (l1 - l2) / (l1 + l2);
}

export function getObscuration(circumstances: LocalEclipseCircumstances): number {
    const {l1, l2, distance} = circumstances;

    const eclipseType = getLocalEclipseType(circumstances);
    const magnitude = getMagnitude(circumstances);
    const moonSunRatio = getMoonSunRatio(circumstances);

    if (magnitude <= 0.0) {
        return 0.0;
    }

    if (magnitude >= 1.0) {
        return 1.0;
    }

    if (eclipseType === LocalSolarEclipseType.Annular) {
        return moonSunRatio ** 2;
    }

    const cNumerator = l1 ** 2 + l2 ** 2 - 2 * distance ** 2;
    const cDenominator = l1 ** 2 - l2 ** 2;
    const c = Math.acos(cNumerator / cDenominator);

    const bNumerator = (l1 * l2 + distance ** 2) / distance;
    const bDenominator = l1 + l2;
    const b = Math.acos(bNumerator / bDenominator);

    const a = Math.PI - b - c;

    const result = moonSunRatio ** 2 * a + b - moonSunRatio * Math.sin(c);

    return result / Math.PI;
}

export function getLocalHorizontalCoordinates(
    circumstances: LocalEclipseCircumstances,
    location: Location,
): LocalHorizontalCoordinates {
    const {hourAngle, sinD, cosD} = circumstances;
    const lat = location.lat * DEG;
    const sinAltitude = Math.sin(lat) * sinD + Math.cos(lat) * cosD * Math.cos(hourAngle);
    const altitude = Math.asin(Math.max(-1, Math.min(1, sinAltitude))) * RAD;
    const azimuth = Math.atan2(
        Math.sin(hourAngle),
        Math.cos(hourAngle) * Math.sin(lat) - (sinD / cosD) * Math.cos(lat),
    );

    return {
        azimuth: normalizeAngle(azimuth * RAD + 180),
        altitude,
        radiusVector: 0,
    };
}

function getUpperSunLimbAltitude(
    elements: BesselianElements,
    location: Location,
    tau: number,
    altitude: number,
): number {
    const toi = TimeOfInterest.fromJulianDay(tau2julianDay(elements, tau));
    const sun = Sun.create(toi);
    const solarDiameter = sun.getTopocentricAngularDiameter(location);

    return correctEffectOfRefraction(altitude) + solarDiameter / 2;
}
