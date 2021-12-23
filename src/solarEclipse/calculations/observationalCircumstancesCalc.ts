import {TimeLocationCircumstances} from '../types/circumstancesTypes';
import {SolarEclipseType} from '../constants/solarEclipseTypes';

export function getMaximumEclipse(circumstances: TimeLocationCircumstances): number {
    const {u, v} = circumstances;

    return Math.sqrt(Math.pow(u, 2) + Math.pow(v, 2));
}

export function getMagnitude(circumstances: TimeLocationCircumstances): number {
    const {l1Derived, l2Derived} = circumstances;
    const maximumEclipse = getMaximumEclipse(circumstances);

    return (l1Derived - maximumEclipse) / (l1Derived + l2Derived);
}

export function getMoonSunRatio(circumstances: TimeLocationCircumstances): number {
    const {l1Derived, l2Derived} = circumstances;

    return (l1Derived - l2Derived) / (l1Derived + l2Derived);
}

export function getEclipseType(circumstances: TimeLocationCircumstances): SolarEclipseType {
    const {l2Derived} = circumstances;
    const maximumEclipse = getMaximumEclipse(circumstances);
    const magnitude = getMagnitude(circumstances);

    if (magnitude <= 0.0) {
        return SolarEclipseType.none
    }

    if (maximumEclipse < l2Derived || maximumEclipse < -1 * l2Derived) {
        if (l2Derived < 0.0) {
            return SolarEclipseType.total;
        }

        return SolarEclipseType.annular;
    }

    return SolarEclipseType.partial;
}
