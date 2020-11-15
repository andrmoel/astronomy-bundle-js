import {au2km, getAngularDistance, km2au} from './distanceCalc';
import {round} from './math';

it('tests au2km', () => {
    expect(au2km(0.985)).toBe(147353902.6395);
});

it('tests km2au', () => {
    expect(km2au(147353902.6395)).toBe(0.985);
});

it('tests getAngularDistance', () => {
    const ra1 = 213.9154;
    const dec1 = 19.1825;
    const ra2 = 201.2983;
    const dec2 = -11.1614;

    const d = getAngularDistance(ra1, dec1, ra2, dec2);

    expect(round(d, 6)).toBe(32.793027);
});
