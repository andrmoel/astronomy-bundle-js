import {decimal2degreeMinutesSeconds} from '@app/utils/angle';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {sec2string} from '@package/time/utils/dateTime';
import {Saturn} from '../index.saturn.high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const saturn = Saturn.create(toi);
const location = Location.create(52.519, 13.408);

it('tests if name is correct', () => {
    expect(saturn.name).toBe('saturn');
});

it('tests getHeliocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.40855282081079, 8);
    expect(y).toBeCloseTo(6.5680470444713395, 8);
    expect(z).toBeCloseTo(-0.36912818333587394, 8);
});

it('tests getHeliocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getHeliocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.4085551407202, 8);
    expect(y).toBeCloseTo(6.568044896491665, 8);
    expect(z).toBeCloseTo(-0.3691282087002513, 8);
});

it('tests getHeliocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(45.70418182290745, 8);
    expect(lat).toBeCloseTo(-2.303493789438194, 8);
    expect(radiusVector).toBeCloseTo(9.183955947806124, 8);
});

it('tests getHeliocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getHeliocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(45.70416208941948, 8);
    expect(lat).toBeCloseTo(-2.303493926804434, 8);
    expect(radiusVector).toBeCloseTo(9.183956031495347, 8);
});

it('tests getGeocentricEclipticRectangularJ2000Coordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularJ2000Coordinates();

    expect(x).toBeCloseTo(6.577077819346477, 8);
    expect(y).toBeCloseTo(5.59926379732458, 8);
    expect(z).toBeCloseTo(-0.36912424774444347, 8);
});

it('tests getGeocentricEclipticRectangularDateCoordinates', () => {
    const {x, y, z} = saturn.getGeocentricEclipticRectangularDateCoordinates();

    expect(x).toBeCloseTo(6.577079819505526, 8);
    expect(y).toBeCloseTo(5.599261594139737, 8);
    expect(z).toBeCloseTo(-0.3691242701461585, 8);
});

it('tests getGeocentricEclipticSphericalJ2000Coordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalJ2000Coordinates();

    expect(lon).toBeCloseTo(40.4087482342524, 8);
    expect(lat).toBeCloseTo(-2.446996659921651, 8);
    expect(radiusVector).toBeCloseTo(8.64557461502947, 8);
});

it('tests getGeocentricEclipticSphericalDateCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getGeocentricEclipticSphericalDateCoordinates();

    expect(lon).toBeCloseTo(40.408728505922724, 8);
    expect(lat).toBeCloseTo(-2.4469967814183686, 8);
    expect(radiusVector).toBeCloseTo(8.645574710715653, 8);
});

it('tests getGeocentricEquatorialSphericalJ2000Coordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalJ2000Coordinates();

    expect(rightAscension).toBeCloseTo(38.77882806685711, 8);
    expect(declination).toBeCloseTo(12.616794259640262, 8);
    expect(radiusVector).toBeCloseTo(8.64557461502947, 8);
});

it('tests getGeocentricEquatorialSphericalDateCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getGeocentricEquatorialSphericalDateCoordinates();

    expect(rightAscension).toBeCloseTo(38.77880890481581, 8);
    expect(declination).toBeCloseTo(12.616788026881709, 8);
    expect(radiusVector).toBeCloseTo(8.645574710715653, 8);
});

it('tests getApparentGeocentricEclipticRectangularCoordinates', () => {
    const {x, y, z} = saturn.getApparentGeocentricEclipticRectangularCoordinates();

    expect(x).toBeCloseTo(6.577384035471913, 8);
    expect(y).toBeCloseTo(5.59895954184509, 8);
    expect(z).toBeCloseTo(-0.36916151681678155, 8);
});

it('tests getApparentGeocentricEclipticSphericalCoordinates', () => {
    const {lon, lat, radiusVector} = saturn.getApparentGeocentricEclipticSphericalCoordinates();

    expect(lon).toBeCloseTo(40.405894813873154, 8);
    expect(lat).toBeCloseTo(-2.4472332515733446, 8);
    expect(radiusVector).toBeCloseTo(8.64561211984423, 8);
});

it('tests getApparentGeocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} = saturn.getApparentGeocentricEquatorialSphericalCoordinates();

    expect(rightAscension).toBeCloseTo(38.776126221331936, 8);
    expect(declination).toBeCloseTo(12.615684560494962, 8);
    expect(radiusVector).toBeCloseTo(8.64561211984423, 8);
});

