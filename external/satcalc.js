var siderealday, earth_rev_pr_siderealday, earth_rev_pr_solar_day, satellite_rev_pr_sidereal_day,
    satellite_rev_pr_solar_day,
    earth_deg_pr_siderealday, earth_deg_pr_solar_day, satellite_deg_pr_sidereal_day, satellite_deg_pr_solar_day, d,
    start_of_current_epoch, Epoch_now, Epoch_start;

var EpochDay, CurrentTime, toRad, toDeg, JD_now, autoupdate;

var Earth_equatorial_radius, GeoSyncRadius;
var getCurrentTimeArray = new Array();
var setCurrentTimeArray = new Array();
var CalcDriftRateOutputArray = new Array();
var CalcDriftRateOutputArray_after_24_hours = new Array();
var EarthSiteGeoCentricPositionArray = new Array();
var LookanglesArray = new Array();

var SatNameCurrentIndex, SetLocation, Calibrate_pulsevalue, Calibrate_pulse_per_ha_degree, calibrate_inc_direction,
    HA_for_calibrated_position;
var EarthSiteLongitude, EarthSiteLatitude;

Earth_equatorial_radius = 6378.135; // equatorial radii
GeoSyncRadius = 42164.57;

toRad = 2 * Math.PI / 360;
toDeg = 360 / (2 * Math.PI);

autoupdate = 'True';

window.setInterval('do_autoupdate()', 1000);

function getLonAsEast(Longinow, dirnow, Longi24, dir24) {
    var londrift;
//OutputArray[48]= Longitude direction
//OutputArray[49]= Longitude in 0-360 deg east format

    /*
    if (Longinow<Longi24) {
      londrift=Longi24-Longinow ;
      londrift=londrift+" East";
      }

       else
      {
      londrift=Longinow -Longi24;
      londrift=londrift+" West";
      }
    */

    londrift = Longi24 - Longinow;  // if positive, drift towards West

    return (londrift);

}

function do_autoupdate() {

    /*
    var Hour,Minute,Second,Month,Day,Year
    Year= Tracker.YearNow.value;
    Hour= Tracker.HourNow.value ;
    Minute=Tracker.MinuteNow.value;
    Second=Tracker.SecondNow.value ;
    Month= Tracker.MonthNow.value;
    Day= DayNow.value ;
    */
//setCurrentTimeArray=setCurrentTime(1*DayNow.value,1*MonthNow.value,1*YearNow.value,1*HourNow.value,1*MinuteNow.value,1*SecondNow.value);

    if (autoupdate == 'True') {

        getCurrentTimeArray = getCurrentTime();

        Tracker.YearNow.value = getCurrentTimeArray[0];
        Tracker.MonthNow.value = getCurrentTimeArray[1];
        Tracker.DayNow.value = getCurrentTimeArray[2];
        Tracker.HourNow.value = getCurrentTimeArray[3];
        Tracker.MinuteNow.value = getCurrentTimeArray[4];
        Tracker.SecondNow.value = getCurrentTimeArray[5];
        Tracker.JulianDay.value = getCurrentTimeArray[6];
        JD_now = getCurrentTimeArray[6];
        Tracker.ModifiedJulianDay.value = getCurrentTimeArray[7];
        Tracker.dJ2000.value = getCurrentTimeArray[8];
        Epoch_now = getCurrentTimeArray[9];

        // virker
        onchange_satellite_rev_siderealday();

        CalcDriftRateOutputArray_after_24_hours = calculatedriftrate((1 * Tracker.DayNow.value + 1) * 1,
            1 * Tracker.MonthNow.value, 1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
            1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value, Tracker.Satellite_rev_solar_day.value,
            Tracker.Satellite_rev_sidereal_day.value,
            Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
            Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value,
            Tracker.Inclination.value, Tracker.NumberOfOrbitsAtEpoch.value);

        CalcDriftRateOutputArray = calculatedriftrate(1 * Tracker.DayNow.value, 1 * Tracker.MonthNow.value,
            1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
            1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value, Tracker.Satellite_rev_solar_day.value,
            Tracker.Satellite_rev_sidereal_day.value,
            Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
            Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value,
            Tracker.Inclination.value, Tracker.NumberOfOrbitsAtEpoch.value);

        // update forms
        Tracker.Earth_rev_solar_day.value = CalcDriftRateOutputArray[0];
        Tracker.Earth_deg_solar_day.value = CalcDriftRateOutputArray[1];
        Tracker.Earth_rev_sidereal_day.value = CalcDriftRateOutputArray[2];
        Tracker.Earth_deg_sidereal_day.value = CalcDriftRateOutputArray[3];
        Tracker.Satellite_deg_sidereal_day.value = CalcDriftRateOutputArray[5];  // was swapped
        Tracker.Satellite_deg_solar_day.value = CalcDriftRateOutputArray[4];     // was swapped
        Tracker.Driftrate.value = CalcDriftRateOutputArray[6];
        Tracker.Direction.value = CalcDriftRateOutputArray[36];
        Tracker.TC.value = CalcDriftRateOutputArray[7];
        Tracker.GeoTC.value = CalcDriftRateOutputArray[8];
        Tracker.Apogee.value = CalcDriftRateOutputArray[12];
        Tracker.Perigee.value = CalcDriftRateOutputArray[13];
        Tracker.Semimajoraxis.value = CalcDriftRateOutputArray[11];
        Tracker.DateEpoch.value = CalcDriftRateOutputArray[14];
        Tracker.GMST.value = CalcDriftRateOutputArray[15];
        Tracker.TimeOfCalculation.value = CalcDriftRateOutputArray[16];
        Tracker.MeananomalyCalculated.value = CalcDriftRateOutputArray[17];
        Tracker.EccentricanomalyBeforeIterations.value = CalcDriftRateOutputArray[18];
        Tracker.Trueanomaly.value = CalcDriftRateOutputArray[19];
        Tracker.EccentricanomalyErrorAfterIterations.value = CalcDriftRateOutputArray[20];
        Tracker.EccentricanomalyAfterIterations.value = CalcDriftRateOutputArray[21];
        Tracker.Velocity.value = CalcDriftRateOutputArray[22];
        Tracker.X_orbit_plane.value = CalcDriftRateOutputArray[23];
        Tracker.Y_orbit_plane.value = CalcDriftRateOutputArray[24];
        Tracker.r_orbit_plane.value = CalcDriftRateOutputArray[25];
        Tracker.x_geocentric.value = CalcDriftRateOutputArray[26];
        Tracker.y_geocentric.value = CalcDriftRateOutputArray[27];
        Tracker.z_geocentric.value = CalcDriftRateOutputArray[28];
        Tracker.declination.value = CalcDriftRateOutputArray[29];//" ToRad"+toRad;
        Tracker.RA.value = CalcDriftRateOutputArray[30];
        Tracker.NumberOfOrbitsNow.value = CalcDriftRateOutputArray[31];
        Tracker.SatelliteGeodeticLatitude.value = CalcDriftRateOutputArray[32];
        Tracker.TimeElepsedSinceEpoch.value = CalcDriftRateOutputArray[33];

        Tracker.SatelliteLongitude.value = CalcDriftRateOutputArray[34];
        Tracker.SatelliteGeocentricLatitude.value = CalcDriftRateOutputArray[35];
        Tracker.Iterations.value = CalcDriftRateOutputArray[37];
        Tracker.EccentricanomalyErrorBeforeIterations.value = CalcDriftRateOutputArray[38];
        Tracker.TimeEpochFormat.value = CalcDriftRateOutputArray[39];
        Tracker.Altitude.value = CalcDriftRateOutputArray[40];
        Tracker.GeoAltitude.value = CalcDriftRateOutputArray[41];
        Tracker.GeoDeticAltitude.value = CalcDriftRateOutputArray[42];
        Tracker.AverageDriftrate.value = CalcDriftRateOutputArray[43];
        Tracker.AverageDriftrateDirection.value = CalcDriftRateOutputArray[44];
        Tracker.AvrGeoAltitude.value = CalcDriftRateOutputArray[45];
        Tracker.EW_oscillation_caused_by_inclination.value = CalcDriftRateOutputArray[46];
        Tracker.EW_oscillation_caused_by_eccentricity.value = CalcDriftRateOutputArray[47];

        //calculate_geocentric_ECI_coordinates(SiteLon,SiteLat,Re,altitude,GMST)
        EarthSiteGeoCentricPositionArray = calculate_geocentric_ECI_coordinates(EarthSiteLongitude, EarthSiteLatitude,
            Earth_equatorial_radius, 0, CalcDriftRateOutputArray[15]);

        //calculate_lookangles(Re,xs,ys,zs,xo,yo,zo,LST,SiteLat,SiteLon)
        LookanglesArray = calculate_lookangles(Earth_equatorial_radius, CalcDriftRateOutputArray[26],
            CalcDriftRateOutputArray[27], CalcDriftRateOutputArray[28], EarthSiteGeoCentricPositionArray[0],
            EarthSiteGeoCentricPositionArray[1], EarthSiteGeoCentricPositionArray[2], CalcDriftRateOutputArray[15],
            EarthSiteLatitude, EarthSiteLongitude);
        Tracker.SatelliteElevation.value = formatvalue(LookanglesArray[4], 8);
        Tracker.SatelliteAzimuth.value = formatvalue(LookanglesArray[5], 8);
        Tracker.SatelliteRange.value = formatvalue(LookanglesArray[3], 8);
        onchange_satellite_rev_solarday();

        Tracker.Current_Motion.value = formatvalue(CalcDriftRateOutputArray[50] * 1, 13);

        // LongitudeDriftrate.value=CalcDriftRateOutputArray_after_24_hours[34];

        Tracker.LongitudeDriftrate.value = getLonAsEast(CalcDriftRateOutputArray[49], CalcDriftRateOutputArray[48],
            CalcDriftRateOutputArray_after_24_hours[49], CalcDriftRateOutputArray_after_24_hours[48]);

        if (Tracker.LongitudeDriftrate.value * 1 > 0) Tracker.LongitudeDriftrateDirection.value = 'East';
        else Tracker.LongitudeDriftrateDirection.value = 'West';

        //Tracker.LongitudeDriftrateDirection.value=Tracker.LongitudeDriftrateDirection.value+" "+CalcDriftRateOutputArray_after_24_hours[49];

        Tracker.LongitudeDriftrate.value = Math.abs(Tracker.LongitudeDriftrate.value * 1);

        Tracker.LongitudeAfter24Hours.value = formatvalue(CalcDriftRateOutputArray_after_24_hours[49], 8) + ' East ('
            + formatvalue((360 - CalcDriftRateOutputArray_after_24_hours[49]), 8) * 1 + ' West )';

        //GMST_2();
    }

}

function calculate_geocentric_ECI_coordinates(SiteLon, SiteLat, Re, altitude, GMST) {

    var OutputArray = new Array();
    var z, y, x, omega, R, Earth_flattening_constant, C, S;

    Earth_flattening_constant = 1 / 298.26;

    C = 1 / Math.sqrt(
        1 + Earth_flattening_constant * (Earth_flattening_constant - 2) * Math.sin(SiteLat * toRad) * Math.sin(
        SiteLat * toRad));
    S = (1 - Earth_flattening_constant) * (1 - Earth_flattening_constant) * C;
    z = Re * Math.sin(SiteLat * toRad);
//alert(z);

    R = Re * Math.cos(SiteLat * toRad);

    omega = 1 * GMST + 1 * SiteLon;  // SiteLon = negative in west, positive = east

    x = R * Math.cos(omega * toRad);
    y = R * Math.sin(omega * toRad);

//Tracker.SatelliteAzimuth.value="x="+x+" y="+y+" z="+z+" omega="+omega+" GMST="+GMST+" R="+R+" Re="+Re+" SiteLon="+SiteLon+" SiteLat="+SiteLat;

// make ECI coordinates correced for earth flattening

    x = Earth_equatorial_radius * C * Math.cos(SiteLat * toRad) * Math.cos(omega * toRad);
    y = Earth_equatorial_radius * C * Math.cos(SiteLat * toRad) * Math.sin(omega * toRad);
    z = Earth_equatorial_radius * S * Math.sin(SiteLat * toRad);

    OutputArray[0] = x;
    OutputArray[1] = y;
    OutputArray[2] = z;

    return (OutputArray);

}

