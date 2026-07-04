import {EARTH_SIDEREAL_ROTATION_PER_DAY} from '@app/constants/earth';
import {DEG, RAD} from '@app/constants/math';
import {LimbAlignment} from '@app/enums/limb';
import type {EquatorialSphericalCoordinates} from '@app/types/CoordinateTypes';
import type {EventOptions} from '@app/types/EventTypes';
import type {Location} from '@app/types/LocationTypes';
import {normalizeAngle} from '@app/utils/angle';
import {
    equatorialSpherical2topocentricHorizontalByLocalHourAngle,
    equatorialSpherical2topocentricSphericalByLocalHourAngle,
} from '@app/utils/coordinateTransformation';
import {getGreenwichApparentSiderealTime} from '@app/utils/siderealTime';
import {julianDay2julianCenturiesJ2000, julianDay2time} from '@package/time/utils/dateTime';
import {getDeltaT} from '@package/time/utils/deltaT';

export type EquatorialCoordinatesProvider = (jd: number) => EquatorialSphericalCoordinates;

// Mean atmospheric refraction at the horizon (34'), Meeus chapter 15.
const REFRACTION_AT_HORIZON = 0.5667;

const CONVERGENCE_LIMIT = 0.00001;
const MAX_ITERATIONS = 100;

export function getTransit(location: Location, jd0: number, getCoords: EquatorialCoordinatesProvider): number {
    const GAST = getGreenwichSiderealTimeAtMidnight(jd0);
    const dynamicalTimeOffset = getDynamicalTimeOffset(jd0);

    const {rightAscension} = getCoords(jd0);

    // Meeus 15.2
    let m = normalizeAngle((rightAscension - location.lon - GAST) / 360, 1);
    let dm = 0;

    let cnt = 0;
    do {
        const coords = getCoords(jd0 + m + dynamicalTimeOffset);
        const H = getLocalHourAngle(coords.rightAscension, location.lon, GAST, m);

        dm = -H / 360;
        m += dm;

        if (cnt++ > MAX_ITERATIONS) {
            throw new Error(`Astronomical object has no transit on given day ${jd0}.`);
        }
    } while (Math.abs(dm) > CONVERGENCE_LIMIT);

    if (m < 0 || m >= 1) {
        throw new Error(`Astronomical object has no transit on given day ${jd0}.`);
    }

    return jd0 + m;
}

export function getRise(location: Location, jd0: number, h0: number, getCoords: EquatorialCoordinatesProvider): number {
    return getRiseSet(location, jd0, h0, getCoords, -1, 'rise');
}

export function getSet(location: Location, jd0: number, h0: number, getCoords: EquatorialCoordinatesProvider): number {
    return getRiseSet(location, jd0, h0, getCoords, 1, 'set');
}

// Standard altitude h0 of the body's center at the moment of the event, Meeus chapter 15.
export function getStandardAltitude(options: EventOptions = {}, angularDiameter = 0): number {
    const {isRefractionConsidered = true, alignment = LimbAlignment.Center} = options;

    const refraction = isRefractionConsidered ? REFRACTION_AT_HORIZON : 0;
    const semiDiameter = angularDiameter / 2;

    let h0 = -refraction;

    if (alignment === LimbAlignment.UpperLimb) {
        h0 -= semiDiameter;
    } else if (alignment === LimbAlignment.LowerLimb) {
        h0 += semiDiameter;
    }

    return h0;
}

function getRiseSet(
    location: Location,
    jd0: number,
    h0: number,
    getCoords: EquatorialCoordinatesProvider,
    sign: number,
    event: 'rise' | 'set',
): number {
    const GAST = getGreenwichSiderealTimeAtMidnight(jd0);
    const dynamicalTimeOffset = getDynamicalTimeOffset(jd0);

    const {rightAscension, declination} = getCoords(jd0);

    const mTransit = normalizeAngle((rightAscension - location.lon - GAST) / 360, 1);
    const halfDiurnalArc = getHalfDiurnalArc(declination, location.lat, h0);

    if (Number.isNaN(halfDiurnalArc)) {
        throw new Error(`Astronomical object cannot ${event} on given day ${jd0}.`);
    }

    let m = normalizeAngle(mTransit + sign * halfDiurnalArc, 1);
    let dm = 0;

    let cnt = 0;
    do {
        const coords = getCoords(jd0 + m + dynamicalTimeOffset);
        const geocentricH = getLocalHourAngle(coords.rightAscension, location.lon, GAST, m);

        // Reduce the geocentric position to the observer's location. This matters for the
        // Moon, whose horizontal parallax (~1°) shifts rise and set by several minutes.
        const {localHourAngle: H, declination} = equatorialSpherical2topocentricSphericalByLocalHourAngle(
            geocentricH,
            coords.declination,
            coords.radiusVector,
            location,
        );

        const {altitude} = equatorialSpherical2topocentricHorizontalByLocalHourAngle(H, declination, location.lat);

        // Meeus 15, correction to m
        dm = (altitude - h0) / (360 * Math.cos(declination * DEG) * Math.cos(location.lat * DEG) * Math.sin(H * DEG));
        m += dm;

        if (cnt++ > MAX_ITERATIONS) {
            throw new Error(`Astronomical object cannot ${event} on given day ${jd0}.`);
        }
    } while (Math.abs(dm) > CONVERGENCE_LIMIT);

    if (m < 0) {
        throw new Error(
            `Astronomical object cannot ${event} on given day ${jd0}. The ${event} happens the day before.`,
        );
    }

    if (m >= 1) {
        throw new Error(`Astronomical object cannot ${event} on given day ${jd0}. The ${event} happens the next day.`);
    }

    return jd0 + m;
}

function getHalfDiurnalArc(declination: number, lat: number, h0: number): number {
    const latRad = lat * DEG;
    const dRad = declination * DEG;
    const h0Rad = h0 * DEG;

    const cosH0 = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(dRad)) / (Math.cos(latRad) * Math.cos(dRad));

    if (Math.abs(cosH0) > 1) {
        return NaN;
    }

    const H0 = Math.acos(cosH0) * RAD;

    return H0 / 360;
}

function getLocalHourAngle(rightAscension: number, lon: number, GAST: number, m: number): number {
    const theta0 = GAST + EARTH_SIDEREAL_ROTATION_PER_DAY * m;

    const H = theta0 + lon - rightAscension;

    return normalizeAngle(H + 180) - 180;
}

function getGreenwichSiderealTimeAtMidnight(jd0: number): number {
    const T = julianDay2julianCenturiesJ2000(jd0);

    return getGreenwichApparentSiderealTime(T);
}

function getDynamicalTimeOffset(jd0: number): number {
    const {year, month} = julianDay2time(jd0);

    return getDeltaT(year, month) / 86400;
}
