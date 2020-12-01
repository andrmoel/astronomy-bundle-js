//
// exceptions.h
//
// Copyright (c) 2010 Michael F. Henry
//
#pragma once

#include "cJulian.h"

namespace Zeptomoby 
{
namespace OrbitTools
{
///////////////////////////////////////////////////////////////////////////////
class cPropagationException
{
public:
   cPropagationException() {}
   cPropagationException(const string& message)  { m_Message = message; }
   ~cPropagationException() {}

   string Message() { return m_Message; }

private:
   string m_Message;
};

///////////////////////////////////////////////////////////////////////////////
class cDecayException: public cPropagationException
{
public:
   cDecayException(cJulian decayTime, string satelliteName)
   {
      m_DecayTime     = decayTime;
      m_SatelliteName = satelliteName;
   }

   // The GMT when the satellite orbit decays.
   cJulian GetDecayTime() { return m_DecayTime; }

   // The name of the satellite whose orbit decayed
   string GetSatelliteName() { return m_SatelliteName; }

private:
   cJulian m_DecayTime;
   string  m_SatelliteName;
};
}
}