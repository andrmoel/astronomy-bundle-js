//
// cNoradSGP4.h
//
// This class implements the NORAD Simple General Perturbation 4 orbit
// model. This model provides the ECI coordinates/velocity of satellites
// with orbit periods less than 225 minutes.
//
// Copyright (c) 2003-2010 Michael F. Henry
//
#pragma once

#include "cNoradBase.h"

namespace Zeptomoby 
{
namespace OrbitTools
{

class cOrbit;

//////////////////////////////////////////////////////////////////////////////
class cNoradSGP4 : public cNoradBase
{
public:
   cNoradSGP4(const cOrbit &orbit);
   virtual ~cNoradSGP4();

   virtual cEciTime GetPosition(double tsince);

   virtual cNoradBase* Clone(const cOrbit& orbit) { return new cNoradSGP4(orbit); }

protected:
   double m_c5; 
   double m_omgcof;
   double m_xmcof;
   double m_delmo;
   double m_sinmo;
};
}
}