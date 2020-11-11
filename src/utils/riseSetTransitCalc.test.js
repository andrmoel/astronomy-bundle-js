import {getTransit} from './riseSetTransitCalc';
import {createTimeOfInterest} from '../time';

it('tests getTransit', () => {
    const toi = createTimeOfInterest.fromTime(1988, 3, 20, 0, 0, 0);
    const jd0 = toi.getJulianDay0();

    const coords = {
        rightAscension: 41.73129,
        declination: 18.44092,
        radiusVector: 0.0,
    };

    const location = {
        lat: 42.3333,
        lon: -71.0833,
    };

    const jd = getTransit(coords, location, jd0);

    const toi2 = createTimeOfInterest.fromJulianDay(jd);

    console.log(toi2.time);
});
