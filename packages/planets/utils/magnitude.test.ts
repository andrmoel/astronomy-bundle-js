import {
    getApparentMagnitudeJupiter,
    getApparentMagnitudeMars,
    getApparentMagnitudeMercury,
    getApparentMagnitudeNeptune,
    getApparentMagnitudeSaturn,
    getApparentMagnitudeUranus,
    getApparentMagnitudeVenus,
} from './magnitude';

it('tests getApparentMagnitudeMercury', () => {
    const magnitude = getApparentMagnitudeMercury(0.466259, 1.413151, 18.82);

    expect(magnitude).toBeCloseTo(-0.72, 2);
});

describe('tests getApparentMagnitudeVenus', () => {
    it('has phase angle below 163.7°', () => {
        const magnitude = getApparentMagnitudeVenus(0.724604, 0.910947, 72.96);

        expect(magnitude).toBeCloseTo(-4.24, 2);
    });

    it('has phase angle greater than 163.7°', () => {
        const magnitude = getApparentMagnitudeVenus(0.720923, 0.28252, 168.38);

        expect(magnitude).toBeCloseTo(-4.2, 2);
    });
});

it('tests getApparentMagnitudeMars', () => {
    const magnitude = getApparentMagnitudeMars(1.39095, 1.8469, 31.54);

    expect(magnitude).toBeCloseTo(1.03, 1);
});

it('tests getApparentMagnitudeJupiter', () => {
    const magnitude = getApparentMagnitudeJupiter(4.96531, 4.61337, 11.01);

    expect(magnitude).toBeCloseTo(-2.52, 1);
});

describe('tests getApparentMagnitudeSaturn', () => {
    it('has rings edge-on', () => {
        const magnitude = getApparentMagnitudeSaturn(9.0, 8.0, 0.0, 0.0);

        expect(magnitude).toBeCloseTo(0.41, 2);
    });

    it('has rings moderately tilted', () => {
        const magnitude = getApparentMagnitudeSaturn(9.0, 8.0, 5.0, 20.0);

        expect(magnitude).toBeCloseTo(-0.12, 2);
    });

    it('has rings widely open', () => {
        const magnitude = getApparentMagnitudeSaturn(9.0, 8.0, 5.0, 27.0);

        expect(magnitude).toBeCloseTo(-0.3, 2);
    });

    // B = 16.442° is the Saturnicentric latitude of Earth from Meeus Ch. 45 (1992 December 16)
    it('uses Meeus Ch. 45 ring inclination example', () => {
        const magnitude = getApparentMagnitudeSaturn(9.0, 8.0, 4.1, 16.442);

        expect(magnitude).toBeCloseTo(-0.05, 2);
    });

    it('has negative ring inclination', () => {
        const magnitudePos = getApparentMagnitudeSaturn(9.0, 8.0, 5.0, 20.0);
        const magnitudeNeg = getApparentMagnitudeSaturn(9.0, 8.0, 5.0, -20.0);

        expect(magnitudeNeg).toBeCloseTo(magnitudePos, 10);
    });
});

it('tests getApparentMagnitudeUranus', () => {
    const magnitude = getApparentMagnitudeUranus(19.924, 20.72221, 1.62);

    expect(magnitude).toBeCloseTo(5.89, 2);
});

describe('tests getApparentMagnitudeNeptune', () => {
    it('has a year before 1980', () => {
        const magnitude = getApparentMagnitudeNeptune(30.12055, 31.02105, 1670);

        expect(magnitude).toBeCloseTo(7.95, 2);
    });

    it('has a year between 1980 and 2000', () => {
        const magnitude = getApparentMagnitudeNeptune(30.12055, 31.02105, 1999);

        expect(magnitude).toBeCloseTo(7.86, 2);
    });

    it('has a year above 2000', () => {
        const magnitude = getApparentMagnitudeNeptune(30.12055, 31.02105, 2020);

        expect(magnitude).toBeCloseTo(7.85, 2);
    });
});
