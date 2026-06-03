# Time of Interest

The `time` package provides the `TimeOfInterest` (TOI) object — the central time representation used throughout the astronomy-bundle library. It wraps a UTC moment in time and exposes conversions to Julian Day, Julian Centuries/Millennia, Greenwich and Local Sidereal Time, Delta T, and common calendar calculations.

## Install

With npm: `npm install @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/core`

## API Reference

### Create the TimeOfInterest object

**Description:** The `TimeOfInterest` object is the entry point for all calculations in the library. It can be constructed from a calendar date, a JavaScript `Date`, a Julian Day, Julian Centuries, or the current UTC time.

There are several ways to initialize the TOI object.

**Example 1**: Initialize the TimeOfInterest object for the date 02 July 2017 at 15:30:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';

// Create from time
const toi = TimeOfInterest.fromTime(2017, 7, 2, 15, 30, 0);

// Create from Date object
const date = new Date('2017-07-02 15:30:00');
const toi = TimeOfInterest.fromDate(date);

// Create from Julian Day
const jd = 2457937.1458333;
const toi = TimeOfInterest.fromJulianDay(jd);

// Create from Julian Centuries since J2000
const T = 0.17500741501255;
const toi = TimeOfInterest.fromJulianCenturiesJ2000(T);
```

The result will be always: *2017-07-02 15:30:00*

**Example 2**: Create the TOI object for the **current date and time in UTC**

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromCurrentTime();
```

---

### Calendar methods

**Description:** These methods expose basic calendar information for the TOI's date, such as the day of the year, the day of the week, and whether the year is a leap year.

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
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

const dayOfYear = toi.getDayOfYear();
const dayOfWeek = toi.getDayOfWeek();
const isLeapYear = toi.isLeapYear();
```

The result of the calculation should be:\
Day of year: *183*\
Day of week: *0 (Sunday)*\
Is leap year: *false*

---

### Julian Day, Julian Centuries and Julian Millennia

**Description:** These methods convert the TOI to the continuous time scales used in astronomical formulas. Julian Day is a simple day count from a fixed epoch; Julian Centuries and Julian Millennia express elapsed time relative to J2000.0 (1 January 2000, 12:00 TT).

**Example**: Get Julian Day, Julian Centuries and Julian Millennia for 02 July 2017 at 13:37 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

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

---

### Greenwich Sidereal Time and Local Sidereal Time

**Description:** Sidereal time measures the rotation of the Earth relative to the stars rather than the Sun, and is essential for converting between equatorial and horizontal coordinates. Mean sidereal time ignores short-period nutation; apparent sidereal time includes it.

**Example 1**: Get Greenwich Sidereal Time for 02 July 2017 at 13:37 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

const GMST = toi.getGreenwichMeanSiderealTime();
const GAST = toi.getGreenwichApparentSiderealTime();

// To express the angle in time format use angleCalc.deg2time(GMST)
```

The result of the calculation should be:\
GMST: *5h 44m 46.48s*\
GAST: *5h 44m 45.47s*

**Example 2**: Get Local Sidereal Time for 02 July 2017 at 13:37 UTC in Berlin, Germany

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {createLocation} from 'astronomy-bundle/earth';

const toi = TimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);
const location = createLocation(52.52, 13.41);

const LMST = toi.getLocalMeanSiderealTime(location);
const LAST = toi.getLocalApparentSiderealTime(location);

// To express the angle in time format use angleCalc.deg2time(LMST)
```

The result of the calculation should be:\
LMST: *9h 13m 46.798s*\
LAST: *9h 13m 46.232s*

---

### Delta T

**Description:** Delta T (ΔT) is the difference between Terrestrial Time (TT) and Universal Time (UT1), accounting for the gradual slowing of Earth's rotation. It is required when high-precision calculations need to align dynamical time with observed time.

**Example**: Get Delta T for 20 May 2000 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromTime(2000, 5, 20, 0, 0, 0);

const deltaT = toi.getDeltaT();
```

The result of the calculation should be:\
Delta T: *64*
