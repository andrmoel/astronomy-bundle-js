import {km2au} from '@app/utils/distance';
import {getApparentMagnitudeMoon} from './magnitude';

it('tests waxing moon in perigee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(363300);
    const isWaxing = true;

    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing)).toBeCloseTo(-3.12);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing)).toBeCloseTo(-3.5);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing)).toBeCloseTo(-4.62);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing)).toBeCloseTo(-6.36);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing)).toBeCloseTo(-10.33);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing)).toBeCloseTo(-11.84);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing)).toBeCloseTo(-12.07);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing)).toBeCloseTo(-12.33);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing)).toBeCloseTo(-12.63);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing)).toBeCloseTo(-12.79);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing)).toBeCloseTo(-12.88);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing)).toBeCloseTo(-12.92);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing)).toBeCloseTo(-12.94);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing)).toBeCloseTo(-12.95);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing)).toBeCloseTo(-12.98);
});

it('tests waning moon in perigee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(363300);
    const isWaxing = false;

    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing)).toBeCloseTo(-3.12);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing)).toBeCloseTo(-3.5);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing)).toBeCloseTo(-4.62);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing)).toBeCloseTo(-6.23);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing)).toBeCloseTo(-10.22);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing)).toBeCloseTo(-11.69);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing)).toBeCloseTo(-11.98);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing)).toBeCloseTo(-12.29);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing)).toBeCloseTo(-12.63);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing)).toBeCloseTo(-12.8);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing)).toBeCloseTo(-12.89);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing)).toBeCloseTo(-12.93);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing)).toBeCloseTo(-12.95);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing)).toBeCloseTo(-12.97);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing)).toBeCloseTo(-12.98);
});

it('tests waxing moon in apogee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(405500);
    const isWaxing = true;

    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing)).toBeCloseTo(-2.88);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing)).toBeCloseTo(-3.26);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing)).toBeCloseTo(-4.38);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing)).toBeCloseTo(-6.12);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing)).toBeCloseTo(-10.1);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing)).toBeCloseTo(-11.6);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing)).toBeCloseTo(-11.84);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing)).toBeCloseTo(-12.09);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing)).toBeCloseTo(-12.39);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing)).toBeCloseTo(-12.55);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing)).toBeCloseTo(-12.64);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing)).toBeCloseTo(-12.68);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing)).toBeCloseTo(-12.7);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing)).toBeCloseTo(-12.72);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing)).toBeCloseTo(-12.74);
});

it('tests waning moon in apogee', () => {
    const distanceSun = 1;
    const distanceEarth = km2au(405500);
    const isWaxing = false;

    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180, isWaxing)).toBeCloseTo(-2.88);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170, isWaxing)).toBeCloseTo(-3.26);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160, isWaxing)).toBeCloseTo(-4.38);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150, isWaxing)).toBeCloseTo(-5.99);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90, isWaxing)).toBeCloseTo(-9.98);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40, isWaxing)).toBeCloseTo(-11.45);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30, isWaxing)).toBeCloseTo(-11.74);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20, isWaxing)).toBeCloseTo(-12.05);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10, isWaxing)).toBeCloseTo(-12.39);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5, isWaxing)).toBeCloseTo(-12.56);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5, isWaxing)).toBeCloseTo(-12.65);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5, isWaxing)).toBeCloseTo(-12.69);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1, isWaxing)).toBeCloseTo(-12.71);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5, isWaxing)).toBeCloseTo(-12.73);
    expect(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0, isWaxing)).toBeCloseTo(-12.74);
});
