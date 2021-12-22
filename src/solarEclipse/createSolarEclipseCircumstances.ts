import SolarEclipseCircumstances from './SolarEclipseCircumstances';
import {TimeLocationCircumstances} from './types/circumstancesTypes';

export default function createSolarEclipseCircumstances(
    circumstances: TimeLocationCircumstances,
): SolarEclipseCircumstances {
    return new SolarEclipseCircumstances(circumstances);
}
