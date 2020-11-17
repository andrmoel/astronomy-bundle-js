import {km2au} from './distanceCalc';
import {round} from './math';
import {getApparentMagnitudeMoon} from './magnitudeCalc';

describe('tests getApparentMagnitudeMoon', () => {
    it('tests waxing moon in perigee', () => {
        const distanceSun = 1;
        const distanceEarth = km2au(363300);
        const isWaxing = true;

        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-3.12);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.61);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.58);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-6.18);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-10.32);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.85);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-12.07);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.35);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.65);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.83);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.93);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.97);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-13);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-13.02);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-13.04);
    });

    it('tests waning moon in perigee', () => {
        const distanceSun = 1;
        const distanceEarth = km2au(363300);
        const isWaxing = false;

        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-3.12);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.61);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.58);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-6.2);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-10.22);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.72);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-11.98);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.29);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.63);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.82);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.93);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.97);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-13);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-13.02);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-13.04);
    });

    it('tests waxing moon in apogee', () => {
        const distanceSun = 1;
        const distanceEarth = km2au(405500);
        const isWaxing = true;

        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-2.88);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.37);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.34);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-5.94);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-10.08);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.61);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-11.84);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.11);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.41);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.59);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.69);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.73);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-12.76);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-12.78);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-12.8);
    });

    it('tests waning moon in apogee', () => {
        const distanceSun = 1;
        const distanceEarth = km2au(405500);
        const isWaxing = false;

        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-2.88);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.37);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.35);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-5.97);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-9.98);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.49);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-11.74);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.05);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.39);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.58);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.69);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.73);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-12.76);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-12.78);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-12.8);
    });
});
