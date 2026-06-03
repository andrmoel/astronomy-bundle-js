export interface RectangularCoordinates {
    x: number;
    y: number;
    z: number;
}

export interface EclipticSphericalCoordinates {
    lon: number;
    lat: number;
    radiusVector: number;
}

export interface EquatorialSphericalCoordinates {
    rightAscension: number;
    declination: number;
    radiusVector: number;
}

export interface LocalHorizontalCoordinates {
    azimuth: number;
    altitude: number;
    radiusVector: number;
}
