% ------------------------------------------------------------------------------
%
%                           function invjday
%
%  this function finds the year, month, day, hour, minute and second
%    given the julian date. tu can be ut1, tdt, tdb, etc.
%
%  author        : david vallado                  719-573-2600   27 may 2002
%
%  revisions
%                -
%
%  inputs          description                    range / units
%    jd          - julian date                    days from 4713 bc
%
%  outputs       :
%    year        - year                           1900 .. 2100
%    mon         - month                          1 .. 12
%    day         - day                            1 .. 28,29,30,31
%    hr          - hour                           0 .. 23
%    min         - minute                         0 .. 59
%    sec         - second                         0.0 .. 59.999
%
%  locals        :
%    days        - day of year plus fractional
%                  portion of a day               days
%    tu          - julian centuries from 0 h
%                  jan 0, 1900
%    temp        - temporary real values
%    leapyrs     - number of leap years from 1900
%
%  coupling      :
%    days2mdhms  - finds month, day, hour, minute and second given days and year
%
%  references    :
%    vallado       2007, 208, alg 22, ex 3-13
%
% [year,mon,day,hr,min,sec] = invjday ( jd, jdfrac );
% -----------------------------------------------------------------------------

function [year,mon,day,hr,min,sec] = invjday ( jd, jdfrac );

     % check jdfrac for multiple days
     if abs(jdfrac) >= 1.0 
         jd = jd + floor(jdfrac);
         jdfrac = jdfrac - floor(jdfrac);
     end

     % check for fraction of a day included in the jd
	 dt = jd - floor(jd) - 0.5;
     if (abs(dt) > 0.00000001)
         jd = jd - dt;  
         jdfrac = jdfrac + dt;
     end

     % ----------------- find year and days of the year ---------------
     temp   = jd - 2415019.5; 
     tu     = temp / 365.25;
     year   = 1900 + floor( tu );
     leapyrs= floor( ( year-1901 )*0.25 );
     days   = floor(temp - ((year-1900)*365.0 + leapyrs ));

     % ------------ check for case of beginning of a year -------------
     if days + jdfrac < 1.0
         year   = year - 1;
         leapyrs= floor( ( year-1901 )*0.25 );
         days   = floor(temp - ((year-1900)*365.0 + leapyrs ));
     end

     % ------------------- find remaining data  -----------------------
     % now add the daily time in to preserve accuracy
     [mon,day,hr,min,sec] = days2mdh( year, days + jdfrac );

%      [jdo, jdfraco] = jday(2017, 8, 23, 12, 15, 16);
%      [jdo, jdfraco] = jday(2017, 12, 31, 12, 15, 16);
%      fprintf(1,'%11.6f  %11.6f \n',jdo,jdfraco);
%      [year,mon,day,hr,min,sec] = invjday ( jdo + jdfraco, 0.0 );
%      fprintf(1,'%4i  %3i  %3i  %2i:%2i:%6.4f  \n', year,mon,day,hr,min,sec);
%      [year,mon,day,hr,min,sec] = invjday ( jdo, jdfraco );
%      fprintf(1,'%4i  %3i  %3i  %2i:%2i:%6.4f  \n', year,mon,day,hr,min,sec);
%      
%      for i = -50:50
%      for i = 0:50
%          jd = jdo + i/10.0;
%          jdfrac = jdfraco;
%          [year,mon,day,hr,min,sec] = invjday ( jd + jdfrac, 0.0 );
%          fprintf(1,'%4i  %3i  %3i  %2i:%2i:%6.4f  \n', year,mon,day,hr,min,sec);
%          [year,mon,day,hr,min,sec] = invjday ( jd, jdfrac );
% 	     dt = jd - floor(jd);
%          fprintf(1,'%4i  %3i  %3i  %2i:%2i:%6.4f  %11.6f %11.6f \n\n', year,mon,day,hr,min,sec, i/10.0, abs(dt - 0.5));
%      end
% 
%     fprintf(1,'end first half \n');
% 
%     for i = -50:50
%          jd = jdo;
%          jdfrac = jdfraco + i/10.0;
%          [year,mon,day,hr,min,sec] = invjday ( jd + jdfrac, 0.0 );
%          fprintf(1,'%4i  %3i  %3i  %2i:%2i:%6.4f  \n', year,mon,day,hr,min,sec);
%          [year,mon,day,hr,min,sec] = invjday ( jd, jdfrac );
%          fprintf(1,'%4i  %3i  %3i  %2i:%2i:%6.4f  \n\n', year,mon,day,hr,min,sec);
%      end
     
     
     
