import Satellite from './Satellite';

const TLE = `ISS (ZARYA)
1 25544U 98067A   26270.17419514  .00009528  00000-0  18291-3 0  9997
2 25544  51.6315 155.3455 0007168 193.0560 167.0244 15.48664528587561`;

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
