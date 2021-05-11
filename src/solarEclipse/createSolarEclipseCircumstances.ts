import {BesselianElements} from './types/besselianElementsTypes';
import SolarEclipseCircumstances from './SolarEclipseCircumstances';
import {TimeLocalDependentCircumstances} from './types/circumstancesTypes';

export default function createSolarEclipseCircumstances(
    besselianElements: BesselianElements,
    circumstances: TimeLocalDependentCircumstances,
): SolarEclipseCircumstances {
    return new SolarEclipseCircumstances(besselianElements, circumstances);
}
