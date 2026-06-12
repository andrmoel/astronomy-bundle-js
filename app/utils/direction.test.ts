import {Direction} from '@app/enums/direction';
import {azimuth2direction} from './direction';

it('tests azimuth2direction', () => {
    expect(azimuth2direction(0)).toBe(Direction.North);
    expect(azimuth2direction(11.24)).toBe(Direction.North);
    expect(azimuth2direction(11.25)).toBe(Direction.NorthNorthEast);
    expect(azimuth2direction(45)).toBe(Direction.NorthEast);
    expect(azimuth2direction(180)).toBe(Direction.South);
    expect(azimuth2direction(348.75)).toBe(Direction.North);
    expect(azimuth2direction(361)).toBe(Direction.North);
    expect(azimuth2direction(-1)).toBe(Direction.North);
});
