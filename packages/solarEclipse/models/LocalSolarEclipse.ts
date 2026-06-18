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
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {LocalSolarEclipseType} from '../enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import type {EclipseContacts, EclipseContactsToi} from '../types/EclipseContactTypes';
import {contactTausToContactJulianDays, getContactTaus} from '../utils/contacts';
import LocalEclipseCircumstances from './LocalEclipseCircumstances';

export default class LocalSolarEclipse {
    private readonly greatestEclipseCircumstances: LocalEclipseCircumstancesType;

    private constructor(
        private readonly elements: BesselianElements,
        private readonly location: Location,
        private readonly contactTaus: EclipseContacts,
    ) {
        this.greatestEclipseCircumstances = getLocalEclipseCircumstances(elements, location, contactTaus.max);
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

    public getDuration(): number {
        return getDuration(this.elements, this.location);
    }

    public getCentralDuration(): number {
        return getCentralDuration(this.elements, this.location);
    }
}
