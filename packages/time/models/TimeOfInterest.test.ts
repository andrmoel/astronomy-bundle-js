import TimeOfInterest from './TimeOfInterest';

const DAY_OF_WEEK_SATURDAY = 6;

describe('constructors', () => {
    describe('new TimeOfInterest', () => {
        it('sets time', () => {
            const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
        });

        it('sets jd', () => {
            const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

            expect(toi.jd).toBeCloseTo(2451685.076852);
        });

        it('sets T', () => {
            const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

            expect(toi.T).toBeCloseTo(0.003835);
        });
    });

    describe('fromTime', () => {
        it('creates with all arguments', () => {
            const toi = TimeOfInterest.fromTime(2000, 5, 20, 13, 50, 40);

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
        });

        it('defaults hour, min and sec to 0', () => {
            const toi = TimeOfInterest.fromTime(2000, 5, 20);

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 0, min: 0, sec: 0});
        });
    });

    describe('fromDate', () => {
        it('creates from a UTC date', () => {
            const toi = TimeOfInterest.fromDate(new Date('2000-05-20T13:50:40.000Z'));

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
        });
    });

    describe('fromYearOfDay', () => {
        it('creates from year and integer day of year', () => {
            const toi = TimeOfInterest.fromYearOfDay(2000, 141);

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 0, min: 0, sec: 0});
        });
    });

    describe('fromJulianDay', () => {
        it('creates from julian day', () => {
            const toi = TimeOfInterest.fromJulianDay(2451684.5);

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 0, min: 0, sec: 0});
        });
    });

    describe('fromJulianCenturiesJ2000', () => {
        it('creates from julian centuries J2000 (T=0 is J2000.0 epoch)', () => {
            const toi = TimeOfInterest.fromJulianCenturiesJ2000(0);

            expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 0, sec: 0});
        });
    });

    describe('fromCurrentTime', () => {
        afterEach(() => jest.restoreAllMocks());

        it('creates from the current system time', () => {
            jest.spyOn(Date, 'now').mockReturnValue(new Date('2000-05-20T13:50:40.000Z').getTime());

            const toi = TimeOfInterest.fromCurrentTime();

            expect(toi.time).toEqual({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
        });
    });
});

it('tests getTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getTime()).toEqual({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
});

describe('test getString', () => {
    it('has date AD', () => {
        const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

        expect(toi.getString()).toBe('2000-05-20 13:50:40');
    });

    it('has date BC', () => {
        const toi = new TimeOfInterest({year: -2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

        expect(toi.getString()).toBe('-2000-05-20 13:50:40');
    });
});

it('tests getDate', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDate()).toEqual(new Date('2000-05-20T13:50:40.000Z'));
});

it('tests getDecimalYear', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDecimalYear()).toBeCloseTo(2000.38409);
});

it('tests getDayOfYear', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDayOfYear()).toBeCloseTo(141);
});

it('tests getDayOfWeek', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDayOfWeek()).toBeCloseTo(DAY_OF_WEEK_SATURDAY);
});

it('tests isLeapYear', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.isLeapYear()).toBeTruthy();
});

it('tests getJulianDay', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getJulianDay()).toBeCloseTo(2451685.076852);
});

it('tests getJulianDay0', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getJulianDay0()).toBe(2451684.5);
});

it('tests getJulianCenturiesJ2000', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getJulianCenturiesJ2000()).toBeCloseTo(0.003835);
});

it('tests getJulianMillenniaJ2000', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getJulianMillenniaJ2000()).toBeCloseTo(0.000384);
});

it('tests getGreenwichMeanSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getGreenwichMeanSiderealTime()).toBeCloseTo(86.193665);
});

it('tests getGreenwichApparentSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getGreenwichApparentSiderealTime()).toBeCloseTo(86.18946);
});

it('tests getLocalMeanSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
    const location = {lon: 13.3} as never;

    expect(toi.getLocalMeanSiderealTime(location)).toBeCloseTo(99.493665);
});

it('tests getLocalApparentSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
    const location = {lon: 13.3} as never;

    expect(toi.getLocalApparentSiderealTime(location)).toBeCloseTo(99.48946);
});

it('tests getDeltaT', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDeltaT()).toBeCloseTo(63.98);
});
