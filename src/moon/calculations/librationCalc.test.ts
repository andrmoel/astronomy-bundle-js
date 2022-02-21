import {round} from '../../utils/math';
import {getLibration, getOpticalLibration, getPhysicalLibration, getQuantities} from './librationCalc';

const T = -0.07722108145106092;
const coords = {
    lon: 133.162655,
    lat: -3.229126,
    radiusVector: 0,
};

it('tests getLibration', () => {
    const {lon, lat} = getLibration(T, coords);

    expect(round(lon, 5)).toBe(-1.23121);
    expect(round(lat, 5)).toBe(4.1998);
});

it('tests getPhysicalLibration', () => {
    const {lon, lat} = getPhysicalLibration(T, coords);

    expect(round(lon, 5)).toBe(-0.02542);
    expect(round(lat, 5)).toBe(0.00577);
});

it('tests getOpticalLibration', () => {
    const {lon, lat} = getOpticalLibration(T, coords);

    expect(round(lon, 5)).toBe(-1.20579);
    expect(round(lat, 5)).toBe(4.19403);
});

it('tests getQuantities', () => {
    const {rho, sigma, tau} = getQuantities(T);

    expect(round(rho, 5)).toBe(-0.01042);
    expect(round(sigma, 5)).toBe(-0.01574);
    expect(round(tau, 5)).toBe(0.02673);
});
