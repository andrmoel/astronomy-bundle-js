import {
    rectangular2spherical,
    rectangularHeliocentric2rectangularGeocentric,
    spherical2rectangular,
} from '../coordinates/calculations/coordinateCalc';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {EclipticSphericalCoordinates, RectangularCoordinates} from '../coordinates/types/CoordinateTypes';
import {observationCalc} from '../utils';
import {createSun} from '../sun';
import TimeOfInterest from '../time/TimeOfInterest';
import {createEarth} from '../earth';
import Earth from '../earth/Earth';
import Sun from '../sun/Sun';
import {
    correctEffectOfAberration,
    correctEffectOfNutation,
    getLightTimeCorrectedJulianDay,
} from '../coordinates/calculations/apparentCoordinateCalc';
import {createTimeOfInterest} from '../time';
import {getRise, getSet, getTransit} from '../utils/riseSetTransitCalc';
import {Location} from '../earth/types/LocationTypes';
import {STANDARD_ALTITUDE_PLANET_REFRACTION} from '../constants/standardAltitude';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {AstronomicalObjectConstructor} from '../astronomicalObject/interfaces/AstronomicalObjectInterfaces';
import {normalizeAngle} from '../utils/angleCalc';
import {calculateVSOP87, calculateVSOP87Angle} from './calculations/vsop87Calc';
import {Vsop87} from './types/Vsop87Types';
import IPlanet from './interfaces/IPlanet';
import Mercury from './Mercury';
import Venus from './Venus';
import Mars from './Mars';
import Jupiter from './Jupiter';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Neptune from './Neptune';

export default abstract class Planet extends AstronomicalObject implements IPlanet {
    private readonly sun: Sun;

    private readonly earth: Earth;

    protected constructor(
        protected readonly toi: TimeOfInterest = createTimeOfInterest.fromCurrentTime(),
        public readonly name = 'planet',
        protected useVsop87Short: boolean = false,
    ) {
        super(toi, name);

        this.sun = createSun(toi);
        this.earth = createEarth(toi);
    }

    public abstract get diameter(): number;

    protected abstract get vsop87J2000(): Promise<Vsop87>;

    protected abstract get vsop87Date(): Promise<Vsop87>;

    protected abstract get vsop87DateShort(): Promise<Vsop87>;

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation<EclipticSphericalCoordinates>(
            this.name + '_heliocentric_spherical_j2000',
            this.t,
            async () => {
                const vsop87 = await this.vsop87J2000;

                return {
                    lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                    lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                    radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
                };
            },
        );
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation<EclipticSphericalCoordinates>(
            this.name + '_heliocentric_spherical_date',
            this.t,
            async () => {
                const vsop87 = this.useVsop87Short ? await this.vsop87DateShort : await this.vsop87Date;

                return {
                    lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                    lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                    radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
                };
            },
        );
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, this.diameter);
    }

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const phaseAngle = await this.getPhaseAngle();

        return this.calculateApparentMagnitude(coordsHelio.radiusVector, coordsGeo.radiusVector, phaseAngle);
    }

    protected abstract calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number): number;

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getHeliocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(coords);
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getHeliocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricEclipticRectangularJ2000Coordinates();
        const coordsEarth = await this.earth.getHeliocentricEclipticRectangularJ2000Coordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricEclipticRectangularDateCoordinates();
        const coordsEarth = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticRectangularJ2000Coordinates();

        return rectangular2spherical(coords);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(coords);
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        let coords = await this.getLightTimeCorrectedEclipticSphericalCoordinates();

        coords = correctEffectOfAberration(coords, this.T);
        coords = correctEffectOfNutation(coords, this.T);

        return coords;
    }

    public async getTransit(location: Location): Promise<TimeOfInterest> {
        const jd = await getTransit(
            this.constructor as AstronomicalObjectConstructor,
            location,
            this.jd0,
        );

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getRise(location: Location): Promise<TimeOfInterest> {
        const jd = await getRise(
            this.constructor as AstronomicalObjectConstructor,
            location,
            this.jd0,
            STANDARD_ALTITUDE_PLANET_REFRACTION,
        );

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getSet(location: Location): Promise<TimeOfInterest> {
        const jd = await getSet(
            this.constructor as AstronomicalObjectConstructor,
            location,
            this.jd0,
            STANDARD_ALTITUDE_PLANET_REFRACTION,
        );

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getElongation(): Promise<number> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getElongation(coords, coordsSun);
    }

    public async getPhaseAngle(): Promise<number> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coords, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getPositionAngleOfBrightLimb(): Promise<number> {
        const coordsPlanet = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPositionAngleOfBrightLimb(coordsPlanet, coordsSun);
    }

    public async isWaxing(): Promise<boolean> {
        const chi = await this.getPositionAngleOfBrightLimb();

        return observationCalc.isWaxing(chi);
    }

    private async getLightTimeCorrectedEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        const {radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        const jd = getLightTimeCorrectedJulianDay(this.jd, radiusVector);
        const toi = createTimeOfInterest.fromJulianDay(jd);
        const planet = new (<
            typeof Mercury
            | typeof Venus
            | typeof Earth
            | typeof Mars
            | typeof Jupiter
            | typeof Saturn
            | typeof Uranus
            | typeof Neptune
            > this.constructor)(toi);

        const helRecEarthCoords = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();
        const helRecPlanetCoords = await planet.getHeliocentricEclipticRectangularDateCoordinates();

        const coords = rectangularHeliocentric2rectangularGeocentric(helRecPlanetCoords, helRecEarthCoords);

        return rectangular2spherical(coords);
    }
}
