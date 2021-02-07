const VSOP87_L0 = [
    [3.17614666774],
    [0.01353968419, 5.59313319619, 10213.28554621100],
    [0.00089891645, 5.30650048468, 20426.57109242200],
    [0.00005477201, 4.41630652531, 7860.41939243920],
    [0.00003455732, 2.69964470778, 11790.62908865880],
    [0.00002372061, 2.99377539568, 3930.20969621960],
    [0.00001317108, 5.18668219093, 26.29831979980],
    [0.00001664069, 4.25018935030, 1577.34354244780],
    [0.00001438322, 4.15745043958, 9683.59458111640],
    [0.00001200521, 6.15357115319, 30639.85663863300],
    [0.00000761380, 1.95014702120, 529.69096509460],
    [0.00000707676, 1.06466707214, 775.52261132400],
    [0.00000584836, 3.99839884762, 191.44826611160],
    [0.00000769314, 0.81629615911, 9437.76293488700],
    [0.00000499915, 4.12340210074, 15720.83878487840],
    [0.00000326221, 4.59056473097, 10404.73381232260],
    [0.00000429498, 3.58642859752, 19367.18916223280],
    [0.00000326967, 5.67736583705, 5507.55323866740],
    [0.00000231937, 3.16251057072, 9153.90361602180],
    [0.00000179695, 4.65337915578, 1109.37855209340],
    [0.00000128263, 4.22604493736, 20.77539549240],
    [0.00000155464, 5.57043888948, 19651.04848109800],
    [0.00000127907, 0.96209822685, 5661.33204915220],
    [0.00000105547, 1.53721191253, 801.82093112380],
    [0.00000085722, 0.35589249966, 3154.68708489560],
    [0.00000099121, 0.83288185132, 213.29909543800],
    [0.00000098804, 5.39389655503, 13367.97263110660],
    [0.00000082094, 3.21596990826, 18837.49819713819],
    [0.00000088031, 3.88868860307, 9999.98645077300],
    [0.00000071577, 0.11145739345, 11015.10647733480],
    [0.00000056122, 4.24039855475, 7.11354700080],
    [0.00000070239, 0.67458813282, 23581.25817731760],
    [0.00000050796, 0.24531603049, 11322.66409830440],
    [0.00000046111, 5.31576465717, 18073.70493865020],
    [0.00000044574, 6.06282201966, 40853.14218484400],
    [0.00000042594, 5.32873337210, 2352.86615377180],
    [0.00000042635, 1.79955421680, 7084.89678111520],
    [0.00000041177, 0.36240972161, 382.89653222320],
    [0.00000035749, 2.70448479296, 10206.17199921020],
];

const VSOP87_L1 = [
    [10213.52943052898],
    [0.00095707712, 2.46424448979, 10213.28554621100],
    [0.00014444977, 0.51624564679, 20426.57109242200],
    [0.00000213374, 1.79547929368, 30639.85663863300],
    [0.00000151669, 6.10635282369, 1577.34354244780],
    [0.00000173904, 2.65535879443, 26.29831979980],
    [0.00000082233, 5.70234133730, 191.44826611160],
    [0.00000069734, 2.68136034979, 9437.76293488700],
    [0.00000052408, 3.60013087656, 775.52261132400],
    [0.00000038318, 1.03379038025, 529.69096509460],
    [0.00000029633, 1.25056322354, 5507.55323866740],
    [0.00000025056, 6.10664792855, 10404.73381232260],
    [0.00000017772, 6.19369798901, 1109.37855209340],
    [0.00000016510, 2.64330452640, 7.11354700080],
    [0.00000014230, 5.45138233941, 9153.90361602180],
    [0.00000012607, 1.24464400689, 40853.14218484400],
    [0.00000011627, 4.97604495371, 213.29909543800],
    [0.00000012563, 1.88122199199, 382.89653222320],
    [0.00000008869, 0.95282732248, 13367.97263110660],
    [0.00000007374, 4.39476760580, 10206.17199921020],
    [0.00000006552, 2.28168808058, 2352.86615377180],
];

const VSOP87_L2 = [
    [0.00054127076],
    [0.00003891460, 0.34514360047, 10213.28554621100],
    [0.00001337880, 2.02011286082, 20426.57109242200],
    [0.00000023836, 2.04592119012, 26.29831979980],
    [0.00000019331, 3.53527371458, 30639.85663863300],
    [0.00000009984, 3.97130221102, 775.52261132400],
    [0.00000007046, 1.51962593409, 1577.34354244780],
    [0.00000006014, 0.99926757893, 191.44826611160],
    [0.00000003163, 4.36095475762, 9437.76293488700],
    [0.00000002125, 2.65810625752, 40853.14218484400],
    [0.00000001934, 3.39287946981, 382.89653222320],
];

