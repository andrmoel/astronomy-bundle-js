import SolarEclipse from './SolarEclipse';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {BesselianElements} from '../types/BesselianElementTypes';

const minimalElements: BesselianElements = {
    t0Jde: 2457986.5,
    t0Hours: 18,
    tMin: -2,
    tMax: 2,
    deltaT: 69.1,
    x: [0.1, 0.5, 0, 0],
    y: [0.2, 0.3, 0, 0],
    d: [11.9, 0.01, 0, 0],
    mu: [89.0, 14.5, 0, 0],
    l1: [0.54, -0.0001, 0, 0],
    l2: [0.0, -0.0001, 0, 0],
    tanF1: 0.0046,
    tanF2: 0.0046,
};

describe('SolarEclipse.createFromDate', () => {
    it('returns a SolarEclipse instance for a valid eclipse date', () => {
        const eclipse = SolarEclipse.createFromDate('2017-08-21');
        expect(eclipse).toBeInstanceOf(SolarEclipse);
    });

    it('returns a SolarEclipse instance for another valid eclipse date', () => {
        const eclipse = SolarEclipse.createFromDate('2021-12-04');
        expect(eclipse).toBeInstanceOf(SolarEclipse);
    });

    it('throws for a date with no eclipse data', () => {
        expect(() => SolarEclipse.createFromDate('2017-08-22')).toThrow(
            'No solar eclipse data found for date 2017-08-22'
        );
    });

    it('throws for an arbitrary non-eclipse date', () => {
        expect(() => SolarEclipse.createFromDate('2000-01-01')).toThrow();
    });
});

describe('SolarEclipse.createFromToi', () => {
    it('returns a SolarEclipse instance for a TOI on an eclipse date', () => {
        const toi = TimeOfInterest.fromTime(2017, 8, 21, 0, 0, 0);
        const eclipse = SolarEclipse.createFromToi(toi);
        expect(eclipse).toBeInstanceOf(SolarEclipse);
    });

    it('returns a SolarEclipse instance for a TOI with time on an eclipse date', () => {
        const toi = TimeOfInterest.fromTime(2017, 8, 21, 18, 26, 40);
        const eclipse = SolarEclipse.createFromToi(toi);
        expect(eclipse).toBeInstanceOf(SolarEclipse);
    });

    it('throws for a TOI on a non-eclipse date', () => {
        const toi = TimeOfInterest.fromTime(2017, 8, 22, 0, 0, 0);
        expect(() => SolarEclipse.createFromToi(toi)).toThrow();
    });
});

describe('SolarEclipse.createFromBesselianElements', () => {
    it('returns a SolarEclipse instance from pre-parsed elements', () => {
        const eclipse = SolarEclipse.createFromBesselianElements(minimalElements);
        expect(eclipse).toBeInstanceOf(SolarEclipse);
    });

    it('does not throw for any BesselianElements value', () => {
        expect(() => SolarEclipse.createFromBesselianElements(minimalElements)).not.toThrow();
    });
});
