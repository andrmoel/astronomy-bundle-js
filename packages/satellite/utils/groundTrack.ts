import {EARTH_EQUATORIAL_RADIUS_KM} from '@app/constants/earth';
import {DEG, RAD} from '@app/constants/math';
import type {LatLon} from '@app/types/LocationTypes';
import {normalizeLongitude} from '@app/utils/location';
import Location from '@package/location/models/Location';
import {MINUTES_PER_DAY} from '../constants/sgp4';

export function getTimeSteps(startJd: number, endJd: number, stepMinutes: number): Array<number> {
    if (stepMinutes <= 0) {
        throw new Error('The step size must be positive.');
    }

    if (endJd < startJd) {
        throw new Error('The end time must not be before the start time.');
    }

    const stepDays = stepMinutes / MINUTES_PER_DAY;
    const steps = Math.floor((endJd - startJd) / stepDays + 1e-9);
    const jds = Array.from({length: steps + 1}, (_, i) => startJd + i * stepDays);

    if (endJd - jds[jds.length - 1] > 1e-9) {
        jds.push(endJd);
    }

    return jds;
}

export function splitAtAntimeridian(locations: Array<Location>): Array<Array<Location>> {
    const segments: Array<Array<Location>> = [];
    let segment: Array<Location> = [];

    locations.forEach((location, i) => {
        const previous = locations[i - 1];

        if (previous && Math.abs(location.lon - previous.lon) > 180) {
            const [end, start] = getAntimeridianCrossing(previous, location);
            segment.push(end);
            segments.push(segment);
            segment = [start];
        }

        segment.push(location);
    });

    if (segment.length > 0) {
        segments.push(segment);
    }

    return segments;
}

function getAntimeridianCrossing(from: Location, to: Location): [Location, Location] {
    const edge = from.lon > 0 ? 180 : -180;
    const unwrappedToLon = to.lon + 2 * edge;
    const fraction = (edge - from.lon) / (unwrappedToLon - from.lon);
    const lat = from.lat + fraction * (to.lat - from.lat);
    const elevation = from.elevation + fraction * (to.elevation - from.elevation);

    return [new Location(lat, edge, elevation), new Location(lat, -edge, elevation)];
}

export function getFootprint(
    subSatellitePoint: Location,
    minAltitude: number,
    numberOfPoints: number,
): Array<Location> {
    const centralAngle = getFootprintCentralAngle(subSatellitePoint.elevation / 1000, minAltitude);

    return Array.from({length: numberOfPoints}, (_, i) =>
        getDestination(subSatellitePoint, (360 * i) / numberOfPoints, centralAngle),
    );
}

export function getFootprintRadius(heightKm: number, minAltitude: number): number {
    return EARTH_EQUATORIAL_RADIUS_KM * getFootprintCentralAngle(heightKm, minAltitude) * DEG;
}

function getFootprintCentralAngle(heightKm: number, minAltitude: number): number {
    const minAltitudeRad = minAltitude * DEG;
    const ratio = (EARTH_EQUATORIAL_RADIUS_KM * Math.cos(minAltitudeRad)) / (EARTH_EQUATORIAL_RADIUS_KM + heightKm);

    return (Math.acos(ratio) - minAltitudeRad) * RAD;
}

function getDestination(origin: LatLon, bearing: number, centralAngle: number): Location {
    const latRad = origin.lat * DEG;
    const bearingRad = bearing * DEG;
    const angleRad = centralAngle * DEG;

    const destinationLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(angleRad) + Math.cos(latRad) * Math.sin(angleRad) * Math.cos(bearingRad),
    );
    const deltaLonRad = Math.atan2(
        Math.sin(bearingRad) * Math.sin(angleRad) * Math.cos(latRad),
        Math.cos(angleRad) - Math.sin(latRad) * Math.sin(destinationLatRad),
    );

    return new Location(destinationLatRad * RAD, normalizeLongitude(origin.lon + deltaLonRad * RAD));
}
