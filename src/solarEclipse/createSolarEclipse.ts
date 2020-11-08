import TimeOfInterest from '../time/TimeOfInterest';
import SolarEclipse from './SolarEclipse';

export default function createSolarEclipse(toi?: TimeOfInterest): SolarEclipse {
    return new SolarEclipse(toi);
}
