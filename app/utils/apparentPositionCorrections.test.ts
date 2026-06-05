import {
    correctEffectOfAberration,
    correctEffectOfNutation,
    correctEffectOfRefraction,
    getLightTimeCorrectedJulianDay,
} from './apparentPositionCorrections';

it('tests getLightTimeCorrectedJulianDay', () => {
    const jd = 2448976.5;
    const d = 0.910845;

    const jdCorrected = getLightTimeCorrectedJulianDay(jd, d);

    expect(jdCorrected).toBeCloseTo(2448976.4947394, 8);
});

it('tests correctEffectOfNutation', () => {
    const coords = {
        lon: 313.07686,
        lat: -18.88801,
        radiusVector: 0.910845,
    };
    const T = 0.2886705;

    const {lon, lat, radiusVector} = correctEffectOfNutation(coords, T);

    expect(lon).toBeCloseTo(313.080988, 6);
    expect(lat).toBeCloseTo(-18.88801, 6);
    expect(radiusVector).toBeCloseTo(0.910845, 6);
});

it('tests correctEffectOfAberration', () => {
    const coords = {
        lon: 313.07686,
        lat: -18.88801,
        radiusVector: 0.910845,
    };
    const T = 0.2886705;

    const {lon, lat, radiusVector} = correctEffectOfAberration(coords, T);

    expect(lon).toBeCloseTo(313.075909, 6);
    expect(lat).toBeCloseTo(-18.889849, 6);
    expect(radiusVector).toBeCloseTo(0.910845, 6);
});

it('tests correctEffectOfRefraction', () => {
    expect(correctEffectOfRefraction(90)).toBeCloseTo(90, 2);
    expect(correctEffectOfRefraction(60)).toBeCloseTo(60.01, 2);
    expect(correctEffectOfRefraction(50)).toBeCloseTo(50.01, 2);
    expect(correctEffectOfRefraction(40)).toBeCloseTo(40.02, 2);
    expect(correctEffectOfRefraction(30)).toBeCloseTo(30.03, 2);
    expect(correctEffectOfRefraction(20)).toBeCloseTo(20.05, 2);
    expect(correctEffectOfRefraction(10)).toBeCloseTo(10.09, 2);
    expect(correctEffectOfRefraction(5)).toBeCloseTo(5.16, 2);
    expect(correctEffectOfRefraction(3)).toBeCloseTo(3.23, 2);
    expect(correctEffectOfRefraction(2)).toBeCloseTo(2.28, 2);
    expect(correctEffectOfRefraction(1)).toBeCloseTo(1.36, 2);
    expect(correctEffectOfRefraction(0)).toBeCloseTo(0.48, 2);
    expect(correctEffectOfRefraction(-1)).toBeCloseTo(-0.35, 2);
    expect(correctEffectOfRefraction(-2)).toBeCloseTo(-1.26, 2);
    expect(correctEffectOfRefraction(-3)).toBeCloseTo(-2.48, 2);
    expect(correctEffectOfRefraction(-5)).toBeCloseTo(-5, 2);
    expect(correctEffectOfRefraction(-10)).toBeCloseTo(-10, 2);
    expect(correctEffectOfRefraction(-20)).toBeCloseTo(-20, 2);
    expect(correctEffectOfRefraction(-30)).toBeCloseTo(-30, 2);
    expect(correctEffectOfRefraction(-40)).toBeCloseTo(-40, 2);
    expect(correctEffectOfRefraction(-50)).toBeCloseTo(-50, 2);
    expect(correctEffectOfRefraction(-60)).toBeCloseTo(-60, 2);
    expect(correctEffectOfRefraction(-80)).toBeCloseTo(-80, 2);
});
