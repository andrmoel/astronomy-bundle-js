export function deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function rad2deg(radians: number): number {
    return radians * (180 / Math.PI);
}

export function normalizeAngle(degrees: number, baseAngle: number = 360.0): number {
    let angle = degrees % baseAngle;

    if (angle < 0) {
        angle = angle + baseAngle;
    }

    return angle;
}
