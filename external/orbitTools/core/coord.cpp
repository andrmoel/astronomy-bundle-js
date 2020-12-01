//
// coord.cpp
//
// Copyright (c) 2003-2013 Michael F. Henry
// Version 01/2013
//
#include "stdafx.h"

#include "coord.h"
#include "cEci.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

//////////////////////////////////////////////////////////////////////
// cGeo Class
//////////////////////////////////////////////////////////////////////

cGeo::cGeo(double latRad, double lonRad, double altKm)
   : m_Lat(latRad), 
     m_Lon(lonRad), 
     m_Alt(altKm)
{
}

cGeo::cGeo(const cEci& eci, cJulian date)
{
   Construct(eci.Position(),
             fmod((AcTan(eci.Position().m_y, eci.Position().m_x) - date.ToGmst()), TWOPI));
}

void cGeo::Construct(const cVector &posEcf, double theta)
{
   theta = fmod(theta, TWOPI);
   
   if (theta  < 0.0) 
   {
      theta += TWOPI;  // "wrap" negative modulo
   }

   double kmSemiMaj = XKMPER_WGS72;

   double r   = sqrt(sqr(posEcf.m_x) + sqr(posEcf.m_y));
   double e2  = F * (2.0 - F);
   double lat = AcTan(posEcf.m_z, r);

   const double delta = 1.0e-07;
   double phi;
   double c;

   do   
   {
      phi = lat;
      c   = 1.0 / sqrt(1.0 - e2 * sqr(sin(phi)));
      lat = AcTan(posEcf.m_z + kmSemiMaj * c * e2 * sin(phi), r);
   }
   while (fabs(lat - phi) > delta);
   
   m_Lat = lat;
   m_Lon = theta;
   m_Alt = r / cos(lat) - kmSemiMaj * c;
}

// Converts to a string representation of the form "38.0N 045.0W 500m".
string cGeo::ToString() const
{
   const int BUF_SIZE = 128;
   char sz[BUF_SIZE];

   bool isNorth = (LatitudeRad()  >= 0.0);
   bool isEast  = (LongitudeRad() >= 0.0);

   _snprintf_s(sz, BUF_SIZE, 
               "%04.3f%c %05.3f%c %.1fm", 
               fabs(LatitudeDeg()),  (isNorth ? 'N' : 'S'),
               fabs(LongitudeDeg()), (isEast  ? 'E' : 'W'),
               AltitudeKm() * 1000.0);

   string strLoc = sz;

   return strLoc;
}

//////////////////////////////////////////////////////////////////////
// cGeoTime Class
//////////////////////////////////////////////////////////////////////
cGeoTime::cGeoTime(const cGeo &geo, cJulian date)
   : cGeo(geo),
     m_Date(date)
{
}

cGeoTime::cGeoTime(double latRad, double lonRad, double altKm, cJulian date)
   : cGeo(latRad, lonRad, altKm),
     m_Date(date)
{
}

cGeoTime::cGeoTime(const cEci &eci, cJulian date)
   : cGeo(eci, date),
     m_Date(date)
{
}

cGeoTime::cGeoTime(const cEciTime &eci)
   : cGeo(eci, eci.Date()),
     m_Date(eci.Date())
{
}

//////////////////////////////////////////////////////////////////////
// cTopo Class
//////////////////////////////////////////////////////////////////////

cTopo::cTopo(double azRad, double elRad, double rangeKm, double rateKmSec) 
   : m_Az(azRad), 
     m_El(elRad),
     m_Range(rangeKm), 
     m_RangeRate(rateKmSec)
{
}

//////////////////////////////////////////////////////////////////////
// cTopoTime Class
//////////////////////////////////////////////////////////////////////

cTopoTime::cTopoTime(const cTopo& topo, cJulian date)
   : cTopo(topo),
     m_Date(date)
{
}

cTopoTime::cTopoTime(double azRad, double elRad, double range, double rangeRate, cJulian date)
   : cTopo(azRad, elRad, range, rangeRate),
     m_Date(date)
{
}

}
}