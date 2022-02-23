import {createTimeOfInterest} from '../../time';
import GoldenHandle from './GoldenHandle';

const toi = createTimeOfInterest.fromTime(2022, 4, 1, 0, 0, 0);
const goldenHandle = new GoldenHandle(toi);

it('tests getStartTime', async () => {
    const eventToi = await goldenHandle.getStartTime();

    expect(eventToi.getString()).toBe('2022-04-11 18:19:36');
});

it('tests getMaximum', async () => {
    const toi = await goldenHandle.getMaximum();

    expect(toi.getString()).toBe('2022-04-11 21:19:36');
});

it('tests getEndTime', async () => {
    const toi = await goldenHandle.getEndTime();

    expect(toi.getString()).toBe('2022-04-12 03:19:36');
});
