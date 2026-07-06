import type {Location} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {clampToVisibleWindow, getContactTaus} from './contacts';

export function getDuration(elements: BesselianElements, location: Location): number {
    const contacts = getContactTaus(elements, location);
    if (contacts === null) {
        return 0;
    }

    const visible = clampToVisibleWindow(contacts, contacts.c1, contacts.c4);
    if (visible === null) {
        return 0;
    }

    return (visible.end - visible.start) * 3600;
}

export function getCentralDuration(elements: BesselianElements, location: Location): number {
    const contacts = getContactTaus(elements, location);
    if (contacts === null || contacts.c2 === null || contacts.c3 === null) {
        return 0;
    }

    const visible = clampToVisibleWindow(contacts, contacts.c2, contacts.c3);
    if (visible === null) {
        return 0;
    }

    return (visible.end - visible.start) * 3600;
}