it('tests getApparentTopocentricEquatorialSphericalCoordinates', () => {
    const {rightAscension, declination, radiusVector} =
        saturn.getApparentTopocentricEquatorialSphericalCoordinates(location);

    expect(rightAscension).toBeCloseTo(38.77595600900008, 6);
    expect(declination).toBeCloseTo(12.615476758590598, 6);
    expect(radiusVector).toBeCloseTo(8.645598025567432, 6);
});

it('tests getApparentTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getApparentTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57559280242685, 6);
    expect(altitude).toBeCloseTo(19.33243552175324, 6);
    expect(radiusVector).toBeCloseTo(8.645598025567432, 6);
});

it('tests getRefractionCorrectedTopocentricHorizontalCoordinates', () => {
    const {azimuth, altitude, radiusVector} = saturn.getRefractionCorrectedTopocentricHorizontalCoordinates(location);

    expect(azimuth).toBeCloseTo(265.57559280242685, 6);
    expect(altitude).toBeCloseTo(19.3797744836793, 6);
    expect(radiusVector).toBeCloseTo(8.645598025567432, 6);
});

it('tests getDistanceToEarth', () => {
    const d = saturn.getDistanceToEarth();

    expect(d).toBeCloseTo(1293359567.7008302, 6);
});

it('tests getApparentDistanceToEarth', () => {
    const d = saturn.getApparentDistanceToEarth();

    expect(d).toBeCloseTo(1293365164.02681, 6);
});

it('tests getTopocentricDistanceToEarth', () => {
    const d = saturn.getTopocentricDistanceToEarth(location);

    expect(d).toBeCloseTo(1293363055.553012, 6);
});

it('tests getLightTime', () => {
    const lt = saturn.getLightTime();

    expect(sec2string(lt)).toBe('1h 11m 54.18s');
});

it('tests getAngularDiameter', () => {
    const delta = saturn.getAngularDiameter();

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 19.223"');
});

it('tests getTopocentricAngularDiameter', () => {
    const delta = saturn.getTopocentricAngularDiameter(location);

    expect(decimal2degreeMinutesSeconds(delta)).toBe('0° 00\' 19.223"');
});

it('tests getElongation', () => {
    const phi = saturn.getElongation();

    expect(phi).toBeCloseTo(120.51658859441211, 6);
});

it('tests getTopocentricElongation', () => {
    const phi = saturn.getTopocentricElongation(location);

    expect(phi).toBeCloseTo(120.51636259234166, 6);
});

it('tests getPhaseAngle', () => {
    const i = saturn.getPhaseAngle();

    expect(i).toBeCloseTo(5.292377045029405, 6);
});

it('tests getTopocentricPhaseAngle', () => {
    const i = saturn.getTopocentricPhaseAngle(location);

    expect(i).toBeCloseTo(5.292399313166191, 6);
});

it('tests getIlluminatedFraction', () => {
    const k = saturn.getIlluminatedFraction();

    expect(k).toBeCloseTo(0.997868489438928, 6);
});

it('tests getTopocentricIlluminatedFraction', () => {
    const k = saturn.getTopocentricIlluminatedFraction(location);

    expect(k).toBeCloseTo(0.9978684715146134, 6);
});

it('tests getPositionAngleOfBrightLimb', () => {
    const chi = saturn.getPositionAngleOfBrightLimb();

    expect(chi).toBeCloseTo(250.4752363825277, 6);
});

it('tests getTopocentricPositionAngleOfBrightLimb', () => {
    const chi = saturn.getTopocentricPositionAngleOfBrightLimb(location);

    expect(chi).toBeCloseTo(250.47511648663613, 6);
});

it('tests isWaxing', () => {
    const isWaxing = saturn.isWaxing();

    expect(isWaxing).toBeTruthy();
});

it('tests isTopocentricWaxing', () => {
    const isWaxing = saturn.isTopocentricWaxing(location);

    expect(isWaxing).toBeTruthy();
});

it('tests getApparentMagnitude', () => {
    const V = saturn.getApparentMagnitude();

    expect(V).toBeCloseTo(0.13507041418279486, 6);
});

it('tests getTopocentricApparentMagnitude', () => {
    const V = saturn.getTopocentricApparentMagnitude(location);

    expect(V).toBeCloseTo(0.13507724986556302, 6);
});
