import TimeOfInterest from '../time/TimeOfInterest';
import Location from '../earth/Location';
import createLocation from '../earth/createLocation';
import {BesselianElements} from './types/besselianElementsTypes';

export default class SolarEclipse {
    private besselianElements: BesselianElements;

    constructor(private toi: TimeOfInterest) {
        this.besselianElements = SolarEclipse.loadBesselianElements(toi);
    }

    private static loadBesselianElements(toi: TimeOfInterest): BesselianElements {
        const jd0 = toi?.getJulianDay0();
        const besselianElemenetsFile = __dirname + `/resources/besselianElements/${jd0}`;

        return require(besselianElemenetsFile).default;
    }

    public getBesselianElements(): BesselianElements {
        return this.besselianElements;
    }

    public getLocationOfGreatestEclipse(): Location {
        const {latGreatestEclipse, lonGreatestEclipse} = this.besselianElements;

        return createLocation(latGreatestEclipse, lonGreatestEclipse);
    }
}
