//
// cTle.cpp
// This class encapsulates a single set of standard NORAD two line elements.
//
// Copyright 1996-2012 Michael F. Henry
// 05/2012
//
#include "stdafx.h"

#include "cTle.h"

namespace Zeptomoby 
{
namespace OrbitTools
{
// Note: The column offsets are zero based.

// Name
const int TLE_LEN_LINE_DATA      = 69; const int TLE_LEN_LINE_NAME      = 24;

// Line 1
const int TLE1_COL_SATNUM        =  2; const int TLE1_LEN_SATNUM        =  5;
const int TLE1_COL_INTLDESC_A    =  9; const int TLE1_LEN_INTLDESC_A    =  2;
const int TLE1_COL_INTLDESC_B    = 11; const int TLE1_LEN_INTLDESC_B    =  3;
const int TLE1_COL_INTLDESC_C    = 14; const int TLE1_LEN_INTLDESC_C    =  3;
const int TLE1_COL_EPOCH_A       = 18; const int TLE1_LEN_EPOCH_A       =  2;
const int TLE1_COL_EPOCH_B       = 20; const int TLE1_LEN_EPOCH_B       = 12;
const int TLE1_COL_MEANMOTIONDT  = 33; const int TLE1_LEN_MEANMOTIONDT  = 10;
const int TLE1_COL_MEANMOTIONDT2 = 44; const int TLE1_LEN_MEANMOTIONDT2 =  8;
const int TLE1_COL_BSTAR         = 53; const int TLE1_LEN_BSTAR         =  8;
const int TLE1_COL_EPHEMTYPE     = 62; const int TLE1_LEN_EPHEMTYPE     =  1;
const int TLE1_COL_ELNUM         = 64; const int TLE1_LEN_ELNUM         =  4;

// Line 2
const int TLE2_COL_SATNUM        = 2;  const int TLE2_LEN_SATNUM        =  5;
const int TLE2_COL_INCLINATION   = 8;  const int TLE2_LEN_INCLINATION   =  8;
const int TLE2_COL_RAASCENDNODE  = 17; const int TLE2_LEN_RAASCENDNODE  =  8;
const int TLE2_COL_ECCENTRICITY  = 26; const int TLE2_LEN_ECCENTRICITY  =  7;
const int TLE2_COL_ARGPERIGEE    = 34; const int TLE2_LEN_ARGPERIGEE    =  8;
const int TLE2_COL_MEANANOMALY   = 43; const int TLE2_LEN_MEANANOMALY   =  8;
const int TLE2_COL_MEANMOTION    = 52; const int TLE2_LEN_MEANMOTION    = 11;
const int TLE2_COL_REVATEPOCH    = 63; const int TLE2_LEN_REVATEPOCH    =  5;

/////////////////////////////////////////////////////////////////////////////
cTle::cTle(string& strName, string& strLine1, string& strLine2)
{
   m_strLine0  = strName;
   m_strLine1 = strLine1;
   m_strLine2 = strLine2;

   TrimRight(m_strLine0);
   Initialize();
}

/////////////////////////////////////////////////////////////////////////////
cTle::cTle(const cTle &tle)
{
   m_strLine0 = tle.m_strLine0;
   m_strLine1 = tle.m_strLine1;
   m_strLine2 = tle.m_strLine2;

   for (int fld = FLD_FIRST; fld < FLD_LAST; fld++)
   {
      m_Field[fld] = tle.m_Field[fld];
   }

   m_mapCache = tle.m_mapCache;
}

/////////////////////////////////////////////////////////////////////////////
cTle::~cTle()
{
}

/////////////////////////////////////////////////////////////////////////////
// GetField()
// Return requested field as a double (function return value) or as a text
// string (*pstr) in the units requested (eUnit). Set 'bStrUnits' to true 
// to have units appended to text string.
//
// Note: numeric return values are cached; asking for the same field more
// than once incurs minimal overhead.
double cTle::GetField(eField   fld, 
                      eUnits   units,    /* = U_NATIVE */
                      string  *pstr      /* = NULL     */,
                      bool     bStrUnits /* = false    */) const
{
   assert((FLD_FIRST <= fld) && (fld < FLD_LAST));
   assert((U_FIRST <= units) && (units < U_LAST));

   if (pstr)
   {
      // Return requested field in string form.
      *pstr = m_Field[fld];
      
      if (bStrUnits)
      {
         *pstr += GetUnits(fld);
      }

      TrimLeft (*pstr);
      TrimRight(*pstr);
      
      return 0.0;
   }
   else
   {
      // Return requested field in floating-point form.
      // Return cache contents if it exists, else populate cache
      FldKey key = Key(units, fld);

      if (m_mapCache.find(key) == m_mapCache.end())
      {
         // Value not in cache; add it
         double valNative = atof(m_Field[fld].c_str());
         double valConv   = ConvertUnits(valNative, fld, units); 
         m_mapCache[key]  = valConv;

         return valConv;
      }
      else
      {
         // return cached value
         return m_mapCache[key];
      }
   }
}

//////////////////////////////////////////////////////////////////////////////
// Convert the given field into the requested units. It is assumed that
// the value being converted is in the TLE format's "native" form.
double cTle::ConvertUnits(double valNative, // value to convert
                          eField fld,       // what field the value is
                          eUnits units)     // what units to convert to
{
   switch (fld)
   {
      case FLD_I:
      case FLD_RAAN:
      case FLD_ARGPER:
      case FLD_M:
      {
         // The native TLE format is DEGREES
         if (units == U_RAD)
         {
            return valNative * RADS_PER_DEG;
         }
      }
   }

   return valNative; // return value in unconverted native format
}

//////////////////////////////////////////////////////////////////////////////
string cTle::GetUnits(eField fld)
{
   static const string strDegrees    = " degrees";
   static const string strRevsPerDay = " revs / day";
   static const string strNull;

   switch (fld)
   {
      case FLD_I:
      case FLD_RAAN:
      case FLD_ARGPER:
      case FLD_M:
         return strDegrees;

      case FLD_MMOTION:
         return strRevsPerDay;

      default:
         return strNull;   
   }
}

/////////////////////////////////////////////////////////////////////////////
// ExpToAtof()
// Converts TLE-style exponential notation of the form [ |-]00000[ |+|-]0 to a
// form that is parse-able by the C-runtime function atof(). Assumes implied
// decimal point to the left of the first number in the string, i.e., 
//       " 12345-3" =  0.12345e-3
//       "-23429-5" = -0.23429e-5
//       " 40436+1" =  0.40436e+1
// Assumes that lack of a sign character implies a positive value, i.e.,
//       " 00000 0" =  0.00000
//       " 31415 1" =  3.1415
string cTle::ExpToAtof(const string &str)
{
   const int COL_SIGN     = 0;
   const int LEN_SIGN     = 1;

   const int COL_MANTISSA = 1;
   const int LEN_MANTISSA = 5;

   const int COL_EXPONENT = 6;
   const int LEN_EXPONENT = 2;

   string sign     = str.substr(COL_SIGN,     LEN_SIGN);
   string mantissa = str.substr(COL_MANTISSA, LEN_MANTISSA);
   string exponent = str.substr(COL_EXPONENT, LEN_EXPONENT);

   TrimLeft(exponent);

   return sign + "0." + mantissa + "e" + exponent;
}

/////////////////////////////////////////////////////////////////////////////
// Initialize()
// Initialize the string array.
void cTle::Initialize()
{
   // Have we already been initialized?
   if (m_Field[FLD_NORADNUM].size()) { return; }
   
   assert(!m_strLine1.empty());
   assert(!m_strLine2.empty());
   
   m_Field[FLD_NORADNUM] = m_strLine1.substr(TLE1_COL_SATNUM, TLE1_LEN_SATNUM);
   m_Field[FLD_INTLDESC] = m_strLine1.substr(TLE1_COL_INTLDESC_A,
                                             TLE1_LEN_INTLDESC_A +
                                             TLE1_LEN_INTLDESC_B +   
                                             TLE1_LEN_INTLDESC_C);   
   m_Field[FLD_EPOCHYEAR] = 
         m_strLine1.substr(TLE1_COL_EPOCH_A, TLE1_LEN_EPOCH_A);

   m_Field[FLD_EPOCHDAY] = 
         m_strLine1.substr(TLE1_COL_EPOCH_B, TLE1_LEN_EPOCH_B);
   
   if (m_strLine1[TLE1_COL_MEANMOTIONDT] == '-')
   {
      // value is negative
      m_Field[FLD_MMOTIONDT] = "-0";
   }
   else
   {
      m_Field[FLD_MMOTIONDT] = "0";
   }
   
   m_Field[FLD_MMOTIONDT] += m_strLine1.substr(TLE1_COL_MEANMOTIONDT + 1,
                                               TLE1_LEN_MEANMOTIONDT);
   
   // decimal point assumed; exponential notation
   m_Field[FLD_MMOTIONDT2] = ExpToAtof(
                                 m_strLine1.substr(TLE1_COL_MEANMOTIONDT2,
                                                   TLE1_LEN_MEANMOTIONDT2));
   // decimal point assumed; exponential notation
   m_Field[FLD_BSTAR] = ExpToAtof(m_strLine1.substr(TLE1_COL_BSTAR,
                                                    TLE1_LEN_BSTAR));
   // TLE1_COL_EPHEMTYPE      
   // TLE1_LEN_EPHEMTYPE   
   m_Field[FLD_SET] = m_strLine1.substr(TLE1_COL_ELNUM, TLE1_LEN_ELNUM);
   
   TrimLeft(m_Field[FLD_SET]);
   
   // TLE2_COL_SATNUM         
   // TLE2_LEN_SATNUM         
   
   m_Field[FLD_I] = m_strLine2.substr(TLE2_COL_INCLINATION,
                                      TLE2_LEN_INCLINATION);
   TrimLeft(m_Field[FLD_I]);
   
   m_Field[FLD_RAAN] = m_strLine2.substr(TLE2_COL_RAASCENDNODE,
                                         TLE2_LEN_RAASCENDNODE);
   TrimLeft(m_Field[FLD_RAAN]);

   // decimal point is assumed
   m_Field[FLD_E] = "0.";
   m_Field[FLD_E] += m_strLine2.substr(TLE2_COL_ECCENTRICITY,
                                       TLE2_LEN_ECCENTRICITY);
   
   m_Field[FLD_ARGPER] = m_strLine2.substr(TLE2_COL_ARGPERIGEE,
                                           TLE2_LEN_ARGPERIGEE);
   TrimLeft(m_Field[FLD_ARGPER]);
   
   m_Field[FLD_M] = m_strLine2.substr(TLE2_COL_MEANANOMALY,
                                      TLE2_LEN_MEANANOMALY);
   TrimLeft(m_Field[FLD_M]);
   
   m_Field[FLD_MMOTION] = m_strLine2.substr(TLE2_COL_MEANMOTION, 
                                            TLE2_LEN_MEANMOTION);
   TrimLeft(m_Field[FLD_MMOTION]);
   
   m_Field[FLD_ORBITNUM] = m_strLine2.substr(TLE2_COL_REVATEPOCH,
                                             TLE2_LEN_REVATEPOCH);
   TrimLeft(m_Field[FLD_ORBITNUM]);
}

/////////////////////////////////////////////////////////////////////////////
// Returns true if "str" is a valid line of a two-line element set,
// else false.
//
// A valid satellite name is less than or equal to TLE_LEN_LINE_NAME
//      characters;
// A valid data line must:
//      Have as the first character the line number
//      Have as the second character a blank
//      Be TLE_LEN_LINE_DATA characters long
//
bool cTle::IsValidLine(string& str, eTleLine line)
{
   TrimLeft(str);
   TrimRight(str);

   size_t nLen = str.size();

   if (line == LINE_ZERO)
   {
      // Satellite name
      return nLen <= TLE_LEN_LINE_NAME;
   }
   else
   {
      // Data line
      return (nLen == TLE_LEN_LINE_DATA) &&
             ((str[0] - '0') == line)    &&
             (str[1] == ' ');
   }
}

/////////////////////////////////////////////////////////////////////////////
// CheckSum()
// Calculate the check sum for a given line of TLE data, the last character
// of which is the current checksum. (Although there is no check here,
// the current checksum should match the one we calculate.)
// The checksum algorithm: 
//    Each number in the data line is summed, modulo 10.
//    Non-numeric characters are zero, except minus signs, which are 1.
//
int cTle::CheckSum(const string& str)
{
   // The length is "- 1" because we don't include the current (existing)
   // checksum character in the checksum calculation.
   size_t len = str.size() - 1;
   int xsum = 0;
   
   for (size_t i = 0; i < len; i++)
   {
      char ch = str[i];

      if (isdigit(ch)) 
      {
         xsum += (ch - '0');
      }
      else if (ch == '-')
      {
         xsum++;
      }
   }
   
   return (xsum % 10);
}

/////////////////////////////////////////////////////////////////////////////
void cTle::TrimLeft(string& s)
{
   while ((s.size() > 0) && (s[0] == ' ')) { s.erase(0, 1); }
}

/////////////////////////////////////////////////////////////////////////////
void cTle::TrimRight(string& s)
{
   while ((s.size() > 0) && (s[s.size() - 1] == ' ')) { s.erase(s.size() - 1); }
}
}
}