Part of the [Astronomy Bundle](../../README.md).

# Solar Eclipse

The `solarEclipse` package provides solar eclipse calculations for any location on Earth. It uses Besselian Elements — pre-computed polynomial coefficients describing the Moon's shadow geometry — to determine eclipse type, contact times, magnitude, and obscuration at a specific geographic location and point in time.

## Install

With npm: `npm install @astronomy-bundle/solar-eclipse @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/solar-eclipse @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/solar-eclipse @astronomy-bundle/core`

## API Reference

- [Eclipse Catalogue](#eclipse-catalogue)
- [SolarEclipse](#solareclipse)
- [LocalSolarEclipse](#localsolareclipse-eclipse--location)
- [LocalEclipseCircumstances](#localeclipsecircumstances-eclipse--location--time)

### Eclipse Catalogue

Two pre-computed eclipse catalogues are provided as separate subpath exports. Use them to list available eclipse dates, look up Besselian elements by date, and pass the result to [`SolarEclipse.createFromBesselianElements`](#createfrombesselianelements-static).

Both catalogue entrypoints export a `Catalogue` class with the same methods:

- `Catalogue.getAvailableEclipseDates(dateFrom?, dateTo?)`: returns sorted eclipse dates in `YYYY-MM-DD` format. The optional boundaries are inclusive.
- `Catalogue.getBesselianElements(date)`: returns the parsed Besselian elements for an eclipse date. It throws when the date is outside the catalogue range or when no eclipse exists on that date.

#### Standard catalogue (1900–2100)

Import from `@astronomy-bundle/solar-eclipse/catalogue` for the standard catalogue. It contains 454 eclipses, from `1900-05-28` to `2100-09-04`, and is the default choice for modern dates. Requests outside the 1900–2100 catalogue range throw with a hint to use the full catalogue instead.

```javascript
import {SolarEclipse} from '@astronomy-bundle/solar-eclipse';
import {Catalogue} from '@astronomy-bundle/solar-eclipse/catalogue';

const availableDates = Catalogue.getAvailableEclipseDates('2026-01-01', '2026-12-31');
const elements = Catalogue.getBesselianElements('2026-08-12');
const eclipse = SolarEclipse.createFromBesselianElements(elements);
```

#### Full catalogue (−1999–3000)

> **⚠️ Warning:** The full catalogue is about 1 MB uncompressed. Avoid importing it in browser bundles or size-sensitive environments unless necessary.

For eclipses outside the standard range, import from `@astronomy-bundle/solar-eclipse/catalogue-full`. It contains 11,898 eclipses, from `-1999-06-12` to `3000-10-19`, while leaving the standard catalogue entrypoint unchanged. Negative years use signed astronomical year numbering.

```javascript
import {SolarEclipse} from '@astronomy-bundle/solar-eclipse';
import {Catalogue} from '@astronomy-bundle/solar-eclipse/catalogue-full';

const availableDates = Catalogue.getAvailableEclipseDates(); // All dates from -1999-06-12 to 3000-10-19
const elements = Catalogue.getBesselianElements('-0500-03-14');
const eclipse = SolarEclipse.createFromBesselianElements(elements);
```

---

### SolarEclipse

`SolarEclipse` represents a solar eclipse event and provides global eclipse properties such as type, greatest eclipse location and time, and peak magnitude. It is the primary entry point for eclipse calculations.

**Example**: Total solar eclipse on 2 July 2019

```javascript
import {SolarEclipse} from '@astronomy-bundle/solar-eclipse';
import {Catalogue} from '@astronomy-bundle/solar-eclipse/catalogue';

const elements = Catalogue.getBesselianElements('2019-07-02');
const eclipse = SolarEclipse.createFromBesselianElements(elements);
```

---

#### createFromBesselianElements *(static)*

**Description:** Creates a `SolarEclipse` instance from a `BesselianElements` object. This is the only static constructor on `SolarEclipse`. Use the built-in [`Catalogue`](#eclipse-catalogue) entrypoints for date-based lookup, or pass custom pre-computed Besselian elements.

```javascript
import {SolarEclipse, parseBesselianElements} from '@astronomy-bundle/solar-eclipse';

// ASE 2016-09-01
const elements = parseBesselianElements([
    2457632.88058,  9.0,  -3.0,  3.0,  68.4,  68.4,
    -0.16139600,    0.50406349,  -0.00002140,  -0.00000631,
    -0.29965001,   -0.14815210,  -0.00002580,   0.00000178,
     8.06330013,   -0.01480200,  -0.00000200,
     315.03155518,  15.00454044,  0.00000000,
     0.55792803,    0.00011150,  -0.00001050,
     0.01173100,    0.00011100,  -0.00001040,
     0.00463390,    0.00461090
]);

const eclipse = SolarEclipse.createFromBesselianElements(elements);
```

---

#### getType

**Description:** Returns the global eclipse type as a `SolarEclipseType` value. Possible values are `'partial'`, `'total'`, `'annular'`, and `'hybrid'`.

```javascript
const type = eclipse.getType();
```

The result of the calculation should be: *total*

---

#### getLocationOfGreatestEclipse

**Description:** Returns the geographic coordinates `{lat, lon}` (in decimal degrees) of the point on Earth's surface where the eclipse is greatest — i.e., where the Moon's shadow axis passes closest to the centre of the Earth.

```javascript
const {lat, lon} = eclipse.getLocationOfGreatestEclipse();
```

The result of the calculation should be:\
lat: *-17.388965*\
lon: *-108.998649*

---

#### getTimeOfGreatestEclipse

**Description:** Returns a `TimeOfInterest` representing the moment of greatest eclipse in Terrestrial Time (TT).

```javascript
const toi = eclipse.getTimeOfGreatestEclipse();
const {year, month, day, hour, min, sec} = toi.getTime();
```

The result of the calculation should be: *2019-07-02 19:22:58*

---

#### getMaxMagnitude

**Description:** Returns the eclipse magnitude at greatest eclipse — the fraction of the Sun's diameter covered by the Moon at the point and moment of greatest eclipse. Values above 1 indicate a total eclipse.

```javascript
const magnitude = eclipse.getMaxMagnitude();
```

The result of the calculation should be: *1.022966*

---

#### getMaxMoonSunRatio

**Description:** Returns the ratio of the apparent angular diameter of the Moon to that of the Sun at the moment of greatest eclipse. A ratio greater than 1 means totality is possible; less than 1 means an annular eclipse is possible.

```javascript
const ratio = eclipse.getMaxMoonSunRatio();
```

The result of the calculation should be: *1.045932*

---

#### getMaxObscuration

**Description:** Returns the fraction of the Sun's area obscured by the Moon at greatest eclipse, as a value between 0 and 1. Returns 1 for total eclipses.

```javascript
const obscuration = eclipse.getMaxObscuration();
```

The result of the calculation should be: *1*

---

#### getMaxDuration

**Description:** Returns the total duration of the eclipse in seconds at the point of greatest eclipse, measured from first contact (C1) to last contact (C4).

```javascript
const durationSeconds = eclipse.getMaxDuration();
```

The result of the calculation should be: *11847.3*

---

#### getMaxCentralDuration

**Description:** Returns the duration of the central phase (totality or annularity) in seconds at the point of greatest eclipse, measured from second contact (C2) to third contact (C3).

```javascript
const centralDurationSeconds = eclipse.getMaxCentralDuration();
```

The result of the calculation should be: *272.8*

---

#### getCentralLine

**Description:** Returns the path of the central eclipse (totality or annularity) as an array of `{lat, lon}` coordinate objects in decimal degrees. Points are computed by stepping through the eclipse duration and projecting the Moon's shadow axis onto Earth's surface. Points where the shadow axis misses Earth are omitted. The optional `stepsInSeconds` parameter (default: `10`) controls the time resolution between points — smaller values produce a denser path.

```javascript
const path = eclipse.getCentralLine();
// [{lat: ..., lon: ...}, ...]

// Higher resolution (1-second steps)
const densePath = eclipse.getCentralLine(1);
```

---

#### getLocalEclipse

**Description:** Returns a [`LocalSolarEclipse`](#localsolareclipse-eclipse--location) instance for a specific observer location. Use this to calculate contact times, local eclipse type, magnitude, and obscuration as seen from that location.

```javascript
import {Location} from '@astronomy-bundle/core';

const location = Location.create(21.52854, 39.14387, 6);
const localEclipse = eclipse.getLocalEclipse(location);
```

---

### LocalSolarEclipse (Eclipse + Location)

`LocalSolarEclipse` represents a solar eclipse as seen from a specific observer location. It provides contact times, local eclipse type, magnitude, obscuration, and duration for that observer.

**Example**: Annular solar eclipse on 1 September 2016, observer on Réunion (−21.32947°N, 55.45174°E, 43 m)

```javascript
import {Location} from '@astronomy-bundle/core';
import {SolarEclipse} from '@astronomy-bundle/solar-eclipse';
import {Catalogue} from '@astronomy-bundle/solar-eclipse/catalogue';

const location = Location.create(-21.32947, 55.45174, 43);
const elements = Catalogue.getBesselianElements('2016-09-01');

const localEclipse = SolarEclipse
    .createFromBesselianElements(elements);
    .getLocalEclipse(location);
```

---

#### getType

**Description:** Returns the local eclipse type as a `LocalSolarEclipseType` value. Possible values are `'partial'`, `'total'`, and `'annular'`.

```javascript
const type = localEclipse.getType();
```

The result of the calculation should be: *annular*

---

#### getContactTaus

**Description:** Returns the contact times as dimensionless time offsets (τ) relative to `t0` in the Besselian elements. `c1` and `c4` are always present; `c2` and `c3` are only set for central (total or annular) eclipses and are `null` for partial eclipses. `max` is the moment of greatest eclipse at this location.

```javascript
const contacts = localEclipse.getContactTaus();

const {c1, c2, max, c3, c4} = contacts;
```

The result of the calculation should be:\
c1: *-0.587733*\
c2: *1.161358*\
max: *1.185232*\
c3: *1.209146*\
c4: *2.730092*

---

#### getContactTimes

**Description:** Returns the contact times as `TimeOfInterest` objects in Terrestrial Time (TT). `c1` is first external contact, `c2` second contact (start of central phase), `max` is greatest eclipse, `c3` third contact (end of central phase), and `c4` last external contact. `c2` and `c3` are `null` for partial eclipses.

```javascript
const contacts = localEclipse.getContactTimes();

const {year: y1, month: mo1, day: d1, hour: h1, min: m1, sec: s1} = contacts.c1.getTime();
const {year: y2, month: mo2, day: d2, hour: h2, min: m2, sec: s2} = contacts.c2.getTime();
const {year: ym, month: mom, day: dm, hour: hm, min: mm, sec: sm} = contacts.max.getTime();
const {year: y3, month: mo3, day: d3, hour: h3, min: m3, sec: s3} = contacts.c3.getTime();
const {year: y4, month: mo4, day: d4, hour: h4, min: m4, sec: s4} = contacts.c4.getTime();
```

The result of the calculation should be:\
c1: *2016-09-01 08:23:35*\
c2: *2016-09-01 10:08:32*\
max: *2016-09-01 10:09:58*\
c3: *2016-09-01 10:11:24*\
c4: *2016-09-01 11:42:39*

---

#### getMaxMagnitude

**Description:** Returns the eclipse magnitude at greatest local eclipse — the fraction of the Sun's diameter covered by the Moon at the observer's location. Values below 1 indicate a partial or annular eclipse; values above 1 indicate totality.

```javascript
const magnitude = localEclipse.getMaxMagnitude();
```

The result of the calculation should be: *0.980731*

---

#### getMaxMoonSunRatio

**Description:** Returns the ratio of the apparent angular diameter of the Moon to that of the Sun at the moment of greatest local eclipse. A ratio below 1 means an annular eclipse is possible; above 1 means totality is possible.

```javascript
const ratio = localEclipse.getMaxMoonSunRatio();
```

The result of the calculation should be: *0.970421*

---

#### getMaxObscuration

**Description:** Returns the fraction of the Sun's area obscured by the Moon at greatest local eclipse, as a value between 0 and 1. Returns 1 for total eclipses; less than 1 for annular and partial eclipses.

```javascript
const obscuration = localEclipse.getMaxObscuration();
```

The result of the calculation should be: *0.941717*

---

#### getDuration

**Description:** Returns the total duration of the eclipse in seconds at the observer's location, measured from first contact (C1) to last contact (C4).

```javascript
const durationSeconds = localEclipse.getDuration();
```

The result of the calculation should be: *11944.2*

---

#### getCentralDuration

**Description:** Returns the duration of the central phase (totality or annularity) in seconds at the observer's location, measured from second contact (C2) to third contact (C3). Returns 0 for partial eclipses.

```javascript
const centralDurationSeconds = localEclipse.getCentralDuration();
```

The result of the calculation should be: *172.0*

---

#### getCircumstances

**Description:** Returns a [`LocalEclipseCircumstances`](#localeclipsecircumstances-eclipse--location--time) instance for a specific moment in time at the observer's location. Use this to query eclipse state (type, magnitude, obscuration) at any point during the eclipse.

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromTime(2016, 9, 1, 10, 9, 58);
const circumstances = localEclipse.getCircumstances(toi);
```

---

### LocalEclipseCircumstances (Eclipse + Location + Time)

`LocalEclipseCircumstances` represents the eclipse conditions at a specific geographic location and moment in time. It requires a `BesselianElements` object (describing the eclipse), a `Location`, and a `TimeOfInterest`.

**Example**: Total solar eclipse on 2 August 2027, observer in Jeddah, Saudi Arabia (21.52854°N, 39.14387°E, 6 m)

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {SolarEclipse} from '@astronomy-bundle/solar-eclipse';
import {Catalogue} from '@astronomy-bundle/solar-eclipse/catalogue';

const location = Location.create(21.52854, 39.14387, 6);
const toiPartial = TimeOfInterest.fromTime(2027, 8, 2, 10, 1, 5);
const toiTotal   = TimeOfInterest.fromTime(2027, 8, 2, 10, 23, 13);
const elements = Catalogue.getBesselianElements('2027-08-02');

const localEclipse = SolarEclipse
    .createFromBesselianElements(elements)
    .getLocalEclipse(location);

// Local circumstances during partial phase in Jeddah
const circumstancesPartial = localEclipse.getCircumstances(toiPartial);

// Local circumstances during total phase in Jeddah
const circumstancesTotal = localEclipse.getCircumstances(toiTotal);
```

---

#### getEclipseType

**Description:** Returns the eclipse type at the observer's location for the given moment. Possible values are `'none'`, `'partial'`, `'total'`, and `'annular'`. Returns `'none'` before the eclipse has started or after it has ended.

**Example**: Get eclipse type during partial and total phases

```javascript
const typePartial = circumstancesPartial.getEclipseType();
const typeTotal   = circumstancesTotal.getEclipseType();
```

The result of the calculation should be:\
During partial phase: *partial*\
During total phase: *total*

---

#### isInEclipse

**Description:** Returns `true` if any eclipse is in progress at the given moment (partial, total, or annular phase). Returns `false` before first contact and after last contact.

**Example**: Check whether the eclipse is in progress

```javascript
const inEclipsePartial = circumstancesPartial.isInEclipse();
const inEclipseTotal   = circumstancesTotal.isInEclipse();
```

The result of the calculation should be:\
During partial phase: *true*\
During total phase: *true*

---

#### isInCentralEclipse

**Description:** Returns `true` only during the central phase — totality or annularity. Returns `false` during the partial phase, before first contact, and after last contact.

**Example**: Check whether totality (or annularity) is in progress

```javascript
const inCentralPartial = circumstancesPartial.isInCentralEclipse();
const inCentralTotal   = circumstancesTotal.isInCentralEclipse();
```

The result of the calculation should be:\
During partial phase: *false*\
During total phase: *true*

---

#### getMagnitude

**Description:** Returns the eclipse magnitude — the fraction of the Sun's diameter covered by the Moon. During the partial phase the value is between 0 and 1; it exceeds 1 during totality and is negative before the eclipse begins.

**Example**: Get magnitude during partial and total phases

```javascript
const magnitudePartial = circumstancesPartial.getMagnitude();
const magnitudeTotal   = circumstancesTotal.getMagnitude();
```

The result of the calculation should be:\
During partial phase: *0.737326*\
During total phase: *1.011528*

---

#### getObscuration

**Description:** Returns the fraction of the Sun's area obscured by the Moon, as a value between 0 and 1. Unlike magnitude, this is an area-based measure and never exceeds 1. Returns 0 when no eclipse is in progress and 1 during totality.

**Example**: Get obscuration during partial and total phases

```javascript
const obscurationPartial = circumstancesPartial.getObscuration();
const obscurationTotal   = circumstancesTotal.getObscuration();
```

The result of the calculation should be:\
During partial phase: *0.684328*\
During total phase: *1*

---

#### getTopocentricHorizontalCoordinates

**Description:** Returns the geometric topocentric horizontal coordinates of the Sun for the observer's location and given moment. The result contains azimuth and altitude in degrees, plus `radiusVector` set to `0`.

**Example**: Get geometric Sun coordinates during totality

```javascript
const horizontal = circumstancesTotal.getTopocentricHorizontalCoordinates();
```

The result of the calculation should be:\
Azimuth: *255.664318°*\
Geometric altitude: *76.861319°*

---

#### getApparentTopocentricHorizontalCoordinates

**Description:** Returns the apparent topocentric horizontal coordinates of the Sun for the observer's location and given moment. The altitude includes atmospheric refraction correction; azimuth and `radiusVector` are unchanged from the geometric coordinates.

**Example**: Get refraction-corrected Sun coordinates during totality

```javascript
const apparentHorizontal = circumstancesTotal.getApparentTopocentricHorizontalCoordinates();
```

The result of the calculation should be:\
Azimuth: *255.664318°*\
Apparent altitude (with refraction): *76.865248°*
