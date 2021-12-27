import {BesselianElements} from '../types/besselianElementsTypes';
import {Location} from '../../earth/types/LocationTypes';
import {SolarEclipseType} from '../constants/solarEclipseTypes';
import {getEclipseType} from './observationalCircumstancesCalc';
import {
    getTimeLocationCircumstancesC1,
    getTimeLocationCircumstancesC2,
    getTimeLocationCircumstancesC3, getTimeLocationCircumstancesC4,
    getTimeLocationCircumstancesMaxEclipse,
} from './eventCircumstancesCalc';

export function getDuration(besselianElements: BesselianElements, location: Location): number {
    const circumstancesMax = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

    const eventType = getEclipseType(circumstancesMax);

    if (eventType === SolarEclipseType.none) {
        return 0.0;
    }

    const {t: tC1} = getTimeLocationCircumstancesC1(besselianElements, location);
    const {t: tC4} = getTimeLocationCircumstancesC4(besselianElements, location);

    return (tC4 - tC1) * 3600;
}

export function getCentralDuration(besselianElements: BesselianElements, location: Location): number {
    const circumstancesMax = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

    const eventType = getEclipseType(circumstancesMax);

    if (eventType === SolarEclipseType.none || eventType === SolarEclipseType.partial) {
        return 0.0;
    }

    const {t: tC2} = getTimeLocationCircumstancesC2(besselianElements, location);
    const {t: tC3} = getTimeLocationCircumstancesC3(besselianElements, location);

    return (tC3 - tC2) * 3600;
}
