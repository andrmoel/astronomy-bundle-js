Part of the [Astronomy Bundle](../../README.md).

# Sun

The `sun` package provides the `Sun` object for computing the Sun's position as seen from Earth. Geocentric and topocentric coordinates are derived from Earth's heliocentric VSOP87 position, with corrections for aberration and nutation applied to the apparent coordinates.

## Install

With npm: `npm install @astronomy-bundle/sun @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/sun @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/sun @astronomy-bundle/core`

## High precision

By default the `Sun` class uses a reduced VSOP87 series (via the standard `Earth` model) that is accurate enough for most applications. For maximum accuracy you can import from the `high-precision` entry point instead:

```javascript
import {Sun} from '@astronomy-bundle/sun/high-precision';
```

> **Warning:** The full VSOP87 series used by the high-precision variant contains significantly more terms than the reduced version. This results in a **~10x larger bundle size** and slower parse time. Only use this variant when the extra accuracy is required.

## API Reference

### Create the Sun object

**Description:** The `Sun` object represents the Sun at a specific point in time, given as a `TimeOfInterest`. If no TOI is provided it defaults to the current time. Two precision variants are available: `Sun` for standard use cases (VSOP87 reduced series) and `Sun` from the `high-precision` entry point for maximum accuracy (full VSOP87 series).

**Example**: Create a Sun object for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';
// or for high precision:
// import {Sun} from '@astronomy-bundle/sun/high-precision';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = Sun.create(toi);
```

---

### Geocentric ecliptic spherical coordinates

**Description:** These methods return the Sun's position as geocentric ecliptic spherical coordinates `{lon, lat, radiusVector}`. Longitude and latitude are in degrees; the radius vector (distance from Earth) is in astronomical units (AU). Two reference frames are available: J2000.0 (fixed equinox of year 2000) and the ecliptic of the date.

**Example**: Get geocentric ecliptic spherical coordinates for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = Sun.create(toi);

const coordsJ2000 = sun.getGeocentricEclipticSphericalJ2000Coordinates();
const coordsDate  = sun.getGeocentricEclipticSphericalDateCoordinates();
```

The result of the calculation should be:\
J2000 longitude: *209.02487179°*\
J2000 latitude: *0.00138647°*\
J2000 radius vector: *0.99514386 AU*

Date longitude: *209.31555315°*\
Date latitude: *-0.00014017°*\
Date radius vector: *0.99514386 AU*

---

### Geocentric ecliptic rectangular coordinates

**Description:** These methods return the Sun's position as geocentric ecliptic rectangular coordinates `{x, y, z}` in astronomical units (AU), derived from the spherical coordinates.

**Example**: Get geocentric ecliptic rectangular coordinates for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = Sun.create(toi);

const coordsJ2000 = sun.getGeocentricEclipticRectangularJ2000Coordinates();
const coordsDate  = sun.getGeocentricEclipticRectangularDateCoordinates();
```

The result of the calculation should be:\
J2000 x: *-0.87016292 AU*\
J2000 y: *-0.4828331 AU*\
J2000 z: *0.00002408 AU*

Date x: *-0.86770215 AU*\
Date y: *-0.4872415 AU*\
Date z: *-0.00000243 AU*

---

### Geocentric equatorial spherical coordinates

**Description:** These methods return the Sun's position in the equatorial coordinate frame as `{rightAscension, declination, radiusVector}`. Right ascension and declination are in degrees; the radius vector is in AU. Two reference frames are available: J2000.0 and the equator of the date.

**Example**: Get geocentric equatorial spherical coordinates for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = Sun.create(toi);

const coordsJ2000 = sun.getGeocentricEquatorialSphericalJ2000Coordinates();
const coordsDate  = sun.getGeocentricEquatorialSphericalDateCoordinates();
```

The result of the calculation should be:\
J2000 right ascension: *206.9810651°*\
J2000 declination: *-11.1254097°*\
J2000 radius vector: *0.99514386 AU*

Date right ascension: *207.25762788°*\
Date declination: *-11.22974218°*\
Date radius vector: *0.99514386 AU*

---

### Apparent geocentric coordinates

**Description:** Apparent coordinates apply corrections for aberration and nutation to the geometric coordinates, giving the position as it would be observed from Earth's centre. Available in both ecliptic and equatorial spherical forms, as well as ecliptic rectangular.

**Example**: Get apparent geocentric coordinates for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = Sun.create(toi);

const eclipticSpherical   = sun.getApparentGeocentricEclipticSphericalCoordinates();
const equatorialSpherical = sun.getApparentGeocentricEquatorialSphericalCoordinates();
```

The result of the calculation should be:\
Apparent ecliptic longitude: *209.30479579°*\
Apparent ecliptic latitude: *-0.00014017°*\
Apparent ecliptic radius vector: *0.99514386 AU*

Apparent right ascension: *207.2473691°*\
Apparent declination: *-11.22593849°*\
Apparent radius vector: *0.99514386 AU*

---

### Topocentric coordinates

**Description:** Topocentric coordinates shift the geocentric position to match the perspective of an observer at a specific location on Earth's surface. A `Location` (geographic latitude and longitude in degrees) is required. Available as equatorial spherical and horizontal (azimuth/altitude) coordinates.

**Example**: Get topocentric coordinates for 22 October 2020 at 06:15 UTC, observer in Berlin (52.519°N, 13.408°E)

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const sun = Sun.create(toi);

const equatorial  = sun.getTopocentricEquatorialSphericalCoordinates(location);
const horizontal  = sun.getTopocentricHorizontalCoordinates(location);
const apparentAlt = sun.getApparentTopocentricHorizontalCoordinates(location);
```

The result of the calculation should be:\
Topocentric right ascension: *207.248793°*\
Topocentric declination: *-11.227945°*

Azimuth: *113.50076°*\
Geometric altitude: *3.433893°*\
Apparent altitude (with refraction): *3.643379°*

---

### Distance to Earth

**Description:** These methods return the distance between the Sun and Earth in kilometres. The geocentric distance is computed from the radius vector; the topocentric variant corrects for the observer's position on the surface.

**Example**: Get the distance to Earth for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const sun = Sun.create(toi);

const distance            = sun.getDistanceToEarth();
const topocentricDistance = sun.getTopocentricDistanceToEarth(location);
```

The result of the calculation should be:\
Geocentric distance: *148,871,402.78 km*\
Topocentric distance: *148,871,013.47 km*

---

### Light time

**Description:** Returns the time in seconds that light takes to travel from the Sun to Earth at the given moment.

**Example**: Get light time for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const sun = Sun.create(toi);

const lightTime = sun.getLightTime();
```

The result of the calculation should be:\
Light time: *0h 8m 16.58s*

---

### Angular diameter

**Description:** Returns the Sun's angular diameter in degrees as seen from Earth (or from a surface observer for the topocentric variant).

**Example**: Get the angular diameter for 22 October 2020 at 06:15 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const sun = Sun.create(toi);

const diameter            = sun.getAngularDiameter();
const topocentricDiameter = sun.getTopocentricAngularDiameter(location);
```

The result of the calculation should be:\
Geocentric angular diameter: *0° 32' 09.582"*\
Topocentric angular diameter: *0° 32' 09.587"*

---

### Apparent magnitude

**Description:** Returns the apparent visual magnitude of the Sun. The value is constant at *-26.74*.

**Example**: Get the apparent magnitude

```javascript
import {Sun} from '@astronomy-bundle/sun';

const sun = Sun.create();

const magnitude = sun.getApparentMagnitude();
```

The result of the calculation should be:\
Apparent magnitude: *-26.74*
