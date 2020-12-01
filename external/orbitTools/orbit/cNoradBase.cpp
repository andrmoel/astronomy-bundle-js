//
// cNoradBase.cpp
//
// The equations used here (and in derived classes) to determine satellite 
// ECI coordinates/velocity come from the December, 1980 NORAD document 
// "Space Track Report No. 3". The report details 6 orbital models and 
// provides FORTRAN IV implementations of each. The classes here 
// implement only two of the orbital models: SGP4 and SDP4. These two models, 
// one for "near-earth" objects and one for "deep space" objects, are widely
// used in satellite tracking software and can produce very accurate results
// when used with current NORAD two-line element datum.
//
// For excellent information on the underlying physics of orbits, visible 
// satellite observations, current NORAD TLE data, and other related material,
// see http://www.celestrak.com which is maintained by Dr. TS Kelso.
//
// Copyright (c) 2003-2010 Michael F. Henry
//
// mfh 12/2010
//
#include "StdAfx.h"
#include "cNoradBase.h"
#include "cOrbit.h"
#include "coord.h"
#include "cEci.h"
#include "cVector.h"
#include "cJulian.h"
#include "exceptions.h"

namespace Zeptomoby 
{
namespace OrbitTools
{

//////////////////////////////////////////////////////////////////////////////
cNoradBase::cNoradBase(const cOrbit &orbit) :
   m_Orbit(orbit)
{
   // Initialize any variables which are time-independent when
   // calculating the ECI coordinates of the satellite.
   m_sinio = sin(m_Orbit.Inclination());
   m_cosio = cos(m_Orbit.Inclination());

   double theta2 = m_cosio * m_cosio;
   double x3thm1 = 3.0 * theta2 - 1.0;
   double eosq   = sqr(m_Orbit.Eccentricity());

   m_betao2 = 1.0 - eosq;
   m_betao  = sqrt(m_betao2);

   // For perigee below 156 km, the values of S and QOMS2T are altered.
   double rp      = m_Orbit.SemiMajor() * (1.0 - m_Orbit.Eccentricity());
   double perigee = (rp - 1.0) * XKMPER_WGS72;

   double Qo = AE + 120.0 / XKMPER_WGS72;
   double S  = AE +  78.0 / XKMPER_WGS72;

   m_s4     = S;
   m_qoms24 = pow((Qo - S), 4); //(QO - S)^4 ER^4

   m_s4      = S;
   m_qoms24  = QOMS2T;

   if (perigee < 156.0)
   {
      m_s4 = perigee - 78.0;

      if (perigee <= 98.0)
      {
         m_s4 = 20.0;
      }

      m_qoms24 = pow((120.0 - m_s4) * AE / XKMPER_WGS72, 4.0);
      m_s4 = m_s4 / XKMPER_WGS72 + AE;
   }

   const double pinvsq = 1.0 / (sqr(m_Orbit.SemiMajor()) * sqr(m_betao2));

   m_tsi   = 1.0 / (m_Orbit.SemiMajor() - m_s4);
   m_eta   = m_Orbit.SemiMajor() * m_Orbit.Eccentricity() * m_tsi;
   m_eeta  = m_Orbit.Eccentricity() * m_eta;

   const double etasq = m_eta * m_eta;
   const double psisq = fabs(1.0 - etasq);

   m_coef  = m_qoms24 * pow(m_tsi, 4.0);
   m_coef1 = m_coef   / pow(psisq, 3.5);

   const double c2 = m_coef1 * m_Orbit.MeanMotion() * 
                     (m_Orbit.SemiMajor() * (1.0 + 1.5 * etasq + m_eeta * (4.0 + etasq)) +
                     0.75 * CK2 * m_tsi / psisq * x3thm1 * 
                     (8.0 + 3.0 * etasq * (8.0 + etasq)));

   m_c1 = m_Orbit.BStar() * c2;
   m_a3ovk2 = -XJ3 / CK2 * pow(AE,3.0);

   m_c3 = m_coef * m_tsi * m_a3ovk2 * m_Orbit.MeanMotion() * AE * m_sinio / m_Orbit.Eccentricity();

   const double x1mth2 = 1.0 - theta2;
   m_c4     = 2.0 * m_Orbit.MeanMotion() * m_coef1 * m_Orbit.SemiMajor() * m_betao2 * 
              (m_eta * (2.0 + 0.5 * etasq) +
              m_Orbit.Eccentricity() * (0.5 + 2.0 * etasq) - 
              2.0 * CK2 * m_tsi / (m_Orbit.SemiMajor() * psisq) *
              (-3.0 * x3thm1 * (1.0 - 2.0 * m_eeta + etasq * (1.5 - 0.5 * m_eeta)) +
              0.75 * x1mth2 * 
              (2.0 * etasq - m_eeta * (1.0 + etasq)) * 
              cos(2.0 * m_Orbit.ArgPerigee())));

   const double theta4 = theta2 * theta2;
   const double temp1  = 3.0 * CK2 * pinvsq * m_Orbit.MeanMotion();;
   const double temp2  = temp1 * CK2 * pinvsq;
   const double temp3  = 1.25 * CK4 * pinvsq * pinvsq * m_Orbit.MeanMotion();;

   m_xmdot = m_Orbit.MeanMotion() + 0.5 * temp1 * m_betao * x3thm1 +
             0.0625 * temp2 * m_betao * 
             (13.0 - 78.0 * theta2 + 137.0 * theta4);

   const double x1m5th = 1.0 - 5.0 * theta2;

   m_omgdot = -0.5 * temp1 * x1m5th + 0.0625 * temp2 * 
              (7.0 - 114.0 * theta2 +  395.0 * theta4) +
              temp3 * (3.0 - 36.0 * theta2 + 49.0 * theta4);

   const double xhdot1 = -temp1 * m_cosio;

   m_xnodot = xhdot1 + (0.5 * temp2 * (4.0 - 19.0 * theta2) +
              2.0 * temp3 * (3.0 - 7.0 * theta2)) * m_cosio;
   m_xnodcf = 3.5 * m_betao2 * xhdot1 * m_c1;
   m_t2cof  = 1.5 * m_c1;
}

//////////////////////////////////////////////////////////////////////////////
cNoradBase& cNoradBase::operator=(const cNoradBase &b)
{
   // m_Orbit is a "const" member var, so cast away its
   // "const-ness" in order to complete the assigment.
   *(const_cast<cOrbit*>(&m_Orbit)) = b.m_Orbit;

   return *this;
}

//////////////////////////////////////////////////////////////////////////////
cEciTime cNoradBase::FinalPosition(double incl, double  omega, 
                                   double    e, double      a,
                                   double   xl, double  xnode, 
                                   double   xn, double tsince)
{
   if ((e * e) > 1.0)
   {
      throw cPropagationException("Error in satellite data");
   }

   double beta = sqrt(1.0 - e * e);

   // Long period periodics 
   double axn  = e * cos(omega);
   double temp = 1.0 / (a * beta * beta);

   double sinip = sin(m_Orbit.Inclination());
   double cosip = cos(m_Orbit.Inclination());
   double aycof = 0.25 * m_a3ovk2 * sinip;
   double xlcof = (0.125 * m_a3ovk2 * sinip * (3.0 + 5.0 * cosip)) / 
                  (1.0 + cosip);
   double xll  = temp * xlcof * axn;
   double aynl = temp * aycof;
   double xlt  = xl + xll;
   double ayn  = e * sin(omega) + aynl;

   const double E6A = 1.0e-06;

   // Solve Kepler's Equation 

   double capu   = Fmod2p(xlt - xnode);
   double temp2  = capu;
   double temp3  = 0.0;
   double temp4  = 0.0;
   double temp5  = 0.0;
   double temp6  = 0.0;
   double sinepw = 0.0;
   double cosepw = 0.0;
   bool   fDone  = false;

   for (int i = 1; (i <= 10) && !fDone; i++)
   {
      sinepw = sin(temp2);
      cosepw = cos(temp2);
      temp3 = axn * sinepw;
      temp4 = ayn * cosepw;
      temp5 = axn * cosepw;
      temp6 = ayn * sinepw;

      double epw = (capu - temp4 + temp3 - temp2) / 
                   (1.0 - temp5 - temp6) + temp2;

      if (fabs(epw - temp2) <= E6A)
      {
         fDone = true;
      }
      else
      {
         temp2 = epw;
      }
   }

   // Short period preliminary quantities 
   double ecose = temp5 + temp6;
   double esine = temp3 - temp4;
   double elsq  = axn * axn + ayn * ayn;
   temp  = 1.0 - elsq;
   double pl = a * temp;
   double r  = a * (1.0 - ecose);
   double temp1 = 1.0 / r;
   double rdot  = XKE * sqrt(a) * esine * temp1;
   double rfdot = XKE * sqrt(pl) * temp1;
   temp2 = a * temp1;
   double betal = sqrt(temp);
   temp3 = 1.0 / (1.0 + betal);
   double cosu  = temp2 * (cosepw - axn + ayn * esine * temp3);
   double sinu  = temp2 * (sinepw - ayn - axn * esine * temp3);
   double u     = AcTan(sinu, cosu);
   double sin2u = 2.0 * sinu * cosu;
   double cos2u = 2.0 * cosu * cosu - 1.0;

   temp  = 1.0 / pl;
   temp1 = CK2 * temp;
   temp2 = temp1 * temp;

   // Update for short periodics 
   double cosip2 = cosip * cosip;
   double x3thm1 = 3.0 * cosip2 - 1.0;
   double x1mth2 = 1.0 - cosip2;
   double x7thm1 = 7.0 * cosip2 - 1.0;
   double rk = r * (1.0 - 1.5 * temp2 * betal * x3thm1) + 
               0.5 * temp1 * x1mth2 * cos2u;
   double uk = u - 0.25 * temp2 * x7thm1 * sin2u;
   double xnodek = xnode + 1.5 * temp2 * m_cosio * sin2u;
   double xinck  = incl + 1.5 * temp2 * m_cosio * m_sinio * cos2u;
   double rdotk  = rdot - xn * temp1 * x1mth2 * sin2u;
   double rfdotk = rfdot + xn * temp1 * (x1mth2 * cos2u + 1.5 * x3thm1);

   // Orientation vectors 
   double sinuk  = sin(uk);
   double cosuk  = cos(uk);
   double sinik  = sin(xinck);
   double cosik  = cos(xinck);
   double sinnok = sin(xnodek);
   double cosnok = cos(xnodek);
   double xmx = -sinnok * cosik;
   double xmy = cosnok * cosik;
   double ux  = xmx * sinuk + cosnok * cosuk;
   double uy  = xmy * sinuk + sinnok * cosuk;
   double uz  = sinik * sinuk;
   double vx  = xmx * cosuk - cosnok * sinuk;
   double vy  = xmy * cosuk - sinnok * sinuk;
   double vz  = sinik * cosuk;

   // Position
   double x = rk * ux;
   double y = rk * uy;
   double z = rk * uz;

   cVector vecPos(x, y, z);

   // Validate on altitude
   double altKm = (vecPos.Magnitude() * (XKMPER_WGS72 / AE));

   if (altKm < XKMPER_WGS72)
   {
      cJulian decayTime = m_Orbit.Epoch();

      decayTime.AddMin(tsince);
      throw cDecayException(decayTime, m_Orbit.SatName(true));
   }
   
   // Velocity
   double xdot = rdotk * ux + rfdotk * vx;
   double ydot = rdotk * uy + rfdotk * vy;
   double zdot = rdotk * uz + rfdotk * vz;

   cVector vecVel(xdot, ydot, zdot);

   cJulian gmt = m_Orbit.Epoch();
   gmt.AddMin(tsince);

   cEciTime eci = cEciTime(vecPos, vecVel, gmt);

   return eci;
}
}
}