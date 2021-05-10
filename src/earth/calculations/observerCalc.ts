import {GeocentricPosition, Location} from '../types/LocationTypes';
import {deg2rad} from '../../utils/angleCalc';

export function getGeocentricPosition(location: Location): GeocentricPosition {
    const {lat, elevation} = location;
    const latRad = deg2rad(lat);

    const tmp = Math.atan(0.996647189335 * Math.tan(latRad));

    const rhoSin0 = (0.996647189335 * Math.sin(tmp)) + (elevation * Math.sin(latRad) / 6378137.0);
    const rhoCos0 = Math.cos(tmp) + (elevation * Math.cos(latRad) / 6378137.0);

    return {
        rhoSin0,
        rhoCos0,
    }
}
