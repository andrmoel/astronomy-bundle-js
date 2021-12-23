import Location from '../earth/Location';
import {BesselianElements} from './types/besselianElementsTypes';

export default class LocalCircumstances {
    constructor(private besselianElements: BesselianElements, private location: Location) {
    }
}
