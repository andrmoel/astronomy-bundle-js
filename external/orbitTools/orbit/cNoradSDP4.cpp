//
// cNoradSDP4.cpp
//
// NORAD SDP4 implementation. See header note in cNoradBase.cpp
// Copyright (c) 2003-2014 Michael F. Henry
//
// Version 06/2014
//
#include "stdafx.h"

#include "cEci.h"
#include "cNoradSDP4.h"
#include "cOrbit.h"

namespace Zeptomoby 
{
namespace OrbitTools
{
static const double zes  = 0.01675;
static const double zel  = 0.05490;
static const double zns  = 1.19459e-05; 
static const double znl  = 1.5835218e-04;   
static const double thdt = 4.3752691e-03;

//////////////////////////////////////////////////////////////////////////////
cNoradSDP4::cNoradSDP4(const cOrbit &orbit) :
   cNoradBase(orbit)
{
   double sinarg = sin(m_Orbit.ArgPerigee());
   double cosarg = cos(m_Orbit.ArgPerigee());
   double eqsq   = sqr(m_Orbit.Eccentricity());
   
   // Deep space initialization 
   cJulian jd = m_Orbit.Epoch();

   dp_thgr = jd.ToGmst();

   double eq     = m_Orbit.Eccentricity();
   double aqnv   = 1.0 / m_Orbit.SemiMajor();
   double xmao   = m_Orbit.MeanAnomaly();
   double xpidot = m_omgdot + m_xnodot;
   double sinq   = sin(m_Orbit.RAAN());
   double cosq   = cos(m_Orbit.RAAN());

   // Initialize lunar solar terms 
   double day = jd.FromJan0_12h_1900();
   double dpi_xnodce = 4.5236020 - 9.2422029E-4 * day;
   double dpi_stem   = sin(dpi_xnodce);
   double dpi_ctem   = cos(dpi_xnodce);
   double dpi_zcosil = 0.91375164 - 0.03568096 * dpi_ctem;
   double dpi_zsinil = sqrt(1.0 - dpi_zcosil * dpi_zcosil);
   double dpi_zsinhl = 0.089683511 *dpi_stem / dpi_zsinil;
   double dpi_zcoshl = sqrt(1.0 - dpi_zsinhl * dpi_zsinhl);
   double dpi_c      = 4.7199672 + 0.22997150 * day;
   double dpi_gam    = 5.8351514 + 0.0019443680 * day;
   
   dp_zmol = Fmod2p(dpi_c - dpi_gam);

   double dpi_zx = 0.39785416 * dpi_stem / dpi_zsinil;
   double dpi_zy = dpi_zcoshl * dpi_ctem + 0.91744867 * dpi_zsinhl * dpi_stem;

   dpi_zx = AcTan(dpi_zx,dpi_zy) + dpi_gam - dpi_xnodce;

   double dpi_zcosgl = cos(dpi_zx);
   double dpi_zsingl = sin(dpi_zx);

   dp_zmos   = 6.2565837 + 0.017201977 * day;
   dp_zmos   = Fmod2p(dp_zmos);
   
   const double zcosis = 0.91744867;
   const double zsinis = 0.39785416;     
   const double c1ss   = 2.9864797e-06;
   const double zsings = -0.98088458;
   const double zcosgs =  0.1945905;

   double zcosg = zcosgs;
   double zsing = zsings;
   double zcosi = zcosis;
   double zsini = zsinis;
   double zcosh = cosq;
   double zsinh = sinq;
   double cc  = c1ss;
   double zn  = zns;
   double ze  = zes;
   double xnoi = 1.0 / m_Orbit.MeanMotion();

   double se  = 0.0;  double si = 0.0;  double sl = 0.0;  
   double sgh = 0.0;  double sh = 0.0;

   // Apply the solar and lunar terms on the first pass, then re-apply the
   // solar terms again on the second pass.

   for (int pass = 1; pass <= 2; pass++)
   {
      // Do solar terms 
      double a1  =  zcosg * zcosh + zsing * zcosi * zsinh;
      double a3  = -zsing * zcosh + zcosg * zcosi * zsinh;
      double a7  = -zcosg * zsinh + zsing * zcosi * zcosh;
      double a8  = zsing * zsini;
      double a9  = zsing * zsinh + zcosg * zcosi * zcosh;
      double a10 = zcosg * zsini;

      double a2 = m_cosio * a7 +  m_sinio * a8;
      double a4 = m_cosio * a9 +  m_sinio * a10;
      double a5 = -m_sinio * a7 +  m_cosio * a8;
      double a6 = -m_sinio * a9 +  m_cosio * a10;
      double x1 = a1 * cosarg + a2 * sinarg;
      double x2 = a3 * cosarg + a4 * sinarg;
      double x3 = -a1 * sinarg + a2 * cosarg;
      double x4 = -a3 * sinarg + a4 * cosarg;
      double x5 = a5 * sinarg;
      double x6 = a6 * sinarg;
      double x7 = a5 * cosarg;
      double x8 = a6 * cosarg;
      double z31 = 12.0 * x1 * x1 - 3.0 * x3 * x3;
      double z32 = 24.0 * x1 * x2 - 6.0 * x3 * x4;
      double z33 = 12.0 * x2 * x2 - 3.0 * x4 * x4;
      double z1 = 3.0 * (a1 * a1 + a2 * a2) + z31 * eqsq;
      double z2 = 6.0 * (a1 * a3 + a2 * a4) + z32 * eqsq;
      double z3 = 3.0 * (a3 * a3 + a4 * a4) + z33 * eqsq;
      double z11 = -6.0 * a1 * a5 + eqsq*(-24.0 * x1 * x7 - 6.0 * x3 * x5);
      double z12 = -6.0 * (a1 * a6 + a3 * a5) +
                   eqsq * (-24.0 * (x2 * x7 + x1 * x8) - 6.0 * (x3 * x6 + x4 * x5));
      double z13 = -6.0 * a3 * a6 + eqsq * (-24.0 * x2 * x8 - 6.0 * x4 * x6);
      double z21 = 6.0 * a2 * a5 + eqsq * (24.0 * x1 * x5 - 6.0 * x3 * x7);
      double z22 = 6.0*(a4 * a5 + a2 * a6) +
                   eqsq * (24.0 * (x2 * x5 + x1 * x6) - 6.0 * (x4 * x7 + x3 * x8));
      double z23 = 6.0 * a4 * a6 + eqsq*(24.0 * x2 * x6 - 6.0 * x4 * x8);
      z1 = z1 + z1 + m_betao2 * z31;
      z2 = z2 + z2 + m_betao2 * z32;
      z3 = z3 + z3 + m_betao2 * z33;
      double s3  = cc * xnoi;
      double s2  = -0.5 * s3 / m_betao;
      double s4  = s3 * m_betao;
      double s1  = -15.0 * eq * s4;
      double s5  = x1 * x3 + x2 * x4;
      double s6  = x2 * x3 + x1 * x4;
      double s7  = x2 * x4 - x1 * x3;
      se  = s1 * zn * s5;
      si  = s2 * zn * (z11 + z13);
      sl  = -zn * s3 * (z1 + z3 - 14.0 - 6.0 * eqsq);
      sgh =  s4 * zn * (z31 + z33 - 6.0);
      sh  = -zn * s2 * (z21 + z23);

      if (m_Orbit.Inclination() < 5.2359877E-2)
      {
         sh = 0.0;
      }

      dp_ee2 =  2.0 * s1 * s6;
      dp_e3  =  2.0 * s1 * s7;
      dp_xi2 =  2.0 * s2 * z12;
      dp_xi3 =  2.0 * s2 * (z13 - z11);
      dp_xl2 = -2.0 * s3 * z2;
      dp_xl3 = -2.0 * s3 * (z3 - z1);
      dp_xl4 = -2.0 * s3 * (-21.0 - 9.0 * eqsq) * ze;
      dp_xgh2 = 2.0 * s4 * z32;
      dp_xgh3 = 2.0 * s4 * (z33 - z31);
      dp_xgh4 = -18.0 * s4 * ze;
      dp_xh2 = -2.0 * s2 * z22;
      dp_xh3 = -2.0 * s2 * (z23 - z21);

      if (pass == 1)
      {
         // Do lunar terms 
         dp_sse = se;
         dp_ssi = si;
         dp_ssl = sl;
         dp_ssh = sh / m_sinio;
         dp_ssg = sgh - m_cosio * dp_ssh;
         dp_se2 = dp_ee2;
         dp_si2 = dp_xi2;
         dp_sl2 = dp_xl2;
         dp_sgh2 = dp_xgh2;
         dp_sh2 = dp_xh2;
         dp_se3 = dp_e3;
         dp_si3 = dp_xi3;
         dp_sl3 = dp_xl3;
         dp_sgh3 = dp_xgh3;
         dp_sh3 = dp_xh3;
         dp_sl4 = dp_xl4;
         dp_sgh4 = dp_xgh4;
         zcosg = dpi_zcosgl;
         zsing = dpi_zsingl;
         zcosi = dpi_zcosil;
         zsini = dpi_zsinil;
         zcosh = dpi_zcoshl * cosq + dpi_zsinhl * sinq;
         zsinh = sinq * dpi_zcoshl - cosq * dpi_zsinhl;
         zn = znl;

         const double c1l = 4.7968065e-07;

         cc = c1l;
         ze = zel;
      }
   }

   dp_sse = dp_sse + se;
   dp_ssi = dp_ssi + si;
   dp_ssl = dp_ssl + sl;
   dp_ssg = dp_ssg + sgh - m_cosio / m_sinio * sh;
   dp_ssh = dp_ssh + sh / m_sinio;

   // Geopotential resonance initialization
   gp_reso = false;
   gp_sync = false;

   double g310;
   double f220;
   double bfact = 0.0;

   // Determine if orbit is 24- or 12-hour resonant.
   // Mean motion is given in radians per minute.
   if ((m_Orbit.MeanMotion() > 0.0034906585) && (m_Orbit.MeanMotion() < 0.0052359877))
   {
      // Orbit is within the Clarke Belt (period is 24-hour resonant).
      // Synchronous resonance terms initialization
      gp_reso = true;
      gp_sync = true;

      double g200 = 1.0 + eqsq * (-2.5 + 0.8125 * eqsq);

      g310 = 1.0 + 2.0 * eqsq;

      double g300 = 1.0 + eqsq * (-6.0 + 6.60937 * eqsq);

      f220 = 0.75 * (1.0 + m_cosio) * (1.0 + m_cosio);

      double f311 = 0.9375 * m_sinio * m_sinio * (1.0 + 3 * m_cosio) - 0.75 * (1.0 + m_cosio);
      double f330 = 1.0 + m_cosio;

      const double q22 = 1.7891679e-06;
      const double q31 = 2.1460748e-06;   
      const double q33 = 2.2123015e-07;   

      f330 = 1.875 * f330 * f330 * f330;
      dp_del1 = 3.0 * m_Orbit.MeanMotion() * m_Orbit.MeanMotion() * aqnv * aqnv;
      dp_del2 = 2.0 * dp_del1 * f220 * g200 * q22;
      dp_del3 = 3.0 * dp_del1 * f330 * g300 * q33 * aqnv;
      dp_del1 = dp_del1 * f311 * g310 * q31 * aqnv;
      dp_xlamo = xmao + m_Orbit.RAAN() + m_Orbit.ArgPerigee() - dp_thgr;
      bfact = m_xmdot + xpidot - thdt;
      bfact = bfact + dp_ssl + dp_ssg + dp_ssh;
   }
   else if (((m_Orbit.MeanMotion() >= 8.26E-03) && (m_Orbit.MeanMotion() <= 9.24E-03)) && (eq >= 0.5))
   {
      // Period is 12-hour resonant
      gp_reso = true;

      double eoc  = eq * eqsq;
      double g201 = -0.306 - (eq - 0.64) * 0.440;

      double g211;   double g322;
      double g410;   double g422;   
      double g520;

      if (eq <= 0.65)
      {
         g211 =    3.616 -  13.247  * eq + 16.290   * eqsq;
         g310 =  -19.302 +  117.390 * eq - 228.419  * eqsq + 156.591  * eoc;
         g322 = -18.9068 + 109.7927 * eq - 214.6334 * eqsq + 146.5816 * eoc;
         g410 =  -41.122 +  242.694 * eq - 471.094  * eqsq +  313.953 * eoc;
         g422 = -146.407 +  841.880 * eq - 1629.014 * eqsq + 1083.435 * eoc;
         g520 = -532.114 + 3017.977 * eq - 5740.0   * eqsq + 3708.276 * eoc;
      }
      else
      {
         g211 =   -72.099 +  331.819 * eq -  508.738 * eqsq +  266.724 * eoc;
         g310 =  -346.844 + 1582.851 * eq - 2415.925 * eqsq + 1246.113 * eoc;
         g322 =  -342.585 + 1554.908 * eq - 2366.899 * eqsq + 1215.972 * eoc;
         g410 = -1052.797 + 4758.686 * eq - 7193.992 * eqsq + 3651.957 * eoc;
         g422 = -3581.69  + 16178.11 * eq - 24462.77 * eqsq + 12422.52 * eoc;

         if (eq <= 0.715)
         {
            g520 = 1464.74 - 4664.75 * eq + 3763.64 * eqsq;
         }
         else
         {
            g520 = -5149.66 + 29936.92 * eq - 54087.36 * eqsq + 31324.56 * eoc;
         }
      }

      double g533;   
      double g521;   
      double g532;

      if (eq < 0.7)
      {
         g533 = -919.2277  + 4988.61   * eq - 9064.77   * eqsq + 5542.21  * eoc;
         g521 = -822.71072 + 4568.6173 * eq - 8491.4146 * eqsq + 5337.524 * eoc;
         g532 = -853.666   + 4690.25   * eq - 8624.77   * eqsq + 5341.4   * eoc;
      }
      else
      {
         g533 = -37995.78  + 161616.52 * eq - 229838.2  * eqsq + 109377.94 * eoc;
         g521 = -51752.104 + 218913.95 * eq - 309468.16 * eqsq + 146349.42 * eoc;
         g532 = -40023.88  + 170470.89 * eq - 242699.48 * eqsq + 115605.82 * eoc;
      }

      double sini2  = sqr(m_sinio);
      double theta2 = sqr(m_cosio);

      f220 = 0.75 * (1.0 + 2.0 * m_cosio + theta2);

      const double root22 = 1.7891679e-06;
      const double root32 = 3.7393792e-07;
      const double root44 = 7.3636953e-09;
      const double root52 = 1.1428639e-07;
      const double root54 = 2.1765803e-09;   

      double f221 = 1.5 * sini2;
      double f321 =  1.875 * m_sinio * (1.0 - 2.0 * m_cosio - 3.0 * theta2);
      double f322 = -1.875 * m_sinio * (1.0 + 2.0 * m_cosio - 3.0 * theta2);
      double f441 = 35.0 * sini2 * f220;
      double f442 = 39.3750 * sini2 * sini2;
      double f522 = 9.84375 * m_sinio * (sini2 * (1.0 - 2.0 * m_cosio - 5.0 * theta2) +
                    0.33333333*(-2.0 + 4.0 * m_cosio + 6.0 * theta2));
      double f523 = m_sinio * (4.92187512 * sini2 * (-2.0 - 4.0 * m_cosio + 10.0 * theta2) +
                    6.56250012 * (1.0 + 2.0 * m_cosio - 3.0 * theta2));
      double f542 = 29.53125 * m_sinio * ( 2.0 - 8.0 * m_cosio + theta2 * (-12.0 + 8.0 * m_cosio + 10.0 * theta2));
      double f543 = 29.53125 * m_sinio * (-2.0 - 8.0 * m_cosio + theta2 * ( 12.0 + 8.0 * m_cosio - 10.0 * theta2));
      double xno2 = m_Orbit.MeanMotion() * m_Orbit.MeanMotion();
      double ainv2 = aqnv * aqnv;
      double temp1 = 3.0 * xno2 * ainv2;
      double temp  = temp1 * root22;

      dp_d2201 = temp * f220 * g201;
      dp_d2211 = temp * f221 * g211;
      temp1 = temp1 * aqnv;
      temp = temp1 * root32;
      dp_d3210 = temp * f321 * g310;
      dp_d3222 = temp * f322 * g322;
      temp1 = temp1 * aqnv;
      temp = 2.0 * temp1 * root44;
      dp_d4410 = temp * f441 * g410;
      dp_d4422 = temp * f442 * g422;
      temp1 = temp1 * aqnv;
      temp  = temp1 * root52;
      dp_d5220 = temp * f522 * g520;
      dp_d5232 = temp * f523 * g532;
      temp = 2.0 * temp1 * root54;
      dp_d5421 = temp * f542 * g521;
      dp_d5433 = temp * f543 * g533;
      dp_xlamo = xmao + m_Orbit.RAAN() + m_Orbit.RAAN() - dp_thgr - dp_thgr;
      bfact = m_xmdot + m_xnodot + m_xnodot - thdt - thdt;
      bfact = bfact + dp_ssl + dp_ssh + dp_ssh;
   }

   if (gp_reso || gp_sync)
   {
      dp_xfact = bfact - m_Orbit.MeanMotion();

      // Initialize integrator 
      dp_xli   = dp_xlamo;
      dp_xni   = m_Orbit.MeanMotion();
      dp_atime = 0.0;
      dp_stepp = 720.0;
      dp_stepn = -720.0;
      dp_step2 = 259200.0;
   }
   else
   {
      dp_xfact = 0.0;
      dp_xli   = 0.0;
      dp_xni   = 0.0;
      dp_atime = 0.0;
      dp_stepp = 0.0;
      dp_stepn = 0.0;
      dp_step2 = 0.0;
   }
}

//////////////////////////////////////////////////////////////////////////////
cNoradSDP4::~cNoradSDP4()
{
}


//////////////////////////////////////////////////////////////////////////////
bool cNoradSDP4::DeepCalcDotTerms(double *pxndot, double *pxnddt, double *pxldot)
{
   const double fasx2 = 0.13130908;
   const double fasx4 = 2.8843198;
   const double fasx6 = 0.37448087;

   // Dot terms calculated 
   if (gp_sync)
   {
      *pxndot = dp_del1 * sin(dp_xli - fasx2) + 
                dp_del2 * sin(2.0 * (dp_xli - fasx4)) +
                dp_del3 * sin(3.0 * (dp_xli - fasx6));
      *pxnddt = dp_del1 * cos(dp_xli - fasx2) +
                2.0 * dp_del2 * cos(2.0 * (dp_xli - fasx4)) +
                3.0 * dp_del3 * cos(3.0 * (dp_xli - fasx6));
   }
   else
   {
      const double g22 = 5.7686396;
      const double g32 = 0.95240898;
      const double g44 = 1.8014998;
      const double g52 = 1.0508330;      
      const double g54 = 4.4108898;

      double xomi  = m_Orbit.ArgPerigee() + m_omgdot * dp_atime;
      double x2omi = xomi + xomi;
      double x2li  = dp_xli + dp_xli;

      *pxndot = dp_d2201 * sin(x2omi + dp_xli - g22) + 
                dp_d2211 * sin(dp_xli - g22)         +
                dp_d3210 * sin( xomi + dp_xli - g32) +
                dp_d3222 * sin(-xomi + dp_xli - g32) +
                dp_d4410 * sin(x2omi + x2li - g44)   +
                dp_d4422 * sin(x2li - g44)           +
                dp_d5220 * sin( xomi + dp_xli - g52) +
                dp_d5232 * sin(-xomi + dp_xli - g52) +
                dp_d5421 * sin( xomi + x2li - g54)   +
                dp_d5433 * sin(-xomi + x2li - g54);

      *pxnddt = dp_d2201 * cos(x2omi + dp_xli - g22) +
                dp_d2211 * cos(dp_xli - g22)         +
                dp_d3210 * cos( xomi + dp_xli - g32) +
                dp_d3222 * cos(-xomi + dp_xli - g32) +
                dp_d5220 * cos( xomi + dp_xli - g52) +
                dp_d5232 * cos(-xomi + dp_xli - g52) +
                2.0 * (dp_d4410 * cos(x2omi + x2li - g44) +
                dp_d4422 * cos(x2li - g44)         +
                dp_d5421 * cos( xomi + x2li - g54) +
                dp_d5433 * cos(-xomi + x2li - g54));
   }

   *pxldot = dp_xni + dp_xfact;
   *pxnddt = (*pxnddt) * (*pxldot);

   return true;
}

//////////////////////////////////////////////////////////////////////////////
void cNoradSDP4::DeepCalcIntegrator(double *pxndot, double *pxnddt, 
                                    double *pxldot, double delt)
{
   DeepCalcDotTerms(pxndot, pxnddt, pxldot);

   dp_xli = dp_xli + (*pxldot) * delt + (*pxndot) * dp_step2;
   dp_xni = dp_xni + (*pxndot) * delt + (*pxnddt) * dp_step2;
   dp_atime = dp_atime + delt;
}

//////////////////////////////////////////////////////////////////////////////
bool cNoradSDP4::DeepSecular(double *xmdf, double *omgadf, double *xnode,
                             double *emm,  double *xincc,  double *xnn,
                             double tsince)
{
   // Deep space secular effects 
   *xmdf   = (*xmdf)   + dp_ssl * tsince;
   *omgadf = (*omgadf) + dp_ssg * tsince;
   *xnode  = (*xnode)  + dp_ssh * tsince;
   *emm    = m_Orbit.Eccentricity() + dp_sse * tsince;
   *xincc  = m_Orbit.Inclination()  + dp_ssi * tsince;

   if ((*xincc) < 0.0)
   {
      *xincc  = -(*xincc);
      *xnode  = (*xnode)  + PI;
      *omgadf = (*omgadf) - PI;
   }

   double xnddt = 0.0;
   double xndot = 0.0;
   double xldot = 0.0;
   double ft    = 0.0;
   double delt  = 0.0;

   bool fDone = false;

   if (gp_reso) 
   {
      while (!fDone)
      {
         if ((dp_atime == 0.0)                     ||
            ((tsince >= 0.0) && (dp_atime <  0.0)) ||
            ((tsince <  0.0) && (dp_atime >= 0.0)))
         {
            delt = (tsince < 0) ? dp_stepn : dp_stepp;

            // Epoch restart 
            dp_atime = 0.0;
            dp_xni = m_Orbit.MeanMotion();
            dp_xli = dp_xlamo;

            fDone = true;
         }
         else
         {
            if (fabs(tsince) < fabs(dp_atime))
            {
               delt = dp_stepp;

               if (tsince >= 0.0)
               {
                  delt = dp_stepn;
               }

               DeepCalcIntegrator(&xndot, &xnddt, &xldot, delt);
            }
            else
            {
               delt = dp_stepn;

               if (tsince > 0.0)
               {
                  delt = dp_stepp;
               }

               fDone = true;
            }
         }
      }

      while (fabs(tsince - dp_atime) >= dp_stepp)
      {
         DeepCalcIntegrator(&xndot, &xnddt, &xldot, delt);
      }

      ft = tsince - dp_atime;

      DeepCalcDotTerms(&xndot, &xnddt, &xldot);

      *xnn = dp_xni + xndot * ft + xnddt * ft * ft * 0.5;

      double xl   = dp_xli + xldot * ft + xndot * ft * ft * 0.5;
      double temp = -(*xnode) + dp_thgr + tsince * thdt;

      *xmdf = xl - (*omgadf) + temp;

      if (!gp_sync)
      {
         *xmdf = xl + temp + temp;
      }
   }

   return true;
}

//////////////////////////////////////////////////////////////////////////////
bool cNoradSDP4::DeepPeriodics(double *e,      double *xincc,
                               double *omgadf, double *xnode,
                               double *xmam,   double tsince)
{
   // Lunar-solar periodics 
   double sinis = sin(*xincc);
   double cosis = cos(*xincc);

   double sghs = 0.0;
   double shs  = 0.0;
   double sh1  = 0.0;
   double pe   = 0.0;
   double pinc = 0.0;
   double pl   = 0.0;
   double sghl = 0.0;

   // In SGP4-1980, the lunar-solar terms were recalculated only when the 
   // propagation time changed by 30 minutes or more in order to save
   // CPU effort. This could cause "choppy" ephemerides for some orbits.
   // Here the terms are calculated for all propagation times.
   
   // Apply lunar-solar terms
   double zm = dp_zmos + zns * tsince;
   double zf = zm + 2.0 * zes * sin(zm);
   double sinzf = sin(zf);
   double f2  = 0.5 * sinzf * sinzf - 0.25;
   double f3  = -0.5 * sinzf * cos(zf);
   double ses = dp_se2 * f2 + dp_se3 * f3;
   double sis = dp_si2 * f2 + dp_si3 * f3;
   double sls = dp_sl2 * f2 + dp_sl3 * f3 + dp_sl4 * sinzf;

   sghs = dp_sgh2 * f2 + dp_sgh3 * f3 + dp_sgh4 * sinzf;
   shs  = dp_sh2  * f2 + dp_sh3  * f3;
   zm = dp_zmol + znl * tsince;
   zf = zm + 2.0 * zel * sin(zm);
   sinzf = sin(zf);
   f2 = 0.5 * sinzf * sinzf - 0.25;
   f3 = -0.5 * sinzf * cos(zf);

   double sel  = dp_ee2 * f2 + dp_e3  * f3;
   double sil  = dp_xi2 * f2 + dp_xi3 * f3;
   double sll  = dp_xl2 * f2 + dp_xl3 * f3 + dp_xl4 * sinzf;

   sghl = dp_xgh2 * f2 + dp_xgh3 * f3 + dp_xgh4 * sinzf;
   sh1  = dp_xh2  * f2 + dp_xh3  * f3;
   pe   = ses + sel;
   pinc = sis + sil;
   pl   = sls + sll;

   double pgh  = sghs + sghl;
   double ph   = shs  + sh1;

   *xincc = (*xincc) + pinc;
   *e  = (*e) + pe;

   if (m_Orbit.Inclination() >= 0.2)
   {
      // Apply periodics directly 
      ph  = ph / m_sinio;
      pgh = pgh - m_cosio * ph;
      *omgadf = (*omgadf) + pgh;
      *xnode  = (*xnode) + ph;
      *xmam   = (*xmam) + pl;
   }
   else
   {
      // Apply periodics with Lyddane modification 
      double sinok = sin(*xnode);
      double cosok = cos(*xnode);
      double alfdp = sinis * sinok;
      double betdp = sinis * cosok;
      double dalf  =  ph * cosok + pinc * cosis * sinok;
      double dbet  = -ph * sinok + pinc * cosis * cosok;

      alfdp = alfdp + dalf;
      betdp = betdp + dbet;

      double xls = (*xmam) + (*omgadf) + cosis * (*xnode);
      double dls = pl + pgh - pinc * (*xnode) * sinis;

      xls     = xls + dls;
      *xnode  = AcTan(alfdp, betdp);
      *xmam   = (*xmam) + pl;
      *omgadf = xls - (*xmam) - cos(*xincc) * (*xnode);
   }

   return true;
}

//////////////////////////////////////////////////////////////////////////////
// This procedure returns the ECI position and velocity for the satellite
// in the orbit at the given number of minutes since the TLE epoch time
// using the NORAD Simplified General Perturbation 4, "deep space" orbit
// model.
//
// tsince - Time in minutes since the TLE epoch (GMT).
cEciTime cNoradSDP4::GetPosition(double tsince)
{
   // Update for secular gravity and atmospheric drag 
   double xmdf   = m_Orbit.MeanAnomaly() + m_xmdot  * tsince;
   double omgadf = m_Orbit.ArgPerigee()  + m_omgdot * tsince;
   double xnoddf = m_Orbit.RAAN() + m_xnodot * tsince;
   double tsq    = tsince * tsince;
   double xnode  = xnoddf + m_xnodcf * tsq;
   double tempa  = 1.0 - m_c1 * tsince;
   double tempe  = m_Orbit.BStar() * m_c4 * tsince;
   double templ  = m_t2cof * tsq;
   double xn     = m_Orbit.MeanMotion();
   double em;
   double xinc;

   DeepSecular(&xmdf, &omgadf, &xnode, &em, &xinc, &xn, tsince);

   double a    = pow(XKE / xn, 2.0 / 3.0) * sqr(tempa);
   double e    = em - tempe;
   double xmam = xmdf + m_Orbit.MeanMotion() * templ;

   DeepPeriodics(&e, &xinc, &omgadf, &xnode, &xmam, tsince);

   double xl = xmam + omgadf + xnode;

   xn = XKE / pow(a, 1.5);

   return FinalPosition(xinc, omgadf, e, a, xl, xnode, xn, tsince);
}
}
}