function calculate_lookangles(Re, xs, ys, zs, xo, yo, zo, LST, SiteLat, SiteLon) {

    var OutputArray = new Array();
    var rS, rZ, rE, rx, ry, rz, range, Elevation, Azimuth;
    var fi;

    rx = xs - xo;
    ry = ys - yo;
    rz = zs - zo;

    fi = 1 * LST + 1 * SiteLon;
    rS = Math.sin(SiteLat * toRad) * Math.cos(fi * toRad) * rx + Math.sin(SiteLat * toRad) * Math.sin(fi * toRad) * ry
        - Math.cos(SiteLat * toRad) * rz;
    rE = -Math.sin(fi * toRad) * rx + Math.cos(fi * toRad) * ry;
    rZ = Math.cos(SiteLat * toRad) * Math.cos(fi * toRad) * rx + Math.cos(SiteLat * toRad) * Math.sin(fi * toRad) * ry
        + Math.sin(SiteLat * toRad) * rz;

    range = Math.sqrt(rS * rS + rE * rE + rZ * rZ);

    Elevation = toDeg * Math.asin(rZ / range);
    Azimuth = toDeg * Math.atan(-rE / rS);

    if (rS > 0) Azimuth = Azimuth + 180;
    if (Azimuth < 0) Azimuth = Azimuth + 360;

//Tracker.SatelliteAzimuth.value="rx="+rx+" ry="+ry+" rz="+rz+" LST="+LST+" range="+range+" Re="+Re+" SiteLat="+SiteLat;

    OutputArray[0] = rS;
    OutputArray[1] = rZ;
    OutputArray[2] = rE;
    OutputArray[3] = range;
    OutputArray[4] = Elevation;
    OutputArray[5] = Azimuth;

    return (OutputArray);
}

function ReadCookie() {

    var Lat, Lon, LatDir, LonDir, CookieValue, MyCookieVal;
    var ValArray = new Array();
    var SubArray = new Array();

    SitePosCurrentIndex = 1073; // Used only if there are not any cookie stored
//SatNameCurrentIndex =40 ;

    MyCookieVal = document.cookie;
//alert(MyCookieVal);

    if (MyCookieVal !== '') // If cookie has value then set users defaults
    {

        ValArray = MyCookieVal.split(':');  //' Reads 6 cookie values in to the array
        Lat = ValArray[0];
        LatDir = ValArray[1];
        Lon = ValArray[2];
        LonDir = ValArray[3];
        SitePosCurrentIndex = ValArray[4];
        SatNameCurrentIndex = ValArray[5];
        SetLocation = ValArray[6];
        Calibrate_pulsevalue = ValArray[7];
        Calibrate_pulse_per_ha_degree = ValArray[8];
        calibrate_inc_direction = ValArray[9];
        HA_for_calibrated_position = ValArray[10];

//Position.selectedIndex=SitePosCurrentIndex;
        Tracker.Position.selectedIndex = SitePosCurrentIndex;

        Tracker.LatitudeDegrees.value = Lat;     // Set user defaults if cookie already stored on the system
        Tracker.LatitudeDirection.value = LatDir;   //   ' Set user defaults if cookie already stored on the system
        Tracker.LongitudeDegrees.value = Lon;  //' Set user defaults if cookie already stored on the system
        Tracker.LongitudeDirection.value = LonDir;  //    ' Set user defaults if cookie already stored on the system

    } else {
        Tracker.Position.selectedIndex = SitePosCurrentIndex;
        alert('Empty cookie - select a site position');
    }

}   // end function

function SetCookie() {

    var Lat, Lon, LatDir, LonDir, CookieValue;
    var SitePosCurrentIndex;
//alert(document.Position.selectedIndex);

    SitePosCurrentIndex = Tracker.Position.selectedIndex;

    Lat = 1 * Tracker.LatitudeDegrees.value;
    LatDir = Tracker.LatitudeDirection.value;
    Lon = 1 * Tracker.LongitudeDegrees.value;
    LonDir = Tracker.LongitudeDirection.value;

    CookieValue = Lat + ':' + LatDir + ':' + Lon + ':' + LonDir + ':' + SitePosCurrentIndex + ':' + SatNameCurrentIndex
        + ':' + SetLocation + ':' + Calibrate_pulsevalue + ':' + Calibrate_pulse_per_ha_degree + ':'
        + calibrate_inc_direction + ':' + HA_for_calibrated_position + ';expires=Tue, 10 Jul 2040 23:59:59 UTC;';
    document.cookie = CookieValue;  // Store cookie

}

function CalculateLat() {

    var degrees, minutes, seconds, decimaldegrees;
    degrees = 1 * Tracker.LatDegrees.value;
    minutes = 1 * Tracker.LatMinutes.value;
    seconds = 1 * Tracker.LatSeconds.value;

    decimaldegrees = degrees + (minutes / 60) + (seconds / (60 * 60));
    Tracker.LatitudeDegrees.value = formatvalue(decimaldegrees, 6);

}

function CalculateLon() {

    var degrees, minutes, seconds, decimaldegrees;
    degrees = 1 * Tracker.LonDegrees.value;
    minutes = 1 * Tracker.LonMinutes.value;
    seconds = 1 * Tracker.LonSeconds.value;

    decimaldegrees = degrees + (minutes / 60) + (seconds / (60 * 60));
    Tracker.LongitudeDegrees.value = formatvalue(decimaldegrees, 6);

}

function CalculateCoordinate() {

    var degrees, minute, seconds, SiteLon, SiteLat;

    SiteLat = 1 * Tracker.LatitudeDegrees.value;
    SiteLon = 1 * Tracker.LongitudeDegrees.value;

    degrees = Math.floor(SiteLat);
    minutes = Math.floor((SiteLat - degrees) * 60);

    seconds = Math.floor(((SiteLat - degrees) * 60 - minutes) * 60);

    Tracker.LatDegrees.value = degrees;
    Tracker.LatMinutes.value = minutes;
    Tracker.LatSeconds.value = seconds;

    degrees = Math.floor(SiteLon);
    minutes = Math.floor((SiteLon - degrees) * 60);

    seconds = Math.floor(((SiteLon - degrees) * 60 - minutes) * 60);

    Tracker.LonDegrees.value = degrees;
    Tracker.LonMinutes.value = minutes;
    Tracker.LonSeconds.value = seconds;

    if (Tracker.LongitudeDirection.value == 'West') EarthSiteLongitude = -SiteLon;
    else EarthSiteLongitude = SiteLon;

    if (Tracker.LatitudeDirection.value == 'South') EarthSiteLatitude = -SiteLat;
    else EarthSiteLatitude = SiteLat;

}

function ReadPosition()   //   Store the selected position in the cookie
{

    var Lat, Lon, LatDir, LonDir, CookieValue, MyVal;

    var ValArray = new Array();
    var SubArray = new Array();

    MyVal = Tracker.Position.value;

    if (MyVal == null) alert('Cookie damaged - plese run the cookie repair script !');

    if (MyVal !== null) {
        // Check  position
        ValArray = MyVal.split(',');

        SubArray = ValArray[0].split(':'); // The first subarray containing Lat:LatDir
        Lat = SubArray[0];
        LatDir = SubArray[1];
        SubArray = ValArray[1].split(':');  // The second subarray containing Lon:LonDir
        Lon = SubArray[0];
        LonDir = SubArray[1];

        Tracker.LatitudeDegrees.value = Lat;   // Set user defaults if cookie already stored on the system
        Tracker.LatitudeDirection.value = LatDir;   // Set user defaults if cookie already stored on the system
        Tracker.LongitudeDegrees.value = Lon;   // Set user defaults if cookie already stored on the system
        Tracker.LongitudeDirection.value = LonDir;  // Set user defaults if cookie already stored on the system

        if (LonDir == 'West') EarthSiteLongitude = -Lon;
        else EarthSiteLongitude = Lon;

        if (LatDir == 'South') EarthSiteLatitude = -Lat;
        else EarthSiteLatitude = Lat;

    }

}

function ClickAutoupdate() {

    autoupdate = 'True';

}

function ClickManualupdate() {

    autoupdate = 'False';

}

function ManualTimeUpdate()
//setCurrentTime(Day,Month,Year,Hour,Minute,Second)

