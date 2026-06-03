import {createTimeOfInterest} from '../../time';
import LunarX from './LunarX';

const toi = createTimeOfInterest.fromTime(2022, 4, 1, 0, 0, 0);
const lunarX = new LunarX(toi);

it('tests getStartTime', async () => {
    const eventToi = await lunarX.getStartTime();

    expect(eventToi.getString()).toBe('2022-04-08 20:02:32');
});

it('tests getMaximum', async () => {
    const toi = await lunarX.getMaximum();

    expect(toi.getString()).toBe('2022-04-08 21:32:32');
});

it('tests getEndTime', async () => {
    const toi = await lunarX.getEndTime();

    expect(toi.getString()).toBe('2022-04-08 23:02:32');
});
