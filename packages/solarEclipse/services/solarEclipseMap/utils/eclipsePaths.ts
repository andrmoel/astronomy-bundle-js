import type {LatLon} from '@app/types/LocationTypes';
import {calculateCentralLine} from '@package/solarEclipse/services/shadowGeometry/utils/centralLine';
import {
    horizonSinAltitude,
    UMBRA_REGION_STEP_HOURS,
} from '@package/solarEclipse/services/shadowGeometry/utils/constants';
import calculatePenumbraVisibilityAlpha from '@package/solarEclipse/services/shadowGeometry/utils/penumbraVisibility';
import {calculateShadowRegionContours} from '@package/solarEclipse/services/shadowGeometry/utils/shadowOutline';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, RiseSetBoundary, SolarEclipseMapSettings} from '../types/SolarEclipsePathTypes';
import {
    calculateMaxEclipseAtSunrise,
    calculateMaxEclipseAtSunset,
    calculateSunriseBoundary,
    calculateSunsetBoundary,
} from './riseSetBoundary';
import {calculateGeometryParallel, calculatePenumbraVisibilityAlphaParallel, type EclipseGeometry} from './workerPool';

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
        // Same mask, but computed on the worker pool; the memoized result is then served
        // synchronously by penumbraVisibilityAlpha above.
        async prefetchPenumbraVisibilityAlpha(width: number, height: number): Promise<void> {
            if (penumbraAlpha === undefined || penumbraAlpha.width !== width || penumbraAlpha.height !== height) {
                const alpha = await calculatePenumbraVisibilityAlphaParallel(elements, width, height, z0);
                penumbraAlpha = {width, height, alpha};
            }
        },
        // Same vector path as the getter of the same name, but computed on the worker pool
        // (or, without one, on the main thread) and stored in the same memo.
        async prefetchGeometry(geometry: EclipseGeometry): Promise<void> {
            const computed = await calculateGeometryParallel(geometry, elements, z0);
            switch (geometry) {
                case 'centralLine':
                    centralLine ??= (computed as Array<LatLon> | null) ?? calculateCentralLine(elements, z0);
                    break;
                case 'umbralRegion':
                    umbralRegion ??=
                        (computed as Array<Array<LatLon>> | null)
                        ?? calculateShadowRegionContours(elements, true, UMBRA_REGION_STEP_HOURS, z0);
                    break;
                case 'sunriseBoundary':
                    sunriseBoundary ??= (computed as RiseSetBoundary | null) ?? calculateSunriseBoundary(elements, z0);
                    break;
                case 'sunsetBoundary':
                    sunsetBoundary ??= (computed as RiseSetBoundary | null) ?? calculateSunsetBoundary(elements, z0);
                    break;
                case 'maxEclipseSunrise':
                    maxEclipseSunrise ??=
                        (computed as Array<LatLon> | null) ?? calculateMaxEclipseAtSunrise(elements, z0);
                    break;
                case 'maxEclipseSunset':
                    maxEclipseSunset ??=
                        (computed as Array<LatLon> | null) ?? calculateMaxEclipseAtSunset(elements, z0);
                    break;
            }
        },
    };
}
