Part of the [Astronomy Bundle](../../README.md).

# Earth

The `earth` package provides the `Earth` object — the reference body used throughout the astronomy-bundle library. It computes Earth's heliocentric position in the ecliptic coordinate frame using the VSOP87 theory, and exposes Earth-specific quantities such as nutation and the obliquity of the ecliptic.

## Install

With npm: `npm install @astronomy-bundle/earth @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/earth @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/earth @astronomy-bundle/core`

## High precision

By default the `Earth` class uses a reduced VSOP87 series that is accurate enough for most applications. For maximum accuracy you can import from the `high-precision` entry point instead:

```javascript
import {Earth} from '@astronomy-bundle/earth/high-precision';
```

> **⚠️ Warning:** The full VSOP87 series used by the high-precision variant contains significantly more terms than the reduced version. This results in a **~10x larger bundle size** and slower parse time. Only use this variant when the extra accuracy is required.

## API Reference

### Create the Earth object

**Description:** The `Earth` object represents Earth at a specific point in time, given as a `TimeOfInterest`. If no TOI is provided it defaults to the current time. Two precision variants are available: `Earth` from the standard entry point for standard use cases (VSOP87 reduced series), and `Earth` from the `high-precision` entry point for maximum accuracy (full VSOP87 series).

**Example**: Create an Earth object for 10 December 2017 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Earth} from '@astronomy-bundle/earth';
// or for high precision:
// import {Earth} from '@astronomy-bundle/earth/high-precision';

const toi = TimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = Earth.create(toi);
```

---

### Heliocentric ecliptic spherical coordinates

**Description:** These methods return Earth's position in the solar system as heliocentric ecliptic spherical coordinates `{lon, lat, radiusVector}`. Longitude and latitude are in degrees; the radius vector (distance from the Sun) is in astronomical units (AU). Two reference frames are available: J2000.0 (fixed equinox of year 2000) and the ecliptic of the date.

**Example**: Get heliocentric ecliptic spherical coordinates for 10 December 2017 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Earth} from '@astronomy-bundle/earth';

const toi = TimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = Earth.create(toi);

const coordsJ2000 = earth.getHeliocentricEclipticSphericalJ2000Coordinates();
const coordsDate  = earth.getHeliocentricEclipticSphericalDateCoordinates();
```

The result of the calculation should be:\
J2000 longitude: *77.86590139°*\
J2000 latitude: *-0.00250426°*\
J2000 radius vector: *0.98482663 AU*

Date longitude: *78.11652455°*\
Date latitude: *-0.00014301°*\
Date radius vector: *0.98482663 AU*

---

### Heliocentric ecliptic rectangular coordinates

**Description:** These methods return Earth's position as heliocentric ecliptic rectangular coordinates `{x, y, z}` in astronomical units (AU), derived from the spherical coordinates. Rectangular coordinates are convenient when vector arithmetic — such as computing planet–Earth distance vectors — is preferred over spherical trigonometry.

**Example**: Get heliocentric ecliptic rectangular coordinates for 10 December 2017 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Earth} from '@astronomy-bundle/earth';

const toi = TimeOfInterest.fromTime(2017, 12, 10, 0, 0, 0);
const earth = Earth.create(toi);

const coordsJ2000 = earth.getHeliocentricEclipticRectangularJ2000Coordinates();
const coordsDate  = earth.getHeliocentricEclipticRectangularDateCoordinates();
```

The result of the calculation should be:\
J2000 x: *0.20701099 AU*\
J2000 y: *0.96282394 AU*\
J2000 z: *-0.00004304 AU*

Date x: *0.20279744 AU*\
Date y: *0.96372024 AU*\
Date z: *-0.00000246 AU*

---

### Nutation

**Description:** Nutation is a small periodic oscillation of Earth's rotational axis caused by the gravitational pull of the Moon and Sun. `getNutationInLongitude` returns the nutation component along the ecliptic (Δψ), and `getNutationInObliquity` returns the nutation component perpendicular to it (Δε). Both values are in degrees.

**Example**: Get nutation for 02 October 2020 at 22:19:44 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Earth} from '@astronomy-bundle/earth';

const toi = TimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
const earth = Earth.create(toi);

const nutationInLongitude = earth.getNutationInLongitude();
const nutationInObliquity = earth.getNutationInObliquity();
```

The result of the calculation should be:\
Nutation in longitude (Δψ): *-0.004946°*\
Nutation in obliquity (Δε): *0.000478°*

---

### Obliquity of the ecliptic

**Description:** The obliquity of the ecliptic is the angle between Earth's equatorial plane and the ecliptic plane. The mean obliquity is the long-term value calculated from polynomials; the true obliquity adds the short-period nutation correction (Δε). Both are given in degrees.

**Example**: Get obliquity of the ecliptic for 02 October 2020 at 22:19:44 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Earth} from '@astronomy-bundle/earth';

const toi = TimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
const earth = Earth.create(toi);

const meanObliquity = earth.getMeanObliquityOfEcliptic();
const trueObliquity = earth.getTrueObliquityOfEcliptic();
```

The result of the calculation should be:\
Mean obliquity: *23.436593°*\
True obliquity: *23.437070°*
