import {createTimeOfInterest} from '../time';
import createSolarEclipse from './createSolarEclipse';
import SolarEclipse from './SolarEclipse';

it('tests createSolarEclipse', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const solarEclipse = createSolarEclipse(toi);

    expect(solarEclipse).toBeInstanceOf(SolarEclipse);
});

it('tests createSolarEclipse without TOI', () => {
    const solarEclipse = createSolarEclipse();

    expect(solarEclipse).toBeInstanceOf(SolarEclipse);
});
