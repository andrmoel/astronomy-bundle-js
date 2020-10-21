# Astronomy Bundle

**-------------------------------------------------------**

**⚠ WARNING: This library is currently work in progress ⚠**

**-------------------------------------------------------**

This library provides tools and methods for astronomical calculations.
With this bundle it is possible to calculate the position of moon, sun and planets and several coordinate systems.
For a higher accuracy, several corrections, like nutation and precision, were taken into account.
It is also possible to calculate rise, set and culmination events for celestial objects.
For a detailed see the table of contents.

Most of the calculations are based on Jean Meeus 'Astronomical Algorithms' book and the VSOP87 theory.

## Table of Contents  
1.  [Installation](#installation)
2. [Angle Utils](#angle-utils)

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
