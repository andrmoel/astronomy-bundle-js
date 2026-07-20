import type {LatLon, Location} from '@app/types/LocationTypes';
import type {ShadowPathOptions} from '@package/solarEclipse/services/shadowGeometry/types/ShadowPathTypes';
import {getCentralLine} from '@package/solarEclipse/services/shadowGeometry/utils/centralLine';
import calculatePenumbraPathPolygon from '@package/solarEclipse/services/shadowGeometry/utils/penumbraPathPolygon';
import calculateUmbraPathPolygon from '@package/solarEclipse/services/shadowGeometry/utils/umbraPathPolygon';
import type {LocalEclipseCircumstances} from '@package/solarEclipse/types/EclipseCircumstances';
import {getCentralDuration, getDuration} from '@package/solarEclipse/utils/duration';
import {getEclipseType} from '@package/solarEclipse/utils/eclipseType';
import {
    getGamma,
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
import {getUmbraPathWidth} from '@package/solarEclipse/utils/pathWidth';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {SolarEclipseType} from '../enums/SolarEclipseType';
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

    public getSaros(): number {
        return this.elements.saros;
    }

    public getLocationOfGreatestEclipse(): LatLon {
        return this.locationOfGreatestEclipse;
    }

    public getTimeOfGreatestEclipse(): TimeOfInterest {
        const jd = getJulianDayOfGreatestEclipse(this.elements);

        return TimeOfInterest.fromJulianDay(jd);
    }

    public getGamma(): number {
        return getGamma(this.elements);
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
        return getUmbraPathWidth(this.elements, this.tauOfGreatestEclipse);
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

    public getCentralLine(options: ShadowPathOptions = {}): Array<LatLon> {
        return getCentralLine(this.elements, options);
    }

    public getUmbraPathPolygon(options: ShadowPathOptions = {}): Array<LatLon> {
        return calculateUmbraPathPolygon(this.elements, options);
    }

    public getPenumbraPathPolygon(options: ShadowPathOptions = {}): Array<LatLon> {
        return calculatePenumbraPathPolygon(this.elements, options);
    }
}
