import * as vsop87DateDefault from '@app/resources/vsop87/vsop87EarthSphericalDateReduced';
import * as vsop87J2000Default from '@app/resources/vsop87/vsop87EarthSphericalJ2000Reduced';
import type {EclipticSphericalCoordinates, RectangularCoordinates} from '@app/types/CoordinateTypes';
import type {Vsop87} from '@app/types/Vsop87Types';
import {normalizeAngle} from '@app/utils/angle';
import {spherical2rectangular} from '@app/utils/coordinateTransformation';
import * as earth from '@app/utils/earth';
import {calculateVSOP87, calculateVSOP87Angle} from '@app/utils/vsop87';
import AstronomicalObject from '@package/core/models/models/AstronomicalObject';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';

export default class Earth extends AstronomicalObject {
    public constructor(
        toi?: TimeOfInterest,
        private readonly vsop87Date: Vsop87 = vsop87DateDefault,
        private readonly vsop87J2000: Vsop87 = vsop87J2000Default,
    ) {
        super(toi, 'earth');
    }

    public static create(toi?: TimeOfInterest): Earth {
        return new Earth(toi);
    }

    public getHeliocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return spherical2rectangular(this.getHeliocentricEclipticSphericalJ2000Coordinates());
    }

    public getHeliocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        return spherical2rectangular(this.getHeliocentricEclipticSphericalDateCoordinates());
    }

    public getHeliocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return {
            lon: normalizeAngle(calculateVSOP87Angle(this.vsop87J2000.VSOP87_X, this.t)),
            lat: calculateVSOP87Angle(this.vsop87J2000.VSOP87_Y, this.t),
            radiusVector: calculateVSOP87(this.vsop87J2000.VSOP87_Z, this.t),
        };
    }

    public getHeliocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        return {
            lon: normalizeAngle(calculateVSOP87Angle(this.vsop87Date.VSOP87_X, this.t)),
            lat: calculateVSOP87Angle(this.vsop87Date.VSOP87_Y, this.t),
            radiusVector: calculateVSOP87(this.vsop87Date.VSOP87_Z, this.t),
        };
    }

    public getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return {x: 0, y: 0, z: 0};
    }

    public getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        return {x: 0, y: 0, z: 0};
    }

    public getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return {lon: 0, lat: 0, radiusVector: 0};
    }

    public getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        return {lon: 0, lat: 0, radiusVector: 0};
    }

    public getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates {
        return {lon: 0, lat: 0, radiusVector: 0};
    }

    public getNutationInLongitude(): number {
        return earth.getNutationInLongitude(this.T);
    }

    public getNutationInObliquity(): number {
        return earth.getNutationInObliquity(this.T);
    }

    public getMeanObliquityOfEcliptic(): number {
        return earth.getMeanObliquityOfEcliptic(this.T);
    }

    public getTrueObliquityOfEcliptic(): number {
        return earth.getTrueObliquityOfEcliptic(this.T);
    }
}
