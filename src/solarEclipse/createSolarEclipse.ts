import TimeOfInterest from '../time/TimeOfInterest';
import SolarEclipse from './SolarEclipse';
import solarEclipseExists from './solarEclipseExists';

export default function createSolarEclipse(toi?: TimeOfInterest): SolarEclipse {
    if (!solarEclipseExists(toi)) {
        throw new Error('Could not find Solar Eclipse for given date: ' + toi?.getString());
    }

    return new SolarEclipse(toi);
}
