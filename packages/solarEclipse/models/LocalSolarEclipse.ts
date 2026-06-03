import type Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {LocalSolarEclipseType} from '../enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import type {EclipseContacts, EclipseContactsTau} from '../types/EclipseContactTypes';
import {getContactTaus} from '../utils/contacts';
import {getLocalSnapshot} from '../utils/localCircumstances';
import LocalEclipseCircumstances from './LocalEclipseCircumstances';

export default class LocalSolarEclipse {
    private constructor(
        private readonly elements: BesselianElements,
        private readonly location: Location,
        private readonly contactTaus: EclipseContactsTau,
    ) {}

    public static create(elements: BesselianElements, location: Location): LocalSolarEclipse {
        const contactTaus = getContactTaus(elements, location);
        if (!contactTaus) {
            throw new Error('No solar eclipse visible at this location');
        }
        return new LocalSolarEclipse(elements, location, contactTaus);
    }

    public getCircumstances(toi: TimeOfInterest): LocalEclipseCircumstances {
        return LocalEclipseCircumstances.create(this.elements, this.location, toi);
    }

    public getType(): LocalSolarEclipseType {
        if (this.contactTaus.c2 === null) {
            return LocalSolarEclipseType.Partial;
        }
        const snap = getLocalSnapshot(this.elements, this.location, this.contactTaus.max);
        return snap.l2 < 0 ? LocalSolarEclipseType.Total : LocalSolarEclipseType.Annular;
    }

    public getContactTaus(): EclipseContactsTau | null {
        return this.contactTaus;
    }

    public getContactTimes(): EclipseContacts {
        const tauToDate = (tau: number): Date => {
            const jde = this.elements.t0Jde + tau / 24;
            return TimeOfInterest.fromJulianDay(jde).getDate();
        };

        return {
            c1: tauToDate(this.contactTaus.c1),
            c2: this.contactTaus.c2 !== null ? tauToDate(this.contactTaus.c2) : null,
            max: tauToDate(this.contactTaus.max),
            c3: this.contactTaus.c3 !== null ? tauToDate(this.contactTaus.c3) : null,
            c4: tauToDate(this.contactTaus.c4),
        };
    }

    // Duration of the eclipse (C1 to C4) in seconds.
    public getDuration(): number {
        return (this.contactTaus.c4 - this.contactTaus.c1) * 3600;
    }

    // Duration of the central phase (C2 to C3) in seconds, or null for partial eclipses.
    public getCentralDuration(): number | null {
        if (this.contactTaus.c2 === null || this.contactTaus.c3 === null) {
            return null;
        }
        return (this.contactTaus.c3 - this.contactTaus.c2) * 3600;
    }
}
