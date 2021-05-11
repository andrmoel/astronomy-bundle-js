import SolarEclipseCircumstances from './SolarEclipseCircumstances';
import {TimeLocalDependentCircumstances} from './types/circumstancesTypes';

export default function createSolarEclipseCircumstances(
    circumstances: TimeLocalDependentCircumstances,
): SolarEclipseCircumstances {
    return new SolarEclipseCircumstances(circumstances);
}
