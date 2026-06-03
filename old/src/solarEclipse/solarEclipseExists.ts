import TimeOfInterest from '../time/TimeOfInterest';
import {SOLAR_ECLIPSES} from './constants/solarEclipseList';

export default function solarEclipseExists(toi?: TimeOfInterest): boolean {
    if (!toi) {
        return false;
    }

    const jd0 = toi.getJulianDay0();

    return SOLAR_ECLIPSES.includes(jd0);
}
