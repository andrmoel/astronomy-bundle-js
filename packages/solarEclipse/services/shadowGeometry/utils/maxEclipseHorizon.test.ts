import {getBesselianElementsAtTime} from '@package/solarEclipse/utils/besselianElements';
import {isOnSunsetSide, maxEclipseHorizonRootAtTau} from './maxEclipseHorizon';
import {ELEMENTS_2019_07_02 as elements, maxEclipseCircumstances} from './testSupport';

it('finds points whose maximum eclipse happens exactly on the horizon', () => {
    let found = 0;
    for (let tau = elements.tMin; tau <= elements.tMax; tau += 0.5) {
        for (const isSunset of [false, true]) {
            const root = maxEclipseHorizonRootAtTau(elements, tau, isSunset, 0);
            if (root === null) {
                continue;
            }
            found++;
            const {magnitude, altitude} = maxEclipseCircumstances(elements, root.point);

            expect(magnitude).toBeGreaterThan(0);
            expect(Math.abs(altitude)).toBeLessThan(0.5);
        }
    }

    expect(found).toBeGreaterThan(5);
});

it('reports the fundamental-plane separation of the root', () => {
    const roots: Array<number> = [];
    for (let tau = elements.tMin; tau <= elements.tMax; tau += 0.5) {
        const root = maxEclipseHorizonRootAtTau(elements, tau, true, 0);
        if (root !== null) {
            roots.push(root.separation);
        }
    }

    expect(roots.length).toBeGreaterThan(0);
    for (const separation of roots) {
        expect(separation).toBeGreaterThanOrEqual(0);
        expect(separation).toBeLessThanOrEqual(0.55);
    }
});

describe('isOnSunsetSide', () => {
    const e = getBesselianElementsAtTime(elements, 0);

    it('reports the setting side when the Sun stands west of the local zenith', () => {
        expect(isOnSunsetSide({lat: -30, lon: 0}, e, elements.deltaT)).toBe(true);
    });

    it('reports the rising side when the Sun stands east of the local zenith', () => {
        expect(isOnSunsetSide({lat: -30, lon: 90}, e, elements.deltaT)).toBe(false);
    });

    it('flips between rising and setting for antimeridian longitudes', () => {
        const west = isOnSunsetSide({lat: -30, lon: 0}, e, elements.deltaT);
        const east = isOnSunsetSide({lat: -30, lon: 180}, e, elements.deltaT);

        expect(east).toBe(!west);
    });
});
