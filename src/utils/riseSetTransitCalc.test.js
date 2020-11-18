import {createTimeOfInterest} from '../time';
import Venus from '../planets/Venus';
import {getTransit} from './riseSetTransitCalc';
import {round} from './math';

const toi = createTimeOfInterest.fromTime(1988, 3, 20, 0, 0, 0);
const jd0 = toi.getJulianDay0();

it('tests getTransit', async () => {
    const location = {
        lat: 42.3333,
        lon: -71.0833,
    };

    const jd = await getTransit(Venus, location, jd0);

    expect(round(jd, 6)).toBe(2447241.319796);
});
