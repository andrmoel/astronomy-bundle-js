//
// coord.h
//
// Copyright 2002-2014 Michael F. Henry
// Version 06/2014
//
#pragma once

#include "cJulian.h"
#include "cVector.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

class cEci;
class cEcf;
class cEciTime;

//////////////////////////////////////////////////////////////////////
// Geocentric coordinates.
class cGeo  
{
public:
   cGeo(const cEci& eci, cJulian date);
   cGeo(double latRad, double lonRad, double altKm);

   virtual ~cGeo() {}

   double LatitudeRad()  const { return m_Lat; }
   double LongitudeRad() const { return m_Lon; }

   double LatitudeDeg()  const { return rad2deg(m_Lat); }
   double LongitudeDeg() const { return rad2deg(m_Lon); }

   double AltitudeKm() const     { return m_Alt; }
   void   AltitudeKm(double alt) { m_Alt = alt;  }

   virtual string ToString() const;

protected:
   void Construct(const cVector &posEcf, double theta);

   double m_Lat;   // Latitude,  radians (negative south)
   double m_Lon;   // Longitude, radians (negative west)
   double m_Alt;   // Altitude,  km      (above ellipsoid height)
};

//////////////////////////////////////////////////////////////////////
// Geocentric coordinates and associated time
class cGeoTime : public cGeo
{
public:
   cGeoTime(const cGeo &geo, cJulian date);
   cGeoTime(double latRad, double lonRad, double altKm, cJulian date);
   cGeoTime(const cEci &eci, cJulian date);
   cGeoTime(const cEciTime &eci);
   virtual ~cGeoTime() {};
      
   cJulian Date() const { return m_Date; }

protected:
   cJulian m_Date;
};

//////////////////////////////////////////////////////////////////////
// Topocentric-Horizon coordinates.
class cTopo  
{
public:
   cTopo(double azRad, double elRad, double rangeKm, double rateKmSec);
   virtual ~cTopo() {};

   double AzimuthRad()     const { return m_Az; }
   double ElevationRad()   const { return m_El; }

   double AzimuthDeg()     const { return rad2deg(m_Az); }
   double ElevationDeg()   const { return rad2deg(m_El); }

   double RangeKm()        const { return m_Range;     }
   double RangeRateKmSec() const { return m_RangeRate; }

protected:
   double m_Az;         // Azimuth, radians
   double m_El;         // Elevation, radians
   double m_Range;      // Range, kilometers
   double m_RangeRate;  // Range rate of change, km/sec
                        // Negative value means "towards observer"
};

//////////////////////////////////////////////////////////////////////
// Topocentric-Horizon coordinates and associated time
class cTopoTime : public cTopo
{
public:
   cTopoTime(const cTopo& topo, cJulian date);
   cTopoTime(double azRad, double elRad, double range, double rangeRate, cJulian date);
   virtual ~cTopoTime() {};

   cJulian Date() const { return m_Date; }

protected:
   cJulian m_Date;
};

}
}