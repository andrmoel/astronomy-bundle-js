import {
    getGreenwichApparentSiderealTime,
    getGreenwichMeanSiderealTime,
    getLocalApparentSiderealTime,
    getLocalHourAngle,
    getLocalMeanSiderealTime,
} from './siderealTime';
import {deg2time} from '@app/utils/angle';
import {round} from '@app/utils/math';

it('tests getGreenwichMeanSiderealTime', () => {
    const T = -0.127296372348;

    const GMST = getGreenwichMeanSiderealTime(T);

    expect(deg2time(GMST)).toBe('13h 10m 46.366s');
});

it('tests getGreenwichApparentSiderealTime', () => {
    const T = -0.127296372348;

    const GAST = getGreenwichApparentSiderealTime(T);

    expect(deg2time(GAST)).toBe('13h 10m 46.134s');
});

it('tests getLocalMeanSiderealTime', () => {
    const T = -0.127296372348;

    const GMST = getLocalMeanSiderealTime(T, 13.53);

    expect(deg2time(GMST)).toBe('14h 04m 53.566s');
});

it('tests getLocalApparentSiderealTime', () => {
    const T = -0.127296372348;

    const GAST = getLocalApparentSiderealTime(T, 13.53);

    expect(deg2time(GAST)).toBe('14h 04m 53.334s');
});

it('tests getLocalHourAngle', () => {
    const T = -0.12727429842573834;
    const lon = -77.065415;
    const rightAscension = 347.3193375;

    const H = getLocalHourAngle(T, lon, rightAscension);

    expect(round(H, 6)).toBe(64.352135);
});
