% ------------------------------------------------------------------------------
%
%                           function constastro
%
%  this function sets constants for various astrodynamic operations. 
%
%  author        : david vallado                  719-573-2600    2 apr 2007
%
%  revisions
%
%  inputs        : description                    range / units
%    none
%
%  outputs       :
%    re, flat, omegaearth, mu;
%    eccearth, eccearthsqrd;
%    renm, reft, tusec, tumin, tuday, omegaearthradptu, omegaearthradpmin;
%    velkmps, velftps, velradpmin;
%    degpsec, radpday;
%    speedoflight, au, earth2moon, moonradius, sunradius;
%
%  locals        :
%                -
%
%  coupling      :
%    none.
%
% constastro;
% ------------------------------------------------------------------------------
        constmath;

        % -----------------------  physical constants  ----------------
        % EGM-08 constants used here
        re         = 6378.1363;         % km
        flat       = 1.0/298.257223563;
        omegaearth = 7.292115e-5;     % rad/s
        mu         = 398600.4415;      % km3/s2
        mum        = 3.986004415e14;   % m3/s2

        % derived constants from the base values
        eccearth = sqrt(2.0*flat - flat^2);
        eccearthsqrd = eccearth^2;

        renm = re / nm2m;
        reft = re * 1000.0 / ft2m;

        tusec = sqrt(re^3/mu);
        tumin = tusec / 60.0;
        tuday = tusec / 86400.0;
        tudaysid = tusec / 86164.090524;

        omegaearthradptu  = omegaearth * tusec;
        omegaearthradpmin = omegaearth * 60.0;

        velkmps = sqrt(mu / re);
        velftps = velkmps * 1000.0/ft2m;
        velradpmin = velkmps * 60.0/re;
%for afspc
%velkmps1 = velradpmin*6378.135/60.0   7.90537051051763
%mu1 = velkmps*velkmps*6378.135        3.986003602567418e+005        
        degpsec = (180.0 / pi) / tusec;
        radpday = 2.0 * pi * 1.002737909350795;

        speedoflight = 299792.458; % km/s
        au = 149597870.7;      % km
        earth2moon = 384400.0; % km
        moonradius =   1738.0; % km
        sunradius  = 696000.0; % km

        masssun   = 1.9891e30;
        massearth = 5.9742e24;
        massmoon  = 7.3483e22;
        
        musun = 1.32712428e11;
        mumoon = 4902.799;

