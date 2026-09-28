import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {getSunAltitude, getSunTemePosition, isSunlit} from './illumination';

const {T} = TimeOfInterest.fromTime(2026, 9, 28, 14, 39, 0);
const BERLIN = {lat: 52.52, lon: 13.405, elevation: 34};

describe('isSunlit', () => {
    it('is sunlit on the day side', () => {
        expect(isSunlit({x: -7000, y: 0, z: 0}, T)).toBe(true);
    });

    it('is in shadow on the night side', () => {
        expect(isSunlit({x: 7000, y: 0, z: 0}, T)).toBe(false);
    });

    it('is sunlit above the terminator', () => {
        expect(isSunlit({x: 0, y: 0, z: 7000}, T)).toBe(true);
    });

    it('is sunlit on the night side far outside the shadow cone', () => {
        expect(isSunlit({x: 7000, y: 9000, z: 0}, T)).toBe(true);
    });

    it('is sunlit above the pole behind the Earth where a spherical Earth would cast a shadow', () => {
        expect(isSunlit(getPositionBehindEarth(6375), T)).toBe(true);
    });

    it('is in shadow above the pole behind the Earth below the polar radius', () => {
        expect(isSunlit(getPositionBehindEarth(6350), T)).toBe(false);
    });
});

describe('getSunAltitude', () => {
    it('gets the altitude of the Sun for an observer', () => {
        expect(getSunAltitude(BERLIN, T)).toBeCloseTo(18.308, 2);
    });
});

describe('getSunTemePosition', () => {
    it('gets the position of the Sun in km', () => {
        const {x, y, z} = getSunTemePosition(T);
        const distance = Math.hypot(x, y, z);

        expect(Math.atan2(y, x) * (180 / Math.PI) + 360).toBeCloseTo(185.0406, 2);
        expect(Math.asin(z / distance) * (180 / Math.PI)).toBeCloseTo(-2.1817, 3);
        expect(distance / 1e6).toBeCloseTo(149.896, 1);
    });
});

function getPositionBehindEarth(distanceFromShadowAxis: number): {x: number; y: number; z: number} {
    const sun = getSunTemePosition(T);
    const sunDistance = Math.hypot(sun.x, sun.y, sun.z);
    const antiSun = {x: -sun.x / sunDistance, y: -sun.y / sunDistance, z: -sun.z / sunDistance};
    const perpendicular = {x: -antiSun.z * antiSun.x, y: -antiSun.z * antiSun.y, z: 1 - antiSun.z * antiSun.z};
    const perpendicularLength = Math.hypot(perpendicular.x, perpendicular.y, perpendicular.z);
    const scale = distanceFromShadowAxis / perpendicularLength;

    return {
        x: antiSun.x * 1000 + perpendicular.x * scale,
        y: antiSun.y * 1000 + perpendicular.y * scale,
        z: antiSun.z * 1000 + perpendicular.z * scale,
    };
}