{

    //setCurrentTimeArray=setCurrentTime(Day,Month,Year,Hour,Minute,Second);

    CalcDriftRateOutputArray_after_24_hours = calculatedriftrate((1 * Tracker.DayNow.value + 1) * 1,
        1 * Tracker.MonthNow.value, 1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
        1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value, Tracker.Satellite_rev_solar_day.value,
        Tracker.Satellite_rev_sidereal_day.value,
        Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
        Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value, Tracker.Inclination.value,
        Tracker.NumberOfOrbitsAtEpoch.value);

    CalcDriftRateOutputArray = calculatedriftrate(
        1 * Tracker.DayNow.value,
        1 * Tracker.MonthNow.value,
        1 * Tracker.YearNow.value,
        1 * Tracker.HourNow.value,
        1 * Tracker.MinuteNow.value,
        1 * Tracker.SecondNow.value,
        Tracker.Satellite_rev_solar_day.value,
        Tracker.Satellite_rev_sidereal_day.value,
        Tracker.first_derative_mean_motion.value,
        Tracker.Eccentricity.value,
        Tracker.Epoch.value,
        Tracker.Meananomaly.value,
        Tracker.Argument_of_perigee.value,
        Tracker.RA_AN.value,
        Tracker.Inclination.value,
        Tracker.NumberOfOrbitsAtEpoch.value
    );

    Tracker.YearNow.value = setCurrentTimeArray[0];
    Tracker.MonthNow.value = setCurrentTimeArray[1];
    Tracker.DayNow.value = setCurrentTimeArray[2];
    Tracker.HourNow.value = setCurrentTimeArray[3];
    Tracker.MinuteNow.value = setCurrentTimeArray[4];
    Tracker.SecondNow.value = setCurrentTimeArray[5];
    JD_now = setCurrentTimeArray[6];
    Tracker.JulianDay.value = setCurrentTimeArray[6];
    Tracker.ModifiedJulianDay.value = setCurrentTimeArray[7];

    Tracker.dJ2000.value = setCurrentTimeArray[8];
    Epoch_now = setCurrentTimeArray[9];

    onchange_satellite_rev_siderealday();
    //CalcDriftRateOutputArray=calculatedriftrate(1*Tracker.DayNow.value,1*Tracker.MonthNow.value,1*Tracker.YearNow.value,1*Tracker.HourNow.value,1*Tracker.MinuteNow.value,1*Tracker.SecondNow.value);

    // update forms
    Tracker.Earth_rev_solar_day.value = CalcDriftRateOutputArray[0];
    Tracker.Earth_deg_solar_day.value = CalcDriftRateOutputArray[1];
    Tracker.Earth_rev_sidereal_day.value = CalcDriftRateOutputArray[2];
    Tracker.Earth_deg_sidereal_day.value = CalcDriftRateOutputArray[3];
    Tracker.Satellite_deg_sidereal_day.value = CalcDriftRateOutputArray[5];  // was swapped
    Tracker.Satellite_deg_solar_day.value = CalcDriftRateOutputArray[4];     // was swapped
    Tracker.Driftrate.value = CalcDriftRateOutputArray[6];
    Tracker.Direction.value = CalcDriftRateOutputArray[36];
    Tracker.TC.value = CalcDriftRateOutputArray[7];
    Tracker.GeoTC.value = CalcDriftRateOutputArray[8];
    Tracker.Apogee.value = CalcDriftRateOutputArray[12];
    Tracker.Perigee.value = CalcDriftRateOutputArray[13];
    Tracker.Semimajoraxis.value = CalcDriftRateOutputArray[11];
    Tracker.DateEpoch.value = CalcDriftRateOutputArray[14];
    Tracker.GMST.value = CalcDriftRateOutputArray[15];
    Tracker.TimeOfCalculation.value = CalcDriftRateOutputArray[16];
    Tracker.MeananomalyCalculated.value = CalcDriftRateOutputArray[17];
    Tracker.EccentricanomalyBeforeIterations.value = CalcDriftRateOutputArray[18];
    Tracker.Trueanomaly.value = CalcDriftRateOutputArray[19];
    Tracker.EccentricanomalyErrorAfterIterations.value = CalcDriftRateOutputArray[20];
    Tracker.EccentricanomalyAfterIterations.value = CalcDriftRateOutputArray[21];
    Tracker.Velocity.value = CalcDriftRateOutputArray[22];
    Tracker.X_orbit_plane.value = CalcDriftRateOutputArray[23];
    Tracker.Y_orbit_plane.value = CalcDriftRateOutputArray[24];
    Tracker.r_orbit_plane.value = CalcDriftRateOutputArray[25];
    Tracker.x_geocentric.value = CalcDriftRateOutputArray[26];
    Tracker.y_geocentric.value = CalcDriftRateOutputArray[27];
    Tracker.z_geocentric.value = CalcDriftRateOutputArray[28];
    Tracker.declination.value = CalcDriftRateOutputArray[29];//" ToRad"+toRad;
    Tracker.RA.value = CalcDriftRateOutputArray[30];
    Tracker.NumberOfOrbitsNow.value = CalcDriftRateOutputArray[31];
    Tracker.SatelliteGeodeticLatitude.value = CalcDriftRateOutputArray[32];
    Tracker.TimeElepsedSinceEpoch.value = CalcDriftRateOutputArray[33];
    Tracker.SatelliteLongitude.value = CalcDriftRateOutputArray[34];
    Tracker.SatelliteGeocentricLatitude.value = CalcDriftRateOutputArray[35];
    Tracker.Iterations.value = CalcDriftRateOutputArray[37];
    Tracker.EccentricanomalyErrorBeforeIterations.value = CalcDriftRateOutputArray[38];
    Tracker.TimeEpochFormat.value = CalcDriftRateOutputArray[39];
    Tracker.Altitude.value = CalcDriftRateOutputArray[40];
    Tracker.GeoAltitude.value = CalcDriftRateOutputArray[41];
    Tracker.GeoDeticAltitude.value = CalcDriftRateOutputArray[42];
    Tracker.AverageDriftrate.value = CalcDriftRateOutputArray[43];
    Tracker.AverageDriftrateDirection.value = CalcDriftRateOutputArray[44];
    Tracker.AvrGeoAltitude.value = CalcDriftRateOutputArray[45];
    Tracker.EW_oscillation_caused_by_inclination.value = CalcDriftRateOutputArray[46];
    Tracker.EW_oscillation_caused_by_eccentricity.value = CalcDriftRateOutputArray[47];
    //calculate_geocentric_ECI_coordinates(SiteLon,SiteLat,Re,altitude,GMST)
    Tracker.EarthSiteGeoCentricPositionArray = calculate_geocentric_ECI_coordinates(EarthSiteLongitude,
        EarthSiteLatitude, Earth_equatorial_radius, 0, CalcDriftRateOutputArray[15]);

    //calculate_lookangles(Re,xs,ys,zs,xo,yo,zo,LST,SiteLat,SiteLon)
    LookanglesArray = calculate_lookangles(Earth_equatorial_radius, CalcDriftRateOutputArray[26],
        CalcDriftRateOutputArray[27], CalcDriftRateOutputArray[28], EarthSiteGeoCentricPositionArray[0],
        EarthSiteGeoCentricPositionArray[1], EarthSiteGeoCentricPositionArray[2], CalcDriftRateOutputArray[15],
        EarthSiteLatitude, EarthSiteLongitude);
    Tracker.SatelliteElevation.value = formatvalue(LookanglesArray[4], 8);
    Tracker.SatelliteAzimuth.value = formatvalue(LookanglesArray[5], 8);
    Tracker.SatelliteRange.value = formatvalue(LookanglesArray[3], 8);

    Tracker.LongitudeDriftrate.value = getLonAsEast(CalcDriftRateOutputArray[49], CalcDriftRateOutputArray[48],
        CalcDriftRateOutputArray_after_24_hours[49], CalcDriftRateOutputArray_after_24_hours[48]);

    if (Tracker.LongitudeDriftrate.value * 1 > 0) Tracker.LongitudeDriftrateDirection.value = 'East';
    else Tracker.LongitudeDriftrateDirection.value = 'West';

    Tracker.LongitudeDriftrate.value = Math.abs(Tracker.LongitudeDriftrate.value * 1);

    Tracker.LongitudeAfter24Hours.value = formatvalue(CalcDriftRateOutputArray_after_24_hours[49], 8) + ' East ('
        + formatvalue((360 - CalcDriftRateOutputArray_after_24_hours[49]), 8) * 1 + ' West )';

    GMST_2();

}

function TimeUpdateNow() {

    getCurrentTimeArray = getCurrentTime();

    Tracker.YearNow.value = getCurrentTimeArray[0];
    Tracker.MonthNow.value = getCurrentTimeArray[1];
    Tracker.DayNow.value = getCurrentTimeArray[2];
    Tracker.HourNow.value = getCurrentTimeArray[3];
    Tracker.MinuteNow.value = getCurrentTimeArray[4];
    Tracker.SecondNow.value = getCurrentTimeArray[5];
    Tracker.JulianDay.value = getCurrentTimeArray[6];
    JD_now = setCurrentTimeArray[6];
    Tracker.ModifiedJulianDay.value = getCurrentTimeArray[7];
    Tracker.dJ2000.value = getCurrentTimeArray[8];
    Epoch_now = getCurrentTimeArray[9];

    // funker
    onchange_satellite_rev_siderealday();

    CalcDriftRateOutputArray_after_24_hours = calculatedriftrate((1 * Tracker.DayNow.value + 1) * 1,
        1 * Tracker.MonthNow.value, 1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
        1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value, Tracker.Satellite_rev_solar_day.value,
        Tracker.Satellite_rev_sidereal_day.value,
        Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
        Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value, Tracker.Inclination.value,
        Tracker.NumberOfOrbitsAtEpoch.value);

    CalcDriftRateOutputArray = calculatedriftrate(1 * Tracker.DayNow.value, 1 * Tracker.MonthNow.value,
        1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
        1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value, Tracker.Satellite_rev_solar_day.value,
        Tracker.Satellite_rev_sidereal_day.value,
        Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
        Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value, Tracker.Inclination.value,
        Tracker.NumberOfOrbitsAtEpoch.value);
    // update forms
    Tracker.Earth_rev_solar_day.value = CalcDriftRateOutputArray[0];
    Tracker.Earth_deg_solar_day.value = CalcDriftRateOutputArray[1];
    Tracker.Earth_rev_sidereal_day.value = CalcDriftRateOutputArray[2];
    Tracker.Earth_deg_sidereal_day.value = CalcDriftRateOutputArray[3];
    Tracker.Satellite_deg_sidereal_day.value = CalcDriftRateOutputArray[5];  // was swapped
    Tracker.Satellite_deg_solar_day.value = CalcDriftRateOutputArray[4];     // was swapped
    Tracker.Driftrate.value = CalcDriftRateOutputArray[6];
    Tracker.Direction.value = CalcDriftRateOutputArray[36];
    Tracker.TC.value = CalcDriftRateOutputArray[7];
    Tracker.GeoTC.value = CalcDriftRateOutputArray[8];
    Tracker.Apogee.value = CalcDriftRateOutputArray[12];
    Tracker.Perigee.value = CalcDriftRateOutputArray[13];
    Tracker.Semimajoraxis.value = CalcDriftRateOutputArray[11];
    Tracker.DateEpoch.value = CalcDriftRateOutputArray[14];
    Tracker.GMST.value = CalcDriftRateOutputArray[15];
    Tracker.TimeOfCalculation.value = CalcDriftRateOutputArray[16];
    Tracker.MeananomalyCalculated.value = CalcDriftRateOutputArray[17];
    Tracker.EccentricanomalyBeforeIterations.value = CalcDriftRateOutputArray[18];
    Tracker.Trueanomaly.value = CalcDriftRateOutputArray[19];
    Tracker.EccentricanomalyErrorAfterIterations.value = CalcDriftRateOutputArray[20];
    Tracker.EccentricanomalyAfterIterations.value = CalcDriftRateOutputArray[21];
    Tracker.Velocity.value = CalcDriftRateOutputArray[22];
    Tracker.X_orbit_plane.value = CalcDriftRateOutputArray[23];
    Tracker.Y_orbit_plane.value = CalcDriftRateOutputArray[24];
    Tracker.r_orbit_plane.value = CalcDriftRateOutputArray[25];
    Tracker.x_geocentric.value = CalcDriftRateOutputArray[26];
    Tracker.y_geocentric.value = CalcDriftRateOutputArray[27];
    Tracker.z_geocentric.value = CalcDriftRateOutputArray[28];
    Tracker.declination.value = CalcDriftRateOutputArray[29];//" ToRad"+toRad;
    Tracker.RA.value = CalcDriftRateOutputArray[30];
    Tracker.NumberOfOrbitsNow.value = CalcDriftRateOutputArray[31];
    Tracker.SatelliteGeodeticLatitude.value = CalcDriftRateOutputArray[32];
    Tracker.TimeElepsedSinceEpoch.value = CalcDriftRateOutputArray[33];
    Tracker.SatelliteLongitude.value = CalcDriftRateOutputArray[34];
    Tracker.SatelliteGeocentricLatitude.value = CalcDriftRateOutputArray[35];
    Tracker.Iterations.value = CalcDriftRateOutputArray[37];
    Tracker.EccentricanomalyErrorBeforeIterations.value = CalcDriftRateOutputArray[38];
    Tracker.TimeEpochFormat.value = CalcDriftRateOutputArray[39];
    Tracker.Altitude.value = CalcDriftRateOutputArray[40];
    Tracker.GeoAltitude.value = CalcDriftRateOutputArray[41];
    Tracker.GeoDeticAltitude.value = CalcDriftRateOutputArray[42];
    Tracker.AverageDriftrate.value = CalcDriftRateOutputArray[43];
    Tracker.AverageDriftrateDirection.value = CalcDriftRateOutputArray[44];
    Tracker.AvrGeoAltitude.value = CalcDriftRateOutputArray[45];
    Tracker.EW_oscillation_caused_by_inclination.value = CalcDriftRateOutputArray[46];
    Tracker.EW_oscillation_caused_by_eccentricity.value = CalcDriftRateOutputArray[47];
    //calculate_geocentric_ECI_coordinates(SiteLon,SiteLat,Re,altitude,GMST)
    Tracker.EarthSiteGeoCentricPositionArray = calculate_geocentric_ECI_coordinates(EarthSiteLongitude,
        EarthSiteLatitude, Earth_equatorial_radius, 0, CalcDriftRateOutputArray[15]);

    //calculate_lookangles(Re,xs,ys,zs,xo,yo,zo,LST,SiteLat,SiteLon)
    LookanglesArray = calculate_lookangles(Earth_equatorial_radius, CalcDriftRateOutputArray[26],
        CalcDriftRateOutputArray[27], CalcDriftRateOutputArray[28], EarthSiteGeoCentricPositionArray[0],
        EarthSiteGeoCentricPositionArray[1], EarthSiteGeoCentricPositionArray[2], CalcDriftRateOutputArray[15],
        EarthSiteLatitude, EarthSiteLongitude);
    Tracker.SatelliteElevation.value = formatvalue(LookanglesArray[4], 8);
    Tracker.SatelliteAzimuth.value = formatvalue(LookanglesArray[5], 8);
    Tracker.SatelliteRange.value = formatvalue(LookanglesArray[3], 8);

    Tracker.LongitudeDriftrate.value = getLonAsEast(CalcDriftRateOutputArray[49], CalcDriftRateOutputArray[48],
        CalcDriftRateOutputArray_after_24_hours[49], CalcDriftRateOutputArray_after_24_hours[48]);

    if (Tracker.LongitudeDriftrate.value * 1 > 0) Tracker.LongitudeDriftrateDirection.value = 'East';
    else Tracker.LongitudeDriftrateDirection.value = 'West';

    Tracker.LongitudeDriftrate.value = Math.abs(Tracker.LongitudeDriftrate.value * 1);

    Tracker.LongitudeAfter24Hours.value = formatvalue(CalcDriftRateOutputArray_after_24_hours[49], 8) + ' East ('
        + formatvalue((360 - CalcDriftRateOutputArray_after_24_hours[49]), 8) * 1 + ' West )';

    GMST_2();

}

