import {EARTH_AXIS_RATIO, EARTH_EQUATORIAL_RADIUS_KM} from '@app/constants/earth';
import {DEG, RAD} from '@app/constants/math';
import type {RectangularCoordinates} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import {normalizeAngle} from '@app/utils/angle';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2topocentricHorizontalByLocalHourAngle,
} from '@app/utils/coordinateTransformation';
import {au2km} from '@app/utils/distance';
import {
    getGreenwichApparentSiderealTime,
    getGreenwichMeanSiderealTime,
    getLocalMeanSiderealTime,
} from '@app/utils/siderealTime';
import {getApparentLongitude, getRadiusVector} from '@app/utils/sun';

export function isSunlit(position: RectangularCoordinates, T: number): boolean {
    const satellite = scaleToSphericalEarth(position);
    const sun = scaleToSphericalEarth(getSunTemePosition(T));
    const toSun = {x: sun.x - satellite.x, y: sun.y - satellite.y, z: sun.z - satellite.z};
    const distance = getLength(satellite);

    const earthAngularRadius = Math.asin(EARTH_EQUATORIAL_RADIUS_KM / distance);
    const cosSunEarthAngle =
        -(satellite.x * toSun.x + satellite.y * toSun.y + satellite.z * toSun.z) / (distance * getLength(toSun));

    return Math.acos(cosSunEarthAngle) > earthAngularRadius;
}

export function getSunAltitude(location: Location, T: number): number {
    const {x, y, z} = getSunTemePosition(T);
    const rightAscension = Math.atan2(y, x) * RAD;
    const declination = Math.asin(z / getLength({x, y, z})) * RAD;
    const localHourAngle = normalizeAngle(getLocalMeanSiderealTime(T, location.lon) - rightAscension);

    return equatorialSpherical2topocentricHorizontalByLocalHourAngle(localHourAngle, declination, location.lat)
        .altitude;
}

export function getSunTemePosition(T: number): RectangularCoordinates {
    const distance = au2km(getRadiusVector(T));
    const {rightAscension, declination} = eclipticSpherical2equatorialSpherical(
        {lon: getApparentLongitude(T), lat: 0, radiusVector: distance},
        T,
    );
    const equationOfEquinoxes = getGreenwichApparentSiderealTime(T) - getGreenwichMeanSiderealTime(T);
    const raRad = (rightAscension - equationOfEquinoxes) * DEG;
    const decRad = declination * DEG;

    return {
        x: distance * Math.cos(decRad) * Math.cos(raRad),
        y: distance * Math.cos(decRad) * Math.sin(raRad),
        z: distance * Math.sin(decRad),
    };
}

function scaleToSphericalEarth(position: RectangularCoordinates): RectangularCoordinates {
    return {x: position.x, y: position.y, z: position.z / EARTH_AXIS_RATIO};
}

function getLength({x, y, z}: RectangularCoordinates): number {
    return Math.sqrt(x * x + y * y + z * z);
}
