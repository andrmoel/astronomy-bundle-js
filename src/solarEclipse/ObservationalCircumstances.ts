import {
    getEclipseType,
    getMagnitude,
    getMoonSunRatio,
    getObscuration,
} from './calculations/observationalCircumstancesCalc';
import {TimeLocationCircumstances} from './types/circumstancesTypes';
import {SolarEclipseType} from './constants/solarEclipseTypes';

export default class ObservationalCircumstances {
    constructor(private circumstances: TimeLocationCircumstances) {
    }

    public getEclipseType(): SolarEclipseType {
        return getEclipseType(this.circumstances);
    }

    public getMagnitude(): number {
        return getMagnitude(this.circumstances);
    }

    public getMoonSunRatio(): number {
        return getMoonSunRatio(this.circumstances);
    }

    public getObscuration(): number {
        return getObscuration(this.circumstances);
    }
}
