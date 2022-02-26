export type Vsop87Element = Array<Array<number>>;

export type Vsop87Group = Array<Vsop87Element>;

export type Vsop87 = {
    VSOP87_X: Vsop87Group;
    VSOP87_Y: Vsop87Group;
    VSOP87_Z: Vsop87Group;
};
