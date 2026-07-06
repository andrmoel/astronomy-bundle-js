import {readFileSync} from 'node:fs';
import {join} from 'node:path';

import {parseLdemLabel} from './ldemLabel';

const label = readFileSync(join(__dirname, '../resources/ldem_16.lbl'), 'utf8');

it('derives the ldem_16 grid geometry that the loader previously hardcoded', () => {
    const geometry = parseLdemLabel(label);

    expect(geometry.rows).toBe(2880);
    expect(geometry.cols).toBe(5760);
    expect(geometry.degPerPixel).toBe(1 / 16);
    expect(geometry.latFirst).toBeCloseTo(90 - 1 / 32, 12);
    expect(geometry.lonFirst).toBeCloseTo(1 / 32, 12);
    expect(geometry.scalingFactorM).toBe(0.5);
    expect(geometry.referenceRadiusM).toBe(1737400);
});

it('rejects a label whose samples are not 16-bit LSB integers', () => {
    const patched = label.replace(/SAMPLE_BITS\s*=\s*16/, 'SAMPLE_BITS = 32');
    expect(() => parseLdemLabel(patched)).toThrow(/16-bit LSB/);
});

it('throws on a missing keyword', () => {
    const patched = label.replace(/MAP_RESOLUTION.*/, '');
    expect(() => parseLdemLabel(patched)).toThrow(/MAP_RESOLUTION/);
});
