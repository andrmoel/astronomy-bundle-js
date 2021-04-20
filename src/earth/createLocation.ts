import Location from './Location';

export default function(lat: number, lon: number, elevation = 0): Location {
    return new Location(lat, lon, elevation);
}