function getCurrentTime() {
    var Hour, Minute, Second, Month, Day, Year, ReturnValue;

    ReturnValue = new Array();
    today = new Date();

    Hour = today.getUTCHours();

    Minute = today.getUTCMinutes();
    Second = today.getUTCSeconds();

    Month = today.getUTCMonth() + 1;

    Day = today.getUTCDate();

    Year = 1 * today.getUTCFullYear();

    ReturnValue[0] = Year;

//alert(" get "+Year+"/"+Month+"/"+Day+"/"+" "+Hour+":"+Minute+":"+Second);

    if (Month < 10) ReturnValue[1] = '0' + Month;
    else ReturnValue[1] = Month;
    if (Day < 10) ReturnValue[2] = ('0' + Day);
    else ReturnValue[2] = Day;
    if (Hour < 10) ReturnValue[3] = ('0' + Hour);
    else ReturnValue[3] = Hour;
    if (Minute < 10) ReturnValue[4] = ('0' + Minute);
    else ReturnValue[4] = Minute;
    if (Second < 10) ReturnValue[5] = ('0' + Second);
    else ReturnValue[5] = Second;

    ReturnValue[6] = JD_daynumber(Day * 1, Month * 1, Year * 1, Hour * 1, Minute * 1, Second * 1);
    ReturnValue[7] = 1.00000000000000000000 * ReturnValue[6] - 1.000000000000000000000 * 2400000.5;
//ModifiedJulianDay.value=
//JulianDay.value=JD_now;
//JD_now=JD_daynumber(Day*1,Month*1,Year*1,Hour*1,1*Minute,1*Second);

//ModifiedJulianDay.value= JD_now - 2400000.5;

//Epoch_now=daynumber(1*Day,1*Month,1*Year,1*Hour,1*Minute,1*Second);
//dJ2000.value=Epoch_now;

    ReturnValue[8] = daynumber(1 * Day, 1 * Month, 1 * Year, 1 * Hour, 1 * Minute, 1 * Second);

//alert("Start="+" now"+Epoch_now+" Year"+Year);

//alert("GetTimezone offset  "+today.getTimezoneOffset());

//array definition
// ReturnValue[0] = Year
// ReturnValue[1] = Month
// ReturnValue[2] = Day
// ReturnValue[3] = Hour
// ReturnValue[4] = Minute
// ReturnValue[5] = Second
// ReturnValue[6] = Julian Day =JulianDay.value=JD_now;
// ReturnValue[7] = Modified Julian Day  =ModifiedJulianDay.value
// ReturnValue[8] = Epoch now (days since 1.1.2000 00:00)
// ReturnValue[9] = today // PC time format
// YearNow.value=""+Year;  // does not work in Mozilla Firefox
//   dJ2000.value=Epoch_now;

    ReturnValue[9] = today;

//alert(ReturnValue[8]);

    return (ReturnValue);

}

function setCurrentTime(Day, Month, Year, Hour, Minute, Second) {

    var ReturnValue = new Array();
    today = new Date();

//Year= YearNow.value;

// gir feil Epoch_now

    today.setUTCFullYear(Year, (1 * Month - 1), Day);
    today.setUTCHours(Hour);
    today.setUTCMinutes(Minute);
    today.setUTCSeconds(Second);
//today.setTimezoneOffset(0);

    ReturnValue[0] = Year;
    ReturnValue[1] = Month;
    ReturnValue[2] = Day;
    ReturnValue[3] = Hour;
    ReturnValue[4] = Minute;
    ReturnValue[5] = Second;
    ReturnValue[6] = 1.00000000000000000000 * JD_daynumber(Day * 1, Month * 1, Year * 1, Hour * 1, Minute * 1,
        Second * 1);
    ReturnValue[7] = 1.00000000000000000000 * ReturnValue[6] - 1.000000000000000000000 * 2400000.5;
    ReturnValue[8] = daynumber(Day * 1, Month * 1, Year * 1, Hour * 1, Minute * 1, Second * 1);
    ReturnValue[9] = today;

//alert("TEST    "+Year+" "+Month+" "+Day+" "+Hour+" "+Minute+" "+Second);  //ok
//alert("TEST2 = "+ReturnValue[9]); //ok

// ReturnValue[0] = Year
// ReturnValue[1] = Month
// ReturnValue[2] = Day
// ReturnValue[3] = Hour
// ReturnValue[4] = Minute
// ReturnValue[5] = Second
// ReturnValue[6] = Julian Day =JulianDay.value=JD_now;
// ReturnValue[7] = Modified Julian Day  =ModifiedJulianDay.value
// ReturnValue[8] = Epoch now (days since 1.1.2000 00:00)
// ReturnValue[9] = today PC time format

    return (ReturnValue);

}

function generate_24hour_listings() {

    var listing, Az, El, S_lon, S_lat, Range, getCurrentTimeArray, start_d, Day, Month, Year, Hour, Minute, Second, LST,
        GMST, ListingPeriod, i, chr, Drift_rate_dir, Drift_rate;
    var AvrGeoAlt, GeoAlt, Time_since_ep, Avr_driftrate_dir, Avr_driftrate, velocity;

    ListingPeriod = 24 * 60;// hoursxminutes

    chr = ' ';

//alert(auto_manual.value);

    /*

    var time_format = new Date();

    listing="<html>"
    listing+="<head>"
    listing+="<meta http-equiv=Content-Type>"

    listing+="<meta name=GENERATOR content=Microsoft FrontPage 4.0>"
    listing+="<title>Sun azimuth ~ Satellite Longitude</title>"
    listing+="</head>"
    listing+="<FONT SIZE=4>"
    listing+="<body>"

    listing+="<center><font size=+2 face=Arial>****************************SUN************************************</font></center>";

    listing+="<center><font size=+2 face=Arial>***************************MOON***********************************</font></center>"


    listing+="</html>"
    */

// bruk tid konfigurert i form som starttid og beregn vinkler for hver time i 170 timer
// må gjøre om på funksjonene for å gjøre de brukbare til listing funksjon....
//

// for epoch , +1hour step , 24 hour do print SatLon,Satlat,Azimuth,Elevation

    getCurrentTimeArray = setCurrentTime(1 * Tracker.DayNow.value, 1 * Tracker.MonthNow.value,
        1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
        1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value);

    Tracker.YearNow.value = getCurrentTimeArray[0];
    Tracker.MonthNow.value = getCurrentTimeArray[1];
    Tracker.DayNow.value = getCurrentTimeArray[2];
    Tracker.HourNow.value = getCurrentTimeArray[3];
    Tracker.MinuteNow.value = getCurrentTimeArray[4];
    Tracker.SecondNow.value = getCurrentTimeArray[5];
    Tracker.JulianDay.value = getCurrentTimeArray[6];
    JD_now = getCurrentTimeArray[6];
    Tracker.ModifiedJulianDay.value = getCurrentTimeArray[7];
    Tracker.dJ2000.value = getCurrentTimeArray[8];
    Epoch_now = getCurrentTimeArray[9];  // days since 1.1.2000

    // virker
    onchange_satellite_rev_siderealday();

// gjør om Epoch_now til Day,Month,Year osv.  eller ?

    start_d = getCurrentTimeArray[8];

// må gjøre om

    listing = '<pre>';

    listing += '\n' + 'hour' + chr + 'time' + chr + 'time_since_epoch' + chr + 'SatLon' + chr + 'SatLat' + chr
        + 'Azimuth' + chr + 'Elevation' + chr + 'Range' + chr + 'GeoAlt' + chr + 'AvrGeoAlt' + chr + 'velocity' + chr
        + 'Drift_rate' + chr + 'Drift_rate_dir' + chr + 'Avr_driftrate' + chr + 'Avr_driftrate_dir';

    for (i = 1; i < ListingPeriod + 1; i++) {

        time_format = d_to_date_and_time(start_d + (i / (24 * 60)));

        Hour = time_format.getUTCHours();
        Minute = time_format.getUTCMinutes();
        Second = time_format.getUTCSeconds();
        Month = time_format.getUTCMonth() + 1;
        Day = time_format.getUTCDate();
        Year = time_format.getUTCFullYear();

        CalcDriftRateOutputArray = calculatedriftrate(1 * Day, 1 * Month, 1 * Year, 1 * Hour,
            1 * Minute, 1 * Second, Tracker.Satellite_rev_solar_day.value, Tracker.Satellite_rev_sidereal_day.value,
            Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
            Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value,
            Tracker.Inclination.value, Tracker.NumberOfOrbitsAtEpoch.value);

        // update forms

        Drift_rate = CalcDriftRateOutputArray[6];
        Drift_rate_dir = CalcDriftRateOutputArray[36];

        Time_since_ep = CalcDriftRateOutputArray[33];

        GeoAlt = CalcDriftRateOutputArray[41];
        Avr_driftrate = CalcDriftRateOutputArray[43];
        Avr_driftrate_dir = CalcDriftRateOutputArray[44];
        AvrGeoAlt = CalcDriftRateOutputArray[45];

        velocity = CalcDriftRateOutputArray[22];
        S_lat = CalcDriftRateOutputArray[32];
        S_lon = CalcDriftRateOutputArray[34];
        //SatelliteGeocentricLatitude.value=CalcDriftRateOutputArray[35];

        //calculate_geocentric_ECI_coordinates(SiteLon,SiteLat,Re,altitude,GMST)
        EarthSiteGeoCentricPositionArray = calculate_geocentric_ECI_coordinates(EarthSiteLongitude, EarthSiteLatitude,
            Earth_equatorial_radius, 0, CalcDriftRateOutputArray[15]);

        //calculate_lookangles(Re,xs,ys,zs,xo,yo,zo,LST,SiteLat,SiteLon)
        LookanglesArray = calculate_lookangles(Earth_equatorial_radius, CalcDriftRateOutputArray[26],
            CalcDriftRateOutputArray[27], CalcDriftRateOutputArray[28], EarthSiteGeoCentricPositionArray[0],
            EarthSiteGeoCentricPositionArray[1], EarthSiteGeoCentricPositionArray[2], CalcDriftRateOutputArray[15],
            EarthSiteLatitude, EarthSiteLongitude);
        El = formatvalue(LookanglesArray[4], 8);
        Az = formatvalue(LookanglesArray[5], 8);
        Range = formatvalue(LookanglesArray[3], 8);

        listing += '\n' + i + chr + time_format + chr + Time_since_ep + chr + S_lon + chr + S_lat + chr + Az + chr + El
            + chr + Range + chr + GeoAlt + chr + AvrGeoAlt + chr + velocity + chr + Drift_rate + chr + Drift_rate_dir
            + chr + Avr_driftrate + chr + Avr_driftrate_dir;

    }

//listing+="Not implemented yet";

    PrintWindow = window.open('', 'Print_window');
//PrintWindow =window.open("TEST","Print_window","menubar=yes,status=yes,toolbar=yes,scrollbars=yes"); //height=800,width=1000
    PrintWindow.oldWindow = top;
//PrintWindow.document.write(document.Output.Satpos.value)
    PrintWindow.document.write(listing);
    PrintWindow.document.close();

}

