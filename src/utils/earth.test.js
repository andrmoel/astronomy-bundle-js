import {
    getEccentricity,
    getLongitudeOfPerihelionOfOrbit,
    getMeanAnomaly,
    getMeanObliquityOfEcliptic,
    getNutationInLongitude,
    getNutationInObliquity,
    getTrueObliquityOfEcliptic,
} from './earth';
import {round} from './math';
import {deg2angle} from './angle';

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
