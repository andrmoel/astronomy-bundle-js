import {getOpticalSelenographicLocation, getPhysicalSelenographicLocation, getSelenographicLocation} from './libration';

const T = -0.07722108145106092;
const coords = {
    lon: 133.162655,
    lat: -3.229126,
    radiusVector: 0,
};

it('tests getSelenographicLocation', () => {
    const {lon, lat} = getSelenographicLocation(coords, T);

    expect(lon).toBeCloseTo(-1.23121, 5);
    expect(lat).toBeCloseTo(4.1998, 5);
});

it('tests getOpticalSelenographicLocation', () => {
    const {lon, lat} = getOpticalSelenographicLocation(coords, T);

    expect(lon).toBeCloseTo(-1.20579, 5);
    expect(lat).toBeCloseTo(4.19403, 5);
});

it('tests getPhysicalSelenographicLocation', () => {
    const {lon, lat} = getPhysicalSelenographicLocation(coords, T);

    expect(lon).toBeCloseTo(-0.02542, 5);
    expect(lat).toBeCloseTo(0.00577, 5);
});
