Part of the [Astronomy Bundle](../../README.md).

# Lunar Limb Profile

The `lunar-limb-profile` package provides the `LunarLimbProfile` object for computing the height of the Moon's visible limb silhouette from LOLA/LDEM terrain data. Given a libration state and the observer's distance, it evaluates the apparent terrain radius along the line of sight and returns the limb height above the LDEM reference sphere at a celestial position angle. This is useful for modelling the irregular lunar limb in occultations, grazing occultations, and the Baily's beads phase of a solar eclipse.

## Contents

- [Install](#install)
- [Terrain data](#terrain-data)
- [API Reference](#api-reference)
  - [Create the lunar limb profile](#create-the-lunar-limb-profile)
  - [Reference radius](#reference-radius)
  - [Limb height at a position angle](#limb-height-at-a-position-angle)

## Install

With npm: `npm install @astronomy-bundle/lunar-limb-profile`\
With yarn: `yarn add @astronomy-bundle/lunar-limb-profile`\
With pnpm: `pnpm add @astronomy-bundle/lunar-limb-profile`

## Terrain data

The profile is derived from the LOLA Lunar Digital Elevation Model (LDEM), distributed as a raw 16-bit little-endian raster (`.img`) alongside a PDS label (`.lbl`) that describes the grid geometry. Both are passed to `create` as plain data — reading them from disk (or fetching them over the network) is the caller's responsibility. The `ldem_16` product (16 pixels/degree) is a good default; higher-resolution products such as `ldem_64` trade a much larger file for finer detail.

The datasets can be downloaded from the LRO/LOLA GDR DEM archive: <https://ode.rsl.wustl.edu/moon/pagehelp/Content/Missions_Instruments/LRO/LOLA/GDR/GDRDEM.htm>

## API Reference

### Create the lunar limb profile

**Description:** The `LunarLimbProfile` object is created from the LDEM raster bytes and the text of its PDS label. The label is parsed immediately to derive the grid geometry; the raster is validated against that geometry on first use.

**Example**: Create a lunar limb profile from the `ldem_16` product

```javascript
import {readFileSync} from 'node:fs';
import {LunarLimbProfile} from '@astronomy-bundle/lunar-limb-profile';

const imgData = readFileSync('ldem_16.img');
const label = readFileSync('ldem_16.lbl', 'utf8');

const profile = LunarLimbProfile.create(imgData, label);
```

---

### Reference radius

**Description:** `getReferenceRadiusKm()` returns the radius of the LDEM reference sphere in kilometres. Limb heights are measured relative to this sphere.

**Example**: Get the reference radius

```javascript
import {readFileSync} from 'node:fs';
import {LunarLimbProfile} from '@astronomy-bundle/lunar-limb-profile';

const imgData = readFileSync('ldem_16.img');
const label = readFileSync('ldem_16.lbl', 'utf8');

const profile = LunarLimbProfile.create(imgData, label);

const referenceRadiusKm = profile.getReferenceRadiusKm();
```

The result of the calculation should be:\
Reference radius: *1737.4 km*

---

### Limb height at a position angle

**Description:** `getLimbHeightKm(positionAngleDeg, libration, axisPositionAngleDeg, observerDistanceKm)` returns the height of the visible limb silhouette in kilometres — the maximum apparent terrain radius along the line of sight, in perspective from the given observer distance — above the apparent radius of the LDEM reference sphere, at the given celestial position angle.

- `positionAngleDeg` — celestial position angle of the limb point, measured eastward from the north point of the disk.
- `libration` — the Moon's optical libration as `{longitude, latitude}` in degrees.
- `axisPositionAngleDeg` — position angle of the Moon's axis of rotation, used to rotate the celestial position angle into the selenographic frame.
- `observerDistanceKm` — distance from the observer to the Moon in kilometres.

**Example**: Get the limb height at several position angles

```javascript
import {readFileSync} from 'node:fs';
import {LunarLimbProfile} from '@astronomy-bundle/lunar-limb-profile';

const imgData = readFileSync('ldem_16.img');
const label = readFileSync('ldem_16.lbl', 'utf8');

const profile = LunarLimbProfile.create(imgData, label);

const libration = {longitude: 2.0, latitude: -0.1};
const axisPositionAngleDeg = 340;
const observerDistanceKm = 380000;

const north = profile.getLimbHeightKm(0, libration, axisPositionAngleDeg, observerDistanceKm);
const east  = profile.getLimbHeightKm(90, libration, axisPositionAngleDeg, observerDistanceKm);
const south = profile.getLimbHeightKm(180, libration, axisPositionAngleDeg, observerDistanceKm);
const west  = profile.getLimbHeightKm(270, libration, axisPositionAngleDeg, observerDistanceKm);
```

The result of the calculation should be:\
Height at PA 0°: *-0.185596 km*\
Height at PA 90°: *2.115692 km*\
Height at PA 180°: *1.296247 km*\
Height at PA 270°: *-0.927427 km*