const VSOP87_L3 = [
    [0.00000135742, 4.80389020993, 10213.28554621100],
    [0.00000077846, 3.66876371591, 20426.57109242200],
    [0.00000026023],
    [0.00000001214, 5.31970006917, 30639.85663863300],
    [0.00000000254, 4.15021671822, 40853.14218484400],
    [0.00000000008, 5.55523563261, 51066.42773105500],
    [0.00000000008, 1.40501229148, 1577.34354244780],
    [0.00000000006, 1.27791479726, 10404.73381232260],
    [0.00000000006, 5.76447068962, 10239.58386601080],
];

const VSOP87_L4 = [
    [0.00000114016, 3.14159265359],
    [0.00000003209, 5.20514170164, 20426.57109242200],
    [0.00000001714, 2.51099591706, 10213.28554621100],
    [0.00000000050, 0.71356059861, 30639.85663863300],
    [0.00000000023, 5.68127607034, 40853.14218484400],
];

const VSOP87_L5 = [
    [0.00000000874, 3.14159265359],
];

const VSOP87_B0 = [
    [0.05923638472, 0.26702775813, 10213.28554621100],
    [0.00040107978, 1.14737178106, 20426.57109242200],
    [0.00032814918, 3.14159265359],
    [0.00001011392, 1.08946123021, 30639.85663863300],
    [0.00000149458, 6.25390296069, 18073.70493865020],
    [0.00000137788, 0.86020146523, 1577.34354244780],
    [0.00000129973, 3.67152483651, 9437.76293488700],
    [0.00000119507, 3.70468812804, 2352.86615377180],
    [0.00000107971, 4.53903677647, 22003.91463486980],
    [0.00000092029, 1.53954562706, 9153.90361602180],
    [0.00000052982, 2.28138172277, 5507.55323866740],
    [0.00000045617, 0.72319641722, 10239.58386601080],
    [0.00000038855, 2.93437865147, 10186.98722641120],
    [0.00000043491, 6.14015776699, 11790.62908865880],
    [0.00000041700, 5.99126845246, 19896.88012732740],
    [0.00000039644, 3.86842095901, 8635.94200376320],
    [0.00000039175, 3.94960351174, 529.69096509460],
    [0.00000033320, 4.83194909595, 14143.49524243060],
    [0.00000023711, 2.90646621218, 10988.80815753500],
    [0.00000023500, 2.00770618322, 13367.97263110660],
    [0.00000021809, 2.69701424951, 19651.04848109800],
    [0.00000020653, 0.98666685459, 775.52261132400],
    [0.00000016976, 4.13711782135, 10021.83728009940],
    [0.00000017835, 5.96268643102, 25934.12433108940],
    [0.00000014949, 5.61075168206, 10404.73381232260],
    [0.00000018579, 1.80529277514, 40853.14218484400],
    [0.00000015407, 3.29563855296, 11015.10647733480],
    [0.00000012936, 5.42651448496, 29580.47470844380],
    [0.00000011962, 3.57604253827, 10742.97651130560],
    [0.00000011827, 1.19070919600, 8624.21265092720],
    [0.00000011466, 5.12780364967, 6283.07584999140],
    [0.00000009484, 2.75167834335, 191.44826611160],
    [0.00000013129, 5.70735942511, 9683.59458111640],
    [0.00000008583, 0.43182249199, 9786.68735533500],
    [0.00000009763, 0.14614896296, 20618.01935853360],
    [0.00000008148, 1.30548515603, 15720.83878487840],
    [0.00000006050, 6.26541665966, 11322.66409830440],
    [0.00000005955, 4.92235372433, 1059.38193018920],
    [0.00000006983, 3.44920932146, 17298.18232732620],
];

