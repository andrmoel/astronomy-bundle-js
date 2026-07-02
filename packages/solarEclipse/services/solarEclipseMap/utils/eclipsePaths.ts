import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, RiseSetBoundary} from '../types/SolarEclipsePathTypes';
import {calculateCentralLine} from './centralLine';
import {PENUMBRA_REGION_STEP_HOURS, UMBRA_REGION_STEP_HOURS} from './constants';
import {calculateSunriseBoundary, calculateSunsetBoundary} from './riseSetBoundary';
import {calculateShadowRegionContours} from './shadowOutline';

// Each path is computed lazily on first access and memoized. A penumbra layer therefore
// never triggers the umbra / central-line / rise-set math (and vice versa), so rendering a
// map only pays for the polygons it actually draws.
export default function calculateEclipsePaths(elements: BesselianElements): EclipsePaths {
    let centralLine: Array<LatLon> | undefined;
    let umbralRegion: Array<Array<LatLon>> | undefined;
    let penumbralRegion: Array<Array<LatLon>> | undefined;
    let sunsetBoundary: RiseSetBoundary | undefined;
    let sunriseBoundary: RiseSetBoundary | undefined;

    return {
        get centralLine(): Array<LatLon> {
            centralLine ??= calculateCentralLine(elements);

            return centralLine;
        },
        get umbralRegion(): Array<Array<LatLon>> {
            umbralRegion ??= calculateShadowRegionContours(elements, true, UMBRA_REGION_STEP_HOURS);

            return umbralRegion;
        },
        get penumbralRegion(): Array<Array<LatLon>> {
            penumbralRegion ??= calculateShadowRegionContours(elements, false, PENUMBRA_REGION_STEP_HOURS);

            return penumbralRegion;
        },
        get sunsetBoundary(): RiseSetBoundary {
            sunsetBoundary ??= calculateSunsetBoundary(elements);

            return sunsetBoundary;
        },
        get sunriseBoundary(): RiseSetBoundary {
            sunriseBoundary ??= calculateSunriseBoundary(elements);

            return sunriseBoundary;
        },
    };
}
