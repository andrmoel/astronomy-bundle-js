import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {SolarEclipse} from './index';

const eclipse = SolarEclipse.createFromDate('2021-12-04');
// Antarctica Union Glacier
const location = Location.create(-79.738991, -82.736597, 718);

it('tests the solar eclipse', () => {
    const _type = eclipse.getType();
    const _maxObscuration = eclipse.getMaxObscuration();
    const _maxDuration = eclipse.getMaxDuration();
    const _maxCentralDuration = eclipse.getMaxCentralDuration();
    const _sarosNumber = eclipse.getSarosNumber();
    const _location = eclipse.getLocationOfGreatestEclipse();
});

it('tests local eclipse', () => {
    const localEclipse = eclipse.getLocalEclipse(location);

    const _type = localEclipse.getType();
    const contactTaus = localEclipse.getContactTaus();
    const _contactTimes = localEclipse.getContactTimes();
    const _duration = localEclipse.getDuration();
    const _centralDuration = localEclipse.getCentralDuration();

    console.log(contactTaus);
});

it('tests local eclipse circumstances', () => {
    const toi = TimeOfInterest.fromDate(new Date('2025-01-01'));

    const circumstances = eclipse.getLocalEclipse(location).getCircumstances(toi);

    const _type = circumstances.getType();
    const _isInEclipse = circumstances.isInEclipse();
    const _isInCentralEclipse = circumstances.isInCentralEclipse();
    const _magnitude = circumstances.getMagnitude();
    const _obscuration = circumstances.getObscuration();
});
