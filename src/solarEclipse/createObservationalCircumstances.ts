import {TimeLocationCircumstances} from './types/circumstancesTypes';
import ObservationalCircumstances from './ObservationalCircumstances';

export default function createObservationalCircumstances(
    circumstances: TimeLocationCircumstances,
): ObservationalCircumstances {
    return new ObservationalCircumstances(circumstances);
}
