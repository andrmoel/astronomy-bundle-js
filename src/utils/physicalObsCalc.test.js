import {getCentralMeridianMars} from './physicalObsCalc';

it('tests getCentralMeridianMars', () => {
    const T = -0.0714441976;

    getCentralMeridianMars(T);
});
