import {pad, round, tabularInterpolation5} from './math';

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

it('tests tabularInterpolation5', () => {
    const values = [
        -177.050,
        -92.068,
        -16.527,
        49.044,
        104.161,
    ];

    const n = tabularInterpolation5(values);

    expect(round(n, 6)).toBe(0.237973);
});
