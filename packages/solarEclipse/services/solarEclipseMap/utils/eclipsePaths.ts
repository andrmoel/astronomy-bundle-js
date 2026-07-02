import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, RiseSetBoundary} from '../types/SolarEclipsePathTypes';
import {calculateCentralLine} from './centralLine';
import {UMBRA_REGION_STEP_HOURS} from './constants';
import {
    calculateMaxEclipseAtSunrise,
    calculateMaxEclipseAtSunset,
    calculateSunriseBoundary,
    calculateSunsetBoundary,
} from './riseSetBoundary';
import {calculateShadowRegionContours} from './shadowOutline';

// Each path is computed lazily on first access and memoized. A layer therefore never
// triggers the umbra / central-line / rise-set math it does not draw, so rendering a map
// only pays for the polygons it actually uses. (The penumbral shading is not polygon-based —
// see penumbraVisibility.)
export default function calculateEclipsePaths(elements: BesselianElements): EclipsePaths {
    let centralLine: Array<LatLon> | undefined;
    let umbralRegion: Array<Array<LatLon>> | undefined;
    let sunsetBoundary: RiseSetBoundary | undefined;
    let sunriseBoundary: RiseSetBoundary | undefined;
    let maxEclipseSunset: Array<LatLon> | undefined;
    let maxEclipseSunrise: Array<LatLon> | undefined;

    return {
        get centralLine(): Array<LatLon> {
            centralLine ??= calculateCentralLine(elements);

            return centralLine;
        },
        get umbralRegion(): Array<Array<LatLon>> {
            umbralRegion ??= calculateShadowRegionContours(elements, true, UMBRA_REGION_STEP_HOURS);

            return umbralRegion;
        },
        get sunsetBoundary(): RiseSetBoundary {
            sunsetBoundary ??= calculateSunsetBoundary(elements);

            return sunsetBoundary;
        },
        get sunriseBoundary(): RiseSetBoundary {
            sunriseBoundary ??= calculateSunriseBoundary(elements);

            return sunriseBoundary;
        },
        get maxEclipseSunset(): Array<LatLon> {
            maxEclipseSunset ??= calculateMaxEclipseAtSunset(elements);

            return maxEclipseSunset;
        },
        get maxEclipseSunrise(): Array<LatLon> {
            maxEclipseSunrise ??= calculateMaxEclipseAtSunrise(elements);

            return maxEclipseSunrise;
        },
    };
}
