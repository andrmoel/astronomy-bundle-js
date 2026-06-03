import {SOLAR_ECLIPSES} from '../resources/solarEclipseList';
import TimeOfInterest from '@package/time/models/TimeOfInterest';

export default function solarEclipseExists(toi?: TimeOfInterest): boolean {
    if (!toi) {
        return false;
    }

    const jd0 = toi.getJulianDay0();

    return SOLAR_ECLIPSES.includes(jd0);
}
