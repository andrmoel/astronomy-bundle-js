import type {LatLon} from '@app/types/LocationTypes';
import type Location from '@package/location/models/Location';
import type {LocalEclipseCircumstances} from '@package/solarEclipse/types/EclipseCircumstances';
import {parseBesselianElements} from '@package/solarEclipse/utils/besselianElements';
import {getCentralDuration, getDuration} from '@package/solarEclipse/utils/duration';
import {getEclipseType} from '@package/solarEclipse/utils/eclipseType';
import {
    getJulianDayOfGreatestEclipse,
    getLocationOfGreatestEclipse,
    getTauOfGreatestEclipse,
} from '@package/solarEclipse/utils/greatestEclipse';
import {
    getLocalEclipseCircumstances,
    getMagnitude,
    getMoonSunRatio,
    getObscuration,
} from '@package/solarEclipse/utils/localCircumstances';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {SolarEclipseType} from '../enums/SolarEclipseType';
import loadBesselianElements from '../resources/besselianElements/loadBesselianElements';
import type {BesselianElements} from '../types/BesselianElementTypes';
import LocalSolarEclipse from './LocalSolarEclipse';

export default class SolarEclipse {
    private readonly locationOfGreatestEclipse: LatLon;
    private readonly tauOfGreatestEclipse: number;
    private readonly greatestEclipseCircumstances: LocalEclipseCircumstances;

    private constructor(private readonly elements: BesselianElements) {
        this.locationOfGreatestEclipse = getLocationOfGreatestEclipse(elements);
        this.tauOfGreatestEclipse = getTauOfGreatestEclipse(elements);
        this.greatestEclipseCircumstances = getLocalEclipseCircumstances(
            this.elements,
            {...this.locationOfGreatestEclipse, elevation: 0},
            this.tauOfGreatestEclipse,
        );
    }

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
        return getEclipseType(this.elements);
    }

    public getLocationOfGreatestEclipse(): LatLon {
        return this.locationOfGreatestEclipse;
    }

    public getTimeOfGreatestEclipse(): TimeOfInterest {
        const jd = getJulianDayOfGreatestEclipse(this.elements);

        return TimeOfInterest.fromJulianDay(jd);
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

    public getMaxDuration(): number {
        return getDuration(this.elements, {
            ...this.locationOfGreatestEclipse,
            elevation: 0,
        });
    }

    public getMaxCentralDuration(): number {
        return getCentralDuration(this.elements, {
            ...this.locationOfGreatestEclipse,
            elevation: 0,
        });
    }

    // TODO
    // public getSarosNumber(): number {
    //     return 0; // TODO implement
    // }
}
