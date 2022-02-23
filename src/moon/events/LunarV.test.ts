import {createTimeOfInterest} from '../../time';
import LunarV from './LunarV';

const toi = createTimeOfInterest.fromTime(2022, 4, 1, 0, 0, 0);
const lunarV = new LunarV(toi);

it('tests getStartTime', async () => {
    const eventToi = await lunarV.getStartTime();

    expect(eventToi.getString()).toBe('2022-04-08 19:09:03');
});

it('tests getMaximum', async () => {
    const toi = await lunarV.getMaximum();

    expect(toi.getString()).toBe('2022-04-08 22:09:03');
});

it('tests getEndTime', async () => {
    const toi = await lunarV.getEndTime();

    expect(toi.getString()).toBe('2022-04-09 06:09:03');
});
