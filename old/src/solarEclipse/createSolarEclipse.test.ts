import {createTimeOfInterest} from '../time';
import {fromBesselianElements, fromTimeOfInterest} from './createSolarEclipse';
import SolarEclipse from './SolarEclipse';

it('tests for fromBesselianElements', () => {
    const besselianElements = {
        tMax: 2459198.177,
        t0: 16,
        dT: 72.1,
        x: [-0.181824, 0.5633567, 0.0000216, -0.000009],
        y: [-0.269645, -0.0858122, 0.0001884, 0.0000015],
        d: [-23.2577591, -0.001986, 0.000006, 0],
        l1: [0.543862, 0.000097, -0.0000126, 0],
        l2: [-0.002265, 0.0000965, -0.0000125, 0],
        mu: [61.265911, 14.9965, 0, 0],
        tanF1: 0.0047502,
        tanF2: 0.0047266,
        latGreatestEclipse: -40.3,
        lonGreatestEclipse: -67.9,
    };

    const solarEclipse = fromBesselianElements(besselianElements);

    expect(solarEclipse).toBeInstanceOf(SolarEclipse);
});

describe('test for fromTimeOfInterest', () => {
    it('has invalid TOI', async () => {
        const toi = createTimeOfInterest.fromTime(2020, 1, 1, 0, 0, 0);

        await expect(async () => {
            await fromTimeOfInterest(toi);
        }).rejects.toThrow('Could not find Solar Eclipse for given date: 2020-01-01 00:00:00');
    });

    it('has valid TOI', async () => {
        const toi = createTimeOfInterest.fromTime(2020, 12, 14, 0, 0, 0);

        const solarEclipse = await fromTimeOfInterest(toi);

        expect(solarEclipse).toBeInstanceOf(SolarEclipse);
    });
});
