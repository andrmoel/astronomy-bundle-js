import {cos2, pad, round, sin2} from './math';

it('tests round', () => {
    expect(round(0)).toBe(0);
    expect(round(1)).toBe(1);
    expect(round(1.123)).toBe(1);
    expect(round(1.156)).toBe(1);
    expect(round(1.199)).toBe(1);
    expect(round(-1)).toBe(-1);
    expect(round(-1.123)).toBe(-1);
    expect(round(-1.156)).toBe(-1);
    expect(round(-1.199)).toBe(-1);
    expect(round(1.123, 2)).toBe(1.12);
    expect(round(1.156, 2)).toBe(1.16);
    expect(round(1.199, 2)).toBe(1.2);
    expect(round(-1, 2)).toBe(-1);
    expect(round(-1.123, 2)).toBe(-1.12);
    expect(round(-1.156, 2)).toBe(-1.16);
    expect(round(-1.199, 2)).toBe(-1.2);
});

it('tests pad', () => {
    expect(pad(1, 1)).toBe('1');
    expect(pad(1, 2)).toBe('01');
    expect(pad(12, 4)).toBe('0012');
});

it('tests sin2', () => {
    expect(round(sin2(154.34), 8)).toBe(0.15305532);
});

it('tests cos2', () => {
    expect(round(cos2(154.34), 8)).toBe(0.84694468);
});
