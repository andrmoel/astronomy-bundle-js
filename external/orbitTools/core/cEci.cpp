//
// cEci.cpp
//
// Copyright (c) 2002-2013 Michael F. Henry
// Version 01/2013
//
#include "stdafx.h"

#include "globals.h"
#include "cEci.h"
#include "coord.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

//////////////////////////////////////////////////////////////////////
// Class cEci
//////////////////////////////////////////////////////////////////////
cEci::cEci(const cVector &pos, const cVector &vel)
   : m_Position (pos),
     m_Velocity (vel)
{
}

// Creates a instance of the class from geodetic coordinates.
//
// Assumes the Earth is an oblate spheroid.
// Reference: The 1992 Astronomical Almanac, page K11
// Reference: www.celestrak.com (Dr. T.S. Kelso)
cEci::cEci(const cGeo& geo, cJulian date)
{
   double lat = geo.LatitudeRad();
   double lon = geo.LongitudeRad();
   double alt = geo.AltitudeKm();

   // Calculate Local Mean Sidereal Time (theta)
   double theta = date.ToLmst(lon);
   double c = 1.0 / sqrt(1.0 + F * (F - 2.0) * sqr(sin(lat)));
   double s = sqr(1.0 - F) * c;
   double achcp = (XKMPER_WGS72 * c + alt) * cos(lat);

   m_Position.m_x = achcp * cos(theta);         // km
   m_Position.m_y = achcp * sin(theta);         // km
   m_Position.m_z = (XKMPER_WGS72 * s + alt) * sin(lat);   // km
   m_Position.m_w = sqrt(sqr(m_Position.m_x) +  // range, km
                         sqr(m_Position.m_y) + 
                         sqr(m_Position.m_z));  

   // Determine velocity components due to earth's rotation
   double mfactor = TWOPI * (OMEGA_E / SEC_PER_DAY);

   m_Velocity.m_x = -mfactor * m_Position.m_y;  // km / sec
   m_Velocity.m_y =  mfactor * m_Position.m_x;  // km / sec
   m_Velocity.m_z = 0.0;                        // km / sec
   m_Velocity.m_w = sqrt(sqr(m_Velocity.m_x) +  // range rate km/sec^2
                         sqr(m_Velocity.m_y));
}

//////////////////////////////////////////////////////////////////////
// Class cEciTime
//////////////////////////////////////////////////////////////////////

cEciTime::cEciTime(const cEci &eci, cJulian date) :
   cEci(eci),
   m_Date(date)
{
}

cEciTime::cEciTime(const cVector &pos, const cVector &vel, cJulian date) :
   cEci(pos, vel),
   m_Date(date)
{
}

cEciTime::cEciTime(const cGeo &geo, cJulian date)
   : cEci(geo, date),
     m_Date(date)
{
}

cEciTime::cEciTime(const cGeoTime &geo) 
   : cEci(geo, geo.Date()),
     m_Date(geo.Date())
{
}

}
}