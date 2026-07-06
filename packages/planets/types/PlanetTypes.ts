import type {Vsop87} from '@app/types/Vsop87Types';
import type {Earth} from '@package/earth';
import type {Sun} from '@package/sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import type Planet from '../models/Planet';

export type PlanetConstructor = new (
    toi?: TimeOfInterest,
    earth?: Earth,
    sun?: Sun,
    vsop87Date?: Vsop87,
    vsop87J2000?: Vsop87,
) => Planet;
