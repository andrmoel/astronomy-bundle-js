import {REVOLUTIONS_PER_DAY_TO_RAD_PER_MINUTE} from '../constants/sgp4';
import {getApogeeHeight, getOrbitalPeriod, getPerigeeHeight, getSemiMajorAxis} from './orbit';

const MEAN_MOTION = 0.06744683016;
const ECCENTRICITY = 0.0007168;

describe('getOrbitalPeriod', () => {
    it('gets the period in minutes', () => {
        expect(getOrbitalPeriod(MEAN_MOTION)).toBeCloseTo(93.15761, 5);
    });

    it('gets one sidereal day for a geostationary mean motion', () => {
        expect(getOrbitalPeriod(1.00273791 * REVOLUTIONS_PER_DAY_TO_RAD_PER_MINUTE)).toBeCloseTo(1436.068, 3);
    });
});

describe('getSemiMajorAxis', () => {
    it('gets the semi-major axis in km', () => {
        expect(getSemiMajorAxis(MEAN_MOTION)).toBeCloseTo(6807.263, 3);
    });
});

describe('getApogeeHeight', () => {
    it('gets the apogee height above the equator in km', () => {
        expect(getApogeeHeight(MEAN_MOTION, ECCENTRICITY)).toBeCloseTo(434.007, 3);
    });
});

describe('getPerigeeHeight', () => {
    it('gets the perigee height above the equator in km', () => {
        expect(getPerigeeHeight(MEAN_MOTION, ECCENTRICITY)).toBeCloseTo(424.248, 3);
    });

    it('equals the apogee height for a circular orbit', () => {
        expect(getPerigeeHeight(MEAN_MOTION, 0)).toBe(getApogeeHeight(MEAN_MOTION, 0));
    });
});
