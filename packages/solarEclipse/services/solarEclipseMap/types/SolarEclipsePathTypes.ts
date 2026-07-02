import type {LatLon} from '@app/types/LocationTypes';

export type RiseSetBoundary = Array<LatLon>;

export interface EclipsePaths {
    centralLine: Array<LatLon>;
    umbralRegion: Array<Array<LatLon>>;
    sunsetBoundary: RiseSetBoundary;
    sunriseBoundary: RiseSetBoundary;
    maxEclipseSunset: Array<LatLon>;
    maxEclipseSunrise: Array<LatLon>;
}

export interface EclipseStyle {
    fillColor?: string;
    borderColor?: string;
    borderWeight?: number;
}
