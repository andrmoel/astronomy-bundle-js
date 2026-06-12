Part of the [Astronomy Bundle](../../README.md).

# Moon

The `moon` package provides the `Moon` object for computing the Moon's position as seen from Earth. Geocentric coordinates are derived from the Moon's mean orbital elements with corrections for the principal perturbations, and apparent coordinates apply nutation corrections. Topocentric results are exposed as apparent coordinates and, for horizontal altitude, as observed coordinates with atmospheric refraction applied. Observation quantities such as elongation, phase angle, illuminated fraction, and upcoming lunar phases are also available.

## Install

With npm: `npm install @astronomy-bundle/moon @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/moon @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/moon @astronomy-bundle/core`

## High precision

By default the `Moon` class uses the standard `Sun` and `Earth` models (VSOP87 reduced series). For maximum accuracy you can import from the `high-precision` entry point instead, which uses the full VSOP87 series for both the Sun and Earth:

```javascript
import {Moon} from '@astronomy-bundle/moon/high-precision';
```

> **⚠️ Warning:** The full VSOP87 series used by the high-precision variant contains significantly more terms than the reduced version. This results in a **~10x larger bundle size** and slower parse time. Only use this variant when the extra accuracy is required.

## API Reference

### Create the Moon object

**Description:** The `Moon` object represents the Moon at a specific point in time, given as a `TimeOfInterest`. If no TOI is provided it defaults to the current time.

**Example**: Create a Moon object for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';
// or for high precision:
// import {Moon} from '@astronomy-bundle/moon/high-precision';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);
```

---

### Geocentric ecliptic spherical coordinates

**Description:** These methods return the Moon's position as geocentric ecliptic spherical coordinates `{lon, lat, radiusVector}`. Longitude and latitude are in degrees; the radius vector (distance from Earth) is in astronomical units (AU). Two reference frames are available: J2000.0 (fixed equinox of year 2000) and the ecliptic of the date. For the Moon these two frames return identical values.

**Example**: Get geocentric ecliptic spherical coordinates for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);

const coordsJ2000 = moon.getGeocentricEclipticSphericalJ2000Coordinates();
const coordsDate  = moon.getGeocentricEclipticSphericalDateCoordinates();
```

The result of the calculation should be:\
Longitude: *133.162655°*\
Latitude: *-3.229126°*\
Radius vector: *0.002463 AU*

---

### Geocentric ecliptic rectangular coordinates

**Description:** These methods return the Moon's position as geocentric ecliptic rectangular coordinates `{x, y, z}` in astronomical units (AU), derived from the spherical coordinates.

**Example**: Get geocentric ecliptic rectangular coordinates for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);

const coordsJ2000 = moon.getGeocentricEclipticRectangularJ2000Coordinates();
const coordsDate  = moon.getGeocentricEclipticRectangularDateCoordinates();
```

The result of the calculation should be:\
x: *-0.001682 AU*\
y: *0.001793 AU*\
z: *-0.000139 AU*

---

### Geocentric equatorial spherical coordinates

**Description:** These methods return the Moon's position in the equatorial coordinate frame as `{rightAscension, declination, radiusVector}`. Right ascension and declination are in degrees; the radius vector is in AU. Two reference frames are available: J2000.0 and the equator of the date. For the Moon these two frames return identical values.

**Example**: Get geocentric equatorial spherical coordinates for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);

const coordsJ2000 = moon.getGeocentricEquatorialSphericalJ2000Coordinates();
const coordsDate  = moon.getGeocentricEquatorialSphericalDateCoordinates();
```

The result of the calculation should be:\
Right ascension: *134.68392°*\
Declination: *13.769656°*\
Radius vector: *0.002463 AU*

---

### Apparent geocentric coordinates

**Description:** Apparent coordinates apply a nutation correction to the geometric coordinates, giving the position as it would be observed from Earth's centre. Available in both ecliptic and equatorial spherical forms, as well as ecliptic rectangular.

**Example**: Get apparent geocentric coordinates for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);

const eclipticSpherical   = moon.getApparentGeocentricEclipticSphericalCoordinates();
const equatorialSpherical = moon.getApparentGeocentricEquatorialSphericalCoordinates();
```

The result of the calculation should be:\
Apparent ecliptic longitude: *133.167265°*\
Apparent ecliptic latitude: *-3.229126°*\
Apparent ecliptic radius vector: *0.002463 AU*

Apparent right ascension: *134.688469°*\
Apparent declination: *13.768367°*\
Apparent radius vector: *0.002463 AU*

---

### Topocentric coordinates

**Description:** Topocentric coordinates shift the geocentric position to match the perspective of an observer at a specific location on Earth's surface. A `Location` (geographic latitude and longitude in degrees) is required. The API exposes apparent topocentric equatorial coordinates, apparent topocentric horizontal coordinates with geometric altitude, and observed topocentric horizontal coordinates with atmospheric refraction applied to the altitude.

**Example**: Get topocentric coordinates for 12 April 1992 at 00:00 UTC, observer at 52.519°N, 122.4108°W

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const apparentEquatorial = moon.getApparentTopocentricEquatorialSphericalCoordinates(location);
const apparentHorizontal = moon.getApparentTopocentricHorizontalCoordinates(location);
const observedHorizontal = moon.getRefractionCorrectedTopocentricHorizontalCoordinates(location);
```

