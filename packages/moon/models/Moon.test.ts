import {LimbAlignment} from '@app/enums/limb';
import type {Location} from '@app/types/LocationTypes';
import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import Moon from './Moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);
const location: Location = {lat: 52.519, lon: -122.4108, elevation: 0};

it('tests if name is correct', () => {
    expect(moon.name).toBe('moon');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = moon.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.928927, 6);
    expect(y).toBeCloseTo(-0.379282, 6);
    expect(z).toBeCloseTo(-0.000136, 6);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = moon.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.928927, 6);
    expect(y).toBeCloseTo(-0.379282, 6);
    expect(z).toBeCloseTo(-0.000136, 6);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = moon.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(202.2102785, 6);
    expect(lat).toBeCloseTo(-0.007771, 6);
    expect(radiusVector).toBeCloseTo(1.003374, 6);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = moon.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(202.2102785, 6);
    expect(lat).toBeCloseTo(-0.007771, 6);
    expect(radiusVector).toBeCloseTo(1.003374, 6);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = moon.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(-0.001682, 6);
    expect(y).toBeCloseTo(0.001793, 6);
    expect(z).toBeCloseTo(-0.000139, 6);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = moon.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.001682, 6);
    expect(y).toBeCloseTo(0.001793, 6);
    expect(z).toBeCloseTo(-0.000139, 6);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = moon.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(133.1723389, 6);
    expect(lat).toBeCloseTo(-3.229784, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = moon.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(133.1723389, 6);
    expect(lat).toBeCloseTo(-3.229784, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = moon.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(134.6932863, 6);
    expect(declination).toBeCloseTo(13.7663155, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = moon.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(134.6932863, 6);
    expect(declination).toBeCloseTo(13.7663155, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = moon.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.0016824091, 8);
    expect(y).toBeCloseTo(0.0017930291, 8);
    expect(z).toBeCloseTo(-0.0001387477, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = moon.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(133.1769488, 6);
    expect(lat).toBeCloseTo(-3.229784, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = moon.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(134.697835, 6);
    expect(declination).toBeCloseTo(13.7650258, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        moon.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(135.2212175, 6);
    expect(declination).toBeCloseTo(13.0764829, 6);
    expect(radiusVector).toBeCloseTo(0.002441, 6);
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = moon.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(108.958629, 6);
    expect(altitude).toBeCloseTo(30.049598, 6);
    expect(radiusVector).toBeCloseTo(0.002441, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = moon.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(108.958629, 6);
    expect(altitude).toBeCloseTo(30.0786405, 6);
    expect(radiusVector).toBeCloseTo(0.002441, 6);
});

it('tests getDistanceToEarth', () => {
    const d = moon.getDistanceToEarth();

    expect(d).toBeCloseTo(368409.0068148, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = moon.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(368409.0068148, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = moon.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(365174.9952098, 6);
});
it('tests getTransit', () => {
    const toi = moon.getTransit(location);

    expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 3, min: 54, sec: 59});
});

describe('getGeometricRise', () => {
    it('tests the upper limb', () => {
        const toi = moon.getGeometricRise(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 49, sec: 49});
    });

    it('tests the center', () => {
        const toi = moon.getGeometricRise(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 51, sec: 45});
    });

    it('tests the lower limb', () => {
        const toi = moon.getGeometricRise(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 53, sec: 41});
    });
});

describe('getApparentRise', () => {
    it('tests the upper limb', () => {
        const toi = moon.getApparentRise(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 45, sec: 45});
    });

    it('tests the center', () => {
        const toi = moon.getApparentRise(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 47, sec: 41});
    });

    it('tests the lower limb', () => {
        const toi = moon.getApparentRise(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 49, sec: 38});
    });
});

describe('getGeometricSet', () => {
    it('tests the upper limb', () => {
        const toi = moon.getGeometricSet(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 6, sec: 12});
    });

    it('tests the center', () => {
        const toi = moon.getGeometricSet(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 4, sec: 18});
    });

    it('tests the lower limb', () => {
        const toi = moon.getGeometricSet(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 2, sec: 25});
    });
});

describe('getApparentSet', () => {
    it('tests the upper limb', () => {
        const toi = moon.getApparentSet(location, LimbAlignment.UpperLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 10, sec: 11});
    });

    it('tests the center', () => {
        const toi = moon.getApparentSet(location, LimbAlignment.Center);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 8, sec: 16});
    });

    it('tests the lower limb', () => {
        const toi = moon.getApparentSet(location, LimbAlignment.LowerLimb);

        expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 6, sec: 23});
    });
});

