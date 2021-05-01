import TimeOfInterest from '../time/TimeOfInterest';
import {BesselianElements} from './types/besselianElementsTypes';
import loadBesselianElements from './besselianElements/loadBesselianElements';

export default async function createBesselianElements(toi: TimeOfInterest): Promise<BesselianElements> {
    const jd0 = toi.getJulianDay0();

    const array = await loadBesselianElements(jd0);

    return {
        tMax: array[0],
        t0: array[1],
        dT: array[2],
        x: array[3],
        y: array[4],
        d: array[5],
        l1: array[6],
        l2: array[7],
        mu: array[8],
        tanF1: array[9],
        tanF2: array[10],
        latGreatestEclipse: array[11],
        lonGreatestEclipse: array[12],
    }
}
