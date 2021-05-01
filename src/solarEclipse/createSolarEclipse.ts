import TimeOfInterest from '../time/TimeOfInterest';
import SolarEclipse from './SolarEclipse';
import solarEclipseExists from './solarEclipseExists';
import createBesselianElements from './createBesselianElements';
import {BesselianElements} from './types/besselianElementsTypes';

export function fromBesselianElements(besselianElements: BesselianElements): SolarEclipse {
    return new SolarEclipse(besselianElements);
}

export async function fromTimeOfInterest(toi: TimeOfInterest): Promise<SolarEclipse> {
    if (!solarEclipseExists(toi)) {
        throw new Error('Could not find Solar Eclipse for given date: ' + toi.getString());
    }

    const besselianElements = await createBesselianElements(toi);

    return new SolarEclipse(besselianElements);
}
