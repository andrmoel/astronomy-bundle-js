export interface LunarLibration {
    longitude: number;
    latitude: number;
}

export interface LunarLimbProfile {
    // Height of the visible limb silhouette (maximum apparent terrain radius along the line of sight, in
    // perspective from the given observer distance) above the apparent radius of the LDEM reference
    // sphere, at the given celestial position angle.
    getLimbHeightKm(
        positionAngleDeg: number,
        libration: LunarLibration,
        axisPositionAngleDeg: number,
        observerDistanceKm: number,
    ): number;
}
