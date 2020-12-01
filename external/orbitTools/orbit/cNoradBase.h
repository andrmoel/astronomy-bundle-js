//
// cNoradBase.h
//
// This class provides a base class for the NORAD SGP4/SDP4
// orbit models.
//
// Copyright (c) 2003-2012 Michael F. Henry
// Version 09/2012
//
#pragma once

//////////////////////////////////////////////////////////////////////////////

namespace Zeptomoby 
{
namespace OrbitTools
{
//////////////////////////////////////////////////////////////////////////////

class cEciTime;
class cOrbit;

//////////////////////////////////////////////////////////////////////////////

class cNoradBase
{
public:
   cNoradBase(const cOrbit&);
   virtual ~cNoradBase() { }

   virtual cEciTime GetPosition(double tsince) = 0;

   virtual cNoradBase* Clone(const cOrbit&) = 0;

protected:
   cNoradBase& operator=(const cNoradBase&);

   cEciTime FinalPosition(double incl, double omega, double  e, double    a, 
                          double   xl, double xnode, double xn, double tsince);

   const cOrbit &m_Orbit;

   // Orbital parameter variables which need only be calculated one
   // time for a given orbit (ECI position time-independent).
   double m_cosio;   double m_sinio;   
   double m_betao2;  double m_betao;   double m_s4;
   double m_qoms24;  double m_tsi;     double m_eta;
   double m_eeta;    double m_coef;    double m_coef1;
   double m_c1;      double m_c3;      double m_c4; 
   double m_a3ovk2;  double m_xmdot;   double m_omgdot;
   double m_xnodot;  double m_xnodcf;  double m_t2cof;
};
}
}