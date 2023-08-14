import ObservationalCircumstances from './ObservationalCircumstances';
import {TimeLocationCircumstances} from './types/circumstancesTypes';

export default function createObservationalCircumstances(
    circumstances: TimeLocationCircumstances,
): ObservationalCircumstances {
    return new ObservationalCircumstances(circumstances);
}
