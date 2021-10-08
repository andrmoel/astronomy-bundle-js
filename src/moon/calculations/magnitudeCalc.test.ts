import {km2au} from '../../utils/distanceCalc';
import {round} from '../../utils/math';
import {getApparentMagnitudeMoon} from './magnitudeCalc';

it('tests waxing moon in perigee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(363300);
    const isWaxing = true;

    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-3.12);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.5);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.62);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-6.36);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-10.33);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.84);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-12.07);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.33);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.63);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.79);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.88);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.92);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-12.94);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-12.95);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-12.98);
});

it('tests waning moon in perigee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(363300);
    const isWaxing = false;

    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-3.12);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.5);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.62);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-6.23);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-10.22);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.69);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-11.98);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.29);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.63);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.8);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.89);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.93);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-12.95);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-12.97);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-12.98);
});

it('tests waxing moon in apogee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(405500);
    const isWaxing = true;

    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-2.88);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.26);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.38);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-6.12);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-10.1);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.6);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-11.84);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.09);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.39);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.55);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.64);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.68);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-12.7);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-12.72);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-12.74);
});

it('tests waning moon in apogee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(405500);
    const isWaxing = false;

    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing), 2)).toBe(-2.88);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing), 2)).toBe(-3.26);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing), 2)).toBe(-4.38);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing), 2)).toBe(-5.99);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing), 2)).toBe(-9.98);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing), 2)).toBe(-11.45);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing), 2)).toBe(-11.74);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing), 2)).toBe(-12.05);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing), 2)).toBe(-12.39);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing), 2)).toBe(-12.56);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing), 2)).toBe(-12.65);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing), 2)).toBe(-12.69);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing), 2)).toBe(-12.71);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing), 2)).toBe(-12.73);
    expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing), 2)).toBe(-12.74);
});
