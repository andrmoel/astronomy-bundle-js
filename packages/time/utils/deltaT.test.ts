import {getDeltaT} from './deltaT';

it('tests getDeltaT', () => {
    expect(getDeltaT(2200)).toBeCloseTo(1627.3, 1);
    expect(getDeltaT(2100)).toBeCloseTo(196.5, 1);
    expect(getDeltaT(2050)).toBeCloseTo(76.5, 1);
    expect(getDeltaT(2034)).toBeCloseTo(70.7, 1);
    expect(getDeltaT(2033)).toBeCloseTo(71, 1);
    expect(getDeltaT(2027)).toBeCloseTo(69.1, 1);
    expect(getDeltaT(2026)).toBeCloseTo(69.1, 1);
    expect(getDeltaT(2020)).toBeCloseTo(69.4, 1);
    expect(getDeltaT(2018)).toBeCloseTo(69, 1);
    expect(getDeltaT(2005)).toBeCloseTo(64.7, 1);
    expect(getDeltaT(1996)).toBeCloseTo(61.6, 1);
    expect(getDeltaT(1990)).toBeCloseTo(56.8, 1);
    expect(getDeltaT(1986)).toBeCloseTo(54.8, 1);
    expect(getDeltaT(1980)).toBeCloseTo(50.5, 1);
    expect(getDeltaT(1970)).toBeCloseTo(40.1, 1);
    expect(getDeltaT(1960)).toBeCloseTo(33.1, 1);
    expect(getDeltaT(1950)).toBeCloseTo(29.1, 1);
    expect(getDeltaT(1940)).toBeCloseTo(24.3, 1);
    expect(getDeltaT(1930)).toBeCloseTo(24, 1);
    expect(getDeltaT(1920)).toBeCloseTo(21.4, 1);
    expect(getDeltaT(1910)).toBeCloseTo(10.3, 1);
    expect(getDeltaT(1900)).toBeCloseTo(-2.7, 1);
    expect(getDeltaT(1890)).toBeCloseTo(-5.9, 1);
    expect(getDeltaT(1880)).toBeCloseTo(-5.3, 1);
    expect(getDeltaT(1870)).toBeCloseTo(1.1, 1);
    expect(getDeltaT(1860)).toBeCloseTo(7.4, 1);
    expect(getDeltaT(1850)).toBeCloseTo(6.6, 1);
    expect(getDeltaT(1840)).toBeCloseTo(6.2, 1);
    expect(getDeltaT(1830)).toBeCloseTo(8, 1);
    expect(getDeltaT(1820)).toBeCloseTo(11.1, 1);
    expect(getDeltaT(1810)).toBeCloseTo(11.2, 1);
    expect(getDeltaT(1800)).toBeCloseTo(12.6, 1);
    expect(getDeltaT(1750)).toBeCloseTo(13.7, 1);
    expect(getDeltaT(1700)).toBeCloseTo(20.9, 1);
    expect(getDeltaT(1650)).toBeCloseTo(50.3, 1);
    expect(getDeltaT(1630)).toBeCloseTo(80.6, 1);
    expect(getDeltaT(1620)).toBeCloseTo(95.4, 1);
    expect(getDeltaT(1600)).toBeCloseTo(120, 1);
    expect(getDeltaT(1400)).toBeCloseTo(321.8, 1);
    expect(getDeltaT(1200)).toBeCloseTo(736.6, 1);
    expect(getDeltaT(1000)).toBeCloseTo(1574.4, 1);
    expect(getDeltaT(800)).toBeCloseTo(2956, 1);
    expect(getDeltaT(600)).toBeCloseTo(4739.6, 1);
    expect(getDeltaT(400)).toBeCloseTo(6699.6, 1);
    expect(getDeltaT(200)).toBeCloseTo(8641.1, 1);
    expect(getDeltaT(0)).toBeCloseTo(10584, 1);
    expect(getDeltaT(-200)).toBeCloseTo(12792.7, 1);
    expect(getDeltaT(-400)).toBeCloseTo(15531.6, 1);
    expect(getDeltaT(-600)).toBeCloseTo(18721.1, 1);
    expect(getDeltaT(-800)).toBeCloseTo(21946.8, 1);
    expect(getDeltaT(-1000)).toBeCloseTo(25428.4, 1);
});

it('uses the USNO reference tables within their span', () => {
    // historic_deltat.data lower bound
    expect(getDeltaT(1657)).toBeCloseTo(44, 1);
    // historic_deltat.data
    expect(getDeltaT(1750)).toBeCloseTo(13.7, 1);
    // deltat.data (observed)
    expect(getDeltaT(2000)).toBeCloseTo(63.8, 1);
    // deltat.preds (predicted)
    expect(getDeltaT(2030)).toBeCloseTo(70, 1);
});

it('resolves ΔT per month within the observed era', () => {
    // deltat.data resolves ΔT monthly, so mid-2020 peaks above both January bounds -
    // a bump that year-to-year interpolation would flatten out.
    expect(getDeltaT(2020, 1)).toBeCloseTo(69.37, 2);
    expect(getDeltaT(2020, 7)).toBeCloseTo(69.41, 2);
    expect(getDeltaT(2020, 7)).toBeGreaterThan(getDeltaT(2020, 1));
    expect(getDeltaT(2020, 7)).toBeGreaterThan(getDeltaT(2021, 1));
});

it('falls back to the formulas outside the reference span', () => {
    // Before historic_deltat.data begins (year < 1657)
    expect(getDeltaT(1650)).toBeCloseTo(50.3, 1);
    // After deltat.preds ends (year > 2033)
    expect(getDeltaT(2050)).toBeCloseTo(76.5, 1);
});
