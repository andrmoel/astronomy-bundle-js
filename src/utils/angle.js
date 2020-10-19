export function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
}

export function rad2deg(radians) {
    return radians * (180 / Math.PI);
}

export function normalizeAngle(degrees, baseAngle = 360.0) {
    let angle = degrees % baseAngle;

    if (angle < 0) {
        angle = angle + baseAngle;
    }

    return angle;
}
