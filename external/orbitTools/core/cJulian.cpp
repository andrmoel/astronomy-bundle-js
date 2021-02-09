//
// cJulian.cpp
//
// This class encapsulates Julian date system where the day begins at noon.
// Some Julian dates:
//    01/01/1990 00:00 UTC - 2447892.5
//    01/01/1990 12:00 UTC - 2447893.0
//    01/01/2000 00:00 UTC - 2451544.5
//    01/01/2001 00:00 UTC - 2451910.5
//
// Note the Julian day begins at noon, which allows astronomers one date
// for a single observing session.
//
// References:
// - "Astronomical Formulae for Calculators", Jean Meeus, Fourth Edition
//    See pages 23-29, "Julian Day and Calendar Date"
// - "Satellite Communications", Dennis Roddy, 2nd Edition, 1995.
// - "Spacecraft Attitude Determination and Control", James R. Wertz, 1984
//    Details of this Julian system, including the selection of the epoch date.
//
// Copyright (c) 2003-2014 Michael F. Henry
//
// Version 06/2014
//
#include "stdafx.h"
#include "globals.h"
#include "cJulian.h"

namespace Zeptomoby 
{
namespace OrbitTools
{
//////////////////////////////////////////////////////////////////////////////
// Create a Julian date object from a time_t object. time_t objects store the
// number of seconds since midnight UTC January 1, 1970.
cJulian::cJulian(time_t time)
{
   struct tm stm;
   
   gmtime_s(&stm, &time);

   int    year = stm.tm_year + 1900;
   double day  = stm.tm_yday + 1 +
                 (stm.tm_hour + 
                  ((stm.tm_min + 
                   (stm.tm_sec / 60.0)) / 60.0)) / 24.0;

   Initialize(year, day);
}

//////////////////////////////////////////////////////////////////////////////
// Create a Julian date object from a year and day of year.
// Example parameters: year = 2001, day = 1.5 (Jan 1 12h)
cJulian::cJulian(int year, double day)
{
   Initialize(year, day);
}

//////////////////////////////////////////////////////////////////////////////
// Create a Julian date object.
cJulian::cJulian(int year,               // i.e., 2004
                 int mon,                // 1..12
                 int day,                // 1..31
                 int hour,               // 0..23
                 int min,                // 0..59
                 double sec /* = 0.0 */) // 0..(59.999999...)

{
   // Calculate N, the day of the year (1..366)
   int N;
   int F1 = (int)((275.0 * mon) / 9.0);
   int F2 = (int)((mon + 9.0) / 12.0);

   if (IsLeapYear(year))
   {
      // Leap year
      N = F1 - F2 + day - 30;
   }
   else
   {
      // Common year
      N = F1 - (2 * F2) + day - 30;
   }
   
   double dblDay = N + (hour + (min + (sec / 60.0)) / 60.0) / 24.0;

   Initialize(year, dblDay);
}

//////////////////////////////////////////////////////////////////////////////
void cJulian::Initialize(int year, double day)
{
   // 1582 A.D.: 10 days removed from calendar
   // 3000 A.D.: Arbitrary error checking limit
   assert((year > 1582) && (year < 3000));
   assert((day >= 1.0) && (day < 367.0));

   // Now calculate Julian date

   year--;

   // Centuries are not leap years unless they divide by 400
   int A = (year / 100);
   int B = 2 - A + (A / 4);

   double NewYears = (int)(365.25 * year) +
                     (int)(30.6001 * 14)  + 
                     1720994.5 + B;  // 1720994.5 = Oct 30, year -1

   m_Date = NewYears + day;
}

//////////////////////////////////////////////////////////////////////////////
// getComponent()
// Return requested components of date.
// Year : Includes the century.
// Month: 1..12
// Day  : 1..31 including fractional part
void cJulian::GetComponent(int    *pYear, 
                           int    *pMon  /* = NULL */,
                           double *pDOM  /* = NULL */) const
{
   assert(pYear != NULL);

   double jdAdj = Date() + 0.5;
   int    Z     = (int)jdAdj;  // integer part
   double F     = jdAdj - Z;   // fractional part
   double alpha = (int)((Z - 1867216.25) / 36524.25);
   double A     = Z + 1 + alpha - (int)(alpha / 4.0);
   double B     = A + 1524.0;
   int    C     = (int)((B - 122.1) / 365.25);
   int    D     = (int)(C * 365.25);
   int    E     = (int)((B - D) / 30.6001);

   double DOM   = B - D - (int)(E * 30.6001) + F;
   int    month = (E < 13.5) ? (E - 1) : (E - 13);
   int    year  = (month > 2.5) ? (C - 4716) : (C - 4715); 
   
   *pYear = year;

   if (pMon != NULL)
   {
      *pMon = month;
   }

   if (pDOM != NULL)
   {
      *pDOM = DOM;
   }
} 

//////////////////////////////////////////////////////////////////////////////
// ToGmst()
// Calculate Greenwich Mean Sidereal Time for the Julian date. The return value
// is the angle, in radians, measuring eastward from the Vernal Equinox to the
// prime meridian. This angle is also referred to as "ThetaG" (Theta GMST).
// 
// References:
//    The 1992 Astronomical Almanac, page B6.
//    Explanatory Supplement to the Astronomical Almanac, page 50.
//    Orbital Coordinate Systems, Part III, Dr. T.S. Kelso, Satellite Times,
//       Nov/Dec 1995
double cJulian::ToGmst() const
{
   const double UT = fmod(m_Date + 0.5, 1.0);
   const double TU = (FromJan1_12h_2000() - UT) / 36525.0;

   double GMST = 24110.54841 + TU * 
                 (8640184.812866 + TU * (0.093104 - TU * 6.2e-06));

   GMST = fmod(GMST + SEC_PER_DAY * OMEGA_E * UT, SEC_PER_DAY);
   
   if (GMST < 0.0)
   {
      GMST += SEC_PER_DAY;  // "wrap" negative modulo value
   }

   return  (TWOPI * (GMST / SEC_PER_DAY));
 }

//////////////////////////////////////////////////////////////////////////////
// ToLmst()
// Calculate Local Mean Sidereal Time for given longitude (for this date).
// The longitude is assumed to be in radians measured west from Greenwich.
// The return value is the angle, in radians, measuring eastward from the
// Vernal Equinox to the given longitude.
double cJulian::ToLmst(double lon) const
{
   return fmod(ToGmst() + lon, TWOPI);
}

//////////////////////////////////////////////////////////////////////////////
// ToTime()
// Convert to type time_t
// Avoid using this function as it discards the fractional seconds of the
// time component.
time_t cJulian::ToTime() const
{
   int    nYear;
   int    nMonth;
   double dblDay;

   GetComponent(&nYear, &nMonth, &dblDay);

   // dblDay is the fractional Julian Day (i.e., 29.5577).
   // Save the whole number day in nDOM and convert dblDay to
   // the fractional portion of day.
   int nDOM = (int)dblDay;

   dblDay -= nDOM;

   const int SEC_PER_MIN = 60;
   const int SEC_PER_HR  = 60 * SEC_PER_MIN;
   const int SEC_PER_DAY = 24 * SEC_PER_HR;

   int secs = (int)((dblDay * SEC_PER_DAY) + 0.5);

   // Create a "struct tm" type. 
   // NOTE:
   // The "struct tm" type has a 1-second resolution. Any fractional
   // component of the "seconds" time value is discarded.
   struct tm tGMT;
   memset(&tGMT, 0, sizeof(tGMT));

   tGMT.tm_year = nYear - 1900;  // 2001 is 101
   tGMT.tm_mon  = nMonth - 1;    // January is 0
   tGMT.tm_mday = nDOM;          // First day is 1
   tGMT.tm_hour = secs / SEC_PER_HR;
   tGMT.tm_min  = (secs % SEC_PER_HR) / SEC_PER_MIN;
   tGMT.tm_sec  = (secs % SEC_PER_HR) % SEC_PER_MIN;
   tGMT.tm_isdst = 0; // No conversion desired

   time_t tEpoch = mktime(&tGMT);

   if (tEpoch != -1)
   {
      // Valid time_t value returned from mktime().
      // mktime() expects a local time which means that tEpoch now needs 
      // to be adjusted by the difference between this time zone and GMT.
      long secDelta;

      _get_timezone(&secDelta);

      tEpoch -= secDelta;
   }

   return tEpoch;
}
}
}