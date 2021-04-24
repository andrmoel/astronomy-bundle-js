import {createTimeOfInterest} from '../time';
import createSolarEclipse from './createSolarEclipse';
import SolarEclipse from './SolarEclipse';

it('tests createSolarEclipse without TOI', () => {
    try {
        createSolarEclipse();
    } catch (error) {
        expect(error.message).toBe('Could not find Solar Eclipse for given date: undefined');
    }
});

it('tests createSolarEclipse with invalid TOI', () => {
    const toi = createTimeOfInterest.fromTime(2020, 1, 1, 0, 0, 0);

    try {
        createSolarEclipse(toi);
    } catch (error) {
        expect(error.message).toBe('Could not find Solar Eclipse for given date: 2020-01-01 00:00:00');
    }
});

it('tests createSolarEclipse with valid TOI', () => {
    const toi = createTimeOfInterest.fromTime(2020, 12, 14, 0, 0, 0);

    const solarEclipse = createSolarEclipse(toi);

    expect(solarEclipse).toBeInstanceOf(SolarEclipse);
});