function generate_listings() {

    var listing, Az, El, S_lon, S_lat, Range, getCurrentTimeArray, start_d, Day, Month, Year, Hour, Minute, Second, LST,
        GMST, ListingPeriod, i, chr, Drift_rate_dir, Drift_rate;
    var AvrGeoAlt, GeoAlt, Time_since_ep, Avr_driftrate_dir, Avr_driftrate, velocity;

    ListingPeriod = 170;// hours

    chr = ' ';

//alert(auto_manual.value);

    /*

    var time_format = new Date();

    listing="<html>"
    listing+="<head>"
    listing+="<meta http-equiv=Content-Type>"

    listing+="<meta name=GENERATOR content=Microsoft FrontPage 4.0>"
    listing+="<title>Sun azimuth ~ Satellite Longitude</title>"
    listing+="</head>"
    listing+="<FONT SIZE=4>"
    listing+="<body>"

    listing+="<center><font size=+2 face=Arial>****************************SUN************************************</font></center>";

    listing+="<center><font size=+2 face=Arial>***************************MOON***********************************</font></center>"


    listing+="</html>"
    */

// bruk tid konfigurert i form som starttid og beregn vinkler for hver time i 170 timer
// må gjøre om på funksjonene for å gjøre de brukbare til listing funksjon....
//

// for epoch , +1hour step , 170 hour do print SatLon,Satlat,Azimuth,Elevation

    getCurrentTimeArray = setCurrentTime(1 * Tracker.DayNow.value, 1 * Tracker.MonthNow.value,
        1 * Tracker.YearNow.value, 1 * Tracker.HourNow.value,
        1 * Tracker.MinuteNow.value, 1 * Tracker.SecondNow.value);

    Tracker.YearNow.value = getCurrentTimeArray[0];
    Tracker.MonthNow.value = getCurrentTimeArray[1];
    Tracker.DayNow.value = getCurrentTimeArray[2];
    Tracker.HourNow.value = getCurrentTimeArray[3];
    Tracker.MinuteNow.value = getCurrentTimeArray[4];
    Tracker.SecondNow.value = getCurrentTimeArray[5];
    Tracker.JulianDay.value = getCurrentTimeArray[6];
    JD_now = getCurrentTimeArray[6];
    Tracker.ModifiedJulianDay.value = getCurrentTimeArray[7];
    Tracker.dJ2000.value = getCurrentTimeArray[8];
    Epoch_now = getCurrentTimeArray[9];  // days since 1.1.2000

    // virker
    onchange_satellite_rev_siderealday();

// gjør om Epoch_now til Day,Month,Year osv.  eller ?

    start_d = getCurrentTimeArray[8];

// må gjøre om

    listing = '<pre>';

    listing += '\n' + 'hour' + chr + 'time' + chr + 'time_since_epoch' + chr + 'SatLon' + chr + 'SatLat' + chr
        + 'Azimuth' + chr + 'Elevation' + chr + 'Range' + chr + 'GeoAlt' + chr + 'AvrGeoAlt' + chr + 'velocity' + chr
        + 'Drift_rate' + chr + 'Drift_rate_dir' + chr + 'Avr_driftrate' + chr + 'Avr_driftrate_dir';

    for (i = 1; i < ListingPeriod + 1; i++) {

        time_format = d_to_date_and_time(start_d + (i / (24)));

        Hour = time_format.getUTCHours();
        Minute = time_format.getUTCMinutes();
        Second = time_format.getUTCSeconds();
        Month = time_format.getUTCMonth() + 1;
        Day = time_format.getUTCDate();
        Year = time_format.getUTCFullYear();

        CalcDriftRateOutputArray = calculatedriftrate(1 * Day, 1 * Month, 1 * Year, 1 * Hour,
            1 * Minute, 1 * Second, Tracker.Satellite_rev_solar_day.value, Tracker.Satellite_rev_sidereal_day.value,
            Tracker.first_derative_mean_motion.value, Tracker.Eccentricity.value, Tracker.Epoch.value,
            Tracker.Meananomaly.value, Tracker.Argument_of_perigee.value, Tracker.RA_AN.value,
            Tracker.Inclination.value, Tracker.NumberOfOrbitsAtEpoch.value);

        // update forms

        Drift_rate = CalcDriftRateOutputArray[6];
        Drift_rate_dir = CalcDriftRateOutputArray[36];

        Time_since_ep = CalcDriftRateOutputArray[33];

        GeoAlt = CalcDriftRateOutputArray[41];
        Avr_driftrate = CalcDriftRateOutputArray[43];
        Avr_driftrate_dir = CalcDriftRateOutputArray[44];
        AvrGeoAlt = CalcDriftRateOutputArray[45];

        velocity = CalcDriftRateOutputArray[22];
        S_lat = CalcDriftRateOutputArray[32];
        S_lon = CalcDriftRateOutputArray[34];
        //SatelliteGeocentricLatitude.value=CalcDriftRateOutputArray[35];

        //calculate_geocentric_ECI_coordinates(SiteLon,SiteLat,Re,altitude,GMST)
        EarthSiteGeoCentricPositionArray = calculate_geocentric_ECI_coordinates(EarthSiteLongitude, EarthSiteLatitude,
            Earth_equatorial_radius, 0, CalcDriftRateOutputArray[15]);

        //calculate_lookangles(Re,xs,ys,zs,xo,yo,zo,LST,SiteLat,SiteLon)
        LookanglesArray = calculate_lookangles(Earth_equatorial_radius, CalcDriftRateOutputArray[26],
            CalcDriftRateOutputArray[27], CalcDriftRateOutputArray[28], EarthSiteGeoCentricPositionArray[0],
            EarthSiteGeoCentricPositionArray[1], EarthSiteGeoCentricPositionArray[2], CalcDriftRateOutputArray[15],
            EarthSiteLatitude, EarthSiteLongitude);
        El = formatvalue(LookanglesArray[4], 8);
        Az = formatvalue(LookanglesArray[5], 8);
        Range = formatvalue(LookanglesArray[3], 8);

        listing += '\n' + i + chr + time_format + chr + Time_since_ep + chr + S_lon + chr + S_lat + chr + Az + chr + El
            + chr + Range + chr + GeoAlt + chr + AvrGeoAlt + chr + velocity + chr + Drift_rate + chr + Drift_rate_dir
            + chr + Avr_driftrate + chr + Avr_driftrate_dir;

    }

//listing+="Not implemented yet";

    PrintWindow = window.open('', 'Print_window');
//PrintWindow =window.open("","Print_window","menubar=yes,status=yes,toolbar=yes,scrollbars=yes"); //height=800,width=1000
    PrintWindow.oldWindow = top;
//PrintWindow.document.write(document.Output.Satpos.value)
    PrintWindow.document.write(listing);
    PrintWindow.document.close();

}

function Rev(number) {
    var x;
//x= number -Math.floor(number/360.0)*360 ;  // old 24 feb

    x = number;

    if (x > 0.0) {
        while (x > 360.0)
            x = x - 360.0;
    } else {
        while (x < 0.0)
            x = x + 360.0;
    }

    return (x);
}

function get_epoch_date_and_time() {
    var TMP, Day, Year, Start;

    TMP = Tracker.Epoch.value;
    Day = Tracker.Epoch.value.substring(2, 8) * 1;
    Year = 1 * Tracker.Epoch.value.substring(0, 2);

    Start = daynumber_tle(Year, Day);//

//alert(d_to_date_and_time(Start));
    return (d_to_date_and_time(Start));

}

function d_to_date_and_time(d) {
    var today, t;
    var MinMilli = 1000 * 60;
    var HrMilli = MinMilli * 60;
    var DyMilli = HrMilli * 24;

    today = new Date();

// d+10956= Date() format
//window.alert('d= '+d );
//d=3742.5;

//alert("d ep="+d);
    d = d + 10956;
    d * DyMilli;
    today.setTime(d * DyMilli);
//t=((today.getTime()/DyMilli)-10956);
//window.alert('t= '+t );

    time_offset = today.getTimezoneOffset();
    Hour = today.getUTCHours();
    Minute = today.getUTCMinutes();
    Second = today.getUTCSeconds();
    Month = today.getUTCMonth() + 1;
    Day = today.getUTCDate();
    Year = today.getUTCFullYear();

//alert("UTCYear="+Year);

    return (today);

}

//104
function daynumber(dd, mm, yyyy, hh, min, sec)  // 2000.1.1 00:00 som referanse
{

    d = 0;

//

    d = 367 * yyyy - Div((7 * (yyyy + (Div((mm + 9), 12)))), 4) + Div((275 * mm), 9) + dd - 730530;

    d = d + hh / 24 + min / (60 * 24) + sec / (24 * 60 * 60);  // OK
    return (d);

}

function JD_daynumber(dd, mm, yyyy, hh, min, sec) {

    d = 0;

    d = 367 * yyyy - Div((7 * (yyyy + (Div((mm + 9), 12)))), 4) + Div((275 * mm), 9) + dd - 730530 + 2451543.5;

    d = d + hh / 24 + min / (60 * 24) + sec / (24 * 60 * 60);  // OK

//alert(d);

    return (d);

}

function daynumber_tle(Year, Day) {
    var d;

    d = 0;

//Find JD at 1.1 00 UT

//d=367*Year - Div(  (7*(Year+(Div((1+9),12)))),4 ) + Div((275*1),9) + 1 - 730530 ;

//d = 367*Y - (7*(Y + ((M+9)/12)))/4 + (275*M)/9 + D - 730530

//d=d+ hh/24 + min/(60*24) + sec/(24*60*60) ;  // OK

//d=d+Day*1;

//d=367*Year-  730530  -14 ;  // hvorfor +- 14 ???

//d = 367*Y - (7*(Y + ((M+9)/12)))/4 + (275*M)/9 + D - 730530

//d=367*2009  + 1*Day  - 734014;//= 2977 ;

    d = daynumber(1, 1, Year, 0, 0, 0) + Day - 1;  //  OK  works, 30 march 2010

//alert("d to dateand time"+   d_to_date_and_time(d));

//alert("Day"+Day);

//d=d+Day ;  // OK
    return (d);

}

function getTLEfromTextAerea() {

    var tmpString, EpochYear, EpochDay;
    var rows = new Array();
    var year_raw_value;

    tmpString = Tracker.twoline.value;
    rows = tmpString.split('\n');

    Tracker.CommonName.value = rows[0];

// check if the two lines start with 1 and 2

    if ((rows[1].substring(0, 1) != '1') || (rows[2].substring(0, 1) != '2')) alert('error in parameter');
    else {
        //alert("parameter ok") ;
        // get the values from line 1
        Tracker.ObjectID.value = rows[1].substring((3 - 1) * 1, (7) * 1);
        //alert(ObjectID.value);
        Tracker.ElsetClassification.value = rows[1].substring(8 - 1, 8);
        Tracker.InternationalDesignator.value = rows[1].substring(10 - 1, 17);
        Tracker.Epoch.value = rows[1].substring(19 - 1, 32);

        //must me made smarter
        year_raw_value = rows[1].substring(19 - 1, 20);
        if ((year_raw_value > 56) && (year_raw_value <= 99)) {
            EpochYear = '19' + year_raw_value;  // 18 og 19
        } else {
            EpochYear = '20' + year_raw_value;  // 18 og 19
        }

        EpochDay = 1 * rows[1].substring(21 - 1, 32);
        Tracker.first_derative_mean_motion.value = 1 * rows[1].substring(34 - 1, 43);
        Tracker.Inclination.value = 1 * rows[2].substring(9 - 1, 16);
        Tracker.RA_AN.value = 1 * rows[2].substring(18 - 1, 25);
        Tracker.Eccentricity.value = '0.' + rows[2].substring(27 - 1, 33);  // make decimal point

        Tracker.Argument_of_perigee.value = 1 * rows[2].substring(35 - 1, 42);
        Tracker.Meananomaly.value = 1 * rows[2].substring(44 - 1, 51);
        Tracker.Satellite_rev_sidereal_day.value = 1 * rows[2].substring(53 - 1, 63);
        Tracker.NumberOfOrbitsAtEpoch.value = 1 * rows[2].substring(64 - 1, 68);

        //alert(EpochYear+"\n"+EpochDay);

        // Epoch_start=366+daynumber_tle((1*EpochYear),EpochDay*1);// changed 30 Mars due to an error of one year

        Epoch_start = daynumber_tle((1 * EpochYear), EpochDay * 1);
        //alert("Epoch start="+daynumber_tle((1*EpochYear),EpochDay*1));

        Tracker.DateEpoch.value = d_to_date_and_time(Epoch_start);  //

        //alert("epoch start"+Epoch_start);  // regner feil 30 Mars 2010,  1 år for mye

    }

}

function Div(a, b) {
    return ((a - a % b) / b);  //OK
}

