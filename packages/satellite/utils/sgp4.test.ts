import type {Sgp4State} from '../types/Sgp4Types';
import {initializeSgp4, propagateSgp4} from './sgp4';
import {parseTwoLineElement} from './twoLineElement';

const TLES = {
    nearEarth: [
        '1 00005U 58002B   00179.78495062  .00000023  00000-0  28098-4 0  4753',
        '2 00005  34.2682 348.7242 1859667 331.7664  19.3264 10.82419157413667',
    ],
    deepSpace: [
        '1 04632U 70093B   04031.91070959 -.00000084  00000-0  10000-3 0  9955',
        '2 04632  11.4628 273.1101 1450506 207.6000 143.9350  1.20231981 44145',
    ],
    halfDayResonance: [
        '1 08195U 75081A   06176.33215444  .00000099  00000-0  11873-3 0   813',
        '2 08195  64.1586 279.0717 6877146 264.7651  20.2257  2.00491383225656',
    ],
    synchronousResonance: [
        '1 09998U 74033F   05148.79417928 -.00000112  00000-0  00000+0 0  4480',
        '2 09998   9.4958 313.1750 0270971 327.5225  30.8097  1.16186785 45878',
    ],
    geostationaryLowInclination: [
        '1 28626U 05008A   06176.46683397 -.00000205  00000-0  10000-3 0  2190',
        '2 28626   0.0019 286.9433 0000335  13.7918  55.6504  1.00270176  4891',
    ],
    highEccentricity: [
        '1 23333U 94071A   94305.49999999 -.00172956  26967-3  10000-3 0    15',
        '2 23333  28.7490   2.3720 9728298  30.4360   1.3500  0.07309491    70',
    ],
    decaying: [
        '1 33333U 05037B   05333.02012661  .25992681  00000-0  24476-3 0  1532',
        '2 33333  96.4736 157.9986 9950000 244.0492 110.6523  4.00004038 10700',
    ],
    zeroMeanMotion: [
        '1 33334U 78066F   06174.85818871  .00000620  00000-0  10000-3 0  6806',
        '2 33334  68.4714 236.1303 5602877 123.7484 302.5767  0.00001000 67521',
    ],
};

type TleName = keyof typeof TLES;

describe('propagateSgp4 matches Vallado verification vectors', () => {
    it.each<[TleName, number, number[]]>([
        ['nearEarth', 0, [7022.46529266, -1400.08296755, 0.03995155, 1.893841015, 6.405893759, 4.53480725]],
        ['nearEarth', 360, [-7154.03120202, -3783.17682504, -3536.19412294, 4.741887409, -4.151817765, -2.093935425]],
        ['nearEarth', 720, [-7134.59340119, 6531.68641334, 3260.27186483, -4.113793027, -2.911922039, -2.557327851]],
        ['deepSpace', 0, [2334.11450085, -41920.44035349, -0.03867437, 2.826321032, -0.065091664, 0.570936053]],
        [
            'deepSpace',
            -5184,
            [-29020.02587128, 13819.84419063, -5713.33679183, -1.76806839, -3.235371192, -0.395206135],
        ],
        [
            'deepSpace',
            -5064,
            [-32982.56870101, -11125.54996609, -6803.28472771, 0.617446996, -3.379240041, 0.085954707],
        ],
        ['halfDayResonance', 0, [2349.8948335, -14785.93811562, 0.02119378, 2.721488096, -3.256811655, 4.498416672]],
        [
            'halfDayResonance',
            120,
            [15223.91713658, -17852.95881713, 25280.39558224, 1.079041732, 0.875187372, 2.485682813],
        ],
        [
            'halfDayResonance',
            240,
            [19752.78050009, -8600.07130962, 37522.7292109, 0.238105279, 1.546110924, 0.986410447],
        ],
        [
            'synchronousResonance',
            0,
            [25532.98947267, -27244.26327953, -1.11572421, 2.410283885, 2.194175683, 0.545888526],
        ],
        [
            'synchronousResonance',
            -1440,
            [-11362.18265118, -35117.55867813, -5413.62537994, 3.137861261, -1.01167826, 0.267510059],
        ],
        [
            'synchronousResonance',
            -1380,
            [309.25349929, -36960.43090143, -4198.4800767, 3.292429375, -0.002166046, 0.402111628],
        ],
        [
            'geostationaryLowInclination',
            0,
            [42080.71852213, -2646.86387436, 0.81851294, 0.193105177, 3.068688251, 0.000438449],
        ],
        [
            'geostationaryLowInclination',
            240,
            [23232.82515008, 35187.33981802, 4.98927428, -2.56577662, 1.694193132, 0.000163365],
        ],
        [
            'highEccentricity',
            0,
            [-9301.24542292, 3326.10200382, 2318.36441127, -8.729303005, -0.828225037, -0.122314827],
        ],
        [
            'highEccentricity',
            240,
            [-67053.08885388, -14994.69685946, -5897.99072793, -2.860576613, -1.183771565, -0.568473909],
        ],
    ])('%s at %d min', (name, tsince, expected) => {
        const state = propagate(name, tsince);
        const actual = [
            state.position.x,
            state.position.y,
            state.position.z,
            state.velocity.x,
            state.velocity.y,
            state.velocity.z,
        ];

        actual.forEach((value, i) => {
            expect(value).toBeCloseTo(expected[i], 6);
        });
    });
});

describe('propagateSgp4 errors', () => {
    it('throws when the semi-latus rectum becomes negative', () => {
        expect(() => propagate('decaying', 20)).not.toThrow();
        expect(() => propagate('decaying', 25)).toThrow('SGP4: semi-latus rectum');
    });

    it('throws when the perturbed eccentricity is out of range', () => {
        expect(() => propagate('zeroMeanMotion', 0)).toThrow('SGP4: perturbed eccentricity');
    });
});

describe('initializeSgp4', () => {
    it('uses near-Earth propagation for short periods', () => {
        const record = initialize('nearEarth');

        expect(record.deepSpace).toBeNull();
        expect(record.isimp).toBe(false);
    });

    it.each<[TleName, 0 | 1 | 2]>([
        ['deepSpace', 0],
        ['halfDayResonance', 2],
        ['synchronousResonance', 1],
        ['geostationaryLowInclination', 1],
    ])('uses deep-space propagation for %s with resonance %d', (name, irez) => {
        const record = initialize(name);

        expect(record.isimp).toBe(true);
        expect(record.deepSpace?.secular.irez).toBe(irez);
    });
});

function propagate(name: TleName, tsince: number): Sgp4State {
    return propagateSgp4(initialize(name), tsince);
}

function initialize(name: TleName) {
    return initializeSgp4(parseTwoLineElement(TLES[name].join('\n')));
}
