//
// cEci.h
//
// Copyright (c) 2003-2013 Michael F. Henry
// Version 01/2013
//
#pragma once

#include "globals.h"
#include "cVector.h"
#include "cJulian.h"

namespace Zeptomoby 
{
namespace OrbitTools 
{

class cGeo;
class cGeoTime;

//////////////////////////////////////////////////////////////////////
// class cEci
//////////////////////////////////////////////////////////////////////
class cEci
{
public:
   cEci(const cVector &pos, const cVector &vel);
   cEci(const cGeo &geo, cJulian date);
  
   virtual ~cEci() {};

   const cVector& Position() const { return m_Position; }
   const cVector& Velocity() const { return m_Velocity; }

   void ScalePosVector(double factor) { m_Position.Mul(factor); }
   void ScaleVelVector(double factor) { m_Velocity.Mul(factor); }

protected:
   cVector  m_Position;
   cVector  m_Velocity;
};

//////////////////////////////////////////////////////////////////////
// class cEciTime
//////////////////////////////////////////////////////////////////////
class cEciTime : public cEci
{
public:
   cEciTime(const cEci &eci, cJulian date);
   cEciTime(const cVector &pos, const cVector &vel, cJulian date);
   cEciTime(const cGeo &geo, cJulian date);
   cEciTime(const cGeoTime &geo);

   virtual ~cEciTime() {};

   cJulian Date() const { return m_Date; }

protected:
   cJulian m_Date;
};

}
}