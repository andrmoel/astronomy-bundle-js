import {parseBesselianElements} from './besselianElements';

// 22-element raw Besselian data for the 2001-01-09 total lunar eclipse.
const rawElements: Array<number> = [
    2451919.348374, 20, 64.1, 2.162, 1.189, 1, 3.29475, 1.02253, 0.27861, -2.23117, -1.27481, -0.14757, 0.36098,
    0.86973, 1.99702, 2.95278, 111.0355098, 0.68656, -0.000073, 22.3913306, -0.03239, -0.001453,
];

describe('parseBesselianElements', () => {
    it('parses all fields from a 22-element array', () => {
        const result = parseBesselianElements(rawElements);

        expect(result.t0Jde).toBe(2451919.348374);
        expect(result.t0Hours).toBe(20);
        expect(result.deltaT).toBe(64.1);
        expect(result.penumbralMagnitude).toBe(2.162);
        expect(result.umbralMagnitude).toBe(1.189);
        expect(result.eclipseType).toBe(1);
        expect(result.apparentSiderealTime).toBe(3.29475);
        expect(result.moonParallax).toBe(1.02253);
        expect(result.moonSemidiameter).toBe(0.27861);
        expect(result.p1).toBe(-2.23117);
        expect(result.u1).toBe(-1.27481);
        expect(result.u2).toBe(-0.14757);
        expect(result.greatest).toBe(0.36098);
        expect(result.u3).toBe(0.86973);
        expect(result.u4).toBe(1.99702);
        expect(result.p4).toBe(2.95278);
        expect(result.ra).toEqual([111.0355098, 0.68656, -0.000073]);
        expect(result.dec).toEqual([22.3913306, -0.03239, -0.001453]);
    });

    it('throws when the array does not have exactly 22 elements', () => {
        expect(() => parseBesselianElements(rawElements.slice(0, 21))).toThrow(
            'Expected 22 Besselian element values, got 21',
        );
    });
});
