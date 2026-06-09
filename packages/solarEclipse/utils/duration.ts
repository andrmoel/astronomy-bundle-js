import type {Location} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getContactTaus} from './contacts';

// TODO consider sunrise and sunset + atmospheric refraction

export function getDuration(elements: BesselianElements, location: Location): number {
    const contacts = getContactTaus(elements, location);
    if (contacts === null) return 0;
    return (contacts.c4 - contacts.c1) * 3600;
}

export function getCentralDuration(elements: BesselianElements, location: Location): number {
    const contacts = getContactTaus(elements, location);
    if (contacts === null || contacts.c2 === null || contacts.c3 === null) return 0;

    return (contacts.c3 - contacts.c2) * 3600;
}
