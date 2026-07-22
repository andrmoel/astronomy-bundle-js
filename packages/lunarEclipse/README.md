Part of the [Astronomy Bundle](../../README.md).

# Lunar Eclipse

The `lunarEclipse` package provides lunar eclipse Besselian elements for any eclipse between 2000 BCE and 3000 CE. The elements are pre-computed polynomial coefficients describing the Moon's position relative to Earth's shadow, together with eclipse type, magnitudes, and contact times.

## Contents

- [Install](#install)
- [API Reference](#api-reference)
  - [Eclipse Catalogue](#eclipse-catalogue)
    - [Standard catalogue (1900–2100)](#standard-catalogue-19002100)
    - [Full catalogue (−1999–3000)](#full-catalogue-19993000)
    - [Besselian elements](#besselian-elements)

## Install

With npm: `npm install @astronomy-bundle/lunar-eclipse @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/lunar-eclipse @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/lunar-eclipse @astronomy-bundle/core`

## API Reference

### Eclipse Catalogue

Two pre-computed eclipse catalogues are provided as separate subpath exports. Use them to list available eclipse dates and to look up Besselian elements by date.

Both catalogue entrypoints export a `Catalogue` class with the same methods:

- `Catalogue.getAvailableEclipseDates(dateFrom?, dateTo?)`: returns sorted eclipse dates in `YYYY-MM-DD` format. The optional boundaries are inclusive.
- `Catalogue.getBesselianElements(date)`: returns the parsed Besselian elements for an eclipse date. It throws when the date is outside the catalogue range or when no eclipse exists on that date.

#### Standard catalogue (1900–2100)

Import from `@astronomy-bundle/lunar-eclipse/catalogue` for the standard catalogue. It contains 459 eclipses, from `1900-06-13` to `2100-08-19`, and is the default choice for modern dates. Requests outside the 1900–2100 catalogue range throw with a hint to use the full catalogue instead.

```javascript
import {Catalogue} from '@astronomy-bundle/lunar-eclipse/catalogue';

const availableDates = Catalogue.getAvailableEclipseDates('2025-01-01', '2025-12-31');
const elements = Catalogue.getBesselianElements('2025-03-14');
```

#### Full catalogue (−1999–3000)

> **⚠️ Warning:** The full catalogue is about 1 MB uncompressed. Avoid importing it in browser bundles or size-sensitive environments unless necessary.

For eclipses outside the standard range, import from `@astronomy-bundle/lunar-eclipse/catalogue-full`. It contains 12,064 eclipses, from `-1999-06-26` to `3000-11-04`, while leaving the standard catalogue entrypoint unchanged. Negative years use signed astronomical year numbering.

```javascript
import {Catalogue} from '@astronomy-bundle/lunar-eclipse/catalogue-full';

const availableDates = Catalogue.getAvailableEclipseDates(); // All dates from -1999-06-26 to 3000-11-04
const elements = Catalogue.getBesselianElements('-0500-05-15');
```

#### Besselian elements

**Description:** The `parseBesselianElements` function converts a raw catalogue array into a `BesselianElements` object. Use the built-in [`Catalogue`](#eclipse-catalogue) entrypoints for date-based lookup, or pass custom pre-computed Besselian elements.

```javascript
import {parseBesselianElements} from '@astronomy-bundle/lunar-eclipse';

// Total lunar eclipse 2001-01-09
const elements = parseBesselianElements([
    2451919.348374, 20.0, 64.1, 2.162, 1.189, 1,
    3.29475, 1.02253, 0.27861,
    -2.23117, -1.27481, -0.14757, 0.36098, 0.86973, 1.99702, 2.95278,
    111.0355098, 0.68656, -0.000073,
    22.3913306, -0.03239, -0.001453,
]);
```

The returned `BesselianElements` object contains:

- `t0Jde`, `t0Hours`: the reference instant of the eclipse in Terrestrial Time.
- `penumbralMagnitude`, `umbralMagnitude`: the eclipse magnitudes at greatest eclipse.
- `eclipseType`: `1` for total, `2` for partial, `3` for penumbral.
- `apparentSiderealTime`, `moonParallax`, `moonSemidiameter`: the apparent sidereal time at `t0` (hours), and the Moon's horizontal parallax and semidiameter (degrees).
- `p1`, `u1`, `u2`, `greatest`, `u3`, `u4`, `p4`: the contact times as hours relative to `t0`. Umbral contacts (`u1`–`u4`) are `0` for penumbral eclipses; `u2` and `u3` are `0` unless the eclipse is total.
- `ra`, `dec`: the polynomial coefficients of the shadow's right ascension and declination (degrees).
