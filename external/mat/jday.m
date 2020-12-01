% -----------------------------------------------------------------------------
%
%                           function jday.m
%
%  this function finds the julian date given the year, month, day, and time.
%
%  author        : david vallado                  719-573-2600   27 may 2002
%
%  revisions
%                -
%
%  inputs          description                    range / units
%    year        - year                           1900 .. 2100
%    mon         - month                          1 .. 12
%    day         - day                            1 .. 28,29,30,31
%    hr          - universal time hour            0 .. 23
%    min         - universal time min             0 .. 59
%    sec         - universal time sec             0.0 .. 59.999
%    whichtype   - julian .or. gregorian calender   'j' .or. 'g'
%
%  outputs       :
%    jd          - julian date                    days from 4713 bc
%    jdfrac      - julian date fraction of a day   0.0 to 1.0
% 
%  locals        :
%    none.
%
%  coupling      :
%    none.
%
%  references    :
%    vallado       2007, 189, alg 14, ex 3-14
%
% [jd, jdfrac] = jday(yr, mon, day, hr, min, sec)
% -----------------------------------------------------------------------------

function [jd, jdfrac] = jday(yr, mon, day, hr, min, sec)

        % ------------------------  implementation   ------------------
        jd = 367.0 * yr  ...
             - floor( (7 * (yr + floor( (mon + 9) / 12.0) ) ) * 0.25 )   ...
             + floor( 275 * mon / 9.0 ) ...
             + day + 1721013.5;   % use - 678987.0 to go to mjd directly
        jdfrac = (sec + min * 60.0 + hr *3600.0) / 86400.0;
        
        % check jdfrac
        if jdfrac > 1.0 
            jd = jd + floor(jdfrac);
            jdfrac = jdfrac - floor(jdfrac);
        end
        
        %  - 0.5 * sign(100.0 * yr + mon - 190002.5) + 0.5;
        

