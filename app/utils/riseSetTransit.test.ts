import {LimbAlignment} from '@app/enums/limb';
import Location from '@package/location/models/Location';
import Sun from '@package/sun/models/Sun';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {type EquatorialCoordinatesProvider, getRise, getSet, getStandardAltitude, getTransit} from './riseSetTransit';

// Sun seen from Berlin (52.519°N, 13.408°E) on 2020 October 22.
// Reference times (UT) from a solar almanac: rise 05:46:44, transit 10:50:46, set 15:53:59.
const toi = TimeOfInterest.fromTime(2020, 10, 22, 0, 0, 0);
const jd0 = toi.getJulianDay0();
const berlin = Location.create(52.519, 13.408);
const sun = new Sun(toi);

// Apparent geocentric equatorial coordinates of the Sun at an arbitrary julian day,
// wired up exactly as AstronomicalObject.getRise/getSet/getTransit do it.
const getSunCoords: EquatorialCoordinatesProvider = (jd: number) =>
    new Sun(TimeOfInterest.fromJulianDay(jd)).getApparentGeocentricEquatorialSphericalCoordinates();

// Hour of the day (UT) of an event returned as a julian day.
const hourOfDay = (jd: number): number => (jd - jd0) * 24;

describe('getTransit', () => {
    it('computes the solar transit over Berlin', () => {
        const jd = getTransit(berlin, jd0, getSunCoords);

        // 10:50:46 UT
        expect(hourOfDay(jd)).toBeCloseTo(10.8461, 2);
    });
});

describe('getRise / getSet', () => {
    it('computes the sunrise over Berlin', () => {
        const jd = getRise(berlin, jd0, getStandardAltitude(), getSunCoords);

        // 05:46:44 UT
        expect(hourOfDay(jd)).toBeCloseTo(5.7789, 2);
    });

    it('computes the sunset over Berlin', () => {
        const jd = getSet(berlin, jd0, getStandardAltitude(), getSunCoords);

        // 15:53:59 UT
        expect(hourOfDay(jd)).toBeCloseTo(15.8997, 2);
    });

    it('applies the upper-limb standard altitude, giving an earlier sunrise', () => {
        const center = getRise(berlin, jd0, getStandardAltitude(), getSunCoords);
        const upperLimb = getRise(
            berlin,
            jd0,
            getStandardAltitude({alignment: LimbAlignment.UpperLimb}, sun.getAngularDiameter()),
            getSunCoords,
        );

        // 05:45:00 UT — the upper limb clears the horizon before the centre does.
        expect(hourOfDay(upperLimb)).toBeCloseTo(5.75, 2);
        expect(upperLimb).toBeLessThan(center);
    });

    it('throws when the Sun stays below the horizon all day (polar night)', () => {
        const northPole = Location.create(89, 0);
        const solstice = TimeOfInterest.fromTime(2020, 12, 21, 0, 0, 0);
        const jdSolstice = solstice.getJulianDay0();

        expect(() => getRise(northPole, jdSolstice, getStandardAltitude(), getSunCoords)).toThrow(/cannot rise/);
        expect(() => getSet(northPole, jdSolstice, getStandardAltitude(), getSunCoords)).toThrow(/cannot set/);
    });
});

describe('getStandardAltitude', () => {
    it('returns the mean horizontal refraction for a point source by default', () => {
        expect(getStandardAltitude()).toBeCloseTo(-0.5667, 10);
    });

    it('ignores refraction when disabled', () => {
        expect(getStandardAltitude({isRefractionConsidered: false})).toBeCloseTo(0, 10);
    });

    it('lowers the altitude by the semi-diameter for the upper limb', () => {
        const angularDiameter = 0.5;

        expect(getStandardAltitude({alignment: LimbAlignment.UpperLimb}, angularDiameter)).toBeCloseTo(-0.8167, 10);
    });

    it('raises the altitude by the semi-diameter for the lower limb', () => {
        const angularDiameter = 0.5;

        expect(getStandardAltitude({alignment: LimbAlignment.LowerLimb}, angularDiameter)).toBeCloseTo(-0.3167, 10);
    });

    it('omits refraction and applies the semi-diameter together', () => {
        expect(
            getStandardAltitude({isRefractionConsidered: false, alignment: LimbAlignment.UpperLimb}, 0.5),
        ).toBeCloseTo(-0.25, 10);
    });
});
