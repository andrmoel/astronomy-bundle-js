import TimeOfInterest from '@package/time/models/TimeOfInterest';
import solarEclipseExists from './solarEclipseExists';

it('has no valid TOI', () => {
    expect(solarEclipseExists()).toBe(false);
});

it('has no solar eclipse', () => {
    const toi = TimeOfInterest.fromTime(2017, 8, 22, 0, 0, 0);

    expect(solarEclipseExists(toi)).toBe(false);
});

it('has a solar eclipse with date at 00:00', () => {
    const toi = TimeOfInterest.fromTime(2017, 8, 21, 0, 0, 0);

    expect(solarEclipseExists(toi)).toBe(true);
});

it('has a solar eclipse with date and time', () => {
    const toi = TimeOfInterest.fromTime(2017, 8, 21, 22, 54, 10);

    expect(solarEclipseExists(toi)).toBe(true);
});
