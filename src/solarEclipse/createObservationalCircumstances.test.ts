import createObservationalCircumstances from './createObservationalCircumstances';
import ObservationalCircumstances from './ObservationalCircumstances';

it('tests create local circumstances successfully', async () => {
    const circumstances = {
        t: 0,
        h: -9.407488,
        u: -0.0555894700932891,
        v: 0.011295675571670327,
        a: 0.3639375042180445,
        b: -0.09889174084574227,
        l1Derived: 0.53934912025566,
        l2Derived: -0.0067554588016498825,
        n2: 0.14223008338396062,
    };

    const obsCircumstances = await createObservationalCircumstances(circumstances);

    expect(obsCircumstances).toBeInstanceOf(ObservationalCircumstances);
});
