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

    expect(x).toBeCloseTo(-0.92893, 6);
    expect(y).toBeCloseTo(-0.379271, 6);
    expect(z).toBeCloseTo(-0.000136, 6);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = moon.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(-0.92893, 6);
    expect(y).toBeCloseTo(-0.379271, 6);
    expect(z).toBeCloseTo(-0.000136, 6);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = moon.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(202.209606, 6);
    expect(lat).toBeCloseTo(-0.007769, 6);
    expect(radiusVector).toBeCloseTo(1.003374, 6);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = moon.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(202.209606, 6);
    expect(lat).toBeCloseTo(-0.007769, 6);
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

    expect(lon).toBeCloseTo(133.162655, 6);
    expect(lat).toBeCloseTo(-3.229126, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = moon.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(133.162655, 6);
    expect(lat).toBeCloseTo(-3.229126, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = moon.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(134.68392, 6);
    expect(declination).toBeCloseTo(13.769656, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = moon.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(134.68392, 6);
    expect(declination).toBeCloseTo(13.769656, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = moon.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(-0.00168211, 8);
    expect(y).toBeCloseTo(0.00179332, 8);
    expect(z).toBeCloseTo(-0.00013872, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = moon.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(133.167265, 6);
    expect(lat).toBeCloseTo(-3.229126, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = moon.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(134.688469, 6);
    expect(declination).toBeCloseTo(13.768367, 6);
    expect(radiusVector).toBeCloseTo(0.002463, 6);
});

it('tests getTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        moon.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(135.211802, 6);
    expect(declination).toBeCloseTo(13.079873, 6);
    expect(radiusVector).toBeCloseTo(0.002441, 6);
});

it('tests getTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = moon.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(108.968405, 6);
    expect(altitude).toBeCloseTo(30.91398, 6);
    expect(radiusVector).toBeCloseTo(0.002441, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = moon.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(108.968405, 6);
    expect(altitude).toBeCloseTo(30.94205, 6);
    expect(radiusVector).toBeCloseTo(0.002441, 6);
});

it('tests getDistanceToEarth', () => {
    const d = moon.getDistanceToEarth();

    expect(d).toBeCloseTo(368409.684816, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = moon.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(368409.684816, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = moon.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(365174.89477, 6);
});
//
// it('tests getTransit',  () => {
//     const toi =  moon.getTransit(location);
//
//     expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 3, min: 55, sec: 0});
// });
//
// it('tests getRise',  () => {
//     const toi =  moon.getRise(location);
//
//     expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 21, min: 45, sec: 30});
// });
//
// it('tests getSet',  () => {
//     const toi =  moon.getSet(location);
//
//     expect(toi.time).toEqual({year: 1992, month: 4, day: 12, hour: 11, min: 10, sec: 31});
// });

it('tests getLightTime', () => {
    const lt = moon.getLightTime();

    expect(sec2string(lt)).toBe('0h 0m 1.23s');
});

it('tests getAngularDiameter', () => {
    const delta = moon.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 25.453"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = moon.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 32\' 42.686"');
});

it('tests getElongation', () => {
    const phi = moon.getElongation();

    expect(phi).toBeCloseTo(110.792882, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = moon.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(111.462793, 6);
});

it('tests getPhaseAngle', () => {
    const i = moon.getPhaseAngle();

    expect(i).toBeCloseTo(69.075651, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = moon.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(68.407484, 6);
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

    expect(chi).toBeCloseTo(285.044, 3);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = moon.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(284.96, 3);
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

    expect(toiNewMoon.time).toEqual({year: 1992, month: 4, day: 3, hour: 5, min: 2, sec: 3});
});

it('tests getUpcomingFirstQuarter', () => {
    const toiFirstQuarter = moon.getUpcomingFirstQuarter();

    expect(toiFirstQuarter.time).toEqual({year: 1992, month: 4, day: 10, hour: 10, min: 6, sec: 42});
});

it('tests getUpcomingFullMoon', () => {
    const toiFullMoon = moon.getUpcomingFullMoon();

    expect(toiFullMoon.time).toEqual({year: 1992, month: 4, day: 17, hour: 4, min: 43, sec: 22});
});

it('tests getUpcomingLastQuarter', () => {
    const toiLastQuarter = moon.getUpcomingLastQuarter();

    expect(toiLastQuarter.time).toEqual({year: 1992, month: 4, day: 24, hour: 21, min: 40, sec: 37});
});
//
// it('tests getGeocentricLibration',  () => {
//     const {lon, lat} =  moon.getGeocentricLibration();
//
//     expect(lon).toBeCloseTo(-1.23121, 5);
//     expect(lat).toBeCloseTo(4.1998, 5);
// });
//
// it('tests getSelenographicLocationOfEarth',  () => {
//     const {lon, lat} =  moon.getSelenographicLocationOfEarth();
//
//     expect(lon).toBeCloseTo(-1.23121, 5);
//     expect(lat).toBeCloseTo(4.1998, 5);
// });
//
// it('tests getSelenographicLocationOfSun',  () => {
//     const {lon, lat} =  moon.getSelenographicLocationOfSun();
//
//     expect(lon).toBeCloseTo(67.89894, 5);
//     expect(lat).toBeCloseTo(1.4615, 5);
// });
//
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
