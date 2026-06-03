import type {LatLon} from '@app/types/LocationTypes';

export interface Location extends LatLon {
    elevation: number;
}
