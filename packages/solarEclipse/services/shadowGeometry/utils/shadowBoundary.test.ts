import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {calculateShadowBoundaryPoint, penumbraBoundaryFundamental} from './shadowBoundary';
import {fundamentalToLatLon, solveSurfacePoint} from './surface';
import {ELEMENTS_2019_07_02 as elements} from './testSupport';

const atGreatestEclipse = getBesselianElementsAtTime(elements, 0);
const offEarth = getBesselianElementsAtTime(elements, 2.8);

describe('penumbraBoundaryFundamental', () => {
    it('lands on the penumbral limit at its own zeta', () => {
        let checked = 0;
        for (let q = 0; q < 2 * Math.PI; q += Math.PI / 8) {
            const fundamental = penumbraBoundaryFundamental(elements, atGreatestEclipse, q);
            if (fundamental === null) {
                continue;
            }
            const solution = solveSurfacePoint(elements, atGreatestEclipse, fundamental.xi, fundamental.eta, false);
            if (solution === null) {
                continue;
            }
            const axisDistance = Math.hypot(fundamental.xi - atGreatestEclipse.x, fundamental.eta - atGreatestEclipse.y);
            const penumbraRadius = Math.abs(atGreatestEclipse.l1 - solution.zeta * elements.tanF1);
            expect(axisDistance).toBeCloseTo(penumbraRadius, 6);
            checked++;
        }
        expect(checked).toBeGreaterThan(0);
    });
});

describe('calculateShadowBoundaryPoint', () => {
    it('agrees with the converged fundamental-plane coordinates', () => {
        let checked = 0;
        for (let q = 0; q < 2 * Math.PI; q += Math.PI / 8) {
            const point = calculateShadowBoundaryPoint(elements, atGreatestEclipse, q, false);
            const fundamental = penumbraBoundaryFundamental(elements, atGreatestEclipse, q);
            if (point === null || fundamental === null) {
                continue;
            }
            const expected = fundamentalToLatLon(elements, atGreatestEclipse, fundamental.xi, fundamental.eta);
            if (expected === null) {
                continue;
            }
            expect(point.lat).toBeCloseTo(expected.lat, 6);
            expect(point.lon).toBeCloseTo(expected.lon, 6);
            checked++;
        }
        expect(checked).toBeGreaterThan(0);
    });

    it('returns null where the shadow boundary lies off the Earth', () => {
        for (let q = 0; q < 2 * Math.PI; q += Math.PI / 3) {
            expect(calculateShadowBoundaryPoint(elements, offEarth, q, false)).toBeNull();
        }
    });

    it('traces a small footprint for the umbra around the central line', () => {
        const points: Array<{lat: number; lon: number}> = [];
        for (let q = 0; q < 2 * Math.PI; q += Math.PI / 8) {
            const point = calculateShadowBoundaryPoint(elements, atGreatestEclipse, q, true);
            if (point !== null) {
                points.push(point);
            }
        }

        expect(points.length).toBeGreaterThan(4);
        const lats = points.map((p) => p.lat);
        const lons = points.map((p) => p.lon);
        expect(Math.max(...lats) - Math.min(...lats)).toBeLessThan(3);
        expect(Math.max(...lons) - Math.min(...lons)).toBeLessThan(3);
    });
});
