import {EARTH_EQUATORIAL_RADIUS_KM, ECCENTRICITY_SQUARED} from '@app/constants/earth';
import {DEG, RAD} from '@app/constants/math';
import type {
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location as LocationType} from '@app/types/LocationTypes';
import {normalizeAngle} from '@app/utils/angle';
import {
    equatorialSpherical2topocentricHorizontalByLocalHourAngle,
    getRhoCosLat,
    getRhoSinLat,
} from '@app/utils/coordinateTransformation';
import {normalizeLongitude} from '@app/utils/location';
import {
    getGreenwichApparentSiderealTime,
    getGreenwichMeanSiderealTime,
    getLocalMeanSiderealTime,
} from '@app/utils/siderealTime';
import Location from '@package/location/models/Location';

const GEODETIC_ITERATIONS = 10;

export function teme2equatorialSpherical(position: RectangularCoordinates, T: number): EquatorialSphericalCoordinates {
    const {x, y, z} = position;
    const radiusVector = Math.sqrt(x * x + y * y + z * z);
    const equationOfEquinoxes = getGreenwichApparentSiderealTime(T) - getGreenwichMeanSiderealTime(T);

    return {
        rightAscension: normalizeAngle(Math.atan2(y, x) * RAD + equationOfEquinoxes),
        declination: Math.asin(z / radiusVector) * RAD,
        radiusVector,
    };
}

export function teme2geographicLocation(position: RectangularCoordinates, T: number): Location {
    const gmstRad = getGreenwichMeanSiderealTime(T) * DEG;
    const x = position.x * Math.cos(gmstRad) + position.y * Math.sin(gmstRad);
    const y = -position.x * Math.sin(gmstRad) + position.y * Math.cos(gmstRad);
    const {z} = position;
    const p = Math.sqrt(x * x + y * y);

    let latRad = Math.atan2(z, p * (1 - ECCENTRICITY_SQUARED));

    for (let i = 0; i < GEODETIC_ITERATIONS; i++) {
        const N = getPrimeVerticalRadius(latRad);
        const h =
            p * Math.cos(latRad) + z * Math.sin(latRad) - (EARTH_EQUATORIAL_RADIUS_KM * EARTH_EQUATORIAL_RADIUS_KM) / N;
        latRad = Math.atan2(z, p * (1 - (ECCENTRICITY_SQUARED * N) / (N + h)));
    }

    const N = getPrimeVerticalRadius(latRad);
    const heightKm =
        p * Math.cos(latRad) + z * Math.sin(latRad) - (EARTH_EQUATORIAL_RADIUS_KM * EARTH_EQUATORIAL_RADIUS_KM) / N;

    return new Location(latRad * RAD, normalizeLongitude(Math.atan2(y, x) * RAD), heightKm * 1000);
}

function getPrimeVerticalRadius(latRad: number): number {
    const sinLat = Math.sin(latRad);

    return EARTH_EQUATORIAL_RADIUS_KM / Math.sqrt(1 - ECCENTRICITY_SQUARED * sinLat * sinLat);
}

export function teme2topocentricHorizontal(
    position: RectangularCoordinates,
    location: LocationType,
    T: number,
): LocalHorizontalCoordinates {
    const lmst = getLocalMeanSiderealTime(T, location.lon);
    const lmstRad = lmst * DEG;
    const rhoCosLat = getRhoCosLat(location.lat, location.elevation) * EARTH_EQUATORIAL_RADIUS_KM;
    const rhoSinLat = getRhoSinLat(location.lat, location.elevation) * EARTH_EQUATORIAL_RADIUS_KM;

    const x = position.x - rhoCosLat * Math.cos(lmstRad);
    const y = position.y - rhoCosLat * Math.sin(lmstRad);
    const z = position.z - rhoSinLat;
    const distance = Math.sqrt(x * x + y * y + z * z);

    const localHourAngle = normalizeAngle(lmst - Math.atan2(y, x) * RAD);
    const declination = Math.asin(z / distance) * RAD;

    return equatorialSpherical2topocentricHorizontalByLocalHourAngle(
        localHourAngle,
        declination,
        location.lat,
        distance,
    );
}
