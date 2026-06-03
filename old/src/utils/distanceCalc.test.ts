import {au2km, getDistanceInKm, km2au} from './distanceCalc';
import {round} from './math';

it('tests au2km', () => {
    expect(au2km(-0.005)).toBe(-747989.3535);
    expect(au2km(0)).toBe(0);
    expect(au2km(0.005)).toBe(747989.3535);
});

it('tests km2au', () => {
    expect(km2au(-747989.3535)).toBe(-0.005);
    expect(km2au(0)).toBe(0);
    expect(km2au(747989.3535)).toBe(0.005);
});

describe('tests for getDistanceInKm', () => {
    it('has a short distance', () => {
        const location1 = {
            lat: 52.520834,
            lon: 13.409365,
            elevation: 0,
        };
        const location2 = {
            lat: 52.51964,
            lon: 13.4066,
            elevation: 0,
        };

        const distance = getDistanceInKm(location1, location2);

        expect(round(distance, 2)).toBe(0.23);
    });

    it('has a large distance', () => {
        const location1 = {
            lat: 48.836389,
            lon: 2.337222,
            elevation: 0,
        };
        const location2 = {
            lat: 38.921389,
            lon: -77.065556,
            elevation: 0,
        };

        const distance = getDistanceInKm(location1, location2);

        expect(round(distance, 2)).toBe(6181.63);
    });

    it('has a large distance passing 360° line', () => {
        const location1 = {
            lat: -37.798157,
            lon: 178.405194,
            elevation: 0,
        };
        const location2 = {
            lat: -43.953282,
            lon: -176.56143,
            elevation: 0,
        };

        const distance = getDistanceInKm(location1, location2);

        expect(round(distance, 2)).toBe(804.13);
    });
});
