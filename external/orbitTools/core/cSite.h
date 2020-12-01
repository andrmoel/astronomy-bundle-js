//
// cSite.h: interface for the cSite class.
//
// Copyright 2002-2014 Michael F. Henry
// Version 06/2014

#pragma once

#include "coord.h"
#include "cEci.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

//////////////////////////////////////////////////////////////////////
// class cSite
// This class represents a ground site location on the earth.
class cSite  
{
public:
   cSite(double degLat, double degLon, double kmAlt, const string& name);
   cSite(double degLat, double degLon, double kmAlt);
   cSite(const cGeo &geo);
   virtual ~cSite();

   cGeo GetGeo() const { return m_Geo; }

   cEciTime PositionEci (const cJulian& ) const;   // Calc ECI of geo location
   cEciTime GetPosition (const cJulian& ) const;   // Deprecated, use PositionEci()
   cTopo    GetLookAngle(const cEciTime&) const;   // Calc topo coords of ECI object

   double LatitudeRad()  const { return m_Geo.LatitudeRad();  }
   double LongitudeRad() const { return m_Geo.LongitudeRad(); }

   double LatitudeDeg()  const { return m_Geo.LatitudeDeg();  }
   double LongitudeDeg() const { return m_Geo.LongitudeDeg(); }

   double AltitudeKm()   const { return m_Geo.AltitudeKm();   }

   string Name()     const { return m_Name; };
   string ToString() const;

protected:
   cGeo   m_Geo;  // Site coordinates
   string m_Name; // Site name
};
}
}