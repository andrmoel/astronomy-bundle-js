import {round} from '../utils/math';
import Location from './Location';

it('has no elevation', () => {
    const location = new Location(52.519, 13.408);

    expect(location.getLatitude()).toBe(52.519);
    expect(location.getLongitude()).toBe(13.408);
    expect(location.getElevation()).toBe(0);
});

it('has a given elevation', () => {
    const location = new Location(52.519, 13.408, 32);

    expect(location.getLatitude()).toBe(52.519);
    expect(location.getLongitude()).toBe(13.408);
    expect(location.getElevation()).toBe(32);
});

it('tests getDistanceToInKm', () => {
    const location1 = new Location(48.836389, 2.337222);
    const location2 = new Location(38.921389, -77.065556);

    const distance = location1.getDistanceToInKm(location2);

    expect(round(distance, 2)).toBe(6181.63);
});
