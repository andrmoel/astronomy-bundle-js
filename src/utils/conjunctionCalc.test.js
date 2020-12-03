import Jupiter from '../planets/Jupiter';
import Saturn from '../planets/Saturn';
import Venus from '../planets/Venus';
import {getConjunctionInLongitude, getConjunctionInRightAscension} from './conjunctionCalc';
import {round} from './math';

describe('test for getConjunctionInRightAscension', () => {
    it('gets the conjunction of jupiter and saturn in 2020', async () => {
        const jd0 = 2459204.5;

        const {toi, position, angularDistance} = await getConjunctionInRightAscension(Jupiter, Saturn, jd0);

        expect(toi.time).toEqual({year: 2020, month: 12, day: 21, hour: 13, min: 33, sec: 22});
        expect(position).toBe(1);
        expect(round(angularDistance, 6)).toBe(0.104212);
    });

    it('is no conjunction possible for the given date', async () => {
        const jd0 = 2459204.5;

        try {
            await getConjunctionInRightAscension(Jupiter, Venus, jd0);

            fail('Expected error was not thrown');
        } catch (error) {
            expect(error.message).toBe('No conjunction in right ascension possible for given objects at 2459204.5');
        }
    });
});

describe('test for getConjunctionInLongitude', () => {
    it('gets the conjunction of TODO', async () => {
        // TODO Write valid test
    });

    it('is no conjunction possible for the given date', async () => {
        const jd0 = 2459204.5;

        try {
            await getConjunctionInLongitude(Jupiter, Venus, jd0);

            fail('Expected error was not thrown');
        } catch (error) {
            expect(error.message).toBe('No conjunction in longitude possible for given objects at 2459204.5');
        }
    });
});
