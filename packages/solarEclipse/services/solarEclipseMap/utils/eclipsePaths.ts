import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths} from '../types/SolarEclipsePathTypes';
import {calculateCentralLine} from './centralLine';
import {PENUMBRA_PATH_STEP_HOURS, UMBRA_PATH_STEP_HOURS} from './constants';
import {calculateEdgePath} from './limitPaths';
import {calculateSunriseBoundary, calculateSunsetBoundary} from './riseSetBoundary';

export default function calculateEclipsePaths(elements: BesselianElements): EclipsePaths {
    const centralLine = calculateCentralLine(elements);

    const umbraPath = calculateEdgePath(elements, true, UMBRA_PATH_STEP_HOURS);
    const umbralRegion = umbraPath.length > 0 ? [umbraPath] : [];

    const penumbraPath = calculateEdgePath(elements, false, PENUMBRA_PATH_STEP_HOURS);
    const penumbralRegion = penumbraPath.length > 0 ? [penumbraPath] : [];

    const sunsetBoundary = calculateSunsetBoundary(elements);
    const sunriseBoundary = calculateSunriseBoundary(elements);

    return {centralLine, umbralRegion, penumbralRegion, sunsetBoundary, sunriseBoundary};
}
