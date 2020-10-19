import {round} from './math';

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
