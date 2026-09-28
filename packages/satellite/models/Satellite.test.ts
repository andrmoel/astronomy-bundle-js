import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import Satellite from './Satellite';

const TLE = `ISS (ZARYA)
1 25544U 98067A   26270.17419514  .00009528  00000-0  18291-3 0  9997
2 25544  51.6315 155.3455 0007168 193.0560 167.0244 15.48664528587561`;

const TOI = TimeOfInterest.fromTime(2026, 9, 28, 14, 39, 0);

describe('fromTLE', () => {
    it('creates a satellite from a TLE', () => {
        const satellite = Satellite.fromTLE(TLE);

        expect(satellite).toBeInstanceOf(Satellite);
        expect(satellite.tle.name).toBe('ISS (ZARYA)');
        expect(satellite.tle.satelliteNumber).toBe(25544);
        expect(satellite.tle.epoch.jd).toBeCloseTo(2461310.67419514, 8);
        expect(satellite.tle.inclination).toBe(51.6315);
        expect(satellite.tle.meanMotion).toBe(15.48664528);
        expect(satellite.tle.revolutionNumber).toBe(58756);
    });

    it('throws on an invalid TLE', () => {
        expect(() => Satellite.fromTLE('ISS (ZARYA)')).toThrow();
    });
});

describe('getName', () => {
    it('returns the name from the TLE name line', () => {
        expect(Satellite.fromTLE(TLE).getName()).toBe('ISS (ZARYA)');
    });

    it('returns null for a TLE without a name line', () => {
        const twoLineTle = TLE.split('\n').slice(1).join('\n');

        expect(Satellite.fromTLE(twoLineTle).getName()).toBeNull();
    });
});

describe('position', () => {
    const satellite = Satellite.fromTLE(TLE);

    it('gets the geocentric equatorial rectangular coordinates', () => {
        const {x, y, z} = satellite.getGeocentricEquatorialRectangularCoordinates(TOI);

        expect(x).toBeCloseTo(-1957.968754, 5);
        expect(y).toBeCloseTo(-3744.080183, 5);
        expect(z).toBeCloseTo(5319.007488, 5);
    });

    it('gets the geocentric equatorial spherical coordinates', () => {
        const {rightAscension, declination, radiusVector} = satellite.getGeocentricEquatorialSphericalCoordinates(TOI);

        expect(rightAscension).toBeCloseTo(242.39477, 4);
        expect(declination).toBeCloseTo(51.53824, 5);
        expect(radiusVector).toBeCloseTo(6792.9094, 4);
    });

    it('gets the geographic location', () => {
        const location = satellite.getGeographicLocation(TOI);

        expect(location.lat).toBeCloseTo(51.71375, 4);
        expect(location.lon).toBeCloseTo(15.25535, 4);
        expect(location.elevation).toBeCloseTo(427907, -1);
        expect(location).toBeInstanceOf(Location);
    });

    it('gets the topocentric horizontal coordinates', () => {
        const location = {lat: 52.52, lon: 13.405, elevation: 34};
        const {azimuth, altitude, radiusVector} = satellite.getTopocentricHorizontalCoordinates(TOI, location);

        expect(azimuth).toBeCloseTo(124.5621, 3);
        expect(altitude).toBeCloseTo(68.7434, 3);
        expect(radiusVector).toBeCloseTo(456.947, 2);
    });

    it('propagates backwards before the TLE epoch', () => {
        const toi = TimeOfInterest.fromTime(2026, 9, 26, 0, 0, 0);
        const location = satellite.getGeographicLocation(toi);

        expect(location.elevation / 1000).toBeGreaterThan(400);
        expect(location.elevation / 1000).toBeLessThan(440);
    });
});
