//
// cJulian.h
//
// Copyright (c) 2003-2012 Michael F. Henry
//
// Version 01/2013
//
#pragma once
#include "globals.h"

namespace Zeptomoby 
{
namespace OrbitTools
{
//
// See note in cJulian.cpp for information on this class and the epoch dates
//
const double EPOCH_JAN0_12H_1900 = 2415020.0; // Dec 31.5 1899 = Dec 31 1899 12h UTC
const double EPOCH_JAN1_00H_1900 = 2415020.5; // Jan  1.0 1900 = Jan  1 1900 00h UTC
const double EPOCH_JAN1_12H_2000 = 2451545.0; // Jan  1.5 2000 = Jan  1 2000 12h UTC

//////////////////////////////////////////////////////////////////////////////
class cJulian  
{
public:
   cJulian() { Initialize(2000, 1); }
   explicit cJulian(time_t t);              // Create from time_t
   explicit cJulian(int year, double day);  // Create from year, day of year
   explicit cJulian(int year,               // i.e., 2004
                    int mon,                // 1..12
                    int day,                // 1..31
                    int hour,               // 0..23
                    int min,                // 0..59
                    double sec = 0.0);      // 0..(59.999999...)
   ~cJulian() {};

   double ToGmst() const;           // Greenwich Mean Sidereal Time
   double ToLmst(double lon) const; // Local Mean Sidereal Time
   time_t ToTime() const;           // To time_t type - avoid using

   double FromJan0_12h_1900() const { return m_Date - EPOCH_JAN0_12H_1900; }
   double FromJan1_00h_1900() const { return m_Date - EPOCH_JAN1_00H_1900; }
   double FromJan1_12h_2000() const { return m_Date - EPOCH_JAN1_12H_2000; }

   void GetComponent(int *pYear, int *pMon = NULL, double *pDOM = NULL) const;
   double Date() const { return m_Date; }

   void AddDay (double day) { m_Date += day;                 }
   void AddHour(double hr ) { m_Date += (hr  / HR_PER_DAY ); }
   void AddMin (double min) { m_Date += (min / MIN_PER_DAY); }
   void AddSec (double sec) { m_Date += (sec / SEC_PER_DAY); }

   double SpanDay (const cJulian& b) const { return m_Date - b.m_Date;        }
   double SpanHour(const cJulian& b) const { return SpanDay(b) * HR_PER_DAY;  }
   double SpanMin (const cJulian& b) const { return SpanDay(b) * MIN_PER_DAY; }
   double SpanSec (const cJulian& b) const { return SpanDay(b) * SEC_PER_DAY; }

   static bool IsLeapYear(int y)
      { return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0); }

protected:
   void Initialize(int year, double day);

   double m_Date; // Julian date
};
}
}