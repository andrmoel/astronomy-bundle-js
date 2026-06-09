import type TimeOfInterest from '@package/time/models/TimeOfInterest';

export interface EclipseContacts {
    c1: number;
    c2: number | null;
    max: number;
    c3: number | null;
    c4: number;
}

export interface EclipseContactsToi {
    c1: TimeOfInterest;
    c2: TimeOfInterest | null;
    max: TimeOfInterest;
    c3: TimeOfInterest | null;
    c4: TimeOfInterest;
}