function ShowCredit() {
    var credittext;

    credittext = 'First uploaded 25022008';
    credittext = credittext + '\nProgrammed by Jens T. Satre';
    credittext = credittext + '\nScript for calculating satellitte position based on TLE data.\n';
    credittext = credittext + '\nKNOWN PROBLEMS:';
    credittext = credittext + '\nDrift rate error';
    credittext = credittext
        + '\nAt the current time there are small errors in the angles\nThe errors are high on non-geostatioary orbits with high eccentricity.';
    credittext = credittext + '\nAt the moment the calculator does not use the prediction models like SDP/SGP.';
    credittext = credittext + '\n2502-2008: First version.';
    credittext = credittext + '\n2602-2008: Corrected bug in angles when UTC time was around midnight';
    credittext = credittext + '\n2602-2008: Added calculation of geodetic latitude (probably with a bug..)';
    credittext = credittext + '\n2702-2008: Changes to geodetic latitude calculations';
    credittext = credittext + '\n2802-2008: Added more information';
    credittext = credittext + '\n0303-2008: Changes to the javascript code (preparation for listing function)';
    credittext = credittext + '\n0303-2008: Corrected driftrate error';
    credittext = credittext
        + '\n0303-2008: Added average driftrate and average distance from GEO orbit based on semi-major-axis value';
    credittext = credittext + '\n0303-2008: Added East/West oscillation caused by inclination and eccentricity';
    credittext = credittext + '\n0403-2008: Added site location select list';
    credittext = credittext
        + '\n0403-2008: Added calculation of azimuth,elevation and the range between the site location and the satellite';
    credittext = credittext + '\n0503-2008: Corrected azimuth&elevation for oblate earth';
    credittext = credittext + '\n0503-2008: Added 170 hour listing function (1 hour interval)';
    credittext = credittext + '\n0503-2008: Added 24 hour listing function (1 minute interval)';
    credittext = credittext + '\n1003-2008: An error in driftrate calculations has been detected (not corrected yet)';
    credittext = credittext + '\n2907-2008: Average driftrate deg/day is now more accurate. Some other minor changes.';
    credittext = credittext
        + '\n2907-2008: Added longitude driftrate in deg/day(based on current longitude and calculated longitude after 24 hours)';
    credittext = credittext + '\n0408-2008: Changed some errors in labeling of solar and sidereal time.';
    credittext = credittext + '\n0408-2008: Calculating current satellite rev pr. sidereal and solar day.';
    credittext = credittext + '\n3004-2010: Fixed bug in calculation of start of epoch which caused wrong calculations';
    credittext = credittext
        + '\n0211-2010: Calculator works in more browsers like Mozilla Firefox. Listing does not work in Mozilla';
    credittext = credittext + '\n0511-2010: Bug in listing corrected (bug after changes 2 November)';
    credittext = credittext + '\n0511-2010: Listing now works in other browsers like Mozilla Firefox';
    credittext = credittext + '\n0103-2018: Correction for epoch dates before year 2000';
    alert(credittext);

}

function getMST(now, lon) {

    // from http://home.att.net/~srschmitt/script_clock.html
    var year = now.getUTCFullYear();
    var month = now.getUTCMonth() + 1;
    var day = now.getUTCDate();
    var hour = now.getUTCHours();
    var minute = now.getUTCMinutes();
    var second = now.getUTCSeconds();

    // 1994 June 16th at 18h UT
    // days since J2000: -2024.75
    // GMST: 174.77111347427126
    //       11h 39m 5.0672s
    // year   = 1994;
    // month  = 6;
    // day    = 16;
    // hour   = 18;
    // minute = 0;
    // second = 0;

    if (month == 1 || month == 2) {
        year = year - 1;
        month = month + 12;
    }

    var a = Math.floor(year / 100);
    var b = 2 - a + Math.floor(a / 4);

    var c = Math.floor(365.25 * year);
    var d = Math.floor(30.6001 * (month + 1));

    // days since J2000.0
    var jd = b + c + d - 730550.5 + day + (hour + minute / 60.0 + second / 3600.0) / 24.0;

    var jt = (jd) / 36525.0;                   // julian centuries since J2000.0
    var GMST = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jt * jt - jt * jt * jt / 38710000 + lon;
    if (GMST > 0.0) {
        while (GMST > 360.0)
            GMST -= 360.0;
    } else {
        while (GMST < 0.0)
            GMST += 360.0;
    }

    return GMST;
}

function get_time_in_epoch_format(selected_time, timefromepoch) {
// must find the daynumber of the year , 0 = 1 januar, 366 days every 4 year
// fails for dates before y2000

    var today = new Date();
    var first = new Date(selected_time.getFullYear(), 0, 1);

    var theDay;
    var time, timestring, Year, YearStr, timenow, timestring2;

    timenow = 1.0 * (timefromepoch);

//get_time_in_epoch_format(now,Epoch_now);

// first = first day of the year, day 0

//if (selected_time>first){

    theDay = Math.round(((selected_time - first) / 1000 / 60 / 60 / 24) + .5, 0);
//}
//else
//{
//	 theDay = Math.round(((first-selected_time) / 1000 / 60 / 60 / 24) + .5, 0);
//}

//alert(selected_time+"   "+timefromepoch);

    timestring = formatvalue((timenow - Math.floor(timenow)), 12);

    timestring2 = timestring.substring(1, 10);

    Year = selected_time.getUTCFullYear();
    YearStr = formatvalue(Year, 4);

    if ((theDay < 10)) DayStr = '00' + formatvalue(theDay, 4);
    else if ((theDay > 10) && (theDay < 100)) DayStr = DayStr = '0' + formatvalue(theDay, 4);
    else DayStr = DayStr = formatvalue(theDay, 4);

    return (YearStr.substring(2, 5) + DayStr + timestring2);

}

function GMST_2() {

    var Tu, du, gm_st, w, h, m, s;

    du = JD_now - 2451545; //  2451545 = 1.1.2000 12 UTC  ,  du bekrefter riktig 25 feb

    if (du < 0) {
        Tu = (Math.floor(du) + 0.5) / 36525;
    } else Tu = (Math.floor(du) - 0.5) / 36525;

//Tu=Math.floor(du)/36525;  // må være tidspunkt ved midnatt utc ?, hva når du er negativ ?

//alert((du+1)+" / "+Epoch_now);

    w = ((360 / (2 * Math.PI)) * (7.29211510 * ((60 * 60 * 24) / 100000)) * (Epoch_now - Math.floor(Epoch_now))); // w regnes ut riktig,bekreftet 25 feb
//w=0;
// dette er antall radianer. Det er 2pi radianer i 360 grader. 360/2pi grader/radian

    Tracker.GMST2.value = Rev(
        (w + 15 * ((24110.54841 + 8640184.812866 * Tu + 0.093104 * Tu * Tu - ((6.2 / (1000000)) * Tu * Tu * Tu)) / (60
            * 60))));

// nøkkelen ligger her et sted... GMST er sannsynligvis eneste feilkilde.

    gm_st = Rev(
        (w + 15 * ((24110.54841 + 8640184.812866 * Tu + 0.093104 * Tu * Tu - ((6.2 / (1000000)) * Tu * Tu * Tu)) / (60
            * 60))));

    h = Math.floor((Epoch_now - Math.floor(Epoch_now)) * 24);
    m = Math.floor(((Epoch_now - Math.floor(Epoch_now)) * 24 - h) * 60);  // rest
    s = ((((Epoch_now - Math.floor(Epoch_now)) * 24 - h) * 60) - m) * 60;

//TimeTest.value=h+":"+m+":"+s+" "+w+" floor du "+(Math.floor(du)+0.5)+ " ceil du "+(Math.ceil(du)-0.5)+" du "+du+" "+w;  // Epoch now er minst

    return (gm_st);

}

