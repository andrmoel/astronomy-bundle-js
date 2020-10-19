import {deg2rad, normalizeAngle, rad2deg} from './angle';
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

it('tests normalizeAngle', () => {
    expect(round(normalizeAngle(0), 2)).toBe(0);
    expect(round(normalizeAngle(12.5), 2)).toBe(12.5);
    expect(round(normalizeAngle(359), 2)).toBe(359);
    expect(round(normalizeAngle(360), 2)).toBe(0);
    expect(round(normalizeAngle(5964.3), 2)).toBe(204.3);
    expect(round(normalizeAngle(-45), 2)).toBe(315);
    expect(round(normalizeAngle(259, 180), 2)).toBe(79);
});
