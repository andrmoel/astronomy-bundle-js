# Astronomy Bundle

This library provides tools and methods for astronomical calculations.
With this bundle it is possible to calculate the position of moon, sun and planets and several coordinate systems.
For a higher accuracy, several corrections, like nutation and precision, were taken into account.
It is also possible to calculate rise, set and culmination events for celestial objects.
For a detailed see the table of contents.

Most of the calculations are based on Jean Meeus 'Astronomical Algorithms' book and the VSOP87 theory.

## Table of Contents  
1.  [Installation](#installation)
2. [Angle Utils](#angle-utils)
3. [Time of Interest](#toi)
    1. [Create Time Of Interest](#create-time-of-interest)
4. [Astronomical Objects](#astronomical-objects)
    1. [Sun](#sun)
        1. [Distance to Earth](#sun-distance-to-earth)
    2. [Moon](#moon)
        1. [Position of the Moon](#moon-position)
        2. [Distance to Earth](#moon-distance-to-earth)

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
*Angle: 132°36'10.542"*\
*Time: 8h50m24.703s*

**Example 2**: Convert time into decimal format

```javascript
import {angleCalc} from 'astronomy-bundle/utils';

const timeStr = '8h50m24.703s';

const angleInDeg = angleCalc.time2deg(timeStr);
```

The result of the calculation should be:\
*Angle: 132.60292916667°*

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

const toi = createTimeOfInterest();
const toi = createTimeOfInterest.fromCurrentTime();
```

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

### <a name="sun"></a> Sun

#### <a name="sun-distance-to-earth"></a> Distance of the sun to earth

**Example 1**: The current distance of the sun in kilometers can be calculated as follows:

```javascript
import {createSun} from 'astronomy-bundle/sun';

const sun = createSun();

const distance = sun.getDistanceToEarth();
```

The result should be between 147.1 mio and 152.1 mio kilometers.

**Example 2**: Get the distance of the sun for 05 June 2017 at 20:30 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createSun} from 'astronomy-bundle/createSun';

const toi = createTimeOfInterest.fromTime(2017, 6, 5, 20, 30, 0);
const sun = createSun(toi);

const distance = sun.getDistanceToEarth();
```

The result should be: *151797423.98 km*

### <a name="moon"></a> Moon

#### <a name="moon-position"></a> Position of the Moon

**Example 1**: Calculate the geocentric spherical position of the moon for 12 April 1992 at 00:00 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = createMoon(toi);

const {lon, lat, radiusVector} = moon.getGeocentricEclipticSphericalCoordinates();
const {rightAscension, declination, radiusVector} = moon.getGeocentricEquatorialSphericalCoordinates();
const {x, y, z} = moon.getGeocentricEquatorialRectangularCoordinates();
```

The result of the calculation should be:\
\
Longitude: *133.17°*\
Latitude: *-3.23°*\
Radius Vector: *0.002463*\
\
Right Ascension: *134.69°*\
Declination: *13.77°*\
Radius Vector: *0.002463*\
\
x: *-0.001682*\
y: *-0.001701*\
z: *0.000586*\

#### <a name="moon-distance-to-earth"></a> Distance of the moon to earth

**Example 1**: Calculate the distance of the moon in kilometers for the current time

```javascript
import {createMoon} from 'astronomy-bundle/moon';

const moon = createMoon();

const distance = moon.getDistanceToEarth();
```

The result should be between 363300 km and 405500 km.

**Example 2**: Get the distance of the moon on 05 June 2017 at 20:30 UTC

```javascript
import {createTimeOfInterest} from 'astronomy-bundle/time';
import {createMoon} from 'astronomy-bundle/moon';

const toi = createTimeOfInterest.fromTime(2017, 6, 5, 20, 30, 0);
const moon = createMoon(toi);

const distance = moon.getDistanceToEarth();
```

The result should be: *402937.61 km*
