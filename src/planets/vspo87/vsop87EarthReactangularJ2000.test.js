import {timeCalc} from '../../utils';
import {calculateX, calculateY, calculateZ} from './vsop87EarthRectangularJ2000';

it('tests', () => {
    const t = timeCalc.julianDay2julianMillenniaJ2000(2459063.2027083);

    const x = calculateX(t);
    const y = calculateY(t);
    const z = calculateZ(t);

    console.log(x, y, z);
});
