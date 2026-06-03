export interface LatLon {
    lat: number;
    lon: number;
}

export interface Location extends LatLon {
    elevation: number;
}
