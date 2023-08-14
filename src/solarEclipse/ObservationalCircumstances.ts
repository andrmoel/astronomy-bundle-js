import {
    getEclipseType,
    getMagnitude,
    getMoonSunRatio,
    getObscuration,
} from './calculations/observationalCircumstancesCalc';
import {SolarEclipseType} from './constants/solarEclipseTypes';
import {TimeLocationCircumstances} from './types/circumstancesTypes';

export default class ObservationalCircumstances {
    public constructor(private circumstances: TimeLocationCircumstances) {}

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
