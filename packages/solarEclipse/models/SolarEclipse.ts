import Location from '@package/location/models/Location';
import {parseBesselianElements} from '@package/solarEclipse/utils/besselianElements';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {SolarEclipseType} from '../enums/SolarEclipseType';
import loadBesselianElements from '../resources/besselianElements/loadBesselianElements';
import type {BesselianElements} from '../types/BesselianElementTypes';
import LocalSolarEclipse from './LocalSolarEclipse';

export default class SolarEclipse {
    private constructor(private readonly elements: BesselianElements) {}

    public static createFromDate(date: string): SolarEclipse {
        const [yearStr, monthStr, dayStr] = date.split('-');
        const toi = TimeOfInterest.fromTime(Number(yearStr), Number(monthStr), Number(dayStr));

        const raw = loadBesselianElements(toi.getJulianDay0());
        if (!raw) {
            throw new Error(`No solar eclipse data found for date ${date}`);
        }

        return new SolarEclipse(parseBesselianElements(raw));
    }

    public static createFromToi(toi: TimeOfInterest): SolarEclipse {
        const raw = loadBesselianElements(toi.getJulianDay0());
        if (!raw) {
            throw new Error(`No solar eclipse data found for date ${toi.getDecimalYear()}`);
        }

        return new SolarEclipse(parseBesselianElements(raw));
    }

    public static createFromBesselianElements(elements: BesselianElements): SolarEclipse {
        return new SolarEclipse(elements);
    }

    public getLocalEclipse(location: Location): LocalSolarEclipse {
        return LocalSolarEclipse.create(this.elements, location);
    }

    public getType(): SolarEclipseType {
        // TODO
        return SolarEclipseType.Hybrid;
    }

    public getMaxObscuration(): number {
        // TODO
        return 0;
    }

    public getMaxDuration(): number {
        // TODO
        return 0;
    }

    public getMaxCentralDuration(): number {
        // TODO
        return 0;
    }

    public getSarosNumber(): number {
        // TODO
        return 0;
    }

    public getLocationOfGreatestEclipse(): Location {
        // TODO
        return Location.create(0, 0);
    }
}
