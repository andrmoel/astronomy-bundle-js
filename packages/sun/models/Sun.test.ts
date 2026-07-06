import {LimbAlignment} from '@app/enums/limb';
import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Sun from './Sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const sun = new Sun(toi);

it('tests if name is correct', () => {
    expect(sun.name).toBe('sun');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const coords = sun.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(coords.x).toBe(0);
    expect(coords.y).toBe(0);
    expect(coords.z).toBe(0);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const coords = sun.getHeliocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBe(0);
    expect(coords.y).toBe(0);
    expect(coords.z).toBe(0);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = sun.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const coords = sun.getHeliocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBe(0);
    expect(coords.lat).toBe(0);
    expect(coords.radiusVector).toBe(0);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const coords = sun.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(coords.x).toBeCloseTo(-0.8701576662, 8);
    expect(coords.y).toBeCloseTo(-0.4828458132, 8);
    expect(coords.z).toBeCloseTo(0.0000252289, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const coords = sun.getGeocentricEclipticRectangularDateCoordinates();

    expect(coords.x).toBeCloseTo(-0.8676968359, 8);
    expect(coords.y).toBeCloseTo(-0.4872541891, 8);
    expect(coords.z).toBeCloseTo(-0.0000020213, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const coords = sun.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(coords.lon).toBeCloseTo(209.0256587691, 8);
    expect(coords.lat).toBeCloseTo(0.0014525597, 8);
    expect(coords.radiusVector).toBeCloseTo(0.9951454386, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const coords = sun.getGeocentricEclipticSphericalDateCoordinates();

    expect(coords.lon).toBeCloseTo(209.3163399365, 8);
    expect(coords.lat).toBeCloseTo(-0.0001163777, 8);
    expect(coords.radiusVector).toBeCloseTo(0.9951454385, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const coords = sun.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(coords.rightAscension).toBeCloseTo(206.981838961, 8);
    expect(coords.declination).toBeCloseTo(-11.1256268442, 8);
    expect(coords.radiusVector).toBeCloseTo(0.9951454386, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const coords = sun.getGeocentricEquatorialSphericalDateCoordinates();

    expect(coords.rightAscension).toBeCloseTo(207.2583867954, 8);
    expect(coords.declination).toBeCloseTo(-11.2299981126, 8);
    expect(coords.radiusVector).toBeCloseTo(0.9951454385, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = sun.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.867788303, 8);
    expect(y).toBeCloseTo(-0.4870912696, 8);
    expect(z).toBeCloseTo(-0.0000020213, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const coords = sun.getApparentGeocentricEclipticSphericalCoordinates();

    expect(coords.lon).toBeCloseTo(209.305582599, 8);
    expect(coords.lat).toBeCloseTo(-0.0001163775, 8);
    expect(coords.radiusVector).toBeCloseTo(0.9951454385, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const coords = sun.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(coords.rightAscension).toBeCloseTo(207.2481280116, 8);
    expect(coords.declination).toBeCloseTo(-11.226194451, 8);
    expect(coords.radiusVector).toBeCloseTo(0.9951454385, 8);
});

it('tests getTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        sun.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(207.24955223, 6);
    expect(declination).toBeCloseTo(-11.22820101, 6);
    expect(radiusVector).toBeCloseTo(0.99514284, 6);
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.50028545, 6);
    expect(altitude).toBeCloseTo(3.43081376, 6);
    expect(radiusVector).toBeCloseTo(0.99514284, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = sun.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(113.50028545, 6);
    expect(altitude).toBeCloseTo(3.64042028, 6);
    expect(radiusVector).toBeCloseTo(0.99514284, 6);
});

it('tests getDistanceToEarth', () => {
    const d = sun.getDistanceToEarth();

    expect(d).toBeCloseTo(148871638.637022, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = sun.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(148871638.637022, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = sun.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(148871249.40096, 6);
});
it('tests getTransit', () => {
    const toi = sun.getTransit(location);

    expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 10, min: 50, sec: 46});
});

describe('getGeometricRise', () => {
    it('tests the upper limb', () => {
        const toi = sun.getGeometricRise(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 48, sec: 56});
    });

    it('tests the center', () => {
        const toi = sun.getGeometricRise(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 50, sec: 47});
    });

    it('tests the lower limb', () => {
        const toi = sun.getGeometricRise(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 52, sec: 39});
    });
});

describe('getApparentRise', () => {
    it('tests the upper limb', () => {
        const toi = sun.getApparentRise(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 45, sec: 0});
    });

    it('tests the center', () => {
        const toi = sun.getApparentRise(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 46, sec: 51});
    });

    it('tests the lower limb', () => {
        const toi = sun.getApparentRise(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 5, min: 48, sec: 43});
    });
});

describe('getGeometricSet', () => {
    it('tests the upper limb', () => {
        const toi = sun.getGeometricSet(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 51, sec: 47});
    });

    it('tests the center', () => {
        const toi = sun.getGeometricSet(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 49, sec: 55});
    });

    it('tests the lower limb', () => {
        const toi = sun.getGeometricSet(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 48, sec: 4});
    });
});

describe('getApparentSet', () => {
    it('tests the upper limb', () => {
        const toi = sun.getApparentSet(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 55, sec: 42});
    });

    it('tests the center', () => {
        const toi = sun.getApparentSet(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 53, sec: 51});
    });

    it('tests the lower limb', () => {
        const toi = sun.getApparentSet(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 2020, month: 10, day: 22, hour: 15, min: 52, sec: 0});
    });
});

it('tests getLightTime', () => {
    const lt = sun.getLightTime();

    expect(sec2string(lt)).toBe('0h 8m 16.58s');
});

it('tests getAngularDiameter', () => {
    const delta = sun.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 07.8"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = sun.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 07.805"');
});

it('tests getApparentMagnitude', () => {
    const V = sun.getApparentMagnitude();

    expect(V).toBe(-26.74);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = sun.getTopocentricApparentMagnitude();

    expect(V).toBe(-26.74);
});
