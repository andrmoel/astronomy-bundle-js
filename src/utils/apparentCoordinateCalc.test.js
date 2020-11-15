import {
    correctEffectOfAberration,
    correctEffectOfNutation,
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
