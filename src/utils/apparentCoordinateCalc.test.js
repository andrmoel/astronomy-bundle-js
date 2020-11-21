import {
    correctEffectOfAberration,
    correctEffectOfNutation,
    correctEffectOfRefraction,
    getLightTimeCorrectedJulianDay,
} from './apparentCoordinateCalc';
import {round} from './math';

it('tests getLightTimeCorrectedJulianDay', () => {
    const jd = 2448976.5;
    const d = 0.910845;

    const jdCorrected = getLightTimeCorrectedJulianDay(jd, d);

    expect(round(jdCorrected, 8)).toBe(2448976.4947394);
});

it('tests correctEffectOfNutation', () => {
    const coords = {
        lon: 313.07686,
        lat: -18.88801,
        radiusVector: 0.910845,
    };
    const T = 0.2886705;

    const {lon, lat, radiusVector} = correctEffectOfNutation(coords, T);

    expect(round(lon, 6)).toBe(313.080988);
    expect(round(lat, 6)).toBe(-18.88801);
    expect(round(radiusVector, 6)).toBe(0.910845);
});

it('tests correctEffectOfAberration', () => {
    const coords = {
        lon: 313.07686,
        lat: -18.88801,
        radiusVector: 0.910845,
    };
    const T = 0.2886705;

    const {lon, lat, radiusVector} = correctEffectOfAberration(coords, T);

    expect(round(lon, 6)).toBe(313.075909);
    expect(round(lat, 6)).toBe(-18.889849);
    expect(round(radiusVector, 6)).toBe(0.910845);
});

it('tests correctEffectOfRefraction', () => {
    expect(round(correctEffectOfRefraction(90), 2)).toBe(90);
    expect(round(correctEffectOfRefraction(60), 2)).toBe(60.01);
    expect(round(correctEffectOfRefraction(50), 2)).toBe(50.01);
    expect(round(correctEffectOfRefraction(40), 2)).toBe(40.02);
    expect(round(correctEffectOfRefraction(30), 2)).toBe(30.03);
    expect(round(correctEffectOfRefraction(20), 2)).toBe(20.05);
    expect(round(correctEffectOfRefraction(10), 2)).toBe(10.09);
    expect(round(correctEffectOfRefraction(5), 2)).toBe(5.16);
    expect(round(correctEffectOfRefraction(3), 2)).toBe(3.23);
    expect(round(correctEffectOfRefraction(2), 2)).toBe(2.28);
    expect(round(correctEffectOfRefraction(1), 2)).toBe(1.36);
    expect(round(correctEffectOfRefraction(0), 2)).toBe(0.48);
    expect(round(correctEffectOfRefraction(-1), 2)).toBe(-0.35);
    expect(round(correctEffectOfRefraction(-2), 2)).toBe(-1.26);
    expect(round(correctEffectOfRefraction(-3), 2)).toBe(-2.48);
    expect(round(correctEffectOfRefraction(-5), 2)).toBe(-5);
    expect(round(correctEffectOfRefraction(-10), 2)).toBe(-10);
    expect(round(correctEffectOfRefraction(-20), 2)).toBe(-20);
    expect(round(correctEffectOfRefraction(-30), 2)).toBe(-30);
    expect(round(correctEffectOfRefraction(-40), 2)).toBe(-40);
    expect(round(correctEffectOfRefraction(-50), 2)).toBe(-50);
    expect(round(correctEffectOfRefraction(-60), 2)).toBe(-60);
    expect(round(correctEffectOfRefraction(-80), 2)).toBe(-80);
});
