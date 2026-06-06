import {deg2angle} from '@app/utils/angle';
import {
    getAngularDiameter,
    getAngularSeparation,
    getIlluminatedFraction,
    getPhaseAngle,
    getPositionAngleOfBrightLimb,
    isWaxing,
} from './observation';

it('tests getPhaseAngle', () => {
    const equCoordsObj = {
        rightAscension: 239.27954533,
        declination: -18.3152113,
        radiusVector: 1.13444337,
    };

    const equCoordsSun = {
        rightAscension: 346.3596312,
        declination: -5.83408833,
        radiusVector: 0.99162271,
    };

    const i = getPhaseAngle(equCoordsObj, equCoordsSun);

    expect(i).toBeCloseTo(34.9, 2);
});

it('tests getIlluminatedFraction', () => {
    const k = getIlluminatedFraction(43.9);

    expect(k).toBeCloseTo(0.86, 2);
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

    expect(chi).toBeCloseTo(285.04, 2);
});

it('tests isWaxing', () => {
    expect(isWaxing(0)).toBe(false);
    expect(isWaxing(90)).toBe(false);
    expect(isWaxing(179.99)).toBe(false);
    expect(isWaxing(180)).toBe(true);
    expect(isWaxing(180.01)).toBe(true);
    expect(isWaxing(270)).toBe(true);
    expect(isWaxing(360)).toBe(true);
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

    expect(d).toBeCloseTo(32.793, 4);
});
