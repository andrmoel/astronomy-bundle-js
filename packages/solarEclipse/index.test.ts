import {SolarEclipse} from './index';
import Location from '@package/location/models/Location';
import TimeOfInterest from '@package/time/models/TimeOfInterest';

const eclipse = SolarEclipse.createFromDate('2021-12-04');
// Antarctica Union Glacier
const location = Location.create(
    -79.738991,
    -82.736597,
    718
);

it('tests the solar eclipse', () => {
    const type = eclipse.getType();
    const maxObscuration = eclipse.getMaxObscuration();
    const maxDuration = eclipse.getMaxDuration();
    const maxCentralDuration = eclipse.getMaxCentralDuration();
    const sarosNumber = eclipse.getSarosNumber();
    const location = eclipse.getLocationOfGreatestEclipse();
})

it('tests local eclipse', () => {
    const localEclipse = eclipse.getLocalEclipse(location);

    const type = localEclipse.getType();
    const contactTaus = localEclipse.getContactTaus();
    const contactTimes = localEclipse.getContactTimes();
    const duration = localEclipse.getDuration();
    const centralDuration = localEclipse.getCentralDuration();

    console.log(contactTaus);
})

it('tests local eclipse circumstances', () => {
    const toi = TimeOfInterest.fromDate(new Date('2025-01-01'));

    const circumstances = eclipse
        .getLocalEclipse(location)
        .getCircumstances(toi);

    const type = circumstances.getType();
    const isInEclipse = circumstances.isInEclipse();
    const isInCentralEclipse = circumstances.isInCentralEclipse();
    const magnitude = circumstances.getMagnitude();
    const obscuration = circumstances.getObscuration();
});