function calculatedriftrate(
    Day, Month, Year, Hour, Minute, Second, Satellite_rev_solar_day, Satellite_rev_sidereal_day,
    first_derative_mean_motion, Eccentricity, Epoch, Meananomaly, Argument_of_perigee, RA_AN, Inclination,
    NumberOfOrbitsAtEpoch) {

    var TCdecimal, hour, minute, seconds, RangeA, e, M, M0, E, X0, Y0, r, Px, Py, Pz, Qx, Qy, Qz,
        x, y, z, arg_per, RAAN, i, Year, Daynumber, Hour, Minute, Second, TMP, LonString, LatString, alpha_E,
        meanmotion_now, meanmotion_after_24_hours, average_motion, average_distance_from_geo_sync_radius,
        average_drift_rate;

    var now = new Date();
    var cur_t;
    var OutputArray = new Array();

    setCurrentTimeArray = setCurrentTime(Day, Month, Year, Hour, Minute, Second);
    now = setCurrentTimeArray[9];
    Epoch_now = setCurrentTimeArray[8];

// forhold mellom sidereal og solar day 365.242190402/366.242190402
//kilde wikipedia

// TLE oppgitt i mean solar time ?

    earth_deg_pr_solar_day = 360 + (360 / 365.24199);  // solar eller sidereal?

    earth_deg_pr_solar_day = 360 + (360 / 365.2422);  // alt.2

    earth_rev_pr_solar_day = earth_deg_pr_solar_day / 360;
    earth_rev_pr_siderealday = 1 / earth_rev_pr_solar_day;

    earth_rev_pr_siderealday = 365.242190402 / 366.242190402;

    earth_deg_pr_siderealday = earth_rev_pr_siderealday * 360;

    OutputArray[0] = earth_rev_pr_solar_day;
    OutputArray[1] = earth_deg_pr_solar_day;
    OutputArray[2] = earth_rev_pr_siderealday;
    OutputArray[3] = earth_deg_pr_siderealday;

    satellite_deg_pr_sidereal_day = 360 * Satellite_rev_sidereal_day;
    satellite_deg_pr_solar_day = 360 * Satellite_rev_solar_day;

//alert(Satellite_rev_sidereal_day+" "+Satellite_rev_solar_day+" "+first_derative_mean_motion);
// Sier at Satellite_rev_solar_day er et object

    OutputArray[4] = satellite_deg_pr_sidereal_day;
    OutputArray[5] = satellite_deg_pr_solar_day;

    //  AverageMotion = epochMeanMotion   + (CurrentTime-EpochDay)*OrbitalDecay/2;
    //  CurrentMotion = 360*(epochMeanMotion   + (CurrentTime-EpochDay)*OrbitalDecay);

    meanmotion_now = 1 * Satellite_rev_sidereal_day + (first_derative_mean_motion * (Epoch_now - Epoch_start)); // rev/day
    meanmotion_after_24_hours = 1 * Satellite_rev_sidereal_day + (first_derative_mean_motion * (Epoch_now - Epoch_start
        + 1)); // rev/day

    OutputArray[50] = meanmotion_now;

    average_motion = (meanmotion_now + meanmotion_after_24_hours) / 2;

// calculate driftrate
    OutputArray[6] = Rev(
        ((1 / (1 * Satellite_rev_sidereal_day + first_derative_mean_motion * (Epoch_now - Epoch_start)))
            + earth_rev_pr_solar_day) * 360); // -3 hundredelsgrad
//OutputArray[6]=Rev( (     (1/(1*Satellite_rev_sidereal_day+first_derative_mean_motion*(Epoch_now-Epoch_start ))   +earth_rev_pr_solar_day)*360); // -3 hundredelsgrad

// test new driftrate

//TCdecimal=(1440/((1*Satellite_rev_sidereal_day+(first_derative_mean_motion*(Epoch_now-Epoch_start )*360)    )   ))/60;   // Period

//TCdecimal=(1440/(1*Satellite_rev_sidereal_day+(first_derative_mean_motion*(Epoch_now-Epoch_start ))*360       ))/60;   // Period
//TCdecimal=(1440/((1*Satellite_rev_sidereal_day+(first_derative_mean_motion*(Epoch_now-Epoch_start ))       )*360)  )/60;   // Period

//TCdecimal=(1440/((1*Satellite_rev_sidereal_day)+(first_derative_mean_motion*(Epoch_now-Epoch_start )))) /60;   // Period in hours

//day=1440 min

    TCdecimal = (1440 / ((1 * Satellite_rev_sidereal_day) + (first_derative_mean_motion * (Epoch_now - Epoch_start))))
        / 60;   // Period in hours

// bug here ?
    RangeA = Math.pow((6028.9 * (TCdecimal * 60)), (2 / 3));  // semi major axis

//RangeA=Math.pow(    (6028.9* (1440/(1*Satellite_rev_sidereal_day+(first_derative_mean_motion*(Epoch_now-Epoch_start )*360)))), (2/3)   );
//RangeA=Math.pow(    (6028.9* (1440/(1*Satellite_rev_sidereal_day+(first_derative_mean_motion*(Epoch_now-Epoch_start ))))), (2/3)   );

    OutputArray[7] = Convert_to_deg_min_sec(TCdecimal);
//OutputArray[7]=Convert_to_deg_min_sec( ((1440/1.00273354)/60));

    OutputArray[8] = Convert_to_deg_min_sec(((1440 / 1.0027379092558308) / 60));

    OutputArray[9] = RangeA * (1 + Eccentricity * 1);   // apogee
    OutputArray[10] = RangeA * (1 - Eccentricity * 1);  //perigee
    OutputArray[11] = (1 * OutputArray[9] + 1 * OutputArray[10]) / 2;  // semimajoraxsis

//OutputArray[11]=RangeA;  // semi major axis

    e = Eccentricity;

    OutputArray[12] = RangeA * (1 + e * 1) - Earth_equatorial_radius;   // apogee altitude
    OutputArray[13] = RangeA * (1 - e * 1) - Earth_equatorial_radius;   // perigee altitude

    OutputArray[39] = get_time_in_epoch_format(now, Epoch_now);

    OutputArray[14] = d_to_date_and_time(Epoch_start) + '  d=' + formatvalue(Epoch_start, 14) + '  ep=' + Epoch;

    OutputArray[15] = getMST(now, 0.0);

    OutputArray[16] = now + ' (verifies the time&date used)';

    M = Meananomaly * 1 + (360 * (Satellite_rev_sidereal_day * (Epoch_now - Epoch_start) + 0.5
        * first_derative_mean_motion * (Epoch_now - Epoch_start) * (Epoch_now - Epoch_start)));

    OutputArray[17] = Rev(M);

    Initial_M = M;

    E = toDeg * (M * toRad + e * Math.sin(M * toRad) + 0.5 * e * e * Math.sin(2 * M * toRad));// <-- initlial estimate

    OutputArray[18] = Rev(E);

    initial_E = Rev(E);

    var E0, E1, alpha_E, iterations, NewM, M_offset, NyM, initial_E, New_E, Initial_M, E_Error;

    NewM = Rev(E - e * toDeg * Math.sin(toRad * E));

    if (M > NewM) M_old_offset = M - NewM;
    else M_old_offset = NewM - M;

    if ((M_old_offset = 360.00) || (M_old_offset = -360.00)) {
        M_old_offset = 0;
        //alert(M_old_offset);
    }

    M_old_offset = Rev(M_old_offset);

    alpha_E = 9; // just set to any large value before iterating
    M_offset = 9;// just set to any large value before iterating
    iterations = 0;
    E0 = initial_E;
    M0 = Rev(M);
    E0 = Rev(E);
    E_Error = 9;

    while (((Math.abs(E_Error)) > 0.00000001) && (iterations < 40))  // itererer korrekt 25 feb 2008, avslutt etter 40 iterations
    {
        iterations = 1 + iterations;

        E_Error = (E - toRad * e * Math.sin(toRad * E) - M);

        E = E - E_Error;

    }

// sjekk ny M=E-esinE og gammel M
//E=New_E;

    M = Initial_M;
    E = Rev(E);
    var true_anomaly, eccentric_anomaly;

    true_anomaly = toDeg * Math.acos((Math.cos(toRad * E) - e) / (1 - e * Math.cos(toRad * E)));
    eccentric_anomaly = toDeg * Math.acos(
        ((Math.cos(toRad * true_anomaly) + e) / (1 + e * Math.cos(toRad * true_anomaly)))); // funker ikke bra

    OutputArray[19] = true_anomaly;
//alert(eccentric_anomaly);

    M_offset = E_Error;
//alert(E_Error);

    OutputArray[37] = iterations;

// get the eccentric OutputArray[38] anomaly error before iterations
    if (Rev(E) > 1 * OutputArray[18])
        OutputArray[38] = Rev(Rev(E) - 1 * OutputArray[18]);
    else OutputArray[38] = Rev(1 * OutputArray[18] - Rev(E));

    OutputArray[20] = E_Error;

    OutputArray[21] = Rev(E);  // eccentric anomaly after iteratons

// **************Calculate X0,Y0 and r for the perifocal coordinate system*****************
//
//OutputArray[11]= semimajoraxis
    X0 = 1.0 * OutputArray[11] * (Math.cos(toRad * E) - e);  //  = r*Cos(trueanomaly)
    Y0 = 1.0 * OutputArray[11] * Math.sqrt(1 - e * e) * Math.sin(toRad * E);  // = r*sin (trueanomaly)
    r = Math.sqrt(X0 * X0 + Y0 * Y0); // distance
// ****************************************************************************************

//alert(Argument_of_perigee+" "+RA_AN+" "+Inclination);

    arg_per = 1 * Argument_of_perigee;
    RAAN = 1.0 * RA_AN;
    i = 1.0 * Inclination;

    perigee_perturbation = (Epoch_now - Epoch_start) * 4.97 * Math.pow(
        (Earth_equatorial_radius / (1 * OutputArray[11])), 3.5) * (5 * Math.cos(toRad * i) * Math.cos(toRad * i) - 1)
        / ((1 - e * e) * (1 - e * e));

// perturbation of ascending node

    ascending_node_perturbation = (Epoch_now - Epoch_start) * 9.95 * Math.pow(
        (Earth_equatorial_radius / (1 * OutputArray[11])), 3.5) * Math.cos(toRad * i) / ((1 - e * e) * (1 - e * e));

// perbutation of perigee

    arg_per = arg_per + perigee_perturbation;// removed 09 oct 2011
    RAAN = RAAN - ascending_node_perturbation; //removed 09 oct 2011

    true_anomaly = Math.atan2(Y0, X0);

    //  RAAN og long. of ascending node det samme ???

    //Long asc.node = RAAN - GMST

    L_asc_node = RAAN - getMST(now, 0.0);
    xeclip = r * (Math.cos(toRad * L_asc_node) * Math.cos(true_anomaly + toRad * arg_per) - Math.sin(toRad * L_asc_node)
        * Math.sin(true_anomaly + arg_per) * Math.cos(toRad * i));
    yeclip = r * (Math.sin(toRad * L_asc_node) * Math.cos(true_anomaly + toRad * arg_per) + Math.cos(toRad * L_asc_node)
        * Math.sin(true_anomaly + arg_per) * Math.cos(toRad * i));
    zeclip = r * Math.sin(true_anomaly + arg_per) * Math.sin(toRad * i);

//
//
// SatLon= Math.atan2( yeclip,xeclip )-RAAN+Lon_asc_node- w(t-te)= Math.atan2( yeclip,xeclip )-RAAN+(RAAN - GMST)- w(t-te)
//
//

//Velocity.value=Math.sqrt(    398600.5*(     (2/r)-(1/(1*Semimajoraxis.value))  ));

    OutputArray[22] = Math.sqrt(398600.5 / r);

    OutputArray[23] = X0;
    OutputArray[24] = Y0;
    OutputArray[25] = r;

    OutputArray[40] = formatvalue((r - Earth_equatorial_radius), 10);
    OutputArray[41] = formatvalue((r - GeoSyncRadius), 8);  // current distance from teoretical GEO orbit hight

// get driftrate
// use semimajoraxis/2 offset from Geo to get an more average like drift

    average_distance_from_geo_sync_radius, average_drift_rate;

    average_distance_from_geo_sync_radius = (OutputArray[11]) - GeoSyncRadius;  // semimajoraxis-Geosyncradius

    average_drift_rate = (((-3 / 2) * (average_distance_from_geo_sync_radius) * earth_rev_pr_solar_day / GeoSyncRadius)
        * 360);  // her går det galt...

    OutputArray[43] = average_drift_rate;

    OutputArray[45] = average_distance_from_geo_sync_radius;

    if ((1 * OutputArray[43]) > 0) {
        OutputArray[44] = 'East';
        OutputArray[43] = 1 * OutputArray[43];
    } else {
        OutputArray[43] = -1 * OutputArray[43];
        OutputArray[44] = 'West';
    }

// calculate driftrate as specified in Richharia book

    OutputArray[6] = (((-3 / 2) * OutputArray[41] * earth_rev_pr_solar_day / GeoSyncRadius) * 360);  // 41 = geo altitude value,  drift rate trolig ok...

// better to calculate LON drift, LON  now compared to LON after T=T+1

//

    if ((1 * OutputArray[6]) > 0) {
        OutputArray[36] = 'East';
        OutputArray[6] = 1 * OutputArray[6];
    } else {
        OutputArray[6] = -1 * OutputArray[6];
        OutputArray[36] = 'West';
    }
//

//Px,Py,Pz,Qx,Qy,Qz,    x,y,z,tod

//calculate E/W oscillation based on inclination
    OutputArray[46] = toDeg * Math.asin(Math.tan(i / 2) * Math.tan(i / 2));
//calculate E/W oscillation based on eccentricity
    OutputArray[47] = toDeg * (2 * e);

//alert(perigee_perturbation);
//alert(ascending_node_perturbation);

// *********Convert to Earth centered*********************
//**********inertial coordinate system********************
//**********(geocentric coordinates)**********************

    Px = Math.cos(toRad * arg_per) * Math.cos(RAAN * toRad) - Math.sin(toRad * arg_per) * Math.sin(toRad * RAAN)
        * Math.cos(toRad * i);
    Py = Math.cos(toRad * arg_per) * Math.sin(RAAN * toRad) + Math.sin(toRad * arg_per) * Math.cos(toRad * RAAN)
        * Math.cos(toRad * i);
    Pz = Math.sin(toRad * arg_per) * Math.sin(toRad * i);

//alert(toDeg*Math.atan2(Py,Math.sqrt(Px*Px+Py*Py)));

    Qx = -Math.sin(toRad * arg_per) * Math.cos(RAAN * toRad) - Math.cos(toRad * arg_per) * Math.sin(toRad * RAAN)
        * Math.cos(toRad * i);
    Qy = -Math.sin(toRad * arg_per) * Math.sin(RAAN * toRad) + Math.cos(toRad * arg_per) * Math.cos(toRad * RAAN)
        * Math.cos(toRad * i);
    Qz = Math.cos(toRad * arg_per) * Math.sin(toRad * i);

    x = Px * X0 + Qx * Y0;
    y = Py * X0 + Qy * Y0;
    z = Pz * X0 + Qz * Y0;

//*******************************************************

    OutputArray[26] = x;
    OutputArray[27] = y;
    OutputArray[28] = z;

//GetSubSatPoint(x,y,z);

// RA & Decl , Latitude og longitude er litt feil....

    Declination = toDeg * Math.atan2(z, Math.sqrt(x * x + y * y));//+" time "+(toDeg*Math.atan2(  z,Math.sqrt(x*x+y*y)  )/15)+":"+    ((toDeg*Math.atan2(  z,Math.sqrt(x*x+y*y)  )/15)-Math.floor((toDeg*Math.atan2(  z,Math.sqrt(x*x+y*y)  )/15)))*60;

    OutputArray[29] = Declination;//" ToRad"+toRad;

    OutputArray[30] = (Rev(toDeg * Math.atan2(y, x)));//+" time "+Math.floor(Rev(toDeg*Math.atan2(  y,x ))/15)+":"+((Rev(toDeg*Math.atan2(  y,x ))/15)-Math.floor(Rev(toDeg*Math.atan2(  y,x ))/15))*60;

    OutputArray[31] = formatvalue((NumberOfOrbitsAtEpoch * 1 + (Epoch_now - Epoch_start) * Satellite_rev_sidereal_day),
        5);

// gjør samme beregninger med jordbanen og x,y,z punkter på jorden

// finn lengdegrad for Greenwich akkurat nå
// forskjellen mellom lengdegrad GreenWich og satelliten er sat posisjon i forhold til 0.
//var now = new Date();

//getMST( now, lon );

//alert(Epoch_now+"\n"+Epoch_start);  // Epoch_start = undefined

    Longitude = Rev(toDeg * Math.atan2(y, x) - getMST(now, 0.0));  // ørlite feil i RA osv.  Feil i timeoffet ?  feilen er ca. 0.0368 grader

//Longitude=Rev(    toDeg*Math.atan2( y,x )-GMST_2()   );  // ørl
//alert(GMST_2() );
    Latitude = toDeg * Math.atan2(z, Math.sqrt(x * x + y * y));

// calculate Geodedic latitude
    var f, geocentricLat, geodeticLat, recalculated_geodetic_lat, C, Lat_error, loops, R;

    geocentricLat = Math.atan(z / Math.sqrt(x * x + y * y));
    geodeticLat = geocentricLat;
    loops = 0;
    Lat_error = 9;// just set to any value before looping

// kalkulerer klart feil i noen situasjoner

    R = Math.sqrt(x * x + y * y);

// can not calculate correct value... Geodetic should be slightly larger all the time...
    while (Math.abs(Lat_error) > 0.0000001) {
        loops += 1;

        C = 1 * 1 / (Math.sqrt(1 - (e * e * Math.sin(geodeticLat) * Math.sin(geodeticLat))));

        //C=1;

        //Earth_equatorial_radius=6378.14; // equatorial radii
        //GeoSyncRadius

        recalculated_geodetic_lat = Math.atan2((z + 1 * (Earth_equatorial_radius * C * e * e * Math.sin(geodeticLat))),
            R);
        //alert(toDeg*geodeticLat  );
        //if (Lat_error<0) alert(Lat_error);

        //if (geodeticLat<recalculated_geodetic_lat) Lat_error=recalculated_geodetic_lat-geodeticLat
        //	else Lat_error=geodeticLat-recalculated_geodetic_lat;

        Lat_error = recalculated_geodetic_lat - geodeticLat;

//alert("recalculated_geodetic_lat="+recalculated_geodetic_lat+" geodeticLat="+geodeticLat+" loops="+loops+" Lat_error="+Lat_error);

        geodeticLat = recalculated_geodetic_lat;

    }

    C = 1 / (Math.sqrt(1 - (e * e * Math.sin(geodeticLat) * Math.sin(geodeticLat))));

    f = 1 / 298.26;

    geodeticLat = Math.atan(Math.tan(geocentricLat) / ((1 - f) * (1 - f)));

    OutputArray[42] = (R / Math.cos(geodeticLat)) - 1 * Earth_equatorial_radius * C;

    geodeticLat = toDeg * geodeticLat;

    if (Longitude > 180) LonString = formatvalue(360 - Longitude, 10) + ' West';
    else LonString = formatvalue(Longitude, 10) + ' East';

    if (Longitude > 180) OutputArray[48] = 'West';
    else OutputArray[48] = 'East';

//OutputArray[48]= Longitude direction
    OutputArray[49] = Longitude;

    if (Latitude < 0) LatString = formatvalue(-Latitude, 10) + ' South';
    else LatString = formatvalue(Latitude, 10) + ' North';

    if (geodeticLat > 0) OutputArray[32] = formatvalue(Math.abs(geodeticLat), 10) + ' North';
    else OutputArray[32] = formatvalue(Math.abs(geodeticLat), 10) + ' South';

    var Number, Number2;
    Number = M_offset;
    Number2 = E - initial_E;

//Misc.value="Longitude = "+LonString+" Latitude="+LatString+ " Time elapsed since epoch="+Convert_to_deg_min_sec((Epoch_now-Epoch_start)*24);
    window.status = 'Longitude = ' + LonString + ' Latitude=' + OutputArray[32] + ' Time elapsed='
        + Convert_to_deg_min_sec((Epoch_now - Epoch_start) * 24) + ' Iter.=' + OutputArray[37] + '-' + loops
        + ' E error=' + (M_offset) + ' deg. Initial E error= ' + (initial_E - E);

    OutputArray[33] = Convert_to_deg_min_sec((Epoch_now - Epoch_start) * 24) + '   T=' + formatvalue(
        (Epoch_now - Epoch_start), 16);

    OutputArray[34] = LonString;

    OutputArray[35] = LatString;

//SatelliteGeodeticLatitude.value=formatvalue(geodeticLat,10);//+" loops="+loops;

//OutputArray[0]=earth_rev_pr_solar_day;   Earth_rev_solar_day.value
//OutputArray[1]=earth_deg_pr_solar_day;   Earth_deg_solar_day.value
//OutputArray[2]=earth_rev_pr_siderealday; Earth_rev_sidereal_day.value
//OutputArray[3]=earth_deg_pr_siderealday;  Earth_deg_sidereal_day.value
//OutputArray[4]=satellite_deg_pr_sidereal_day;  Satellite_deg_sidereal_day.value
//OutputArray[5]=satellite_deg_pr_solar_day;  Satellite_deg_solar_day.value
//OutputArray[6]=Driftrate.value=
//OutputArray[36]=Direction.value="East";
//OutputArray[7]=TC.value=
//OutputArray[8]=GeoTC.value=
//OutputArray[9]=Apogee.value=RangeA*(1+Eccentricity.value*1);
//OutputArray[10]=Perigee.value=RangeA*(1-Eccentricity.value*1);
//OutputArray[11]=Semimajoraxis.value=(1*Apogee.value+1*Perigee.value)/2;
//OutputArray[12]=Apogee.value=RangeA*(1+Eccentricity.value*1)-Earth_equatorial_radius;
//OutputArray[13]=Perigee.value=RangeA*(1-Eccentricity.value*1)-Earth_equatorial_radius;
//OutputArray[14]=DateEpoch.value=d_to_date_and_time(Epoch_start)+"  d="+formatvalue(Epoch_start,14)+"  ep="+Epoch.value;
//OutputArray[15]=GMST.value=getMST(now, 0.0 );
//OutputArray[16]=TimeOfCalculation.value=now+" (verifies the time&date used)";
//OutputArray[17]=MeananomalyCalculated.value=Rev(M);
//OutputArray[18]=EccentricanomalyBeforeIterations.value=Rev(E);
//OutputArray[19]=Trueanomaly.value=true_anomaly;
//OutputArray[20]=EccentricanomalyErrorAfterIterations.value=E_Error;
//OutputArray[21]=EccentricanomalyAfterIterations.value=Rev(E);
//OutputArray[22]=Velocity.value=Math.sqrt(    398600.5/r);
//OutputArray[23]=X_orbit_plane.value=X0;
//OutputArray[24]=Y_orbit_plane.value=Y0;
//OutputArray[25]=r_orbit_plane.value=r;
//OutputArray[26]=x_geocentric.value=x;
//OutputArray[27]=y_geocentric.value=y;
//OutputArray[28]=z_geocentric.value=z;
//OutputArray[29]=declination.value=Declination;//" ToRad"+toRad;
//OutputArray[30]=RA.value=  right ascension;
//OutputArray[31]=NumberOfOrbitsNow.value=formatvalue((NumberOfOrbitsAtEpoch.value*1+(Epoch_now-Epoch_start)*Satellite_rev_sidereal_day.value),5);
//OutputArray[32]=SatelliteGeodeticLatitude.value=formatvalue(Math.abs(geodeticLat),10)
//OutputArray[33]=TimeElepsedSinceEpoch.value=Convert_to_deg_min_sec((Epoch_now-Epoch_start)*24)+"   T="+formatvalue((Epoch_now-Epoch_start),16);
//OutputArray[34]=SatelliteLongitude.value=LonString;
//OutputArray[35]=SatelliteGeocentricLatitude.value=LatString;
//OutputArray[37]=Iterations.value=iterations;
//OutputArray[38] eccentric anomaly error before iterations
//OutputArray[39]=TimeEpochFormat.value=get_time_in_epoch_format(now,Epoch_now);
//OutputArray[40]=Altitude.value= formatvalue((r -Earth_equatorial_radius),10);
//OutputArray[41]=GeoAltitude.value=formatvalue((r-GeoSyncRadius),8);
//OutputArray[42]=GeoDeticAltitude.value=(R / Math.cos(geodeticLat)) - 1*Earth_equatorial_radius*C;
//OutputArray[43]=AverageDriftrate.value=
//OutputArray[44]=AverageDriftrateDirection.value=OutputArray[44];
//OutputArray[45]=average_distance_from_geo_sync_radius=OutputArray[45];=AvrGeoAltitude.value;
//OutputArray[46]=toDeg*Math.asin(  Math.tan(i/2)*Math.tan(i/2)   );//   EW_oscillation_caused_by_inclination.value;
//OutputArray[47]=toDeg*(2*e );EW_oscillation_caused_by_eccentricity.value;
//OutputArray[48]= Longitude direction
//OutputArray[49]= Longitude in 0-360 deg east format
//OutputArray[50]= Current Mean Motion

//window.status=toDeg*(7.29211510/100000)*(Epoch_now-Epoch_start)*60*60*24;

    return (OutputArray);

}

