import {createTimeOfInterest} from '../time';
import AstronomicalObject from './AstronomicalObject';

class TestClass extends AstronomicalObject {
    constructor(toi) {
        super('TestClass', toi);
    }
}

it('tests get name', () => {
    const astronomicalObject = new TestClass();

    expect(astronomicalObject.name).toBe('TestClass');
});

it('creates an AstronomicalObject with TimeOfInterest', () => {
    const toi = createTimeOfInterest.fromTime(2000, 5, 10, 0, 0, 0);

    const astronomicalObject = new TestClass(toi);

    expect(astronomicalObject.toi.time).toEqual({year: 2000, month: 5, day: 10, min: 0, hour: 0, sec: 0});
});

it('creates an AstronomicalObject without TimeOfInterest', () => {
    jest.spyOn(global.Date, 'now').mockReturnValueOnce('2020-10-21 10:00:00Z');

    const astronomicalObject = new TestClass();

    expect(astronomicalObject.toi.time).toEqual({year: 2020, month: 10, day: 21, hour: 10, min: 0, sec: 0});
});
