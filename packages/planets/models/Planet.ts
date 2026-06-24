import {DEG, RAD} from '@app/constants/math';
import type {EclipticSphericalCoordinates, RectangularCoordinates} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import type {Vsop87} from '@app/types/Vsop87Types';
import {normalizeAngle} from '@app/utils/angle';
import {
    correctEffectOfAberration,
    correctEffectOfNutation,
    getLightTimeCorrectedJulianDay,
} from '@app/utils/apparentPositionCorrections';
import {
    rectangular2spherical,
    rectangularHeliocentric2rectangularGeocentric,
    spherical2rectangular,
} from '@app/utils/coordinateTransformation';
import {
    getAngularDiameter,
    getElongation,
    getIlluminatedFraction,
    getPhaseAngle,
    getPositionAngleOfBrightLimb,
    isWaxing,
} from '@app/utils/observation';
import {calculateVSOP87, calculateVSOP87Angle} from '@app/utils/vsop87';
import AstronomicalObject from '@package/core/models/models/AstronomicalObject';
import Earth from '@package/earth/models/Earth';
import type {PlanetConstructor} from '@package/planets/types/PlanetTypes';
import Sun from '@package/sun/models/Sun';
import TimeOfInterest from '@package/time/models/TimeOfInterest';

export default abstract class Planet extends AstronomicalObject {
    protected readonly earth: Earth;

    protected readonly sun: Sun;

    protected constructor(
        toi: TimeOfInterest | undefined,
        name: string,
        private readonly diameterKm: number,
        earth: Earth | undefined,
        sun: Sun | undefined,
        protected readonly vsop87Date: Vsop87,
        protected readonly vsop87J2000: Vsop87,
    ) {
        super(toi, name);

        this.earth = earth ?? Earth.create(toi);
        this.sun = sun ?? new Sun(toi, this.earth);
    }

    public getDiameter(): number {
        return this.diameterKm;
    }

    public getHeliocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return spherical2rectangular(this.getHeliocentricEclipticSphericalJ2000Coordinates());
    }

    public getHeliocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        return spherical2rectangular(this.getHeliocentricEclipticSphericalDateCoordinates());
    }

    public getHeliocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return this.getHeliocentricEclipticSphericalCoordinates(this.vsop87J2000);
    }

    public getHeliocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        return this.getHeliocentricEclipticSphericalCoordinates(this.vsop87Date);
    }

    public getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        const coordsPlanet = this.getHeliocentricEclipticRectangularJ2000Coordinates();
        const coordsEarth = this.earth.getHeliocentricEclipticRectangularJ2000Coordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        const coordsPlanet = this.getHeliocentricEclipticRectangularDateCoordinates();
        const coordsEarth = this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return rectangular2spherical(this.getGeocentricEclipticRectangularJ2000Coordinates());
    }

    public getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        return rectangular2spherical(this.getGeocentricEclipticRectangularDateCoordinates());
    }

    public getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates {
        let coords = this.getLightTimeCorrectedEclipticSphericalCoordinates();

        coords = correctEffectOfAberration(coords, this.T);
        coords = correctEffectOfNutation(coords, this.T);

        return coords;
    }

    public getAngularDiameter(): number {
        return getAngularDiameter(this.getApparentDistanceToEarth(), this.diameterKm);
    }

    public getTopocentricAngularDiameter(location: Location): number {
        return getAngularDiameter(this.getTopocentricDistanceToEarth(location), this.diameterKm);
    }

    public getElongation(): number {
        const coordsPlanet = this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getElongation(coordsPlanet, coordsSun);
    }

    public getTopocentricElongation(location: Location): number {
        const coordsPlanet = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getElongation(coordsPlanet, coordsSun);
    }

    public getPhaseAngle(): number {
        const coordsPlanet = this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPhaseAngle(coordsPlanet, coordsSun);
    }

    public getTopocentricPhaseAngle(location: Location): number {
        const coordsPlanet = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPhaseAngle(coordsPlanet, coordsSun);
    }

    public getIlluminatedFraction(): number {
        return getIlluminatedFraction(this.getPhaseAngle());
    }

    public getTopocentricIlluminatedFraction(location: Location): number {
        return getIlluminatedFraction(this.getTopocentricPhaseAngle(location));
    }

    public getPositionAngleOfBrightLimb(): number {
        const coordsPlanet = this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPositionAngleOfBrightLimb(coordsPlanet, coordsSun);
    }

    public getTopocentricPositionAngleOfBrightLimb(location: Location): number {
        const coordsPlanet = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPositionAngleOfBrightLimb(coordsPlanet, coordsSun);
    }

    public isWaxing(): boolean {
        return isWaxing(this.getPositionAngleOfBrightLimb());
    }

    public isTopocentricWaxing(location: Location): boolean {
        return isWaxing(this.getTopocentricPositionAngleOfBrightLimb(location));
    }

    public getApparentMagnitude(): number {
        const coordsHelio = this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = this.getGeocentricEclipticSphericalDateCoordinates();
        const phaseAngle = this.getPhaseAngle();

        return this.calculateApparentMagnitude(coordsHelio.radiusVector, coordsGeo.radiusVector, phaseAngle);
    }

    public getTopocentricApparentMagnitude(location: Location): number {
        const coordsHelio = this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const phaseAngle = this.getTopocentricPhaseAngle(location);

        return this.calculateApparentMagnitude(coordsHelio.radiusVector, coordsGeo.radiusVector, phaseAngle);
    }

    protected abstract calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number,
    ): number;

    protected getSaturnRingInclination(): number {
        const {lon, lat} = this.getApparentGeocentricEclipticSphericalCoordinates();
        const iRad = (28.075216 - 0.012998 * this.T + 0.000004 * this.T ** 2) * DEG;
        const omegaRad = normalizeAngle(169.50847 + 1.394681 * this.T + 0.000412 * this.T ** 2) * DEG;
        const lonRad = lon * DEG;
        const latRad = lat * DEG;

        return (
            Math.asin(
                Math.sin(iRad) * Math.cos(latRad) * Math.sin(lonRad - omegaRad) - Math.cos(iRad) * Math.sin(latRad),
            ) * RAD
        );
    }

    private getHeliocentricEclipticSphericalCoordinates(vsop87: Vsop87): EclipticSphericalCoordinates {
        return {
            lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
            lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
            radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
        };
    }

    private getLightTimeCorrectedEclipticSphericalCoordinates(): EclipticSphericalCoordinates {
        const {radiusVector} = this.getGeocentricEclipticSphericalDateCoordinates();
        const toi = TimeOfInterest.fromJulianDay(getLightTimeCorrectedJulianDay(this.jd, radiusVector));
        const PlanetClass = this.constructor as PlanetConstructor;
        const planet = new PlanetClass(toi, this.earth, this.sun, this.vsop87Date, this.vsop87J2000);
        const coordsPlanet = planet.getHeliocentricEclipticRectangularDateCoordinates();
        const coordsEarth = this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth));
    }
}
