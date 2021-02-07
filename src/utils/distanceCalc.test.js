import {au2km, km2au} from './distanceCalc';

it('tests au2km', () =>{
    expect(au2km(-0.005)).toBe(-747989.3535);
    expect(au2km(0)).toBe(0);
    expect(au2km(0.005)).toBe(747989.3535);
});

it('tests km2au', () =>{
    expect(km2au(-747989.3535)).toBe(-0.005);
    expect(km2au(0)).toBe(0);
    expect(km2au(747989.3535)).toBe(0.005);
});
