import type {Location} from '@app/types/LocationTypes';
import type {LocalEclipseCircumstances as LocalEclipseCircumstancesType} from '@package/solarEclipse/types/EclipseCircumstances';
import {getCentralDuration, getDuration} from '@package/solarEclipse/utils/duration';
import {
    getLocalEclipseCircumstances,
    getLocalEclipseType,
    getMagnitude,
    getMoonSunRatio,
    getObscuration,
    isEclipseVisible,
} from '@package/solarEclipse/utils/localCircumstances';
import {getUmbraPathWidth} from '@package/solarEclipse/utils/pathWidth';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {LocalSolarEclipseType} from '../enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import type {EclipseContacts, EclipseContactsToi} from '../types/EclipseContactTypes';
import {contactTausToContactJulianDays, getContactTaus} from '../utils/contacts';
import LocalEclipseCircumstances from './LocalEclipseCircumstances';

export default class LocalSolarEclipse {
    private readonly greatestEclipseTau: number;
    private readonly greatestEclipseCircumstances: LocalEclipseCircumstancesType;

    private constructor(
        private readonly elements: BesselianElements,
        private readonly location: Location,
        private readonly contactTaus: EclipseContacts,
    ) {
        // Greatest eclipse restricted to the above-horizon part, since max may be below the horizon.
        const {c1, c4, max, sunrise, sunset} = contactTaus;
        this.greatestEclipseTau = Math.min(Math.max(max, sunrise ?? c1), sunset ?? c4);
        this.greatestEclipseCircumstances = getLocalEclipseCircumstances(elements, location, this.greatestEclipseTau);
    }

    public static create(elements: BesselianElements, location: Location): LocalSolarEclipse {
        const contactTaus = getContactTaus(elements, location);

        if (!contactTaus || !isEclipseVisible(elements, location, contactTaus)) {
            throw new Error('No solar eclipse visible at this location');
        }

        return new LocalSolarEclipse(elements, location, contactTaus);
    }

    public getCircumstances(toi: TimeOfInterest): LocalEclipseCircumstances {
        return LocalEclipseCircumstances.create(this.elements, this.location, toi);
    }

    public getType(): LocalSolarEclipseType {
        return getLocalEclipseType(this.greatestEclipseCircumstances);
    }

    public getContactTaus(): EclipseContacts | null {
        return this.contactTaus;
    }

    public getContactTimes(): EclipseContactsToi | null {
        const contactsJd = contactTausToContactJulianDays(this.elements, this.contactTaus);

        if (!contactsJd) {
            return null;
        }

        return {
            c1: TimeOfInterest.fromJulianDay(contactsJd.c1),
            c2: contactsJd.c2 ? TimeOfInterest.fromJulianDay(contactsJd.c2) : null,
            max: TimeOfInterest.fromJulianDay(contactsJd.max),
            c3: contactsJd.c3 ? TimeOfInterest.fromJulianDay(contactsJd.c3) : null,
            c4: TimeOfInterest.fromJulianDay(contactsJd.c4),
            sunrise: contactsJd.sunrise !== null ? TimeOfInterest.fromJulianDay(contactsJd.sunrise) : null,
            sunset: contactsJd.sunset !== null ? TimeOfInterest.fromJulianDay(contactsJd.sunset) : null,
        };
    }

    public getMaxMagnitude(): number {
        return getMagnitude(this.greatestEclipseCircumstances);
    }

    public getMaxMoonSunRatio(): number {
        return getMoonSunRatio(this.greatestEclipseCircumstances);
    }

    public getMaxObscuration(): number {
        return getObscuration(this.greatestEclipseCircumstances);
    }

    public getUmbraPathWidth(): number {
        const type = this.getType();
        if (type !== LocalSolarEclipseType.Total && type !== LocalSolarEclipseType.Annular) {
            return 0;
        }

        return getUmbraPathWidth(this.elements, this.greatestEclipseTau);
    }

    public getDuration(): number {
        return getDuration(this.elements, this.location);
    }

    public getCentralDuration(): number {
        return getCentralDuration(this.elements, this.location);
    }
}
