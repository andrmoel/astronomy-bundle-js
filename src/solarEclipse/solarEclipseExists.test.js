import {createTimeOfInterest} from '../time';
import solarEclipseExists from './solarEclipseExists';

it('has no valid TOI', () => {
    expect(solarEclipseExists()).toBeFalsy();
});

it('has no solar eclipse', () => {
    const toi = createTimeOfInterest.fromTime(2017, 8, 22, 0, 0, 0);

    expect(solarEclipseExists(toi)).toBeFalsy();
});

it('has a solar eclipse with date at 00:00', () => {
    const toi = createTimeOfInterest.fromTime(2017, 8, 21, 0, 0, 0);

    expect(solarEclipseExists(toi)).toBeTruthy();
});

it('has a solar eclipse with date and time', () => {
    const toi = createTimeOfInterest.fromTime(2017, 8, 21, 22, 54, 10);

    expect(solarEclipseExists(toi)).toBeTruthy();
});
