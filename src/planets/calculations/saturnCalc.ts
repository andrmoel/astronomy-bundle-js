export function getRingInclination(T: number): number {
    return 28.075216
        - 0.012998 * T
        + 0.000004 * Math.pow(T, 2);
}

export function getLongitudeOfAscendingNode(T: number): number {
    return 169.508470
        + 1.394681 * T
        + 0.000412 * Math.pow(T, 2)
}
