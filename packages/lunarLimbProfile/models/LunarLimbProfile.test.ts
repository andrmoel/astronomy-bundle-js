import {readFileSync} from 'node:fs';
import {join} from 'node:path';

import LunarLimbProfile from './LunarLimbProfile';

const imgData = readFileSync(join(__dirname, '../resources/ldem_16.img'));
const label = readFileSync(join(__dirname, '../resources/ldem_16.lbl'), 'utf8');

it('reads the reference radius from the label', () => {
    const profile = LunarLimbProfile.create(imgData, label);

    expect(profile.getReferenceRadiusKm()).toBeCloseTo(1737.4, 6);
});

it('returns finite limb heights of lunar-relief magnitude across position angles', () => {
    const profile = LunarLimbProfile.create(imgData, label);
    const libration = {longitude: 2.0, latitude: -0.1};

    for (let positionAngleDeg = 0; positionAngleDeg < 360; positionAngleDeg += 5) {
        const height = profile.getLimbHeightKm(positionAngleDeg, libration, 340, 380000);
        expect(Number.isFinite(height)).toBe(true);
        expect(Math.abs(height)).toBeLessThan(10);
    }
});

it('throws when the image does not match the label geometry', () => {
    // Feed the (much smaller) label bytes as the raster so it fails the size check.
    const profile = LunarLimbProfile.create(readFileSync(join(__dirname, '../resources/ldem_16.lbl')), label);

    expect(() => profile.getLimbHeightKm(0, {longitude: 0, latitude: 0}, 0, 380000)).toThrow(/size mismatch/);
});
