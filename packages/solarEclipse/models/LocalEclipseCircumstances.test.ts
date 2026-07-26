import Location from '@package/location/models/Location';
import {LocalEclipseCircumstances, SolarEclipse} from '@package/solarEclipse';
import {LocalSolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import TimeOfInterest from '@package/time/models/TimeOfInterest';

// TSE 2027-08-02
const elements: BesselianElements = {
    t0Jde: 2461619.92211,
    t0Hours: 10,
    tMin: -3,
    tMax: 3,
    x: [-0.019772, 0.54471231, -0.0000446, -0.00000922],
    y: [0.160061, -0.2111582, -0.0001217, 0.00000376],
    d: [17.76247025, -0.010181, -0.000004],
    mu: [328.42254639, 15.00209999, 0],
    l1: [0.53059602, 0.0000138, -0.0000128],
    l2: [-0.015464, 0.0000137, -0.0000128],
    tanF1: 0.0046064,
    tanF2: 0.0045834,
    saros: 136,
};

// Jeddah
const location = Location.create(21.52854, 39.14387, 6);

const toiNoEclipse = TimeOfInterest.fromTime(2027, 8, 2, 8, 55, 50);
const toiPartial = TimeOfInterest.fromTime(2027, 8, 2, 10, 1, 5);
const toiTotal = TimeOfInterest.fromTime(2027, 8, 2, 10, 23, 13);

const circumstancesNoEclipse = LocalEclipseCircumstances.create(elements, location, toiNoEclipse);
const circumstancesPartial = LocalEclipseCircumstances.create(elements, location, toiPartial);
const circumstancesTotal = LocalEclipseCircumstances.create(elements, location, toiTotal);

describe('getType', () => {
    it('returns the eclipse type if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getEclipseType();

        expect(result).toBe(LocalSolarEclipseType.None);
    });

    it('returns the eclipse type if eclipse is in partial phase', () => {
        const result = circumstancesPartial.getEclipseType();

        expect(result).toBe(LocalSolarEclipseType.Partial);
    });

    it('returns the eclipse type if eclipse is in total phase', () => {
        const result = circumstancesTotal.getEclipseType();

        expect(result).toBe(LocalSolarEclipseType.Total);
    });

    it('returns the geometric eclipse type even when the Sun is below the horizon', () => {
        // ASE 2013-05-10
        const elements: BesselianElements = {
            t0Jde: 2456422.51829,
            t0Hours: 0,
            tMin: -3,
            tMax: 3,
            x: [-0.17518, 0.50528872, 0.0000144, -0.00000591],
            y: [-0.30430099, 0.0888899, -0.0000959, -9.7e-7],
            d: [17.60548019, 0.010701, -0.000004],
            mu: [180.9034729, 15.00166035, 0],
            l1: [0.56367201, 0.0000788, -0.00001],
            l2: [0.017447, 0.0000784, -0.00001],
            tanF1: 0.0046313,
            tanF2: 0.0046082,
            saros: 138,
        };
        const capeTown = Location.create(-33.9249, 18.4241, 25);
        const toi = TimeOfInterest.fromTime(2013, 5, 9, 23, 51, 8);
        const circumstances = LocalEclipseCircumstances.create(elements, capeTown, toi);

        expect(circumstances.getTopocentricHorizontalCoordinates().altitude).toBeLessThan(0);
        expect(circumstances.getEclipseType()).toBe(LocalSolarEclipseType.Partial);
    });
});

describe('isInEclipse', () => {
    it('returns false if eclipse has not started', () => {
        const result = circumstancesNoEclipse.isInEclipse();

        expect(result).toBe(false);
    });

    it('returns true if eclipse is in partial phase', () => {
        const result = circumstancesPartial.isInEclipse();

        expect(result).toBe(true);
    });

    it('returns true if eclipse is in total phase', () => {
        const result = circumstancesTotal.isInEclipse();

        expect(result).toBe(true);
    });
});

describe('isInCentralEclipse', () => {
    it('returns false if eclipse has not started', () => {
        const result = circumstancesNoEclipse.isInCentralEclipse();

        expect(result).toBe(false);
    });

    it('returns false if eclipse is in partial phase', () => {
        const result = circumstancesPartial.isInCentralEclipse();

        expect(result).toBe(false);
    });

    it('returns true if eclipse is in total phase', () => {
        const result = circumstancesTotal.isInCentralEclipse();

        expect(result).toBe(true);
    });
});

