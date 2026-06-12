import {Direction} from '../enums/direction';

export function azimuth2direction(azimuth: number): Direction {
    const normalized = ((azimuth % 360) + 360) % 360;
    const sectors: Direction[] = [
        Direction.North,
        Direction.NorthNorthEast,
        Direction.NorthEast,
        Direction.EastNorthEast,
        Direction.East,
        Direction.EastSouthEast,
        Direction.SouthEast,
        Direction.SouthSouthEast,
        Direction.South,
        Direction.SouthSouthWest,
        Direction.SouthWest,
        Direction.WestSouthWest,
        Direction.West,
        Direction.WestNorthWest,
        Direction.NorthWest,
        Direction.NorthNorthWest,
    ];
    const index = Math.floor((normalized + 11.25) / 22.5) % sectors.length;

    return sectors[index];
}
