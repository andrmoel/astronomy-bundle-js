import Location from '@package/location/models/Location';
import {getFootprint, getFootprintRadius, getTimeSteps, splitAtAntimeridian} from './groundTrack';

describe('getTimeSteps', () => {
    it('gets evenly spaced julian days including both ends', () => {
        const jds = getTimeSteps(2461312, 2461312 + 3 / 1440, 1);

        expect(jds).toHaveLength(4);
        expect(jds[1]).toBeCloseTo(2461312 + 1 / 1440, 10);
        expect(jds[3]).toBe(2461312 + 3 / 1440);
    });

    it('appends the end time if it is not on a step', () => {
        const jds = getTimeSteps(2461312, 2461312 + 2.5 / 1440, 1);

        expect(jds).toHaveLength(4);
        expect(jds[3]).toBe(2461312 + 2.5 / 1440);
    });

    it('gets a single step if start equals end', () => {
        expect(getTimeSteps(2461312, 2461312, 1)).toEqual([2461312]);
    });

    it('throws on a non-positive step', () => {
        expect(() => getTimeSteps(2461312, 2461313, 0)).toThrow();
    });

    it('throws if the end is before the start', () => {
        expect(() => getTimeSteps(2461313, 2461312, 1)).toThrow();
    });
});

describe('splitAtAntimeridian', () => {
    it('keeps a track without crossing in one segment', () => {
        const locations = [new Location(0, 10), new Location(5, 20)];

        expect(splitAtAntimeridian(locations)).toEqual([locations]);
    });

    it('splits an eastward crossing and interpolates the edge points', () => {
        const segments = splitAtAntimeridian([new Location(0, 170, 400000), new Location(10, -170, 420000)]);

        expect(segments).toHaveLength(2);
        expect(segments[0][1]).toEqual(new Location(5, 180, 410000));
        expect(segments[1][0]).toEqual(new Location(5, -180, 410000));
        expect(segments[1][1].lon).toBe(-170);
    });

    it('splits a westward crossing', () => {
        const segments = splitAtAntimeridian([new Location(0, -175), new Location(-6, 175)]);

        expect(segments[0][1].lon).toBe(-180);
        expect(segments[0][1].lat).toBeCloseTo(-3, 10);
        expect(segments[1][0].lon).toBe(180);
    });

    it('returns no segments for no locations', () => {
        expect(splitAtAntimeridian([])).toEqual([]);
    });
});

describe('getFootprint', () => {
    it('gets a circle around the sub-satellite point', () => {
        const footprint = getFootprint(new Location(0, 0, 420000), 0, 4);
        const radius = getFootprintRadius(420, 0) / 6378.137 / (Math.PI / 180);

        expect(footprint).toHaveLength(4);
        expect(footprint[0].lat).toBeCloseTo(radius, 10);
        expect(footprint[0].lon).toBeCloseTo(0, 10);
        expect(footprint[1].lat).toBeCloseTo(0, 10);
        expect(footprint[1].lon).toBeCloseTo(radius, 10);
        expect(footprint[2].lat).toBeCloseTo(-radius, 10);
        expect(footprint[3].lon).toBeCloseTo(-radius, 10);
    });

    it('normalizes longitudes near the antimeridian', () => {
        const footprint = getFootprint(new Location(0, 179, 420000), 0, 4);

        expect(footprint[1].lon).toBeLessThan(-150);
    });
});

describe('getFootprintRadius', () => {
    it('gets the ground radius for the horizon', () => {
        expect(getFootprintRadius(420, 0)).toBeCloseTo(2253.722, 3);
    });

    it('gets a smaller radius for a minimum altitude', () => {
        expect(getFootprintRadius(420, 10)).toBeCloseTo(1390.073, 3);
    });

    it('is zero for a minimum altitude of 90°', () => {
        expect(getFootprintRadius(420, 90)).toBeCloseTo(0, 10);
    });
});
