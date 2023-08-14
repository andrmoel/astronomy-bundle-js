import {createTimeOfInterest} from '../../time';
import TimeOfInterest from '../../time/TimeOfInterest';
import {getSunrise} from '../calculations/librationCalc';
import {SelenographicLocation} from '../types/LocationTypes';
import EventInterface from './EventInterface';

export default class LunarV implements EventInterface {
    private coords: SelenographicLocation = {lon: 1.5, lat: 8};

    public constructor(private readonly toi: TimeOfInterest) {}

    public async getStartTime(): Promise<TimeOfInterest> {
        const T = await this.getTMax() - 3 / 24 / 36525;

        return createTimeOfInterest.fromJulianCenturiesJ2000(T);
    }

    public async getMaximum(): Promise<TimeOfInterest> {
        const T = await this.getTMax();

        return createTimeOfInterest.fromJulianCenturiesJ2000(T);
    }

    public async getEndTime(): Promise<TimeOfInterest> {
        const T = await this.getTMax() + 8 / 24 / 36525;

        return createTimeOfInterest.fromJulianCenturiesJ2000(T);
    }

    private async getTMax(): Promise<number> {
        return await getSunrise(this.coords, this.toi.T);
    }
}
