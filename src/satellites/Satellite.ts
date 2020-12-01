import TimeOfInterest from '../time/TimeOfInterest';
import {createTimeOfInterest} from '../time';
import * as satelliteCalc from '../utils/satelliteCalc';
import ITwoLineElement from './interfaces/ITwboLineElement';

export default class Satellite {
    constructor(private tle: ITwoLineElement, private toi: TimeOfInterest) {
    }

    public getCoords() {
        const dt = this.getElapsedTimeSinceEpoch() * 1440;

        const M = satelliteCalc.getMeanAnomaly(this.tle, dt);
        // const a = satelliteCalc.getSemiMajorAxis(this.tle, dt);

        console.log('M', M);
    }

    private getElapsedTimeSinceEpoch() {
        const toiFromTle = createTimeOfInterest.fromYearOfDay(this.tle.epochYear, this.tle.epochDayOfYear);
        const jdFromTle = toiFromTle.getJulianDay();

        return this.toi.getJulianDay() - jdFromTle;
    }
}
