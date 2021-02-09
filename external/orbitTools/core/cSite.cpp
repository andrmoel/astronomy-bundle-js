//
// cSite.cpp
//
// Copyright (c) 2003-2014 Michael F. Henry
// Version 06/2014
//
#include "stdafx.h"
#include "globals.h"
#include "cSite.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

//////////////////////////////////////////////////////////////////////////////
// Construction/Destruction
cSite::cSite(const cGeo &geo) : m_Geo(geo)
{}

//////////////////////////////////////////////////////////////////////////////
// c'tor accepting:
//    Latitude  in degrees (negative south)
//    Longitude in degrees (negative west)
//    Altitude  in km
//    Site name
cSite::cSite(double degLat, double degLon, double kmAlt, const string& name) :
   m_Geo(deg2rad(degLat), deg2rad(degLon), kmAlt),
   m_Name(name)
{}

//////////////////////////////////////////////////////////////////////////////
// c'tor accepting:
//    Latitude  in degrees (negative south)
//    Longitude in degrees (negative west)
//    Altitude  in km
cSite::cSite(double degLat, double degLon, double kmAlt) :
   m_Geo(deg2rad(degLat), deg2rad(degLon), kmAlt)
{}

cSite::~cSite()
{}

//////////////////////////////////////////////////////////////////////////////
// Return the ECI coordinate of the site at the given time.
cEciTime cSite::PositionEci(const cJulian &date) const
{
   return cEciTime(m_Geo, date);
}

//////////////////////////////////////////////////////////////////////////////
// Deprecated - use PositionEci() instead.
cEciTime cSite::GetPosition(const cJulian &date) const
{
   return cEciTime(m_Geo, date);
}

//////////////////////////////////////////////////////////////////////////////
// GetLookAngle()
// Return the topocentric (azimuth, elevation, etc.) coordinates for a target
// object located at the given ECI coordinates.
cTopo cSite::GetLookAngle(const cEciTime &eci) const
{
   // Calculate the ECI coordinates for this cSite object at the time
   // of interest.
   cJulian  date = eci.Date();
   cEciTime eciSite(m_Geo, date); 

   cVector vecRgRate(eci.Velocity().m_x - eciSite.Velocity().m_x,
                     eci.Velocity().m_y - eciSite.Velocity().m_y,
                     eci.Velocity().m_z - eciSite.Velocity().m_z);

   double x = eci.Position().m_x - eciSite.Position().m_x;
   double y = eci.Position().m_y - eciSite.Position().m_y;
   double z = eci.Position().m_z - eciSite.Position().m_z;
   double w = sqrt(sqr(x) + sqr(y) + sqr(z));

   cVector vecRange(x, y, z, w);

   // The site's Local Mean Sidereal Time at the time of interest.
   double theta = date.ToLmst(LongitudeRad());

   double sin_lat   = sin(LatitudeRad());
   double cos_lat   = cos(LatitudeRad());
   double sin_theta = sin(theta);
   double cos_theta = cos(theta);

   double top_s = sin_lat * cos_theta * vecRange.m_x + 
                  sin_lat * sin_theta * vecRange.m_y - 
                  cos_lat * vecRange.m_z;
   double top_e = -sin_theta * vecRange.m_x + 
                   cos_theta * vecRange.m_y;
   double top_z = cos_lat * cos_theta * vecRange.m_x + 
                  cos_lat * sin_theta * vecRange.m_y + 
                  sin_lat * vecRange.m_z;
   double az    = atan(-top_e / top_s);

   if (top_s > 0.0)
   {
      az += PI;
   }

   if (az < 0.0)
   {
      az += 2.0*PI;
   }

   double el   = asin(top_z / vecRange.m_w);
   double rate = (vecRange.m_x * vecRgRate.m_x + 
                  vecRange.m_y * vecRgRate.m_y + 
                  vecRange.m_z * vecRgRate.m_z) / vecRange.m_w;

#ifdef WANT_ATMOSPHERIC_CORRECTION
   double saveEl = el;

   // Elevation correction for atmospheric refraction.
   // Reference:  Astronomical Algorithms by Jean Meeus, pp. 101-104
   // Note:  Correction is meaningless when apparent elevation is below horizon
   el += deg2rad((1.02 / 
                 tan(deg2rad(rad2deg(el) + 10.3 / 
                            (rad2deg(el) + 5.11)))) / 60.0);
   if (el < 0.0)
   {
      // Reset to true elevation
      el = saveEl;
   }

   if (el > (PI / 2))
   {
      el = (PI / 2);
   }
#endif

   cTopo topo(az,           // azimuth,   radians
              el,           // elevation, radians
              vecRange.m_w, // range, km
              rate);        // rate,  km / sec

   return topo;
}

//////////////////////////////////////////////////////////////////////////////
// ToString()
//
string cSite::ToString() const
{
   if (m_Name.length() == 0)
   {
      return m_Geo.ToString();
   }
   else
   {
      return m_Name + " " + m_Geo.ToString();
   }
}

}
}