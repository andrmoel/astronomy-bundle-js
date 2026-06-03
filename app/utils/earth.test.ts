import {
    getEccentricity,
    getLongitudeOfPerihelionOfOrbit,
    getMeanAnomaly,
    getMeanObliquityOfEcliptic,
    getNutationInLongitude,
    getNutationInObliquity,
    getTrueObliquityOfEcliptic,
} from './earth';
import {deg2angle} from '@app/utils/angle';

it('tests getMeanAnomaly', () => {
    const T = -0.127296372348;

    expect(getMeanAnomaly(T)).toBeCloseTo(94.980597);
});

it('tests getEccentricity', () => {
    const T = -0.072183436;

    expect(getEccentricity(T)).toBeCloseTo(0.016712);
});

it('tests getLongitudeOfPerihelionOfOrbit', () => {
    const T = 0.2886705;

    expect(getLongitudeOfPerihelionOfOrbit(T)).toBeCloseTo(103.433746);
});

it('tests getMeanObliquityOfEcliptic', () => {
    const T = -0.127296372458;

    expect(getMeanObliquityOfEcliptic(T)).toBeCloseTo(23.440946);
});

it('tests getTrueObliquityOfEcliptic', () => {
    const T = -0.127296372458;

    expect(getTrueObliquityOfEcliptic(T)).toBeCloseTo(23.443569);
});

it('tests getNutationInLongitude', () => {
    const T = -0.127296372458;

    const sumPhi = getNutationInLongitude(T);

    expect(deg2angle(sumPhi)).toBe('-0° 00\' 03.788"');
});

it('tests getNutationInObliquity', () => {
    const T = -0.127296372458;

    const sumEps = getNutationInObliquity(T);

    expect(deg2angle(sumEps)).toBe('0° 00\' 09.442"');
});
