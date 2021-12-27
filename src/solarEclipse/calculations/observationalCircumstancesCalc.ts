import {TimeLocationCircumstances} from '../types/circumstancesTypes';
import {SolarEclipseType} from '../constants/solarEclipseTypes';
import {Location} from '../../earth/types/LocationTypes';
import {BesselianElements} from '../types/besselianElementsTypes';
import {LocalHorizontalCoordinates} from '../../coordinates/types/CoordinateTypes';
import {equatorialSpherical2topocentricHorizontalByLocalHourAngle} from '../../coordinates/calculations/coordinateCalc';
import {getTimeCircumstances} from './circumstancesCalc';

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

export function getObscuration(circumstances: TimeLocationCircumstances): number {
    const {l1Derived, l2Derived} = circumstances;

    const eclipseType = getEclipseType(circumstances);
    const maximumEclipse = getMaximumEclipse(circumstances);
    const magnitude = getMagnitude(circumstances);
    const moonSunRatio = getMoonSunRatio(circumstances);

    if (magnitude <= 0.0) {
        return 0.0;
    }

    if (magnitude >= 1.0) {
        return 1.0;
    }

    if (eclipseType === SolarEclipseType.annular) {
        return Math.pow(moonSunRatio, 2);
    }

    const cNumerator = Math.pow(l1Derived, 2) + Math.pow(l2Derived, 2) - 2 * Math.pow(maximumEclipse, 2);
    const cDenominator = Math.pow(l1Derived, 2) - Math.pow(l2Derived, 2);
    const c = Math.acos(cNumerator / cDenominator);

    const bNumerator = (l1Derived * l2Derived + Math.pow(maximumEclipse, 2)) / maximumEclipse;
    const bDenominator = l1Derived + l2Derived;
    const b = Math.acos(bNumerator / bDenominator);

    const a = Math.PI - b - c;

    const result = Math.pow(moonSunRatio, 2) * a + b - moonSunRatio * Math.sin(c);

    return result / Math.PI;
}

export function getTopocentricHorizontalCoordinates(
    besselianElements: BesselianElements,
    circumstances: TimeLocationCircumstances,
    location: Location,
): LocalHorizontalCoordinates {
    const {t, h} = circumstances;
    const {d} = getTimeCircumstances(besselianElements, t);
    const {lat} = location;

    return equatorialSpherical2topocentricHorizontalByLocalHourAngle(h, d, lat);
}
