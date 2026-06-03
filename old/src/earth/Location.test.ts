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

describe('tests location in degrees and minutes', () => {
    it('has north and east bounded coordinates', () => {
        const location = new Location(52.519, 13.408);

        expect(location.getLatitudeInDegreeMinutes()).toBe('N 52° 31.14\'');
        expect(location.getLongitudeInDegreeMinutes()).toBe('E 13° 24.48\'');
    });

    it('has south and west bounded coordinates', () => {
        const location = new Location(-22.908, -68.202);

        expect(location.getLatitudeInDegreeMinutes()).toBe('S 22° 54.48\'');
        expect(location.getLongitudeInDegreeMinutes()).toBe('W 68° 12.12\'');
    });
});

describe('tests location in degrees, minutes and seconds', () => {
    it('has north and east bounded coordinates', () => {
        const location = new Location(52.519, 13.408);

        expect(location.getLatitudeInDegreeMinutesSeconds()).toBe('N 52° 31\' 08.4"');
        expect(location.getLongitudeInDegreeMinutesSeconds()).toBe('E 13° 24\' 28.8"');
    });

    it('has south and west bounded coordinates', () => {
        const location = new Location(-22.908, -68.202);

        expect(location.getLatitudeInDegreeMinutesSeconds()).toBe('S 22° 54\' 28.8"');
        expect(location.getLongitudeInDegreeMinutesSeconds()).toBe('W 68° 12\' 07.2"');
    });
});

it('tests getDistanceToInKm', () => {
    const location1 = new Location(48.836389, 2.337222);
    const location2 = new Location(38.921389, -77.065556);

    const distance = location1.getDistanceToInKm(location2);

    expect(round(distance, 2)).toBe(6181.63);
});
