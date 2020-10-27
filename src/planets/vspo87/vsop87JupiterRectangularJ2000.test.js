import {timeCalc} from '../../utils';
import {calculateX, calculateY, calculateZ} from './vsop87JupiterRectangularJ2000';

it('tests', () => {
    const t = timeCalc.julianDay2julianMillenniaJ2000(2459121.2248264);

    const x = calculateX(t);
    const y = calculateY(t);
    const z = calculateZ(t);

    console.log(x, y, z);
});
