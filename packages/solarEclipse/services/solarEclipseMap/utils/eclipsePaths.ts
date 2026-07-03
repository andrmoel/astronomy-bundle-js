import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, RiseSetBoundary, SolarEclipseMapSettings} from '../types/SolarEclipsePathTypes';
import {calculateCentralLine} from './centralLine';
import {horizonSinAltitude, UMBRA_REGION_STEP_HOURS} from './constants';
import calculatePenumbraVisibilityAlpha from './penumbraVisibility';
import {
    calculateMaxEclipseAtSunrise,
    calculateMaxEclipseAtSunset,
    calculateSunriseBoundary,
    calculateSunsetBoundary,
} from './riseSetBoundary';
import {calculateShadowRegionContours} from './shadowOutline';

// Each path is computed lazily on first access and memoized. A layer therefore never
// triggers the umbra / central-line / rise-set math it does not draw, so rendering a map
// only pays for the polygons it actually uses. The settings' horizon convention (geometric
// or refracted rise/set) is resolved once here and threaded into every calculation.
export default function calculateEclipsePaths(
    elements: BesselianElements,
    settings?: SolarEclipseMapSettings,
): EclipsePaths {
    const z0 = horizonSinAltitude(settings);

    let centralLine: Array<LatLon> | undefined;
    let umbralRegion: Array<Array<LatLon>> | undefined;
    let sunsetBoundary: RiseSetBoundary | undefined;
    let sunriseBoundary: RiseSetBoundary | undefined;
    let maxEclipseSunset: Array<LatLon> | undefined;
    let maxEclipseSunrise: Array<LatLon> | undefined;
    let penumbraAlpha: {width: number; height: number; alpha: Uint8ClampedArray} | undefined;

    return {
        get centralLine(): Array<LatLon> {
            centralLine ??= calculateCentralLine(elements, z0);

            return centralLine;
        },
        get umbralRegion(): Array<Array<LatLon>> {
            umbralRegion ??= calculateShadowRegionContours(elements, true, UMBRA_REGION_STEP_HOURS, z0);

            return umbralRegion;
        },
        get sunsetBoundary(): RiseSetBoundary {
            sunsetBoundary ??= calculateSunsetBoundary(elements, z0);

            return sunsetBoundary;
        },
        get sunriseBoundary(): RiseSetBoundary {
            sunriseBoundary ??= calculateSunriseBoundary(elements, z0);

            return sunriseBoundary;
        },
        get maxEclipseSunset(): Array<LatLon> {
            maxEclipseSunset ??= calculateMaxEclipseAtSunset(elements, z0);

            return maxEclipseSunset;
        },
        get maxEclipseSunrise(): Array<LatLon> {
            maxEclipseSunrise ??= calculateMaxEclipseAtSunrise(elements, z0);

            return maxEclipseSunrise;
        },
        penumbraVisibilityAlpha(width: number, height: number): Uint8ClampedArray {
            if (penumbraAlpha === undefined || penumbraAlpha.width !== width || penumbraAlpha.height !== height) {
                penumbraAlpha = {width, height, alpha: calculatePenumbraVisibilityAlpha(elements, width, height, z0)};
            }

            return penumbraAlpha.alpha;
        },
    };
}
