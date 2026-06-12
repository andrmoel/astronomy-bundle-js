Part of the [Astronomy Bundle](../../README.md).

# Sun

The `sun` package provides the `Sun` object for computing the Sun's position as seen from Earth. Geocentric and topocentric coordinates are derived from Earth's heliocentric VSOP87 position, with corrections for aberration and nutation applied to the apparent coordinates. Topocentric results are exposed as apparent coordinates and, for horizontal altitude, as observed coordinates with atmospheric refraction applied.

## Install

With npm: `npm install @astronomy-bundle/sun @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/sun @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/sun @astronomy-bundle/core`

## High precision

By default the `Sun` class uses a reduced VSOP87 series (via the standard `Earth` model) that is accurate enough for most applications. For maximum accuracy you can import from the `high-precision` entry point instead:

```javascript
import {Sun} from '@astronomy-bundle/sun/high-precision';
```

> **⚠️ Warning:** The full VSOP87 series used by the high-precision variant contains significantly more terms than the reduced version. This results in a **~10x larger bundle size** and slower parse time. Only use this variant when the extra accuracy is required.

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
J2000 longitude: *209.02485979°*\
J2000 latitude: *0.00145256°*\
J2000 radius vector: *0.99514567 AU*

Date longitude: *209.31554093°*\
Date latitude: *-0.00011635°*\
Date radius vector: *0.99514567 AU*

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
J2000 x: *-0.87016460 AU*\
J2000 y: *-0.48283379 AU*\
J2000 z: *0.00002523 AU*

Date x: *-0.86770383 AU*\
Date y: *-0.48724220 AU*\
Date z: *-0.00000202 AU*

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
J2000 right ascension: *206.98107755°*\
J2000 declination: *-11.12534365°*\
J2000 radius vector: *0.99514567 AU*

Date right ascension: *207.25762482°*\
Date declination: *-11.22971558°*\
Date radius vector: *0.99514567 AU*

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
Apparent ecliptic longitude: *209.30478357°*\
Apparent ecliptic latitude: *-0.00011635°*\
Apparent ecliptic radius vector: *0.99514567 AU*

Apparent right ascension: *207.24736604°*\
Apparent declination: *-11.22591188°*\
Apparent radius vector: *0.99514567 AU*

---

### Topocentric coordinates

**Description:** Topocentric coordinates shift the geocentric position to match the perspective of an observer at a specific location on Earth's surface. A `Location` (geographic latitude and longitude in degrees) is required. The API exposes apparent topocentric equatorial coordinates, apparent topocentric horizontal coordinates with geometric altitude, and observed topocentric horizontal coordinates with atmospheric refraction applied to the altitude.

**Example**: Get topocentric coordinates for 22 October 2020 at 06:15 UTC, observer in Berlin (52.519°N, 13.408°E)

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Sun} from '@astronomy-bundle/sun';

const toi = TimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
const location = Location.create(52.519, 13.408);
const sun = Sun.create(toi);

const apparentEquatorial = sun.getApparentTopocentricEquatorialSphericalCoordinates(location);
const apparentHorizontal = sun.getApparentTopocentricHorizontalCoordinates(location);
const observedHorizontal = sun.getRefractionCorrectedTopocentricHorizontalCoordinates(location);
```

The result of the calculation should be:\
Apparent topocentric right ascension: *207.248790°*\
Apparent topocentric declination: *-11.227918°*

Apparent topocentric azimuth: *113.500747°*\
Geometric altitude: *3.433916°*\
Observed altitude (with refraction): *3.643402°*

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
Geocentric distance: *148,871,672.60 km*\
Topocentric distance: *148,871,283.29 km*

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
Geocentric angular diameter: *0° 32' 09.579"*\
Topocentric angular diameter: *0° 32' 09.584"*

---

### Apparent magnitude

**Description:** Returns the apparent visual magnitude of the Sun. The value is constant at *-26.74* for both the geocentric and topocentric variants.

**Example**: Get the apparent magnitude

```javascript
import {Sun} from '@astronomy-bundle/sun';

const sun = Sun.create();

const magnitude            = sun.getApparentMagnitude();
const topocentricMagnitude = sun.getTopocentricApparentMagnitude();
```

The result of the calculation should be:\
Apparent magnitude: *-26.74*\
Topocentric apparent magnitude: *-26.74*
