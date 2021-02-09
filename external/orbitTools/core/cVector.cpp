//
// cVector.cpp
//
// Copyright (c) 2001-2010 Michael F. Henry
//
#include "stdafx.h"

#include "cVector.h"

namespace Zeptomoby 
{
namespace OrbitTools
{
//*****************************************************************************
// Multiply each component in the vector by 'factor'.
//*****************************************************************************
void cVector::Mul(double factor)
{
   m_x *= factor;
   m_y *= factor;
   m_z *= factor;
   m_w *= fabs(factor);
}

//*****************************************************************************
// Subtract a vector from this one.
//*****************************************************************************
void cVector::Sub(const cVector& vec)
{
   m_x -= vec.m_x;
   m_y -= vec.m_y;
   m_z -= vec.m_z;
   m_w -= vec.m_w;
}

//*****************************************************************************
// Calculate the angle between this vector and another
//*****************************************************************************
double cVector::Angle(const cVector& vec) const
{
  return acos(Dot(vec) / (Magnitude() * vec.Magnitude()));
}

//*****************************************************************************
//
//*****************************************************************************
double cVector::Magnitude() const
{
  return sqrt((m_x * m_x) + 
              (m_y * m_y) + 
              (m_z * m_z));
}

//*****************************************************************************
// Return the dot product
//*****************************************************************************
double cVector::Dot(const cVector& vec) const
{
   return (m_x * vec.m_x) +
          (m_y * vec.m_y) +
          (m_z * vec.m_z);
}
}
}