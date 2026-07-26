import type {LocalHorizontalCoordinates} from '@app/types/CoordinateTypes';
import type {LatLon, Location} from '@app/types/LocationTypes';
import {correctEffectOfRefraction} from '@app/utils/apparentPositionCorrections';
import {julianDay2tau} from '@package/solarEclipse/utils/besselianElements';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {LocalSolarEclipseType} from '../enums/SolarEclipseType';
import type {ShadowPathOptions} from '../services/shadowGeometry/types/ShadowPathTypes';
import {horizonSinAltitude} from '../services/shadowGeometry/utils/constants';
import {getInstantaneousUmbraOutline} from '../services/shadowGeometry/utils/shadowOutline';
import type {BesselianElements} from '../types/BesselianElementTypes';
import type {LocalEclipseCircumstances as LocalEclipseCircumstancesType} from '../types/EclipseCircumstances';
import {
    getLocalEclipseCircumstances,
    getLocalEclipseType,
    getLocalHorizontalCoordinates,
    getMagnitude,
    getObscuration,
} from '../utils/localCircumstances';

export default class LocalEclipseCircumstances {
    private readonly tau: number;
    private readonly circumstances: LocalEclipseCircumstancesType;

    private constructor(
        private readonly elements: BesselianElements,
        private readonly location: Location,
        toi: TimeOfInterest,
    ) {
        this.tau = julianDay2tau(elements, toi.getJulianDay());
        this.circumstances = getLocalEclipseCircumstances(elements, location, this.tau);
    }

    public static create(
        elements: BesselianElements,
        location: Location,
        toi: TimeOfInterest,
    ): LocalEclipseCircumstances {
        return new LocalEclipseCircumstances(elements, location, toi);
    }

    public getEclipseType(): LocalSolarEclipseType {
        return getLocalEclipseType(this.circumstances);
    }

    public isInEclipse(): boolean {
        return this.circumstances.distance < this.circumstances.l1;
    }

    public isInCentralEclipse(): boolean {
        return this.circumstances.distance < Math.abs(this.circumstances.l2);
    }

    public getUmbraShadowOutline(options: ShadowPathOptions = {}): Array<LatLon> | null {
        if (!this.isInCentralEclipse()) {
            return null;
        }

        return getInstantaneousUmbraOutline(this.elements, this.tau, horizonSinAltitude(options));
    }

    public getMagnitude(): number {
        return getMagnitude(this.circumstances);
    }

    public getObscuration(): number {
        return getObscuration(this.circumstances);
    }

    public getTopocentricHorizontalCoordinates(): LocalHorizontalCoordinates {
        return getLocalHorizontalCoordinates(this.circumstances, this.location);
    }

    public getApparentTopocentricHorizontalCoordinates(): LocalHorizontalCoordinates {
        const {azimuth, altitude, radiusVector} = this.getTopocentricHorizontalCoordinates();

        return {
            azimuth: azimuth,
            altitude: correctEffectOfRefraction(altitude),
            radiusVector: radiusVector,
        };
    }
}
