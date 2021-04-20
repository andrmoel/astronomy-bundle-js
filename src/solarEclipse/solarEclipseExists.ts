import TimeOfInterest from '../time/TimeOfInterest';
import {SOLAR_ECLIPSES} from './solarEclipseList/solarEclipseList';

export default function solarEclipseExists(toi: TimeOfInterest): boolean {
    const jd0 = toi.getJulianDay0();

    return SOLAR_ECLIPSES.includes(jd0);
}
