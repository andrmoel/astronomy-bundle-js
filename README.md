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
    2. [Calendar methods](#time-of-interest-calendar)
    3. [Julian Day, Centuries and Millennia](#time-of-interest-jd)
    3. [Greenwich and Local Sidereal Time](#time-of-interest-gmst)
    3. [Delta T](#time-of-interest-deltat)
4. [Astronomical Objects](#astronomical-objects)
    1. [Earth](#earth)
        1. [Nutation in Longitude and Obliquity](#earth-nutation)
        2. [Obliquity of Ecliptic](#earth-obliquity-of-ecliptic)
    2. [Sun](#sun)
        1. [Distance to Earth](#sun-distance-to-earth)
    3. [Moon](#moon)
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
*Angle: 132° 36' 10.542"*\
*Time: 8h 50m 24.703s*

**Example 2**: Convert time into decimal format

```javascript
import {angleCalc} from 'astronomy-bundle/utils';

const timeStr = '8h 50m 24.703s';

const angleInDeg = angleCalc.time2deg(timeStr);
```

The result of the calculation should be:\
*Angle: 132.6029292°*

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

### <a name="earth"></a> Earth

#### <a name="earth-nutation"></a> Nutation in Longitude and Obliquity

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
Nutation in Longitude: *-0° 0' 15.807"*\
Nutation in Obliquity: *0° 0' 0.395"*

#### <a name="earth-obliquity-of-ecliptic"></a> Obliquity of Ecliptic


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

### <a name="sun"></a> Sun

#### <a name="sun-distance-to-earth"></a> Distance of the sun to earth

**Example 1**: Get distance of the sun in kilometers

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

**Example 1**: Calculate the geocentric position of the moon for 12 April 1992 at 00:00 UTC

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
z: *0.000586*

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
