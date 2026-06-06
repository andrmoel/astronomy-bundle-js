import {Earth} from '@package/earth';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import SunBase from './SunBase';

export default class Sun extends SunBase {
    public constructor(toi?: TimeOfInterest) {
        super(toi, Earth.create(toi));
    }

    public static create(toi?: TimeOfInterest): Sun {
        return new Sun(toi);
    }
}
