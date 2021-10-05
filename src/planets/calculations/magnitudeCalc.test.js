import {round} from '../../utils/math';
import {
    getApparentMagnitudeJupiter,
    getApparentMagnitudeMars,
    getApparentMagnitudeMercury,
    getApparentMagnitudeNeptune,
    getApparentMagnitudeUranus,
    getApparentMagnitudeVenus,
} from './magnitudeCalc';

it('tests getApparentMagnitudeMercury', () => {
    const magnitude = getApparentMagnitudeMercury(0.466259, 1.413151, 18.82);

    expect(round(magnitude, 2)).toBe(-0.72);
});

describe('tests getApparentMagnitudeVenus', () => {
    it('has phase angle below 163.7°', () => {
        const magnitude = getApparentMagnitudeVenus(0.724604, 0.910947, 72.96);

        expect(round(magnitude, 2)).toBe(-4.24);
    });

    it('has phase angle greater than 163.7°', () => {
        const magnitude = getApparentMagnitudeVenus(0.720923, 0.28252, 168.38);

        expect(round(magnitude, 2)).toBe(-4.2);
    });
});

it('tests getApparentMagnitudeMars', () => {
    const magnitude = getApparentMagnitudeMars(1.39095, 1.8469, 31.54);

    expect(round(magnitude, 2)).toBe(1.03);
});

it('tests getApparentMagnitudeJupiter', () => {
    const magnitude = getApparentMagnitudeJupiter(4.96531, 4.61337, 11.01);

    expect(round(magnitude, 2)).toBe(-2.52);
});

it('tests getApparentMagnitudeSaturn', () => {
    // TODO
});

it('tests getApparentMagnitudeUranus', () => {
    const magnitude = getApparentMagnitudeUranus(19.924, 20.72221, 1.62);

    expect(round(magnitude, 2)).toBe(5.89);
});

describe('tests getApparentMagnitudeNeptune', () => {
    it('has a year before 1980', () => {
        const magnitude = getApparentMagnitudeNeptune(30.12055, 31.02105, 1670);

        expect(round(magnitude, 2)).toBe(7.95);
    });

    it('has a year between 1980 and 2000', () => {
        const magnitude = getApparentMagnitudeNeptune(30.12055, 31.02105, 1999);

        expect(round(magnitude, 2)).toBe(7.86);
    });

    it('has a year above 2000', () => {
        const magnitude = getApparentMagnitudeNeptune(30.12055, 31.02105, 2020);

        expect(round(magnitude, 2)).toBe(7.85);
    });
});