it('tests getLightTime', () => {
    const lt = moon.getLightTime();

    expect(sec2string(lt)).toBe('0h 0m 1.23s');
});

it('tests getAngularDiameter', () => {
    const delta = moon.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 25.456"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = moon.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 42.685"');
});

it('tests getElongation', () => {
    const phi = moon.getElongation();

    expect(phi).toBeCloseTo(110.8018707, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = moon.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(111.4718652, 6);
});

it('tests getPhaseAngle', () => {
    const i = moon.getPhaseAngle();

    expect(i).toBeCloseTo(69.0666704, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = moon.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(68.3984201, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = moon.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.679, 3);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = moon.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.684, 3);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = moon.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(285.046, 3);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = moon.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(284.962, 3);
});

it('tests isWaxing', () => {
    const isWaxing = moon.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = moon.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = moon.getApparentMagnitude();

    expect(V).toBeCloseTo(-11.04, 2);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = moon.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(-11.08, 2);
});

it('tests getUpcomingNewMoon', () => {
    const toiNewMoon = moon.getUpcomingNewMoon();

    expect(toiNewMoon.time).toEqual({year: 1992, month: 4, day: 3, hour: 5, min: 1, sec: 4});
});

it('tests getUpcomingFirstQuarter', () => {
    const toiFirstQuarter = moon.getUpcomingFirstQuarter();

    expect(toiFirstQuarter.time).toEqual({year: 1992, month: 4, day: 10, hour: 10, min: 5, sec: 44});
});

it('tests getUpcomingFullMoon', () => {
    const toiFullMoon = moon.getUpcomingFullMoon();

    expect(toiFullMoon.time).toEqual({year: 1992, month: 4, day: 17, hour: 4, min: 42, sec: 23});
});

it('tests getUpcomingLastQuarter', () => {
    const toiLastQuarter = moon.getUpcomingLastQuarter();

    expect(toiLastQuarter.time).toEqual({year: 1992, month: 4, day: 24, hour: 21, min: 39, sec: 38});
});

it('tests getSubEarthPoint', () => {
    const {lon, lat} = moon.getSubEarthPoint();

    expect(lon).toBeCloseTo(-1.2304599, 5);
    expect(lat).toBeCloseTo(4.2006657, 5);
});

it('tests getSubSolarPoint', () => {
    const {lon, lat} = moon.getSubSolarPoint();

    expect(lon).toBeCloseTo(67.8906527, 5);
    expect(lat).toBeCloseTo(1.4615208, 5);
});

it('tests getGeocentricLibration', () => {
    const {lon, lat} = moon.getGeocentricLibration();

    expect(lon).toBeCloseTo(-1.2050447, 5);
    expect(lat).toBeCloseTo(4.1948928, 5);
});

it('tests getGeocentricLibrationMagnitude', () => {
    const liberation = moon.getGeocentricLibrationMagnitude();

    expect(liberation).toBeCloseTo(4.3645456, 5);
});

it('tests getTopocentricLibration', () => {
    const {lon, lat} = moon.getTopocentricLibration(location);

    expect(lon).toBeCloseTo(-0.5522325, 5);
    expect(lat).toBeCloseTo(4.7320424, 5);
});

it('tests getTopocentricLibrationMagnitude', () => {
    const liberation = moon.getTopocentricLibrationMagnitude(location);

    expect(liberation).toBeCloseTo(4.7641564, 5);
});

it('tests getGeocentricPositionAngleOfAxis', () => {
    expect(moon.getGeocentricPositionAngleOfAxis()).toBeCloseTo(15.0870691, 5);
});

it('tests getTopocentricPositionAngleOfAxis', () => {
    expect(moon.getTopocentricPositionAngleOfAxis(location)).toBeCloseTo(15.2610057, 5);
});

// it('tests GoldenHandle', () => {
//     expect(moon.getGoldenHandle()).toBeInstanceOf(GoldenHandle);
// });
//
// it('tests getLunarX', () => {
//     expect(moon.getLunarX()).toBeInstanceOf(LunarX);
// });
//
// it('tests getLunarV', () => {
//     expect(moon.getLunarV()).toBeInstanceOf(LunarV);
// });
