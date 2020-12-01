//
// cTle.h 
//
// This class will accept a single set of two-line elements and then allow
// a client to request specific fields, such as epoch, mean motion, 
// etc., from the set.
//
// Copyright 1996-2012 Michael F. Henry
// Version 05/2012
#pragma once

#include "globals.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

/////////////////////////////////////////////////////////////////////////////
class cTle
{
public:
   cTle(string&, string&, string&);
   cTle(const cTle &tle);
   ~cTle();
   
   enum eTleLine
   {
      LINE_ZERO,
      LINE_ONE,
      LINE_TWO
   };

   enum eField
   {
      FLD_FIRST,
      FLD_NORADNUM = FLD_FIRST,
      FLD_INTLDESC,
      FLD_SET,       // TLE set number
      FLD_EPOCHYEAR, // Epoch: Last two digits of year
      FLD_EPOCHDAY,  // Epoch: Fractional Julian Day of year
      FLD_ORBITNUM,  // Orbit at epoch
      FLD_I,         // Inclination
      FLD_RAAN,      // R.A. ascending node
      FLD_E,         // Eccentricity
      FLD_ARGPER,    // Argument of perigee
      FLD_M,         // Mean anomaly
      FLD_MMOTION,   // Mean motion
      FLD_MMOTIONDT, // First time derivative of mean motion
      FLD_MMOTIONDT2,// Second time derivative of mean motion
      FLD_BSTAR,     // BSTAR Drag
      FLD_LAST       // MUST be last
   };

   enum eUnits
   {
      U_FIRST,
      U_RAD = U_FIRST,  // radians
      U_DEG,            // degrees
      U_NATIVE,         // TLE format native units (no conversion)
      U_LAST            // MUST be last
   };
   
   static bool IsValidLine(string&, eTleLine);

   double GetField(eField fld,               // which field to retrieve
                   eUnits unit  = U_NATIVE,  // return units in rad, deg etc.
                   string *pstr = NULL,      // return ptr for str value
                   bool bStrUnits = false)   // 'true': append units to str val
                   const;

   string Name()  const { return m_strLine0; }
   string Line1() const { return m_strLine1; }
   string Line2() const { return m_strLine2; }

protected:
   void Initialize();

   static string ExpToAtof(const string&);
   static double ConvertUnits(double val, eField fld, eUnits units);
   static int    CheckSum(const string&);

   static void TrimLeft(string&);
   static void TrimRight(string&);

private:
   static string GetUnits(eField);

   // Satellite name and two data lines
   string m_strLine0;
   string m_strLine1;
   string m_strLine2;

   // Converted fields, in atof()-readable form
   string m_Field[FLD_LAST];

   // Cache of field values in "double" format
   typedef int FldKey;
   FldKey Key(eUnits u, eField f) const { return (u * 100) + f; }
   mutable map<FldKey, double>  m_mapCache;
};
}
}

///////////////////////////////////////////////////////////////////////////
//
// TLE data format
//
// [Reference: T.S. Kelso]
//
// Two line element data consists of three lines in the following format:
//
//  AAAAAAAAAAAAAAAAAAAAAA
//  1 NNNNNU NNNNNAAA NNNNN.NNNNNNNN +.NNNNNNNN +NNNNN-N +NNNNN-N N NNNNN
//  2 NNNNN NNN.NNNN NNN.NNNN NNNNNNN NNN.NNNN NNN.NNNN NN.NNNNNNNNNNNNNN
//  
//  Line 0 is a twenty-two-character name.
// 
//   Lines 1 and 2 are the standard Two-Line Orbital Element Set Format identical
//   to that used by NORAD and NASA.  The format description is:
//      
//     Line 1
//     Column    Description
//     01-01     Line Number of Element Data
//     03-07     Satellite Number
//     10-11     International Designator (Last two digits of launch year)
//     12-14     International Designator (Launch number of the year)
//     15-17     International Designator (Piece of launch)
//     19-20     Epoch Year (Last two digits of year)
//     21-32     Epoch (Julian Day and fractional portion of the day)
//     34-43     First Time Derivative of the Mean Motion
//               or Ballistic Coefficient (Depending on ephemeris type)
//     45-52     Second Time Derivative of Mean Motion (decimal point assumed;
//               blank if N/A)
//     54-61     BSTAR drag term if GP4 general perturbation theory was used.
//               Otherwise, radiation pressure coefficient.  (Decimal point assumed)
//     63-63     Ephemeris type
//     65-68     Element number
//     69-69     Check Sum (Modulo 10)
//               (Letters, blanks, periods, plus signs = 0; minus signs = 1)
//
//     Line 2
//     Column    Description
//     01-01     Line Number of Element Data
//     03-07     Satellite Number
//     09-16     Inclination [Degrees]
//     18-25     Right Ascension of the Ascending Node [Degrees]
//     27-33     Eccentricity (decimal point assumed)
//     35-42     Argument of Perigee [Degrees]
//     44-51     Mean Anomaly [Degrees]
//     53-63     Mean Motion [Revs per day]
//     64-68     Revolution number at epoch [Revs]
//     69-69     Check Sum (Modulo 10)
//        
//     All other columns are blank or fixed.
//          
// Example:
//      
// NOAA 6
// 1 11416U          86 50.28438588 0.00000140           67960-4 0  5293
// 2 11416  98.5105  69.3305 0012788  63.2828 296.9658 14.24899292346978