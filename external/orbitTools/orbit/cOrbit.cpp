//
// cOrbit.cpp
//
// Copyright (c) 2002-2014 Michael F. Henry
//
// Version 08/2014
// 
#include "stdafx.h"

#include "cEci.h"
#include "cOrbit.h"
#include "cNoradSGP4.h"
#include "cNoradSDP4.h"

namespace Zeptomoby
{
namespace OrbitTools
{
//////////////////////////////////////////////////////////////////////
cOrbit::cOrbit(const cTle &tle) :
   m_tle(tle),
   m_pNoradModel(NULL)
{
   InitializeCachingVars();

   int    epochYear = (int)m_tle.GetField(cTle::FLD_EPOCHYEAR);
   double epochDay  =      m_tle.GetField(cTle::FLD_EPOCHDAY );

   if (epochYear < 57)
   {
      epochYear += 2000;
   }
   else
   {
      epochYear += 1900;
   }

   m_jdEpoch = cJulian(epochYear, epochDay);

   m_secPeriod = -1.0;

   // Recover the original mean motion and semimajor axis from the
   // input elements.
   double mm     = MeanMotionTle();
   double rpmin  = mm * TWOPI / MIN_PER_DAY;   // rads per minute

   double a1     = pow(XKE / rpmin, 2.0 / 3.0);
   double e      = Eccentricity();
   double i      = Inclination();
   double temp   = (1.5 * CK2 * (3.0 * sqr(cos(i)) - 1.0) / 
                   pow(1.0 - e * e, 1.5));   
   double delta1 = temp / (a1 * a1);
   double a0     = a1 * 
                   (1.0 - delta1 * 
                   ((1.0 / 3.0) + delta1 * 
                   (1.0 + 134.0 / 81.0 * delta1)));

   double delta0 = temp / (a0 * a0);

   m_rmMeanMotionRec    = rpmin / (1.0 + delta0);
   m_aeAxisSemiMajorRec = a0 / (1.0 - delta0);
   m_aeAxisSemiMinorRec = m_aeAxisSemiMajorRec * sqrt(1.0 - (e * e));
   m_kmPerigeeRec       = XKMPER_WGS72 * (m_aeAxisSemiMajorRec * (1.0 - e) - AE);
   m_kmApogeeRec        = XKMPER_WGS72 * (m_aeAxisSemiMajorRec * (1.0 + e) - AE);

   if (TWOPI / m_rmMeanMotionRec >= 225.0)
   {
      // SDP4 - period >= 225 minutes.
      m_pNoradModel = new cNoradSDP4(*this);
   }
   else
   {
      // SGP4 - period < 225 minutes
      m_pNoradModel = new cNoradSGP4(*this);
   }
}

/////////////////////////////////////////////////////////////////////////////
// Copy constructor
cOrbit::cOrbit(const cOrbit& src) :
  m_tle(src.m_tle),
  m_jdEpoch(src.m_jdEpoch),
  m_pNoradModel(NULL),
  m_rmMeanMotionRec(src.m_rmMeanMotionRec),    
  m_aeAxisSemiMajorRec(src.m_aeAxisSemiMajorRec),
  m_aeAxisSemiMinorRec(src.m_aeAxisSemiMinorRec),
  m_kmPerigeeRec(src.m_kmPerigeeRec),
  m_kmApogeeRec(src.m_kmApogeeRec),
  m_secPeriod(src.m_secPeriod)
{
   InitializeCachingVars();

   try
   {
      m_pNoradModel = src.m_pNoradModel->Clone(*this);
   }
   catch (...)
   {
      delete m_pNoradModel;
      throw;
   }
}

/////////////////////////////////////////////////////////////////////////////
cOrbit& cOrbit::operator=(const cOrbit& rhs)
{
   if (this != &rhs)
   {
      m_tle       = rhs.m_tle;
      m_jdEpoch   = rhs.m_jdEpoch;

      InitializeCachingVars();

      m_secPeriod = rhs.m_secPeriod;

      m_rmMeanMotionRec    = rhs.MeanMotion();
      m_aeAxisSemiMajorRec = rhs.SemiMajor();
      m_aeAxisSemiMinorRec = rhs.SemiMinor();
      m_kmPerigeeRec       = rhs.Perigee();    
      m_kmApogeeRec        = rhs.Apogee();     

      cNoradBase *pNoradModel = NULL;

      try
      {
         pNoradModel = rhs.m_pNoradModel->Clone(*this);
      }
      catch (...)
      {
         delete pNoradModel;
         throw;
      }

      delete m_pNoradModel;
      m_pNoradModel = pNoradModel;
   }

   return *this;
}

/////////////////////////////////////////////////////////////////////////////
cOrbit::~cOrbit()
{
   delete m_pNoradModel;
}

/////////////////////////////////////////////////////////////////////////////
void cOrbit::InitializeCachingVars()
{
   m_Inclination   = RadGet(cTle::FLD_I);
   m_Eccentricity  = m_tle.GetField(cTle::FLD_E);
   m_RAAN          = RadGet(cTle::FLD_RAAN);
   m_ArgPerigee    = RadGet(cTle::FLD_ARGPER);  
   m_BStar         = m_tle.GetField(cTle::FLD_BSTAR) / AE;
   m_Drag          = m_tle.GetField(cTle::FLD_MMOTIONDT);
   m_TleMeanMotion = m_tle.GetField(cTle::FLD_MMOTION);
   m_MeanAnomaly   = RadGet(cTle::FLD_M);
}

//////////////////////////////////////////////////////////////////////////////
// Return the period in seconds
double cOrbit::Period() const
{
   if (m_secPeriod < 0.0)
   {
      // Calculate the period using the recovered mean motion.
      if (m_rmMeanMotionRec == 0)
      {
         m_secPeriod = 0.0;
      }
      else
      {
         m_secPeriod = TWOPI / m_rmMeanMotionRec * 60.0;
      }
   }

   return m_secPeriod;
}

//////////////////////////////////////////////////////////////////////////////
// Returns elapsed number of seconds from epoch to given time.
// Note: "Predicted" TLEs can have epochs in the future.
double cOrbit::TPlusEpoch(const cJulian &gmt) const
{
   return gmt.SpanSec(Epoch());
}

//////////////////////////////////////////////////////////////////////////////
// Deprecated - use PositionEci()
cEciTime cOrbit::GetPosition(double mpe) const
{
   return PositionEci(mpe);
}

//////////////////////////////////////////////////////////////////////////////
// This procedure returns the ECI position and velocity for the satellite
// at the given number of minutes past the (GMT) TLE epoch. The vectors 
// returned in the ECI object are kilometer-based.
cEciTime cOrbit::PositionEci(double mpe) const
{
   cEciTime eci = m_pNoradModel->GetPosition(mpe);

   // Convert ECI vector units from AU to kilometers
   double radiusAe = XKMPER_WGS72 / AE;

   eci.ScalePosVector(radiusAe);                          // km
   eci.ScaleVelVector(radiusAe * (MIN_PER_DAY / 86400));  // km/sec

   return eci;
}

//////////////////////////////////////////////////////////////////////////////
// SatName()
// Return the name of the satellite. If requested, the NORAD number is
// appended to the end of the name, i.e., "ISS (ZARYA) #25544".
// The name of the satellite with the NORAD number appended is important
// because many satellites, especially debris, have the same name and
// would otherwise appear to be the same satellite in output data.
string cOrbit::SatName(bool fAppendId /* = false */) const
{
   string str = m_tle.Name();

   if (fAppendId)
   {
      str = str + " #" + SatId();
   }

   return str;
}

//////////////////////////////////////////////////////////////////////////////
// SatId()
// Return the NORAD number of the satellite.
string cOrbit::SatId() const
{
   string strId;

   m_tle.GetField(cTle::FLD_NORADNUM, cTle::U_NATIVE, &strId);

   return strId;
}
}
}