const VSOP87_B1 = [
    [0.00513347602, 1.80364310797, 10213.28554621100],
    [0.00004380100, 3.38615711591, 20426.57109242200],
    [0.00000196586, 2.53001197486, 30639.85663863300],
    [0.00000199162],
    [0.00000014031, 2.27087044687, 9437.76293488700],
    [0.00000012958, 1.50735622957, 18073.70493865020],
    [0.00000011941, 5.60462450426, 1577.34354244780],
    [0.00000010324, 5.24224313355, 2352.86615377180],
    [0.00000009294, 6.07545631303, 22003.91463486980],
    [0.00000007441, 1.50257909439, 11790.62908865880],
    [0.00000008031, 0.29371105198, 9153.90361602180],
    [0.00000007514, 5.08081885990, 10186.98722641120],
    [0.00000004669, 3.87801635015, 10239.58386601080],
    [0.00000004399, 3.58872736593, 40853.14218484400],
    [0.00000003975, 1.28397121206, 10404.73381232260],
    [0.00000004657, 0.75073886819, 5507.55323866740],
    [0.00000003783, 4.33004753984, 19651.04848109800],
    [0.00000003390, 4.88976070903, 10988.80815753500],
    [0.00000003555, 1.25927550356, 19896.88012732740],
    [0.00000003479, 5.50797002160, 529.69096509460],
    [0.00000002884, 0.08549582037, 14143.49524243060],
];

const VSOP87_B2 = [
    [0.00022377665, 3.38509143877, 10213.28554621100],
    [0.00000281739],
    [0.00000173164, 5.25563766915, 20426.57109242200],
    [0.00000026945, 3.87040891568, 30639.85663863300],
    [0.00000001174, 0.09768632072, 10186.98722641120],
    [0.00000000685, 3.19139067811, 11790.62908865880],
    [0.00000000788, 4.36515965295, 10239.58386601080],
    [0.00000000592, 5.22270440328, 40853.14218484400],
    [0.00000000515, 6.12821215207, 10988.80815753500],
    [0.00000000538, 0.57550272342, 2352.86615377180],
    [0.00000000540, 3.11657836329, 18073.70493865020],
];

const VSOP87_B3 = [
    [0.00000646671, 4.99166565277, 10213.28554621100],
    [0.00000019952, 3.14159265359],
    [0.00000005540, 0.77376923951, 20426.57109242200],
    [0.00000002526, 5.44493763020, 30639.85663863300],
    [0.00000000079, 1.51447613604, 10186.98722641120],
    [0.00000000056, 0.63647808442, 40853.14218484400],
    [0.00000000058, 5.70731176550, 10239.58386601080],
    [0.00000000031, 4.72523061067, 11790.62908865880],
    [0.00000000026, 1.02068113372, 10988.80815753500],
];

const VSOP87_B4 = [
    [0.00000014102, 0.31537190181, 10213.28554621100],
    [0.00000000190, 2.35466404492, 20426.57109242200],
    [0.00000000164, 0.74476215141, 30639.85663863300],
    [0.00000000214, 3.14159265359],
    [0.00000000004, 2.34190883009, 40853.14218484400],
];

const VSOP87_B5 = [
    [0.00000000239, 2.05201727566, 10213.28554621100],
];

const VSOP87_R0 = [
    [0.72334820905],
    [0.00489824185, 4.02151832268, 10213.28554621100],
    [0.00001658058, 4.90206728012, 20426.57109242200],
    [0.00001632093, 2.84548851892, 7860.41939243920],
    [0.00001378048, 1.12846590600, 11790.62908865880],
    [0.00000498399, 2.58682187717, 9683.59458111640],
    [0.00000373958, 1.42314837063, 3930.20969621960],
    [0.00000263616, 5.52938185920, 9437.76293488700],
    [0.00000237455, 2.55135903978, 15720.83878487840],
    [0.00000221983, 2.01346776772, 19367.18916223280],
    [0.00000119467, 3.01975365264, 10404.73381232260],
    [0.00000125896, 2.72769833559, 1577.34354244780],
    [0.00000076178, 1.59577224486, 9153.90361602180],
    [0.00000085336, 3.98607953754, 19651.04848109800],
    [0.00000074347, 4.11957854039, 5507.55323866740],
    [0.00000041904, 1.64273363458, 18837.49819713819],
    [0.00000042493, 3.81864530735, 13367.97263110660],
    [0.00000039430, 5.39019422358, 23581.25817731760],
    [0.00000029042, 5.67739528728, 5661.33204915220],
    [0.00000027555, 5.72392407794, 775.52261132400],
    [0.00000027283, 4.82151812709, 11015.10647733480],
    [0.00000031274, 2.31806719544, 9999.98645077300],
    [0.00000019700, 4.96157560245, 11322.66409830440],
    [0.00000019809, 0.53189326492, 27511.46787353720],
    [0.00000013567, 3.75530870628, 18073.70493865020],
    [0.00000012921, 1.13381083556, 10206.17199921020],
    [0.00000016215, 0.56453834290, 529.69096509460],
    [0.00000011821, 5.09025877427, 3154.68708489560],
    [0.00000011728, 0.23432298744, 7084.89678111520],
    [0.00000013079, 5.24353197586, 17298.18232732620],
    [0.00000013180, 3.37207825651, 13745.34623902240],
    [0.00000009097, 3.07004895769, 1109.37855209340],
    [0.00000010818, 2.45024712908, 10239.58386601080],
    [0.00000011438, 4.56838894696, 29050.78374334920],
    [0.00000008377, 5.78327612352, 30639.85663863300],
    [0.00000008193, 1.95023111860, 22003.91463486980],
    [0.00000009308, 1.61615909286, 2352.86615377180],
    [0.00000010652, 1.95528396140, 31441.67756975680],
    [0.00000010357, 1.20234990061, 15874.61759536320],
];

