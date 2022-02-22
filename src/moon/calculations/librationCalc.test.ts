import {round} from '../../utils/math';
import {SelenographicLocation} from '../types/LocationTypes';
import {
    getOpticalSelenographicLocation,
    getPhysicalSelenographicLocation,
    getQuantities,
    getSelenographicLocation,
    getSunrise,
} from './librationCalc';

const T = -0.07722108145106092;
const coords = {
    lon: 133.162655,
    lat: -3.229126,
    radiusVector: 0,
};

it('tests getSelenographicLocation', () => {
    const {lon, lat} = getSelenographicLocation(T, coords);

    expect(round(lon, 5)).toBe(-1.23121);
    expect(round(lat, 5)).toBe(4.1998);
});

it('tests getOpticalSelenographicLocation', () => {
    const {lon, lat} = getOpticalSelenographicLocation(T, coords);

    expect(round(lon, 5)).toBe(-1.20579);
    expect(round(lat, 5)).toBe(4.19403);
});

it('tests getPhysicalSelenographicLocation', () => {
    const {lon, lat} = getPhysicalSelenographicLocation(T, coords);

    expect(round(lon, 5)).toBe(-0.02542);
    expect(round(lat, 5)).toBe(0.00577);
});

it('tests getQuantities', () => {
    const {rho, sigma, tau} = getQuantities(T);

    expect(round(rho, 5)).toBe(-0.01042);
    expect(round(sigma, 5)).toBe(-0.01574);
    expect(round(tau, 5)).toBe(0.02673);
});

it('tests getSunrise', async () => {
    const coords: SelenographicLocation = {
        lon: -20.0,
        lat: 9.7,
    };

    const TRise = await getSunrise(coords, T);

    expect(round(TRise, 8)).toBe(-0.07722636);
});
