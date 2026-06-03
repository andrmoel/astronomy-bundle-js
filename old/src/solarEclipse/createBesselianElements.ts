import TimeOfInterest from '../time/TimeOfInterest';
import loadBesselianElements from './besselianElements/loadBesselianElements';
import {BesselianElements, BesselianElementsArray} from './types/besselianElementsTypes';

export default async function createBesselianElements(toi: TimeOfInterest): Promise<BesselianElements> {
    const jd0 = toi.getJulianDay0();

    const besselianElementsArray = loadBesselianElements(jd0);

    if (!besselianElementsArray) {
        throw new Error(`No besselian elements found for ${jd0}`);
    }

    return _getBesselianElements(besselianElementsArray);
}

function _getBesselianElements(besselianElementsArray: BesselianElementsArray): BesselianElements {
    return {
        tMax: besselianElementsArray[0],
        t0: besselianElementsArray[1],
        dT: besselianElementsArray[2],
        x: besselianElementsArray[3],
        y: besselianElementsArray[4],
        d: besselianElementsArray[5],
        l1: besselianElementsArray[6],
        l2: besselianElementsArray[7],
        mu: besselianElementsArray[8],
        tanF1: besselianElementsArray[9],
        tanF2: besselianElementsArray[10],
        latGreatestEclipse: besselianElementsArray[11],
        lonGreatestEclipse: besselianElementsArray[12],
    };
}