function Convert_to_deg_min_sec(Number) {

    var Hour, Min, Sec, hhmmss;

    if (Number < 0) {

        Number = Math.abs(Number);
        sign = '-';
    } else sign = '+';
    Hour = formatvalue(Math.floor(Number), 8);
    Min = Math.floor((Number - Math.floor(Hour)) * 60);

    Sec = Math.floor(((Number - Math.floor(Hour)) * 60 - Min) * 60);
    Sec = ((Number - Math.floor(Hour)) * 60 - Min) * 60;
    Min = formatvalue(Min, 2);
    Sec = formatvalue(Sec, 5);

//if (Hour>100) Hour="0"+Hour;
    if (Hour < 10) Hour = '0' + Hour;
    if (Min < 10) Min = '0' + Min;
    if (Sec < 10) Sec = '0' + Sec;

    hhmmss = sign + Hour + ':' + Min + ':' + Sec;

    return (hhmmss);

}

function formatvalue(input, rsize) // Desimal avrunding
{
    var invalid = '**************************';
    var nines = '999999999999999999999999';
    var strin = '' + input;
    var fltin = parseFloat(strin);
    if (strin.length <= rsize) return strin;
    if (strin.indexOf('e') != -1 ||
        fltin > parseFloat(nines.substring(0, rsize) + '.4'))
        return invalid.substring(0, rsize);
    var rounded = '' + (fltin + (fltin - parseFloat(strin.substring(0, rsize))));
    return rounded.substring(0, rsize);
}

function onchange_satellite_rev_solarday() {
    satellite_rev_pr_solar_day = Tracker.Satellite_rev_solar_day.value * 1;
    satellite_rev_pr_sidereal_day = 1 / satellite_rev_pr_solar_day;
//Tracker.Satellite_rev_sidereal_day.value=satellite_rev_pr_sidereal_day;

    Tracker.Altitude.value = Math.pow((6028.9 * (1440 / satellite_rev_pr_sidereal_day)), (2 / 3))
        - Earth_equatorial_radius;

    Tracker.GeoAltitude.value = Math.pow((6028.9 * (1440 / satellite_rev_pr_sidereal_day)), (2 / 3)) - GeoSyncRadius;

}

function onchange_satellite_rev_siderealday() {

//Satellite_rev_sidereal_day.value=Current_Motion.value;  // is the same as mean motion given as solar day...

//satellite_rev_pr_sidereal_day=Current_Motion.value;

    satellite_rev_pr_solar_day = 1 / (1 * Tracker.Current_Motion.value);
    Tracker.Satellite_rev_solar_day.value = satellite_rev_pr_solar_day;
    Tracker.Altitude.value = Math.pow((6028.9 * (1440 / satellite_rev_pr_sidereal_day)), (2 / 3))
        - Earth_equatorial_radius;
    Tracker.GeoAltitude.value = Math.pow((6028.9 * (1440 / satellite_rev_pr_sidereal_day)), (2 / 3)) - GeoSyncRadius;
}

function getdriftrate() {

    Tracker.Driftrate.value = Rev(
        (Tracker.Satellite_rev_solar_day.value * 1 + Tracker.Earth_rev_solar_day.value * 1) * 360);

    if ((1 * Tracker.Driftrate.value) < 0)
        Tracker.Direction.value = 'East';
    else
        Tracker.Direction.value = 'West';

// sannsynligvis er korrekt driftrate 1/solarday + sat_siderealday

    satellite_deg_pr_sidereal_day = 360 * satellite_rev_pr_sidereal_day;
    satellite_deg_pr_solar_day = 360 * satellite_rev_pr_solar_day;

    Tracker.Satellite_deg_sidereal_day.value = satellite_deg_pr_sidereal_day;
    Tracker.Satellite_deg_solar_day.value = satellite_deg_pr_solar_day;

//Misc.value=Rev(   (satellite_rev_pr_solar_day+earth_rev_pr_solar_day) * 360); // deg. pr. 24 solar hours

// Epoch starttid regnes ut feil !!!!

}
