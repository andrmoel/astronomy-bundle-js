import {round} from './math';
import {
    getAngularDiameter,
    getApparentMagnitudeMoon,
    getIlluminatedFraction,
    getPhaseAngle,
    getPositionAngleOfBrightLimb,
    isWaxing,
} from './observationCalc';
import {deg2angle} from './angleCalc';
import {km2au} from './distanceCalc';

it('tests getPhaseAngle', () => {
    const equCoordsObj = {
        rightAscension: 239.27954533,
        declination: -18.3152113,
        radiusVector: 1.13444337,
    };

    const equCoordsSun = {
        rightAscension: 346.35963120,
        declination: -5.83408833,
        radiusVector: 0.99162271,
    };

    const i = getPhaseAngle(equCoordsObj, equCoordsSun);

    expect(round(i, 2)).toBe(34.9);
});

it('tests getIlluminatedFraction', () => {
    const k = getIlluminatedFraction(43.9);

    expect(round(k, 2)).toBe(0.86);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const equCoordsObj = {
        rightAscension: 134.6885,
        declination: 13.7648,
        radiusVector: 1.13444337,
    };

    const equCoordsSun = {
        rightAscension: 20.6579,
        declination: 8.6964,
        radiusVector: 0.99162271,
    };

    const chi = getPositionAngleOfBrightLimb(equCoordsObj, equCoordsSun);

    expect(round(chi, 2)).toBe(285.04);
});

it('tests isWaxing', () => {
    expect(isWaxing(0)).toBeFalsy();
    expect(isWaxing(90)).toBeFalsy();
    expect(isWaxing(179.99)).toBeFalsy();
    expect(isWaxing(180)).toBeTruthy();
    expect(isWaxing(180.01)).toBeTruthy();
    expect(isWaxing(270)).toBeTruthy();
    expect(isWaxing(360)).toBeTruthy();
});

it('test getAngularDiameter', () => {
    const delta = getAngularDiameter(363300, 3474);

    expect(deg2angle(delta)).toBe('0° 32\' 52.36"');
});

describe('tests getApparentMagnitudeMoon', () => {
    it('tests moon in perigee', () => {
        const distanceSun = 1;
        const distanceEarth = km2au(363300);

        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180), 2)).toBe(-2.87);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170), 2)).toBe(-3.37);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160), 2)).toBe(-4.34);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150), 2)).toBe(-5.96);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90), 2)).toBe(-9.97);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40), 2)).toBe(-11.48);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30), 2)).toBe(-11.74);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20), 2)).toBe(-12.04);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10), 2)).toBe(-12.38);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5), 2)).toBe(-12.58);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5), 2)).toBe(-12.68);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5), 2)).toBe(-12.73);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1), 2)).toBe(-12.75);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5), 2)).toBe(-12.77);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0), 2)).toBe(-12.8);
    });

    it('tests moon in apogee', () => {
        const distanceSun = 1;
        const distanceEarth = km2au(405500);

        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 180), 2)).toBe(-3.11);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 170), 2)).toBe(-3.61);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 160), 2)).toBe(-4.58);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 150), 2)).toBe(-6.2);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 90), 2)).toBe(-10.21);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 40), 2)).toBe(-11.72);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 30), 2)).toBe(-11.98);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 20), 2)).toBe(-12.28);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 10), 2)).toBe(-12.62);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 5), 2)).toBe(-12.82);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 2.5), 2)).toBe(-12.92);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1.5), 2)).toBe(-12.97);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 1), 2)).toBe(-12.99);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0.5), 2)).toBe(-13.01);
        expect(round(getApparentMagnitudeMoon(distanceSun, distanceEarth, 0), 2)).toBe(-13.04);
    });
});
