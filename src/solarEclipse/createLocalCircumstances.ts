import Location from '../earth/Location';
import LocalCircumstances from './LocalCircumstances';
import {BesselianElements} from './types/besselianElementsTypes';

export default function createLocalCircumstances(
    besselianElements: BesselianElements,
    location: Location,
): LocalCircumstances {
    return new LocalCircumstances(besselianElements, location);
}
