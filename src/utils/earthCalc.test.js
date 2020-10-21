import {
    getEccentricity,
    getEquationOfTime,
    getGreenwichMeanSiderealTime,
    getLongitudeOfPerihelionOfOrbit,
    getMeanAnomaly,
    getMeanObliquityOfEcliptic,
    getNutationInLongitude,
    getNutationInObliquity,
    getTrueObliquityOfEcliptic,
} from './earthCalc';
import {round} from './math';
import {deg2angle, deg2time} from './angleCalc';

it('tests getMeanAnomaly', () => {
    const T = -0.127296372348;

    expect(round(getMeanAnomaly(T), 6)).toBe(94.980597);
});

it('tests getEccentricity', () => {
    const T = -0.072183436;

    expect(round(getEccentricity(T), 6)).toBe(0.016712);
});

it('tests getLongitudeOfPerihelionOfOrbit', () => {
    const T = 0.2886705;

    expect(round(getLongitudeOfPerihelionOfOrbit(T), 6)).toBe(103.433746);
});

it('tests getMeanObliquityOfEcliptic', () => {
    const T = -0.127296372458;

    expect(round(getMeanObliquityOfEcliptic(T), 6)).toBe(23.440946);
});

it('tests getTrueObliquityOfEcliptic', () => {
    const T = -0.127296372458;

    expect(round(getTrueObliquityOfEcliptic(T), 6)).toBe(23.443569);
});

it('tests getNutationInLongitude', () => {
    const T = -0.127296372458;

    const sumPhi = getNutationInLongitude(T);

    expect(deg2angle(sumPhi)).toBe('-0°0\'3.788"');
});

it('tests getNutationInObliquity', () => {
    const T = -0.127296372458;

    const sumEps = getNutationInObliquity(T);

    expect(deg2angle(sumEps)).toBe('0°0\'9.442"');
});

describe('test for getGreenwichMeanSiderealTime', () => {
    it('test 1987-04-10 00:00:00', () => {
        const T = -0.127296372348;

        const GMST = getGreenwichMeanSiderealTime(T);

        expect(deg2time(GMST)).toBe('13h10m46.366s');
    });

    it('tests 1987-04-10 19:21:00', () => {
        const T = -0.12727429842574;

        const GMST = getGreenwichMeanSiderealTime(T);

        expect(deg2time(GMST)).toBe('8h34m57.09s');
    });
});

it('tests getEquationOfTime', () => {
    const T = -0.072183436;

    expect(round(getEquationOfTime(T), 6)).toBe(3.424707);
});
