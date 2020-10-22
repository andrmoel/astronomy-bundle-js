const AU_UNIT_OF_LENGTH = 149597870700.0;

export function au2km(R: number): number {
    return R * (AU_UNIT_OF_LENGTH / 1000);
}

export function km2au(km: number): number {
    return km / (AU_UNIT_OF_LENGTH / 1000);
}
