import type {LatLon} from '@app/types/LocationTypes';

export type RiseSetBoundary = Array<LatLon>;

export interface EclipsePaths {
    centralLine: Array<LatLon>;
    umbralRegion: Array<Array<LatLon>>;
    penumbralRegion: Array<Array<LatLon>>;
    sunsetBoundary: RiseSetBoundary;
    sunriseBoundary: RiseSetBoundary;
}

export interface EclipseStyle {
    fillColor?: string;
    borderColor?: string;
}
