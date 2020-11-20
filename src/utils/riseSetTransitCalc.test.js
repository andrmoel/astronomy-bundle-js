import {createTimeOfInterest} from '../time';
import Venus from '../planets/Venus';
import {STANDARD_ALTITUDE_PLANET_REFRACTION} from '../constants/standardAltitude';
import {getRise, getSet, getTransit} from './riseSetTransitCalc';
import {round} from './math';

const toi = createTimeOfInterest.fromTime(1988, 3, 20, 0, 0, 0);
const jd0 = toi.getJulianDay0();

it('tests getTransit', async () => {
    const location = {
        lat: 42.3333,
        lon: -71.0833,
    };

    const jd = await getTransit(Venus, location, jd0);

    const toiTransit = createTimeOfInterest.fromJulianDay(jd);
    console.log(toiTransit.time);

    expect(round(jd, 6)).toBe(2447241.319796);
});

it('tests getRise', async () => {
    const location = {
        lat: 42.3333,
        lon: -71.033,
    };

    const jd = await getRise(Venus, location, jd0, STANDARD_ALTITUDE_PLANET_REFRACTION);

    expect(round(jd, 6)).toBe(2447241.017517);
});

it('tests getSet', async () => {
    const location = {
        lat: 42.3333,
        lon: -71.033,
    };

    const jd = await getSet(Venus, location, jd0, STANDARD_ALTITUDE_PLANET_REFRACTION);

    expect(round(jd, 6)).toBe(2447240.621156);
});
