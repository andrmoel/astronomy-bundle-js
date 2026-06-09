import type {Location} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getCentralDuration, getDuration} from './duration';

// 2021-12-04 total solar eclipse
const elements: BesselianElements = {
    t0Jde: 2456422.51829,
    t0Hours: 0,
    tMin: -3,
    tMax: 3,
    deltaT: 67.1,
    x: [-0.17518, 0.50528872, 0.0000144, -0.00000591],
    y: [-0.30430099, 0.0888899, -0.0000959, -9.7e-7],
    d: [17.60548019, 0.010701, -0.000004],
    mu: [180.9034729, 15.00166035, 0],
    l1: [0.56367201, 0.0000788, -0.00001],
    l2: [0.017447, 0.0000784, -0.00001],
    tanF1: 0.0046313,
    tanF2: 0.0046082,
};

// Coen, Australia
const centralLineLocation: Location = {lat: -13.94528, lon: 143.19881, elevation: 219};

// Kapstadt, South Africa
const partialObserverLocation: Location = {lat: -33.9177, lon: 18.40277, elevation: 113};

// Ushuaia, Argentina
const partialSunriseLocation: Location = {lat: -54.83955, lon: -68.31199, elevation: 20};

// London
const outsideEclipseLocation: Location = {lat: 51.5, lon: -0.12, elevation: 0};

describe('getDuration', () => {
    it('returns the annular partial-phase duration in seconds for a central-line observer', () => {
        const result = getDuration(elements, centralLineLocation);

        expect(result).toBeCloseTo(6209.7, 2);
    });

    it('returns the total partial-phase duration in seconds for a partial-only observer', () => {
        // Kapstadt, South Africa
        const result = getDuration(elements, partialObserverLocation);

        expect(result).toBeCloseTo(4534.47, 2);
    });

    it('returns the total partial-phase duration for an observer seeing only the end at sunrise', () => {
        // Ushuaia, Argentina
        const result = getDuration(elements, partialSunriseLocation);

        expect(result).toBeCloseTo(5539.38, 2);
    });

    it('returns 0 when the eclipse is not visible from the observer location', () => {
        // London
        const result = getDuration(elements, outsideEclipseLocation);

        expect(result).toBe(0);
    });
});

describe('getCentralDuration', () => {
    it('returns the annularity duration in seconds for a central-line observer', () => {
        // Coen Australia
        const result = getCentralDuration(elements, centralLineLocation);

        expect(result).toBeCloseTo(160.77, 2);
    });

    it('returns 0 for a partial-only observer (no c2/c3)', () => {
        // Kapstadt, South Africa
        const result = getCentralDuration(elements, partialObserverLocation);

        expect(result).toBe(0);
    });

    it('returns 0 for an observer whose eclipse ends at sunrise (no c2/c3)', () => {
        // Ushuaia, Argentina
        const result = getCentralDuration(elements, partialSunriseLocation);

        expect(result).toBe(0);
    });

    it('returns 0 when the eclipse is not visible from the observer location', () => {
        // London
        const result = getCentralDuration(elements, outsideEclipseLocation);

        expect(result).toBe(0);
    });
});
