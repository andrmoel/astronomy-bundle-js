import type {LatLon, Location} from '@app/types/LocationTypes';
import {
    getCentralLine,
    getPenumbraPath,
    getUmbraPath,
} from '@package/solarEclipse/services/shadowGeometry/eclipsePaths';
import type {LocalEclipseCircumstances} from '@package/solarEclipse/types/EclipseCircumstances';
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
import type {ShadowPathOptions} from '../services/shadowGeometry/types/ShadowPathTypes';
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

    public getCentralLine(stepsInSeconds = 10): Array<LatLon> {
        return getCentralLine(this.elements, stepsInSeconds);
    }

    public getUmbraPath(options: ShadowPathOptions = {}): Array<Array<LatLon>> {
        return getUmbraPath(this.elements, options);
    }

    public getPenumbraPath(options: ShadowPathOptions = {}): Array<Array<LatLon>> {
        return getPenumbraPath(this.elements, options);
    }

    // TODO
    // public getSarosNumber(): number {
    //     return 0; // TODO implement
    // }
}
