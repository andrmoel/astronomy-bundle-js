//
// cOrbit.h
//
// This is the header file for the class cOrbit. This class accepts a
// single satellite's NORAD two-line element set and provides information 
// regarding the satellite's orbit such as period, axis length,
// ECI coordinates/velocity, etc., using the SGP4/SDP4 orbital models.
// 
// Copyright (c) 2002-2012 Michael F. Henry
//
// 08/2012
//
#pragma once

#include "cTle.h"
#include "cJulian.h"
#include "cEci.h"
#include "cVector.h"
#include "cNoradBase.h"

//////////////////////////////////////////////////////////////////////////////

namespace Zeptomoby
{
namespace OrbitTools
{

//////////////////////////////////////////////////////////////////////////////
class cOrbit  
{
public:
   cOrbit(const cTle &tle);
   cOrbit(const cOrbit& src);
   cOrbit& operator=(const cOrbit& rhs);
   virtual ~cOrbit();

   // Return satellite ECI data at given minutes past epoch.
   cEciTime PositionEci(double mpe) const;
   cEciTime GetPosition(double mpe) const; // Deprecated, use PositionEci().
   
   double Inclination()   const { return m_Inclination;   }
   double Eccentricity()  const { return m_Eccentricity;  }
   double RAAN()          const { return m_RAAN;          }
   double ArgPerigee()    const { return m_ArgPerigee;    }
   double BStar()         const { return m_BStar;         }
   double Drag()          const { return m_Drag;          }
   double MeanMotionTle() const { return m_TleMeanMotion; }
   double MeanAnomaly()   const { return m_MeanAnomaly;   }

   cJulian Epoch() const { return m_jdEpoch; }

   double TPlusEpoch(const cJulian &t) const;    // time span [t - epoch] in secs

   string SatName(bool fAppendId = false) const;
   string SatId() const;

   string TleLine1() const { return m_tle.Line1(); }
   string TleLine2() const { return m_tle.Line2(); }
   
   // "Recovered" from the input elements
   double SemiMajor()  const { return m_aeAxisSemiMajorRec; }
   double SemiMinor()  const { return m_aeAxisSemiMinorRec; }
   double MeanMotion() const { return m_rmMeanMotionRec;    }  // mean motion, rads/min
   double Major()      const { return 2.0 * SemiMajor();    }  // major axis in AE
   double Minor()      const { return 2.0 * SemiMinor();    }  // minor axis in AE
   double Perigee()    const { return m_kmPerigeeRec;       }  // perigee in km
   double Apogee()     const { return m_kmApogeeRec;        }  // apogee in km
   double Period()     const;                                  // period in seconds

protected:
   double RadGet(cTle::eField fld) const { return m_tle.GetField(fld, cTle::U_RAD); }
   double DegGet(cTle::eField fld) const { return m_tle.GetField(fld, cTle::U_DEG); }

private:
   cTle        m_tle;
   cJulian     m_jdEpoch;
   cNoradBase *m_pNoradModel;

   // Caching variables; note units are not necessarily the same as tle units
   mutable double m_secPeriod;

   // Caching variables for standard TLE elements
   double m_Inclination;
   double m_Eccentricity;
   double m_RAAN;
   double m_ArgPerigee;
   double m_BStar;
   double m_Drag;
   double m_TleMeanMotion;
   double m_MeanAnomaly;

   // Caching variables recovered from the input TLE elements
   double m_aeAxisSemiMajorRec;  // semimajor axis, in AE units
   double m_aeAxisSemiMinorRec;  // semiminor axis, in AE units
   double m_rmMeanMotionRec;     // radians per minute
   double m_kmPerigeeRec;        // perigee, in km
   double m_kmApogeeRec;         // apogee, in km

   void InitializeCachingVars();
};
}
}