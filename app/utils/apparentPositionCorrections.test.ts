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

    expect(jdCorrected).toBeCloseTo(2448976.4947394);
});

it('tests correctEffectOfNutation', () => {
    const coords = {
        lon: 313.07686,
        lat: -18.88801,
        radiusVector: 0.910845,
    };
    const T = 0.2886705;

    const {lon, lat, radiusVector} = correctEffectOfNutation(coords, T);

    expect(lon).toBeCloseTo(313.080988);
    expect(lat).toBeCloseTo(-18.88801);
    expect(radiusVector).toBeCloseTo(0.910845);
});

it('tests correctEffectOfAberration', () => {
    const coords = {
        lon: 313.07686,
        lat: -18.88801,
        radiusVector: 0.910845,
    };
    const T = 0.2886705;

    const {lon, lat, radiusVector} = correctEffectOfAberration(coords, T);

    expect(lon).toBeCloseTo(313.075909);
    expect(lat).toBeCloseTo(-18.889849);
    expect(radiusVector).toBeCloseTo(0.910845);
});

it('tests correctEffectOfRefraction', () => {
    expect(correctEffectOfRefraction(90)).toBeCloseTo(90);
    expect(correctEffectOfRefraction(60)).toBeCloseTo(60.01);
    expect(correctEffectOfRefraction(50)).toBeCloseTo(50.01);
    expect(correctEffectOfRefraction(40)).toBeCloseTo(40.02);
    expect(correctEffectOfRefraction(30)).toBeCloseTo(30.03);
    expect(correctEffectOfRefraction(20)).toBeCloseTo(20.05);
    expect(correctEffectOfRefraction(10)).toBeCloseTo(10.09);
    expect(correctEffectOfRefraction(5)).toBeCloseTo(5.16);
    expect(correctEffectOfRefraction(3)).toBeCloseTo(3.23);
    expect(correctEffectOfRefraction(2)).toBeCloseTo(2.28);
    expect(correctEffectOfRefraction(1)).toBeCloseTo(1.36);
    expect(correctEffectOfRefraction(0)).toBeCloseTo(0.48);
    expect(correctEffectOfRefraction(-1)).toBeCloseTo(-0.35);
    expect(correctEffectOfRefraction(-2)).toBeCloseTo(-1.26);
    expect(correctEffectOfRefraction(-3)).toBeCloseTo(-2.48);
    expect(correctEffectOfRefraction(-5)).toBeCloseTo(-5);
    expect(correctEffectOfRefraction(-10)).toBeCloseTo(-10);
    expect(correctEffectOfRefraction(-20)).toBeCloseTo(-20);
    expect(correctEffectOfRefraction(-30)).toBeCloseTo(-30);
    expect(correctEffectOfRefraction(-40)).toBeCloseTo(-40);
    expect(correctEffectOfRefraction(-50)).toBeCloseTo(-50);
    expect(correctEffectOfRefraction(-60)).toBeCloseTo(-60);
    expect(correctEffectOfRefraction(-80)).toBeCloseTo(-80);
});