const VSOP87_R1 = [
    [0.00034551039, 0.89198710598, 10213.28554621100],
    [0.00000234203, 1.77224942714, 20426.57109242200],
    [0.00000233998, 3.14159265359],
    [0.00000023864, 1.11274502648, 9437.76293488700],
    [0.00000010568, 4.59168210921, 1577.34354244780],
    [0.00000009124, 4.53540907003, 10404.73381232260],
    [0.00000006599, 5.97703999838, 5507.55323866740],
    [0.00000004667, 3.87683960551, 9153.90361602180],
    [0.00000003840, 5.66196924375, 13367.97263110660],
    [0.00000002666, 2.82413291285, 10206.17199921020],
    [0.00000002194, 2.05314419626, 775.52261132400],
    [0.00000002094, 2.55137285015, 18837.49819713819],
    [0.00000001782, 2.64808558644, 30639.85663863300],
    [0.00000001845, 1.87612936641, 11015.10647733480],
    [0.00000001303, 0.20613045603, 11322.66409830440],
    [0.00000001169, 0.79431893441, 17298.18232732620],
    [0.00000001001, 6.16555101536, 10239.58386601080],
    [0.00000000915, 4.59854496966, 1109.37855209340],
    [0.00000000884, 0.66706834422, 18073.70493865020],
    [0.00000000849, 5.58641571940, 12566.15169998280],
    [0.00000001071, 4.94792017474, 6283.07584999140],
];

const VSOP87_R2 = [
    [0.00001406587, 5.06366395190, 10213.28554621100],
    [0.00000015529, 5.47321687981, 20426.57109242200],
    [0.00000013059],
    [0.00000001099, 2.78883988292, 9437.76293488700],
    [0.00000000488, 6.27806914496, 1577.34354244780],
    [0.00000000361, 6.11914188253, 10404.73381232260],
    [0.00000000310, 1.38984998403, 5507.55323866740],
    [0.00000000389, 1.95017779915, 11015.10647733480],
    [0.00000000372, 2.33222828423, 775.52261132400],
    [0.00000000207, 5.63406721595, 10239.58386601080],
    [0.00000000168, 1.10765197296, 13367.97263110660],
];

const VSOP87_R3 = [
    [0.00000049582, 3.22263554520, 10213.28554621100],
    [0.00000000831, 3.21219077104, 20426.57109242200],
    [0.00000000112, 3.14159265359],
    [0.00000000013, 3.77448689585, 30639.85663863300],
    [0.00000000009, 4.19802043629, 10239.58386601080],
    [0.00000000006, 0.20714935358, 10186.98722641120],
    [0.00000000005, 0.68781956122, 8635.94200376320],
];

const VSOP87_R4 = [
    [0.00000000573, 0.92229697820, 10213.28554621100],
    [0.00000000040, 0.95468912157, 20426.57109242200],
    [0.00000000006, 3.14159265359],

];

const VSOP87_R5 = [
    [0.00000000045, 0.30032866722, 10213.28554621100],
];

export const VSOP87_X = [
    VSOP87_L0,
    VSOP87_L1,
    VSOP87_L2,
    VSOP87_L3,
    VSOP87_L4,
    VSOP87_L5,
];

export const VSOP87_Y = [
    VSOP87_B0,
    VSOP87_B1,
    VSOP87_B2,
    VSOP87_B3,
    VSOP87_B4,
    VSOP87_B5,
];

export const VSOP87_Z = [
    VSOP87_R0,
    VSOP87_R1,
    VSOP87_R2,
    VSOP87_R3,
    VSOP87_R4,
    VSOP87_R5,
];
