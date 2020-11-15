import Jupiter from '../planets/Jupiter';
import Saturn from '../planets/Saturn';
import Venus from '../planets/Venus';
import {getConjunctionInRightAscension} from './conjunctionCalc';
import {round} from './math';

it('tests getConjunctionInRightAscension for jupiter and saturn in 2020', async () => {
    const jd0 = 2459204.5;

    const jd = await getConjunctionInRightAscension(Jupiter, Saturn, jd0);

    expect(round(jd, 6)).toBe(2459205.064841);
});

it('test getConjunctionInRightAscension for a date where no conjunction happens', async () => {
    const jd0 = 2459204.5;

    try {
        await getConjunctionInRightAscension(Jupiter, Venus, jd0);

        fail('Expected error was not thrown');
    } catch (error) {
        expect(error.message).toBe('No conjunction possible for given objects at 2459204.5');
    }
});
