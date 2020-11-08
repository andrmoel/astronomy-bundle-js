import {angle2deg, deg2angle, deg2rad, deg2time, normalizeAngle, rad2deg, time2deg} from './angleCalc';
import {round} from './math';

it('tests deg2rad', () => {
    expect(round(deg2rad(0), 4)).toBe(0);
    expect(round(deg2rad(25), 4)).toBe(0.4363);
    expect(round(deg2rad(45), 4)).toBe(0.7854);
    expect(round(deg2rad(90), 4)).toBe(1.5708);
    expect(round(deg2rad(180), 4)).toBe(3.1416);
    expect(round(deg2rad(270), 4)).toBe(4.7124);
    expect(round(deg2rad(360), 4)).toBe(6.2832);
    expect(round(deg2rad(400), 4)).toBe(6.9813);
    expect(round(deg2rad(-45), 4)).toBe(-0.7854);
    expect(round(deg2rad(-90), 4)).toBe(-1.5708);
});

it('tests rad2deg', () => {
    expect(round(rad2deg(0))).toBe(0);
    expect(round(rad2deg(0.4363))).toBe(25);
    expect(round(rad2deg(0.7854))).toBe(45);
    expect(round(rad2deg(1.5708))).toBe(90);
    expect(round(rad2deg(3.1416))).toBe(180);
    expect(round(rad2deg(4.7124))).toBe(270);
    expect(round(rad2deg(6.2832))).toBe(360);
    expect(round(rad2deg(6.9813))).toBe(400);
    expect(round(rad2deg(-0.7854))).toBe(-45);
    expect(round(rad2deg(-1.5708))).toBe(-90);
});

it('tests deg2angle', () => {
    expect(deg2angle(0.0)).toBe('0° 00\' 00"');
    expect(deg2angle(45.2625)).toBe('45° 15\' 45"');
    expect(deg2angle(270.5)).toBe('270° 30\' 00"');
    expect(deg2angle(0.2625)).toBe('0° 15\' 45"');
    expect(deg2angle(-0.2625)).toBe('-0° 15\' 45"');
    expect(deg2angle(0.00105222)).toBe('0° 00\' 03.788"');
    expect(deg2angle(-0.00105222)).toBe('-0° 00\' 03.788"');
    expect(deg2angle(0.2625, true)).toBe('15\' 45"');
    expect(deg2angle(-0.2625, true)).toBe('-15\' 45"');
    expect(deg2angle(0.00105222, true)).toBe('03.788"');
    expect(deg2angle(-0.00105222, true)).toBe('-03.788"');
    expect(deg2angle(-24.929312194388)).toBe('-24° 55\' 45.524"');
});

it('tests angle2deg', () => {
    expect(round(angle2deg('0°0\'0"'), 6)).toBe(0.0);
    expect(round(angle2deg('45°15\'45"'), 6)).toBe(45.2625);
    expect(round(angle2deg('45° 15\' 45"'), 6)).toBe(45.2625);
    expect(round(angle2deg('270°30\'0"'), 6)).toBe(270.5);
    expect(round(angle2deg('-0°0\'3.788"'), 6)).toBe(-0.001052);
});

it('tests deg2time', () => {
    expect(deg2time(0.0)).toBe('0h 00m 00s');
    expect(deg2time(45.4)).toBe('3h 01m 36s');
    expect(deg2time(360)).toBe('24h 00m 00s');
    expect(deg2time(-45.4)).toBe('-3h 01m 36s');
});

it('tests time2deg', () => {
    expect(round(time2deg('0h0m0s'), 6)).toBe(0);
    expect(round(time2deg('3h1m36s'), 6)).toBe(45.4);
    expect(round(time2deg('03h01m36s'), 6)).toBe(45.4);
    expect(round(time2deg('3h 1m 36s'), 6)).toBe(45.4);
    expect(round(time2deg('24h0m0s'), 6)).toBe(360);
    expect(round(time2deg('-3h1m36s'), 6)).toBe(-45.4);
    expect(round(time2deg('12h45m15.512s'), 6)).toBe(191.314633);
});

it('tests normalizeAngle', () => {
    expect(round(normalizeAngle(0), 2)).toBe(0);
    expect(round(normalizeAngle(12.5), 2)).toBe(12.5);
    expect(round(normalizeAngle(359), 2)).toBe(359);
    expect(round(normalizeAngle(360), 2)).toBe(0);
    expect(round(normalizeAngle(5964.3), 2)).toBe(204.3);
    expect(round(normalizeAngle(-45), 2)).toBe(315);
    expect(round(normalizeAngle(259, 180), 2)).toBe(79);
});
