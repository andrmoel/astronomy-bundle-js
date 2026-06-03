import {deg2angle} from './angleCalc';
import {round} from './math';
import {
    getAngularDiameter,
    getAngularSeparation,
    getIlluminatedFraction,
    getPhaseAngle,
    getPositionAngleOfBrightLimb,
    isWaxing,
} from './observationCalc';

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

it('tests getAngularSeparation', () => {
    const coords1 = {
        rightAscension: 213.9154,
        declination: 19.1825,
        radiusVector: 1,
    };

    const coords2 = {
        rightAscension: 201.2983,
        declination: -11.1614,
        radiusVector: 1,
    };

    const d = getAngularSeparation(coords1, coords2);

    expect(round(d, 4)).toBe(32.7930);
});
