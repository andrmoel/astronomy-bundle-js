//
// cSatellite.h
//
// Copyright (c) 2014 Michael F. Henry
// Version 07/2014
//
#pragma once

#include <string>
#include "cTle.h"
#include "cEci.h"
#include "cOrbit.h"

using namespace Zeptomoby::OrbitTools;

namespace Zeptomoby 
{
namespace OrbitTools
{

class cSatellite
{
public:
   cSatellite(const cTle& tle, const std::string* pName = NULL);
   cSatellite(const cSatellite& src);
   cSatellite& operator=(const cSatellite& rhs);
   ~cSatellite();

   string   Name() const;
   cEciTime PositionEci(const cJulian& time) const;
   cEciTime PositionEci(double mpe) const;

   const cOrbit& Orbit() const { return *m_pOrbit; }      

protected:
   cOrbit* m_pOrbit;
   string* m_pName;
};

}
}