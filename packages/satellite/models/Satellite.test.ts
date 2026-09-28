import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import Satellite from './Satellite';

const TLE = `ISS (ZARYA)
1 25544U 98067A   26270.17419514  .00009528  00000-0  18291-3 0  9997
2 25544  51.6315 155.3455 0007168 193.0560 167.0244 15.48664528587561`;

const TOI = TimeOfInterest.fromTime(2026, 9, 28, 14, 39, 0);
const BERLIN = {lat: 52.52, lon: 13.405, elevation: 34};

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

describe('orbit', () => {
    const satellite = Satellite.fromTLE(TLE);

    it('gets the epoch age in days', () => {
        expect(satellite.getEpochAge(TOI)).toBeCloseTo(1.43622, 5);
    });

    it('gets the orbital period in minutes', () => {
        expect(satellite.getOrbitalPeriod()).toBeCloseTo(92.993697, 6);
    });

    it('gets the semi-major axis in km', () => {
        expect(satellite.getSemiMajorAxis()).toBeCloseTo(6799.27573, 5);
    });

    it('gets the apogee height in km', () => {
        expect(satellite.getApogeeHeight()).toBeCloseTo(426.01445, 5);
    });

    it('gets the perigee height in km', () => {
        expect(satellite.getPerigeeHeight()).toBeCloseTo(416.26701, 5);
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

    it('gets the geocentric equatorial rectangular velocity', () => {
        const {x, y, z} = satellite.getGeocentricEquatorialRectangularVelocity(TOI);

        expect(x).toBeCloseTo(6.620785, 6);
        expect(y).toBeCloseTo(-3.843407, 6);
        expect(z).toBeCloseTo(-0.274336, 6);
    });

    it('gets the speed', () => {
        expect(satellite.getSpeed(TOI)).toBeCloseTo(7.660406, 6);
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
        const {azimuth, altitude, radiusVector} = satellite.getTopocentricHorizontalCoordinates(TOI, BERLIN);

        expect(azimuth).toBeCloseTo(124.5621, 3);
        expect(altitude).toBeCloseTo(68.7434, 3);
        expect(radiusVector).toBeCloseTo(456.947, 2);
    });

    it('gets the range rate', () => {
        expect(satellite.getRangeRate(TOI, BERLIN)).toBeCloseTo(2.0983, 3);
    });

    it('gets the doppler shift', () => {
        expect(satellite.getDopplerShift(TOI, BERLIN, 437.8e6)).toBeCloseTo(-3064.3, 0);
    });

    it('propagates backwards before the TLE epoch', () => {
        const toi = TimeOfInterest.fromTime(2026, 9, 26, 0, 0, 0);
        const location = satellite.getGeographicLocation(toi);

        expect(location.elevation / 1000).toBeGreaterThan(400);
        expect(location.elevation / 1000).toBeLessThan(440);
    });
});

describe('ground track', () => {
    const satellite = Satellite.fromTLE(TLE);

    it('gets the sub-satellite points split at the antimeridian', () => {
        const end = TimeOfInterest.fromTime(2026, 9, 28, 16, 19, 0);
        const segments = satellite.getGroundTrack(TOI, end);
        const [first] = segments[0];
        const last = segments[1][segments[1].length - 1];

        expect(segments).toHaveLength(2);
        expect(segments[0]).toHaveLength(47);
        expect(segments[1]).toHaveLength(56);
        expect(first.lat).toBeCloseTo(51.71375, 4);
        expect(first.lon).toBeCloseTo(15.25535, 4);
        expect(segments[0][46].lon).toBe(180);
        expect(segments[1][0].lon).toBe(-180);
        expect(segments[1][0].lat).toBe(segments[0][46].lat);
        expect(last.lat).toBeCloseTo(satellite.getGeographicLocation(end).lat, 10);
    });

    it('uses the given step size', () => {
        const end = TimeOfInterest.fromTime(2026, 9, 28, 14, 49, 0);

        expect(satellite.getGroundTrack(TOI, end, 5)[0]).toHaveLength(3);
    });
});

describe('footprint', () => {
    const satellite = Satellite.fromTLE(TLE);

    it('gets the footprint around the sub-satellite point', () => {
        const footprint = satellite.getFootprint(TOI);

        expect(footprint).toHaveLength(72);
        expect(footprint[0].lat).toBeCloseTo(72.139, 3);
        expect(footprint[0].lon).toBeCloseTo(15.2554, 4);
        expect(footprint[36].lat).toBeCloseTo(31.2885, 4);
    });

    it('gets the footprint with a minimum altitude and number of points', () => {
        const footprint = satellite.getFootprint(TOI, 10, 8);

        expect(footprint).toHaveLength(8);
        expect(footprint[0].lat - 51.71375).toBeCloseTo(1407.914 / 6378.137 / (Math.PI / 180), 3);
    });

    it('gets the footprint radius in km', () => {
        expect(satellite.getFootprintRadius(TOI)).toBeCloseTo(2273.73, 2);
        expect(satellite.getFootprintRadius(TOI, 10)).toBeCloseTo(1407.91, 2);
    });
});

describe('illumination', () => {
    const satellite = Satellite.fromTLE(TLE);

    it('is sunlit before entering the Earth shadow', () => {
        expect(satellite.isSunlit(TimeOfInterest.fromTime(2026, 9, 28, 14, 50, 15))).toBe(true);
    });

    it('is not sunlit after entering the Earth shadow', () => {
        expect(satellite.isSunlit(TimeOfInterest.fromTime(2026, 9, 28, 14, 50, 30))).toBe(false);
    });

    it('is visible above the horizon in the dark sky while sunlit', () => {
        expect(satellite.isVisible(TimeOfInterest.fromTime(2026, 9, 28, 17, 50, 0), BERLIN)).toBe(true);
    });

    it('is not visible in daylight', () => {
        expect(satellite.isVisible(TOI, BERLIN)).toBe(false);
    });

    it('is not visible in the Earth shadow', () => {
        expect(satellite.isVisible(TimeOfInterest.fromTime(2026, 9, 28, 17, 57, 0), BERLIN)).toBe(false);
    });

    it('is not visible below the horizon', () => {
        expect(satellite.isVisible(TimeOfInterest.fromTime(2026, 9, 28, 17, 40, 0), BERLIN)).toBe(false);
    });
});
