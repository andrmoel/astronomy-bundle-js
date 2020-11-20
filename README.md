# Astronomy Bundle

This library provides tools and methods for astronomical calculations.
With this bundle it is possible to calculate the position of moon, sun and planets and several coordinate systems.
For a higher accuracy, several corrections, like nutation and precision, were taken into account.
It is also possible to calculate rise, set and culmination events for celestial objects.
For a detailed see the table of contents.

Most of the calculations base on Jean Meeus 'Astronomical Algorithms' book and the VSOP87 theory.

## Table of Contents  
1.  [Installation](#installation)
2. [Angle Utils](#angle-utils)
3. [Time of Interest](#toi)
    1. [Create Time Of Interest](#create-time-of-interest)
    2. [Calendar methods](#time-of-interest-calendar)
    3. [Julian Day, Centuries and Millennia](#time-of-interest-jd)
    3. [Greenwich and Local Sidereal Time](#time-of-interest-gmst)
    3. [Delta T](#time-of-interest-deltat)
4. [Astronomical Objects](#astronomical-objects)
5. [Earth](#earth)
    1. [Position of the Earth](#earth-position)
    2. [Nutation in Longitude and Obliquity](#earth-nutation)
    3. [Obliquity of Ecliptic](#earth-obliquity-of-ecliptic)
6. [Sun](#sun)
    1. [Position of the Sun](#sun-position)
    2. [Distance to Earth and Diameter](#sun-distance-diameter)
    3. [Sunrise, Sunset and Transit](#sun-rise-set)
7. [Moon](#moon)
    1. [Position of the Moon](#moon-position)
    2. [Distance to Earth and Diameter](#moon-distance-diameter)
    3. [Moonrise, Moonset and Transit](#moon-rise-set)
    3. [Phases](#moon-phases)
    4. [Apparent Magnitude](#moon-magnitude)
8. [Planets](#planets)
    1. [Position of Planets](#planets-position)
    2. [Distance to Earth and Diameter](#planets-distance-diameter)
    3. [Phases](#planets-phases)
    4. [Apparent Magnitude](#planets-magnitude)
    5. [Conjunction](#planets-conjunction)
9. [Solar Eclipse](#solar-eclipse)

## <a name="installation"></a>Installation

You can install the astronomy-bundle using npm:
```
npm i astronomy-bundle
```
or yarn:

```
yarn add astronomy-bundle
```

## <a name="angle-utils"></a> Angle Utils

The angle util provides helper methods to convert an angle into different formats.

**Example 1**: Convert decimal angle

```javascript
import {angleCalc} from 'astronomy-bundle/utils';

const angleInDeg = 132.6029282;

const angleStr = angleCalc.deg2angle(angleInDeg);
const timeStr = angleCalc.deg2time(angleInDeg);
```

The result of the calculation should be:\
*Angle: 132° 36' 10.542"*\
*Time: 8h 50m 24.703s*

**Example 2**: Convert time into decimal format

```javascript
import {angleCalc} from 'astronomy-bundle/utils';

const timeStr = '8h 50m 24.703s';

const angleInDeg = angleCalc.time2deg(timeStr);
```

The result of the calculation should be:\
*Angle: 132.602929°*

## <a name="toi"></a> Time of Interest

The TimeOfInterest (TOI) object represents the time for which all the astronomical calculations are done.
For that reason it is the **most important object** in this library.

### <a name="create-time-of-interest"></a> Create the TimeOfInterest object

There are several ways to initialize the TOI object.

**Example 1**: Initialize the TimeOfInterest object for the date 02 July 2017 at 15:30:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';

// Create from time
const toi = createTimeOfInterest.fromTime(2017, 7, 2, 15, 30, 0);

// Create from Date object
const date = new Date('2017-07-02 15:30:00');
const toi = createTimeOfInterest.fromDate(date);

// Create from Julian Day
const jd = 2457937.1458333;
const toi = createTimeOfInterest.fromJulianDay(jd);

// Create from Julian Centuries since J2000
const T = 0.17500741501255;
const toi = createTimeOfInterest.fromJulianCenturiesJ2000(T);
```

The result will be always: *2017-07-02 15:30:00*

**Example 2**: Create the TOI object for the **current date and time in UTC**

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';

const toi = createTimeOfInterest.fromCurrentTime();
```

### <a name="time-of-interest-calendar"></a> Calendar methods

Legend for day of the week:

| Value | Day of week |
| ----- | ----------- |
| 0     | Sunday      |
| 1     | Monday      |
| 2     | Tuesday     |
| 3     | Wednesday   |
| 4     | Thursday    |
| 5     | Friday      |
| 6     | Saturday    |

**Example**: Get day of year, day of week and leap year for 02 July 2017 at 13:37 UTC 

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';

const toi = createTimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

const dayOfYear = toi.getDayOfYear();
const dayOfWeek = toi.getDayOfWeek();
const isLeapYear = toi.isLeapYear();
```

The result of the calculation should be:\
Day of year: *183*\
Day of week: *0 (Sunday)*\
Is leap year: *false*

### <a name="time-of-interest-jd"></a> Julian Day, Julian Centuries and Julian Millennia

**Example**: Get Julian Day, Julian Centuries and Julian Millennia for 02 July 2017 at 13:37 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';

const toi = createTimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

const jd = toi.getJulianDay();
const jd0 = toi.getJulianDay0();
const T = toi.getJulianCenturiesJ2000();
const t = toi.getJulianMillenniaJ2000();
```

The result of the calculation should be:\
Julian Day: *2457937.0673611*\
Julian Day 0: *2457936.5*\
Julian Centuries J2000: *0.1750052666*\
Julian Millennia J2000: *0.0175005267*

### <a name="time-of-interest-gmst"></a> Greenwich Sidereal Time and Local Sidereal Time

**Example 1**: Get Greenwich Sidereal Time for 02 July 2017 at 13:37 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';

const toi = createTimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

const GMST = toi.getGreenwichMeanSiderealTime();
const GAST = toi.getGreenwichApparentSiderealTime();

// To express the angle in time format use angleCalc.deg2time(GMST)
```

The result of the calculation should be:\
GMST: *5h 44m 46.48s*\
GAST: *5h 44m 45.47s*

**Example 2**: Get Local Sidereal Time for 02 July 2017 at 13:37 UTC in Berlin, Germany

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createLocation} from 'astronomy-bundle/earth';

const toi = createTimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);
const location = createLocation(52.52, 13.41);

const LMST = toi.getLocalMeanSiderealTime(location);
const LAST = toi.getLocalApparentSiderealTime(location);

// To express the angle in time format use angleCalc.deg2time(LMST)
```

The result of the calculation should be:\
LMST: *9h 13m 46.798s*\
LAST: *9h 13m 46.232s*

### <a name="time-of-interest-deltat"></a> Delta T

**Example**: Get Delta T for 20 May 2000 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';

const toi = createTimeOfInterest.fromTime(2000, 5, 20, 0, 0, 0);

const deltaT = toi.getDeltaT();
```

The result of the calculation should be:\
Delta T: *64*

## <a name="astronomical-objects"></a> Astronomical Objects

An astronomical object should be initialized with the TOI. If you don't pass the TOI in the constructor, the
**current** time is chosen.

**Example 1**: Create an astronomical object with TOI

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromCurrentTime();

const moon = createMoon(toi);
```

**Example 2**: Create an astronomical object without TOI. The chosen TOI corresponds to the current time

```javascript
import {createMoon} from 'astronomy-bundle/moon';

const moon = createMoon();
```

## <a name="earth"></a> Earth

This library uses the VSOP87 theory to calculate precise planetary positions.
Each calculation uses terms with a heavy file size of several kilobytes.
For that reason all VSOP87 calculations will **load asynchronous** and only when they are used.
All coordinate methods do return a **Promise**.

### <a name="earth-position"></a> Position of the Earth

**Example**: Calculate the heliocentric position (J2000) of the Earth for 10 December 2017 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createEarth} from 'astronomy-bundle/earth';

const toi = createTimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = createEarth(toi);

const {x, y, z} = await earth.getHeliocentricEclipticRectangularJ2000Coordinates();
const {lon, lat, radiusVector} = await earth.getHeliocentricEclipticSphericalJ2000Coordinates();
```

The result of the calculation should be:\
\
x: *0.2070104*\
y: *0.96282379*\
z: *-0.00004247*\
\
Longitude: *77° 51' 57.357"*\
Latitude: *-0° 00' 08.895"*\
Radius Vector: *0.98482636*\

### <a name="earth-nutation"></a> Nutation in Longitude and Obliquity

**Example**: Get nutation in Longitude and Obliquity for 01 August 2020 at 16:51:54 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createEarth} from 'astronomy-bundle/earth';

const toi = createTimeOfInterest.fromTime(2020, 8, 1, 16, 51, 54);
const earth = createEarth(toi);

const phi = earth.getNutationInLongitude();
const e = earth.getNutationInObliquity();

// To express the angle in string format use angleCalc.deg2angle(p)
```

The result of the calculation should be:\
\
Nutation in Longitude: *-0° 00' 15.807"*\
Nutation in Obliquity: *0° 00' 00.395"*

### <a name="earth-obliquity-of-ecliptic"></a> Obliquity of Ecliptic

**Example**: Get Mean and True Obliquity of Ecliptic for 01 August 2020 at 16:51:54 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createEarth} from 'astronomy-bundle/earth';

const toi = createTimeOfInterest.fromTime(2020, 8, 1, 16, 51, 54);
const earth = createEarth(toi);

const eps0 = earth.getMeanObliquityOfEcliptic();
const eps = earth.getTrueObliquityOfEcliptic();

// To express the angle in string format use angleCalc.deg2angle(eps)
```

The result of the calculation should be:\
\
Mean Obliquity of Ecliptic: *23° 26' 11.813"*\
True Obliquity of Ecliptic: *23° 26' 12.208"*

## <a name="sun"></a> Sun

This library uses the VSOP87 theory to calculate precise planetary positions.
Each calculation uses terms with a heavy file size of several kilobytes.
For that reason all VSOP87 calculations will **load asynchronous** and only when they are used.
All coordinate methods do return a **Promise**.

### <a name="sun-position"></a> Position of the Sun

**Example**: Get the position of the Sun (Date) for 10 October 2020 at 06:15 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createSun} from 'astronomy-bundle/sun';

const toi = createTimeOfInterest.fromTime(2020, 10, 10, 6, 15, 0);
const sun = createSun(toi);

const geoEclCoords = await sun.getGeocentricEclipticSphericalDateCoordinates();
const geoAppEquCoords = await sun.getApparentGeocentricEquatorialSphericalCoordinates()
```

The result should be:\
\
Longitude: *209.31555315°*\
Latitude: *-0.00014017°*\
Radius Vector: *0.99514386*\
\
Right Ascension: *207.25282342°*\
Declination: *-11.22796087°*\
Right Ascension: *0.99514386*\

### <a name="sun-distance-diameter"></a> Distance to Earth and diameter of the Sun

**Example 1**: Get distance and diameter of the sun for the current date and time

```javascript
import {createSun} from 'astronomy-bundle/sun';

const sun = createSun();

const distance = await sun.getDistanceToEarth();
const delta = await sun.getAngularDiameter();
```

The result should be:\
The distance is between 147.1 mio and 152.1 mio kilometers.\
The angular diameter is about 32'

**Example 2**: Get the distance and diameter of the Sun for 05 June 2017 at 20:30 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createSun} from 'astronomy-bundle/createSun';

const toi = createTimeOfInterest.fromTime(2017, 6, 5, 20, 30, 0);
const sun = createSun(toi);

const distance = await sun.getDistanceToEarth();
const delta = await sun.getAngularDiameter();
```

The result should be:\
\
Distance: *151797423.98 km*\
Diameter: *0° 31' 32.43"*

### <a name="sun-rise-set"></a> Sunrise, Sunset and Transit

The used standard altitude for sunset and sunrise is -0.833 which refers to the upper limb of the sun
and considers the effect of atmospheric refraction.

**Example**: Get the rise, set and transit of the Sun on 20. November 2020 in Berlin, Germany

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createSun} from 'astronomy-bundle/sun';

const location = {
    lat: 52.519,
    lon: 13.408,
};

const toi = createTimeOfInterest.fromTime(2020, 11, 20, 0, 0, 0);
const sun = createSun(toi);

const toiRise = await sun.getRise(location);
const toiTransit = await sun.getTransit(location);
const toiSet = await sun.getSet(location);
```

The result should be:\
\
Sunrise: *06:37:31 UTC*\
Transit: *11:52:04 UTC*\
Sunset: *15:06:07 UTC*

## <a name="moon"></a> Moon

This library uses the VSOP87 theory to calculate precise planetary positions.
Each calculation uses terms with a heavy file size of several kilobytes.
For that reason all VSOP87 calculations will **load asynchronous** and only when they are used.
All coordinate methods do return a **Promise**.

### <a name="moon-position"></a> Position of the Moon

**Example 1**: Calculate the geocentric position of the Moon for 12 April 1992 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = createMoon(toi);

const {x, y, z} = await moon.getGeocentricEclipticRectangularDateCoordinates();
const {lon, lat, radiusVector} = await moon.getGeocentricEclipticSphericalDateCoordinates();
const {rightAscension, declination, radiusVector} = await moon.getGeocentricEquatorialSphericalDateCoordinates();
```

The result of the calculation should be:\
\
x: *-0.001682*\
y: *-0.001701*\
z: *0.000586*\
\
Longitude: *133.17°*\
Latitude: *-3.23°*\
Radius Vector: *0.002463*\
\
Right Ascension: *134.69°*\
Declination: *13.77°*\
Radius Vector: *0.002463*

### <a name="moon-distance-diameter"></a> Distance to earth and diameter

**Example 1**: Calculate the distance of the Moon in kilometers for the current time

```javascript
import {createMoon} from 'astronomy-bundle/moon';

const moon = createMoon();

const distance = await moon.getDistanceToEarth();
const delta = await moon.getAngularDiameter();
```

The result should be between 363300 km and 405500 km.\
The angular diameter is about 32'

**Example 2**: Get the distance of the Moon for 05 June 2017 at 20:30 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(2017, 6, 5, 20, 30, 0);
const moon = createMoon(toi);

const distance = await moon.getDistanceToEarth();
```

The result should be: *402937.61 km*

### <a name="moon-rise-set"></a> Moonrise, Moonset and Transit

The used standard altitude for moonset and moonrise is 0.125 which considers the effect of atmospheric refraction.

**Example**: Get the rise, set and transit of the Moon on 20. November 2020 in Berlin, Germany

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const location = {
    lat: 52.519,
    lon: 13.408,
};

const toi = createTimeOfInterest.fromTime(2020, 11, 20, 0, 0, 0);
const moon = createMoon(toi);

const toiRise = await moon.getRise(location);
const toiTransit = await moon.getTransit(location);
const toiSet = await moon.getSet(location);
```

The result should be:\
\
Moonrise: *12:02:52 UTC*\
Transit: *16:03:43 UTC*\
Moonset: *20:11:42 UTC*

### <a name="moon-phases"></a> Phases of the Moon

**Example 1**: Get the phase angle and illumination of the Moon for 12 April 1992 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = createMoon(toi);

const i = await moon.getPhaseAngle();
const k = await moon.getIlluminatedFraction();
```

The result of the calculation should be:\
Phase angle: *69.07545°*\
Illumination: *0.679 (67.9%)*

**Example 2**: Get upcoming first quarter and next full moon in November 2020

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(2020, 11, 1, 0, 0, 0);
const moon = createMoon(toi);

const toiUpcomingFirstQuarter = moon.getUpcomingFirstQuarter();
const toiUpcomingFullMoon = moon.getUpcomingFullMoon();
```

The result of the calculation should be:\
Upcoming first quarter: *2020-11-22 04:46:35 UTC*\
Upcoming full moon: *2020-11-30 09:31:22 UTC*

### <a name="moon-magnitude"></a> Apparent magnitude of the Moon

**Example**: Get the apparent Magnitude of the Moon for 07 November 2020 at 01:20 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(2020, 11, 7, 1, 20, 0);
const moon = createMoon(toi);

const V = await moon.getApparentMagnitude();
```

The result of the calculation should be: *-10.71m*

## <a name="planets"></a> Planets

This library uses the VSOP87 theory to calculate precise planetary positions.
Each calculation uses terms with a heavy file size of several kilobytes.
For that reason all VSOP87 calculations will **load asynchronous** and only when they are used.
All coordinate methods do return a **Promise**.

### <a name="planets-position"></a> Position of Planets

Each planet (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune) provides the following methods:

```javascript
getHeliocentricEclipticRectangularJ2000Coordinates()
getHeliocentricEclipticRectangularDateCoordinates()
getHeliocentricEclipticSphericalJ2000Coordinates()
getHeliocentricEclipticSphericalDateCoordinates()
getGeocentricEclipticRectangularJ2000Coordinates()
getGeocentricEclipticRectangularDateCoordinates()
getGeocentricEclipticSphericalJ2000Coordinates()
getGeocentricEclipticSphericalDateCoordinates()
getGeocentricEquatorialSphericalJ2000Coordinates()
getGeocentricEquatorialSphericalDateCoordinates()
getApparentGeocentricRectangularCoordinates()
getApparentGeocentricEclipticSphericalCoordinates()
getApparentGeocentricEquatorialSphericalCoordinates()
```

**Example 1**: Calculate the heliocentric position for equinox J2000 of Venus for 04 November 2020 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createVenus} from 'astronomy-bundle/planets';

const toi = createTimeOfInterest.fromTime(2020, 11, 4, 0, 0, 0);
const venus = createVenus(toi);

const coordsRec = await venus.getHeliocentricEclipticRectangularJ2000Coordinates();
const coordsSph = await venus.getHeliocentricEclipticSphericalJ2000Coordinates();
```
The result of the calculation should be:\
\
Heliocentric Rectangular (J2000)\
x: *-0.53523555*\
y: *0.477793213*\
z: *0.037443275*\
\
Heliocentric Spherical (J2000)\
Longitude: *138° 14' 43.437"*\
Latitude: *2° 59' 14.774"*\
Radius Vector: *0.71844655*\

**Example 2**: Calculate the geocentric position for current date of Jupiter for 04 November 2020 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createJupiter} from 'astronomy-bundle/planets';

const toi = createTimeOfInterest.fromTime(2020, 11, 4, 0, 0, 0);
const jupiter = createJupiter(toi);

const coordsRec = await jupiter.getGeocentricEclipticRectangularDateCoordinates();
const coordsSph = await jupiter.getGeocentricEclipticSphericalDateCoordinates();
```

The result of the calculation should be:\
\
Geocentric Rectangular\
x: *4.1719826*\
y: *1.966573890*\
z: *-0.101817535*\
\
Geocentric Spherical\
Longitude: *25° 14' 17.091"*\
Latitude: *-1° 15' 52.651"*\
Radius Vector: *4.613373871*

### <a name="planets-distance-diameter"></a> Distance to Earth and diameter

**Example**: Get the distance and diameter of Venus for 02 October 2008 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createVenus} from 'astronomy-bundle/planets';

const toi = createTimeOfInterest.fromTime(2008, 10, 2, 0, 0, 0);
const venus = createVenus(toi);

const d = await venus.getDistanceToEarth();
const delta = await venus.getAngularDiameter();
```

The result of the calculation should be:\
Distance to Earth: *206 930 461.4 km*\
Diameter: *0° 00' 12.065"*

### <a name="planets-phases"></a> Phases of a Planet

**Example**: Get the phase angle and illumination of the Mars for 20 Match 2019 at 02:55 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMars} from 'astronomy-bundle/planets';

const toi = createTimeOfInterest.fromTime(2019, 3, 20, 2, 55, 0);
const mars = createMars(toi);

const i = await mars.getPhaseAngle();
const k = await mars.getIlluminatedFraction();
```

The result of the calculation should be:\
Phase angle: *30.98°*\
Illumination: *0.929 (92.9%)*

### <a name="planets-conjunction"></a> Conjunction of two Planets

**Example 1**: Check if there is a conjunction between Jupiter and Saturn on 04 June 2018

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createJupiter, Saturn} from 'astronomy-bundle/planets';

const toi = createTimeOfInterest.fromTime(2018, 6, 4, 0, 0, 0);
const jupiter = createJupiter(toi);

const toiConjunction = await jupiter.getConjunctionInRightAscensionTo(Saturn);
```

This code will throw an error: *No conjunction possible for given objects at 2458273.5*

**Example 2**: Check if there is a conjunction between Jupiter and Saturn on 21 December 2020

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createJupiter, Saturn} from 'astronomy-bundle/planets';

const toi = createTimeOfInterest.fromTime(2020, 12, 21, 0, 0, 0);
const jupiter = createJupiter(toi);

const toiConjunction = await jupiter.getConjunctionInRightAscensionTo(Saturn); // Result is of type TimeOfInterest
```

Result of the calculation:\
*There is a conjunction on 21 December 2020 at 13:24 UTC*

## <a name="solar-eclipse"></a> Solar Eclipse

**Example 1**: Check if there is a Solar Eclipse on 15 January 2019

```javascript
import {solarEclipseExists} from 'astronomy-bundle/solarEclipse';

const toi = createTimeOfInterest.fromTime(2019, 1, 15, 0, 0, 0);
const exists = solarEclipseExists(toi);
```

Result of the calculation: *There is no solar eclipse*

**Example 2**: Check if there is a Solar Eclipse on 21 August 2017

```javascript
import {solarEclipseExists} from 'astronomy-bundle/solarEclipse';

const toi = createTimeOfInterest.fromTime(2017, 8, 21, 0, 0, 0);
const exists = solarEclipseExists(toi);
```

Result of the calculation: *Yes, there is a solar eclipse*
