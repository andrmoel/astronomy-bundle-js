import type Location from '@package/location/models/Location';
import {julianDay2tau} from '@package/solarEclipse/utils/besselianElements';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {LocalSolarEclipseType} from '../enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import type {LocalEclipseCircumstances as LocalEclipseCircumstancesType} from '../types/EclipseCircumstances';
import {
    getLocalEclipseCircumstances,
    getLocalEclipseType,
    getMagnitude,
    getObscuration,
} from '../utils/localCircumstances';

export default class LocalEclipseCircumstances {
    private readonly circumstances: LocalEclipseCircumstancesType;

    private constructor(elements: BesselianElements, location: Location, toi: TimeOfInterest) {
        const tau = julianDay2tau(elements, toi.getJulianDay());
        this.circumstances = getLocalEclipseCircumstances(elements, location, tau);
    }

    public static create(
        elements: BesselianElements,
        location: Location,
        toi: TimeOfInterest,
    ): LocalEclipseCircumstances {
        return new LocalEclipseCircumstances(elements, location, toi);
    }

    public getEclipseType(): LocalSolarEclipseType {
        return getLocalEclipseType(this.circumstances);
    }

    public isInEclipse(): boolean {
        return this.circumstances.distance < this.circumstances.l1;
    }

    public isInCentralEclipse(): boolean {
        return this.circumstances.distance < Math.abs(this.circumstances.l2);
    }

    public getMagnitude(): number {
        return getMagnitude(this.circumstances);
    }

    public getObscuration(): number {
        return getObscuration(this.circumstances);
    }

    // TODO
    // public getSunAltitude(): number {
    //     return getSunAltitudeDeg(this.elements, this.location, this.tau);
    // }

    // TODO
    // During a solar eclipse the moon and sun share essentially the same altitude.
    // public getMoonAltitude(): number {
    //     return this.getSunAltitude();
    // }
}