describe('getUmbraShadowOutline', () => {
    it('returns null if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getUmbraShadowOutline();

        expect(result).toBeNull();
    });

    it('returns null in the partial phase, when the location is outside the umbra', () => {
        const result = circumstancesPartial.getUmbraShadowOutline();

        expect(result).toBeNull();
    });

    it('returns the instantaneous umbra outline in the total phase', () => {
        const result = circumstancesTotal.getUmbraShadowOutline();

        expect(result).not.toBeNull();
        expect((result as Array<{lat: number; lon: number}>).length).toBeGreaterThanOrEqual(3);
    });

    it('returns an outline that encloses the observer at maximum eclipse', () => {
        const outline = circumstancesTotal.getUmbraShadowOutline() as Array<{lat: number; lon: number}>;

        const latitudes = outline.map((point) => point.lat);
        const longitudes = outline.map((point) => point.lon);

        expect(location.lat).toBeGreaterThan(Math.min(...latitudes));
        expect(location.lat).toBeLessThan(Math.max(...latitudes));
        expect(location.lon).toBeGreaterThan(Math.min(...longitudes));
        expect(location.lon).toBeLessThan(Math.max(...longitudes));
    });

    it('returns an enclosing outline when the refracted horizon is requested', () => {
        const outline = circumstancesTotal.getUmbraShadowOutline({refraction: true}) as Array<{
            lat: number;
            lon: number;
        }>;

        expect(outline).not.toBeNull();
        expect(outline.length).toBeGreaterThanOrEqual(3);

        const latitudes = outline.map((point) => point.lat);
        const longitudes = outline.map((point) => point.lon);

        expect(location.lat).toBeGreaterThan(Math.min(...latitudes));
        expect(location.lat).toBeLessThan(Math.max(...latitudes));
        expect(location.lon).toBeGreaterThan(Math.min(...longitudes));
        expect(location.lon).toBeLessThan(Math.max(...longitudes));
    });

    it('smooths the sunlit edge so the sunrise footprint has no large gaps', () => {
        const eclipse = SolarEclipse.createFromBesselianElements(elements);
        const sunrise = eclipse.getCentralLine()[0];
        const sunriseEclipse = eclipse.getLocalEclipse(Location.create(sunrise.lat, sunrise.lon, 0));
        const contacts = sunriseEclipse.getContactTimes();

        expect(contacts).not.toBeNull();
        if (contacts === null) {
            throw new Error('missing contact times for the sunrise location');
        }

        const outline = sunriseEclipse.getCircumstances(contacts.max).getUmbraShadowOutline() as Array<{
            lat: number;
            lon: number;
        }>;

        expect(outline).not.toBeNull();

        let maxChordDeg = 0;
        for (let i = 0; i < outline.length; i++) {
            const a = outline[i];
            const b = outline[(i + 1) % outline.length];
            let dLon = b.lon - a.lon;
            if (dLon > 180) {
                dLon -= 360;
            }
            if (dLon < -180) {
                dLon += 360;
            }
            dLon *= Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180);
            maxChordDeg = Math.max(maxChordDeg, Math.hypot(b.lat - a.lat, dLon));
        }

        expect(maxChordDeg).toBeLessThan(0.2);
    });
});

describe('getMagnitude', () => {
    it('returns magnitude if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getMagnitude();

        expect(result).toBeCloseTo(-0.0540031, 6);
    });

    it('returns magnitude if eclipse is in partial phase', () => {
        const result = circumstancesPartial.getMagnitude();

        expect(result).toBeCloseTo(0.7373132, 6);
    });

    it('returns magnitude if eclipse is in total phase', () => {
        const result = circumstancesTotal.getMagnitude();

        expect(result).toBeCloseTo(1.0115157, 6);
    });
});

describe('getObscuration', () => {
    it('returns obscuration if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getObscuration();

        expect(result).toBe(0);
    });

    it('returns obscuration if eclipse is in partial phase', () => {
        const result = circumstancesPartial.getObscuration();

        expect(result).toBeCloseTo(0.6843127, 6);
    });

    it('returns obscuration if eclipse is in total phase', () => {
        const result = circumstancesTotal.getObscuration();

        expect(result).toBe(1);
    });
});

describe('getTopocentricHorizontalCoordinates', () => {
    it('returns the geometric Sun horizontal coordinates in degrees at maximum eclipse', () => {
        const result = circumstancesTotal.getTopocentricHorizontalCoordinates();

        expect(result.azimuth).toBeCloseTo(255.664319, 6);
        expect(result.altitude).toBeCloseTo(76.861319, 6);
        expect(result.radiusVector).toBe(0);
    });
});

describe('getApparentTopocentricHorizontalCoordinates', () => {
    it('returns the refraction-corrected Sun horizontal coordinates in degrees at maximum eclipse', () => {
        const result = circumstancesTotal.getApparentTopocentricHorizontalCoordinates();

        expect(result.azimuth).toBeCloseTo(255.664319, 6);
        expect(result.altitude).toBeCloseTo(76.865248, 6);
        expect(result.radiusVector).toBe(0);
    });
});