The result of the calculation should be:\
Apparent topocentric right ascension: *135.211802°*\
Apparent topocentric declination: *13.079873°*

Apparent topocentric azimuth: *108.968405°*\
Geometric altitude: *30.91398°*\
Observed altitude (with refraction): *30.94205°*

---

### Distance to Earth

**Description:** These methods return the distance between the Moon and Earth in kilometres. `getDistanceToEarth` and `getApparentDistanceToEarth` return the geocentric distance; the topocentric variant corrects for the observer's position on the surface.

**Example**: Get the distance to Earth for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const distance            = moon.getDistanceToEarth();
const topocentricDistance = moon.getTopocentricDistanceToEarth(location);
```

The result of the calculation should be:\
Geocentric distance: *368,409.684816 km*\
Topocentric distance: *365,174.894770 km*

---

### Light time

**Description:** Returns the time in seconds that light takes to travel from the Moon to Earth at the given moment.

**Example**: Get light time for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);

const lightTime = moon.getLightTime();
```

The result of the calculation should be:\
Light time: *0h 0m 1.23s*

---

### Angular diameter

**Description:** Returns the Moon's angular diameter in degrees as seen from Earth (or from a surface observer for the topocentric variant).

**Example**: Get the angular diameter for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const diameter            = moon.getAngularDiameter();
const topocentricDiameter = moon.getTopocentricAngularDiameter(location);
```

The result of the calculation should be:\
Geocentric angular diameter: *0° 32' 25.453"*\
Topocentric angular diameter: *0° 32' 42.686"*

---

### Elongation

**Description:** Returns the angular separation between the Moon and the Sun in degrees. Values range from 0° (new moon) to 180° (full moon).

**Example**: Get elongation for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const elongation            = moon.getElongation();
const topocentricElongation = moon.getTopocentricElongation(location);
```

The result of the calculation should be:\
Elongation: *110.792854°*\
Topocentric elongation: *111.462765°*

---

### Phase angle

**Description:** Returns the phase angle of the Moon in degrees — the angle Sun–Moon–Earth. A phase angle of 0° corresponds to full moon and 180° to new moon.

**Example**: Get phase angle for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const phaseAngle            = moon.getPhaseAngle();
const topocentricPhaseAngle = moon.getTopocentricPhaseAngle(location);
```

The result of the calculation should be:\
Phase angle: *69.075679°*\
Topocentric phase angle: *68.407512°*

---

### Illuminated fraction

**Description:** Returns the fraction of the Moon's disk that is illuminated, as a value between 0 (new moon) and 1 (full moon).

**Example**: Get illuminated fraction for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const fraction            = moon.getIlluminatedFraction();
const topocentricFraction = moon.getTopocentricIlluminatedFraction(location);
```

The result of the calculation should be:\
Illuminated fraction: *0.679*\
Topocentric illuminated fraction: *0.684*

---

### Position angle of bright limb

**Description:** Returns the position angle of the Moon's bright limb in degrees, measured eastward from the north point of the disk. This indicates the direction from which the Moon is illuminated.

**Example**: Get position angle of bright limb for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const chi            = moon.getPositionAngleOfBrightLimb();
const topocentricChi = moon.getTopocentricPositionAngleOfBrightLimb(location);
```

The result of the calculation should be:\
Position angle: *285.044°*\
Topocentric position angle: *284.960°*

---

### Waxing / waning

**Description:** Returns `true` if the Moon is currently waxing (moving from new moon toward full moon), `false` if it is waning.

**Example**: Check waxing/waning for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const waxing            = moon.isWaxing();
const topocentricWaxing = moon.isTopocentricWaxing(location);
```

The result of the calculation should be:\
Waxing: *true*\
Topocentric waxing: *true*

---

### Apparent magnitude

**Description:** Returns the apparent visual magnitude of the Moon. The value depends on the phase angle, the Moon's distance from Earth, and whether it is waxing or waning.

**Example**: Get apparent magnitude for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const location = Location.create(52.519, -122.4108);
const moon = Moon.create(toi);

const magnitude            = moon.getApparentMagnitude();
const topocentricMagnitude = moon.getTopocentricApparentMagnitude(location);
```

The result of the calculation should be:\
Apparent magnitude: *-11.04*\
Topocentric apparent magnitude: *-11.08*

---

### Upcoming lunar phases

**Description:** These methods return the `TimeOfInterest` of the principal lunar phases in the lunation selected from the Moon's current date. Depending on the phase, the result can be before or after the Moon's current date. The four phases are new moon, first quarter, full moon, and last quarter.

**Example**: Get upcoming lunar phases for 12 April 1992 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Moon} from '@astronomy-bundle/moon';

const toi = TimeOfInterest.fromTime(1992, 4, 12, 0, 0, 0);
const moon = Moon.create(toi);

const newMoon      = moon.getUpcomingNewMoon();
const firstQuarter = moon.getUpcomingFirstQuarter();
const fullMoon     = moon.getUpcomingFullMoon();
const lastQuarter  = moon.getUpcomingLastQuarter();
```

The result of the calculation should be:\
Next new moon: *1992-04-03 05:02:03 UTC*\
Next first quarter: *1992-04-10 10:06:42 UTC*\
Next full moon: *1992-04-17 04:43:22 UTC*\
Next last quarter: *1992-04-24 21:40:37 UTC*
