export type RectangularCoordinates = {
    x: number,
    y: number,
    z: number,
}

export type EclipticSphericalCoordinates = {
    lon: number,
    lat: number,
    radiusVector: number,
}

export type EquatorialSphericalCoordinates = {
    rightAscension: number,
    declination: number,
    radiusVector: number,
}

export type LocalHorizontalCoordinates = {
    azimuth: number,
    altitude: number,
    radiusVector: number,
}
