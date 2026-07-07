import {calculateCentralLine, getCentralLine} from './centralLine';
import {REFRACTED_HORIZON_SIN_ALTITUDE} from './constants';
import {latLonChordDeg} from './contourGeometry';
import isPointInPolygon from './pointInPolygon';
import {ELEMENTS_2019_07_02, ELEMENTS_2021_12_04 as elements, maxEclipseCircumstances} from './testSupport';
import calculateUmbraPathPolygon from './umbraPathPolygon';

describe('calculateCentralLine', () => {
    it('follows the same track as getCentralLine at the same step', () => {
        const geometric = calculateCentralLine(elements, 0);
        const line = getCentralLine(elements, {stepsInSeconds: 1});
        const mid = geometric[Math.floor(geometric.length / 2)];

        expect(line.some((point) => latLonChordDeg(point, mid) < 1e-9)).toBe(true);
    });

    it('extends past the geometric terminator with the refracted horizon', () => {
        // 2019-07-02: its sunset hook crosses the -50' sliver in more than one step
        const geometric2019 = calculateCentralLine(ELEMENTS_2019_07_02, 0);
        const refracted = calculateCentralLine(ELEMENTS_2019_07_02, REFRACTED_HORIZON_SIN_ALTITUDE);

        expect(refracted.length).toBeGreaterThan(geometric2019.length);
        expect(refracted.slice(-1)[0]).not.toEqual(geometric2019.slice(-1)[0]);
    });
});

describe('getCentralLine', () => {
    const line = getCentralLine(elements);

    it('returns a continuous line', () => {
        expect(line.length).toBeGreaterThan(300);
        for (let i = 1; i < line.length; i++) {
            expect(latLonChordDeg(line[i - 1], line[i])).toBeLessThan(1);
        }
    });

    it('starts and ends with a central maximum eclipse on the horizon', () => {
        for (const tip of [line[0], line[line.length - 1]]) {
            const {magnitude, altitude} = maxEclipseCircumstances(elements, tip);

            expect(magnitude).toBeGreaterThan(1);
            expect(Math.abs(altitude)).toBeLessThan(0.5);
        }
    });

    it('ends inside the end caps of the umbra path polygon', () => {
        const polygon = calculateUmbraPathPolygon(elements);

        for (const tip of [line[0], line[line.length - 1]]) {
            expect(isPointInPolygon(tip, polygon)).toBe(true);
            const gap = Math.min(...polygon.map((vertex) => latLonChordDeg(vertex, tip)));
            expect(gap).toBeLessThan(1);
        }
    });

    it('respects the refraction horizon convention', () => {
        const refracted = getCentralLine(elements, {refraction: true});

        expect(refracted.length).toBeGreaterThan(300);
        expect(refracted[0]).not.toEqual(line[0]);
        expect(refracted[refracted.length - 1]).not.toEqual(line[line.length - 1]);
    });

    it('respects the step size', () => {
        const fine = getCentralLine(elements, {stepsInSeconds: 1});

        expect(fine.length).toBeGreaterThan(line.length * 3);
    });
});
