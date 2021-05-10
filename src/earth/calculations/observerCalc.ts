import {GeocentricPosition, Location} from '../types/LocationTypes';
import {deg2rad} from '../../utils/angleCalc';
import {EARTH_AXIS_RATIO, EARTH_RADIUS} from '../constants/dimensions';

export function getGeocentricPosition(location: Location): GeocentricPosition {
    const {lat, elevation} = location;
    const latRad = deg2rad(lat);

    const tmp = Math.atan(EARTH_AXIS_RATIO * Math.tan(latRad));

    const rhoSin0 = (EARTH_AXIS_RATIO * Math.sin(tmp)) + (elevation * Math.sin(latRad) / 6378137.0);
    const rhoCos0 = Math.cos(tmp) + (elevation * Math.cos(latRad) / EARTH_RADIUS);

    return {
        rhoSin0,
        rhoCos0,
    }
}
