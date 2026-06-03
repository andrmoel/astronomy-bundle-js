import type Location from '@package/location/models/Location';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import {LocalSolarEclipseType} from '../enums/SolarEclipseType';
import type {BesselianElements} from '../types/BesselianElementTypes';
import {
    getLocalSnapshot,
    getMagnitude,
    getObscuration,
    getSunAltitudeDeg,
    getTauFromToi,
    type LocalSnapshot,
} from '../utils/localCircumstances';

export default class LocalEclipseCircumstances {
    private readonly tau: number;
    private readonly snap: LocalSnapshot;

    private constructor(
        private readonly elements: BesselianElements,
        private readonly location: Location,
        private readonly toi: TimeOfInterest,
    ) {
        this.tau = getTauFromToi(elements, toi);
        this.snap = getLocalSnapshot(elements, location, this.tau);
    }

    public static create(
        elements: BesselianElements,
        location: Location,
        toi: TimeOfInterest,
    ): LocalEclipseCircumstances {
        return new LocalEclipseCircumstances(elements, location, toi);
    }

    public getLocation(): Location {
        return this.location;
    }

    public getTimeOfInterest(): TimeOfInterest {
        return this.toi;
    }

    public getType(): LocalSolarEclipseType {
        const {l1, l2, distance} = this.snap;
        if (distance >= l1 || distance >= Math.abs(l2)) return LocalSolarEclipseType.Partial;
        return l2 < 0 ? LocalSolarEclipseType.Total : LocalSolarEclipseType.Annular;
    }

    public isInEclipse(): boolean {
        return this.snap.distance < this.snap.l1;
    }

    public isInCentralEclipse(): boolean {
        return this.snap.distance < Math.abs(this.snap.l2);
    }

    public getMagnitude(): number {
        return getMagnitude(this.snap.l1, this.snap.l2, this.snap.distance);
    }

    public getObscuration(): number {
        return getObscuration(this.snap.l1, this.snap.l2, this.snap.distance);
    }

    public getSunAltitude(): number {
        return getSunAltitudeDeg(this.elements, this.location, this.tau);
    }

    // During a solar eclipse the moon and sun share essentially the same altitude.
    public getMoonAltitude(): number {
        return this.getSunAltitude();
    }
}
