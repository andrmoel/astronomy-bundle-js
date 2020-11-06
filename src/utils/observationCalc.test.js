import {round} from './math';
import {getIlluminatedFraction, getPhaseAngle} from './observationCalc';

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
