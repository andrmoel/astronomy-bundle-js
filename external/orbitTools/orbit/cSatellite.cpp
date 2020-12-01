//
// cSatellite.cpp
// 
// Copyright (c) 2014 Michael F. Henry
// Version 08/2014
//
#include "stdafx.h"

#include "cSatellite.h"
#include "cOrbit.h"

namespace Zeptomoby
{
namespace OrbitTools
{

cSatellite::cSatellite(const cTle& tle, const std::string* pName /* = NULL */)
{
   m_pOrbit = new cOrbit(tle);

   // If specified, override the name of the satellite embedded in the TLE data.
   if (pName != NULL)
   {
      m_pName = new string(*pName);
   }
   else
   {
      m_pName = new string(m_pOrbit->SatName());
   }
}

cSatellite::cSatellite(const cSatellite& src)
{
   cOrbit* pOrbit = dynamic_cast<cOrbit*>(src.m_pOrbit);
   m_pOrbit = new cOrbit(*pOrbit);
   m_pName  = new string(src.Name());
}

cSatellite& cSatellite::operator=(const cSatellite& rhs)
{
   if (this != &rhs)
   {
      delete m_pOrbit;
      delete m_pName;

      cOrbit* pOrbit = dynamic_cast<cOrbit*>(rhs.m_pOrbit);
      m_pOrbit = new cOrbit(*pOrbit);
      m_pName = new string(rhs.Name());
   }

   return *this;
}

cSatellite::~cSatellite()
{
   delete m_pOrbit;
   delete m_pName;
}

std::string cSatellite::Name() const
{
   return m_pOrbit->SatName();
}

// Calculates the ECI position of the satellite at the specified number of
// minutes past the satellite epoch time.
cEciTime cSatellite::PositionEci(double mpe) const
{
   return m_pOrbit->PositionEci(mpe);
}

// Calculates the ECI position of the satellite at the specified time.
cEciTime cSatellite::PositionEci(const cJulian& time) const
{
   double mpe = time.SpanMin(m_pOrbit->Epoch());

   return PositionEci(mpe);
}

}
}