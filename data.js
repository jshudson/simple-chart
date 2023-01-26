const data = [
    [25.0014, 173964],
    [25.00508, 178617],
    [25.00878, 177673],
    [25.01248, 176714],
    [25.01618, 176579],
    [25.01987, 177316],
    [25.02357, 179922],
    [25.02727, 175879],
    [25.03095, 181595],
    [25.03465, 180744],
    [25.03835, 185264],
    [25.04205, 180837],
    [25.04573, 183476],
    [25.04943, 182459],
    [25.05313, 181821],
    [25.05682, 179803],
    [25.06052, 185076],
    [25.06422, 184070],
    [25.06792, 183468],
    [25.0716, 183615],
    [25.0753, 180956],
    [25.079, 186485],
    [25.08268, 186195],
    [25.08638, 183065],
    [25.09008, 187628],
    [25.09378, 185014],
    [25.09747, 186270],
    [25.10117, 185866],
    [25.10487, 187653],
    [25.10855, 188126],
    [25.11225, 189171],
    [25.11595, 183106],
    [25.11965, 186778],
    [25.12333, 192706],
    [25.12703, 189342],
    [25.13073, 185628],
    [25.13442, 187000],
    [25.13812, 188248],
    [25.14182, 183790],
    [25.14552, 189393],
    [25.1492, 189986],
    [25.1529, 188654],
    [25.1566, 189987],
    [25.1603, 192520],
    [25.16398, 189905],
    [25.16768, 190426],
    [25.17138, 187153],
    [25.17507, 192652],
    [25.17877, 195851],
    [25.18247, 194958],
    [25.18617, 200907],
    [25.18985, 211176],
    [25.19355, 254372],
    [25.19725, 339414],
    [25.20093, 549904],
    [25.20463, 1081623],
    [25.20833, 2304933],
    [25.21203, 4610613],
    [25.21572, 8422587],
    [25.21942, 13655310],
    [25.22312, 20048620],
    [25.2268, 27431000],
    [25.2305, 34967940],
    [25.2342, 42322200],
    [25.2379, 48799520],
    [25.24158, 54626660],
    [25.24528, 59645960],
    [25.24898, 64702730],
    [25.25267, 69432940],
    [25.25637, 72870210],
    [25.26007, 75979380],
    [25.26377, 78676590],
    [25.26745, 80354510],
    [25.27115, 81869360],
    [25.27485, 82790860],
    [25.27855, 80846840],
    [25.28223, 72700080],
    [25.28593, 58561940],
    [25.28963, 39552740],
    [25.29332, 19735940],
    [25.29702, 8213838],
    [25.30072, 3895238],
    [25.30442, 2334453],
    [25.3081, 1711505],
    [25.3118, 1356454],
    [25.3155, 1163481],
    [25.31918, 1019815],
    [25.32288, 924341],
    [25.32658, 849114],
    [25.33028, 762638],
    [25.33397, 708026],
    [25.33767, 664971],
    [25.34137, 628346],
    [25.34505, 602598],
    [25.34875, 575479],
    [25.35245, 536187],
    [25.35615, 511728],
    [25.35983, 502984],
    [25.36353, 483187],
    [25.36723, 469163],
    [25.37092, 460356],
    [25.37462, 448573],
    [25.37832, 427595],
    [25.38202, 416640],
    [25.3857, 405646],
    [25.3894, 397946],
    [25.3931, 393061],
    [25.39678, 381321],
    [25.40048, 382931],
    [25.40418, 375322],
    [25.40788, 363454],
    [25.41157, 362417],
    [25.41527, 358441],
    [25.41897, 352704],
    [25.42267, 346695],
    [25.42635, 340694],
    [25.43005, 342202],
    [25.43375, 335638],
    [25.43743, 333050],
    [25.44113, 333422],
    [25.44483, 325564],
    [25.44853, 328358],
    [25.45222, 318942],
    [25.45592, 316447],
    [25.45962, 316184],
    [25.4633, 313948],
    [25.467, 312161],
    [25.4707, 308743],
    [25.4744, 308929],
    [25.47808, 301698],
    [25.48178, 298569],
    [25.48548, 306411],
    [25.48917, 303100],
    [25.49287, 302177],
    [25.49657, 295924],
    [25.50027, 300592],
    [25.50395, 299838],
    [25.50765, 289369],
    [25.51135, 289545],
    [25.51503, 290661],
    [25.51873, 291585],
    [25.52243, 284587],
    [25.52613, 281841],
    [25.52982, 284368],
    [25.53352, 292413],
    [25.53722, 292689],
    [25.54092, 290314],
    [25.5446, 283001],
    [25.5483, 278768],
    [25.552, 281449],
    [25.55568, 282234],
    [25.55938, 277059],
    [25.56308, 279257],
    [25.56678, 282763],
    [25.57047, 279901],
    [25.57417, 283467],
    [25.57787, 279975],
    [25.58155, 275949],
    [25.58525, 279046],
    [25.58895, 277807],
    [25.59265, 273236],
    [25.59633, 273890],
    [25.60003, 276521],
    [25.60373, 270963],
    [25.60742, 266339],
    [25.61112, 274039],
    [25.61482, 274151],
    [25.61852, 271519],
    [25.6222, 274374],
    [25.6259, 269324],
    [25.6296, 272618],
    [25.63328, 270190],
    [25.63698, 269042],
    [25.64068, 273895],
    [25.64438, 270863],
    [25.64807, 268463],
    [25.65177, 268313],
    [25.65547, 269299],
    [25.65915, 269659],
    [25.66285, 270736],
    [25.66655, 271561],
    [25.67025, 264750],
    [25.67393, 273217],
    [25.67763, 266244],
    [25.68133, 270889],
    [25.68503, 267754],
    [25.68872, 272262],
    [25.69242, 272455],
    [25.69612, 277493],
    [25.6998, 277866],
    [25.7035, 282344],
    [25.7072, 280621],
    [25.7109, 282608],
    [25.71458, 286561],
    [25.71828, 290768],
    [25.72198, 287466],
    [25.72567, 286426],
    [25.72937, 279733],
    [25.73307, 276999],
    [25.73677, 270471],
    [25.74045, 274283],
    [25.74415, 273801],
    [25.74785, 270991],
    [25.75153, 273397],
    [25.75523, 274338],
    [25.75893, 267559],
    [25.76263, 269112],
    [25.76632, 275705],
    [25.77002, 266396],
    [25.77372, 268010],
    [25.7774, 267286],
    [25.7811, 270562],
    [25.7848, 270141],
    [25.7885, 268752],
    [25.79218, 268397],
    [25.79588, 274742],
    [25.79958, 267046],
    [25.80328, 268575],
    [25.80697, 263582],
    [25.81067, 269631],
    [25.81437, 275848],
    [25.81805, 271928],
    [25.82175, 274179],
    [25.82545, 272037],
    [25.82915, 274620],
    [25.83283, 269988],
    [25.83653, 270399],
    [25.84023, 272775],
    [25.84392, 274555],
    [25.84762, 274852],
    [25.85132, 272869],
    [25.85502, 270216],
    [25.8587, 268199],
    [25.8624, 272291],
    [25.8661, 273900],
    [25.86978, 275186],
    [25.87348, 276909],
    [25.87718, 285304],
    [25.88088, 286234],
    [25.88457, 289840],
    [25.88827, 302000],
    [25.89197, 303533],
    [25.89565, 309104],
    [25.89935, 317361],
    [25.90305, 311157],
    [25.90675, 310831],
    [25.91043, 304141],
    [25.91413, 300818],
    [25.91783, 296009],
    [25.92152, 290413],
    [25.92522, 286928],
    [25.92892, 284530],
    [25.93262, 275727],
    [25.9363, 281080],
    [25.94, 279363],
    [25.9437, 279832],
    [25.9474, 276211],
    [25.95108, 278195],
    [25.95478, 277810],
    [25.95848, 284914],
    [25.96217, 279851],
    [25.96587, 278146],
    [25.96957, 278062],
    [25.97327, 278754],
    [25.97695, 284740],
    [25.98065, 281857],
    [25.98435, 284008],
    [25.98803, 281390],
    [25.99173, 279740],
    [25.99543, 279738],
    [25.99913, 282247],
    [26.00282, 278019],
    [26.00652, 282197],
    [26.01022, 273230],
    [26.0139, 281321],
    [26.0176, 284733],
    [26.0213, 279414],
    [26.025, 279997],
    [26.02868, 284020],
    [26.03238, 284130],
    [26.03608, 282368],
    [26.03977, 283718],
    [26.04347, 281959],
    [26.04717, 276958],
    [26.05087, 277801],
    [26.05455, 284172],
    [26.05825, 283882],
    [26.06195, 281632],
    [26.06565, 286764],
    [26.06933, 286983],
    [26.07303, 285563],
    [26.07673, 282550],
    [26.08042, 290036],
    [26.08412, 284195],
    [26.08782, 289536],
    [26.09152, 293854],
    [26.0952, 282807],
    [26.0989, 287604],
    [26.1026, 288964],
    [26.10628, 291964],
    [26.10998, 288824],
    [26.11368, 292883],
    [26.11738, 290003],
    [26.12107, 299067],
    [26.12477, 299366],
    [26.12847, 299731],
    [26.13215, 299816],
    [26.13585, 306061],
    [26.13955, 312884],
    [26.14325, 312340],
    [26.14693, 317024],
    [26.15063, 312039],
    [26.15433, 317067],
    [26.15802, 316606],
    [26.16172, 315369],
    [26.16542, 318650],
    [26.16912, 311407],
    [26.1728, 308578],
    [26.1765, 303290],
    [26.1802, 301847],
    [26.18388, 300009],
    [26.18758, 306101],
    [26.19128, 292001],
    [26.19498, 297819],
    [26.19867, 299503],
    [26.20237, 299002],
    [26.20607, 298893],
    [26.20977, 309387],
    [26.21345, 307654],
    [26.21715, 334994],
    [26.22085, 383728],
    [26.22453, 485786],
    [26.22823, 745708],
    [26.23193, 1370493],
    [26.23563, 2607986],
    [26.23932, 4990521],
    [26.24302, 8885625],
    [26.24672, 14456010],
    [26.2504, 21660040],
    [26.2541, 28614200],
    [26.2578, 35469600],
    [26.2615, 42568030],
    [26.26518, 48073290],
    [26.26888, 54302670],
    [26.27258, 59102240],
    [26.27627, 63520810],
    [26.27997, 67496030],
    [26.28367, 69487330],
    [26.28737, 71362500],
    [26.29105, 70028970],
    [26.29475, 62853760],
    [26.29845, 52831800],
    [26.30213, 38781900],
    [26.30583, 24864980],
    [26.30953, 13264900],
    [26.31323, 6587605],
    [26.31692, 3514666],
    [26.32062, 2228005],
    [26.32432, 1634949],
    [26.328, 1324883],
    [26.3317, 1124766],
    [26.3354, 1002997],
    [26.3391, 919796],
    [26.34278, 838911],
    [26.34648, 775783],
    [26.35018, 746436],
    [26.35388, 697796],
    [26.35757, 660900],
    [26.36127, 636215],
    [26.36497, 620325],
    [26.36865, 595295],
    [26.37235, 576246],
    [26.37605, 560161],
    [26.37975, 543548],
    [26.38343, 535485],
    [26.38713, 514593],
    [26.39083, 510449],
    [26.39452, 500262],
    [26.39822, 491494],
    [26.40192, 484383],
    [26.40562, 476313],
    [26.4093, 476086],
    [26.413, 463751],
    [26.4167, 467260],
    [26.42038, 457048],
    [26.42408, 443177],
    [26.42778, 445884],
    [26.43148, 440655],
    [26.43517, 441760],
    [26.43887, 447433],
    [26.44257, 453210],
    [26.44625, 484461],
    [26.44995, 526530],
    [26.45365, 600263],
    [26.45735, 718159],
    [26.46103, 857079],
    [26.46473, 1035874],
    [26.46843, 1195356],
    [26.47213, 1279411],
    [26.47582, 1308975],
    [26.47952, 1232138],
    [26.48322, 1121194],
    [26.4869, 958546],
    [26.4906, 816700],
    [26.4943, 704039],
    [26.498, 613196],
    [26.50168, 565283],
    [26.50538, 547775],
    [26.50908, 556016],
    [26.51277, 598093],
    [26.51647, 673617],
    [26.52017, 775345],
    [26.52387, 918456],
    [26.52755, 1043366],
    [26.53125, 1091144],
    [26.53495, 1131090],
    [26.53863, 1141310],
    [26.54233, 1092458],
    [26.54603, 984222],
    [26.54973, 872447],
    [26.55342, 755821],
    [26.55712, 654028],
    [26.56082, 572577],
    [26.5645, 519615],
    [26.5682, 483583],
    [26.5719, 455836],
    [26.5756, 444959],
    [26.57928, 443500],
    [26.58298, 442851],
    [26.58668, 429177],
    [26.59037, 430692],
    [26.59407, 437927],
    [26.59777, 437004],
    [26.60147, 441806],
    [26.60515, 443342],
    [26.60885, 456727],
    [26.61255, 482148],
    [26.61625, 550521],
    [26.61993, 674650],
    [26.62363, 859320],
    [26.62733, 1144252],
    [26.63102, 1489818],
    [26.63472, 1932400],
    [26.63842, 2310932],
    [26.64212, 2584400],
    [26.6458, 2655910],
    [26.6495, 2539350],
    [26.6532, 2277316],
    [26.65688, 1924731],
    [26.66058, 1565710],
    [26.66428, 1203104],
    [26.66798, 924601],
    [26.67167, 729645],
    [26.67537, 589733],
    [26.67907, 527960],
    [26.68275, 480647],
    [26.68645, 456377],
    [26.69015, 448150],
    [26.69385, 435581],
    [26.69753, 432478],
    [26.70123, 439451],
    [26.70493, 432337],
    [26.70862, 433315],
    [26.71232, 416592],
    [26.71602, 423025],
    [26.71972, 414345],
    [26.7234, 413522],
    [26.7271, 411278],
    [26.7308, 410192],
    [26.7345, 407825],
    [26.73818, 410052],
    [26.74188, 407005],
    [26.74558, 401015],
    [26.74927, 404881],
    [26.75297, 409251],
    [26.75667, 396110],
    [26.76037, 403832],
    [26.76405, 401946],
    [26.76775, 406005],
    [26.77145, 399067],
    [26.77513, 410993],
    [26.77883, 405741],
    [26.78253, 411674],
    [26.78623, 425319],
    [26.78992, 445307],
    [26.79362, 503179],
    [26.79732, 625954],
    [26.801, 866960],
    [26.8047, 1311871],
    [26.8084, 2046533],
    [26.8121, 3175955],
    [26.81578, 4662904],
    [26.81948, 6278612],
    [26.82318, 7807569],
    [26.82687, 9062906],
    [26.83057, 9853752],
    [26.83427, 9980121],
    [26.83797, 9330656],
    [26.84165, 8081851],
    [26.84535, 6339034],
    [26.84905, 4798625],
    [26.85273, 3315985],
    [26.85643, 2298052],
    [26.86013, 1621853],
    [26.86383, 1199096],
    [26.86752, 960888],
    [26.87122, 802235],
    [26.87492, 718243],
    [26.87862, 671812],
    [26.8823, 649669],
    [26.886, 656085],
    [26.8897, 672980],
    [26.89338, 701431],
    [26.89708, 768409],
    [26.90078, 843044],
    [26.90448, 921157],
    [26.90817, 987717],
    [26.91187, 981954],
    [26.91557, 967872],
    [26.91925, 917818],
    [26.92295, 839822],
    [26.92665, 754447],
    [26.93035, 687191],
    [26.93403, 615150],
    [26.93773, 583062],
    [26.94143, 551658],
    [26.94512, 524626],
    [26.94882, 497454],
    [26.95252, 496483],
    [26.95622, 485461],
    [26.9599, 480767],
    [26.9636, 475471],
    [26.9673, 464343],
    [26.97098, 469582],
    [26.97468, 459163],
    [26.97838, 454879],
    [26.98208, 457339],
    [26.98577, 464000],
    [26.98947, 458146],
    [26.99317, 462221],
    [26.99687, 458693],
    [27.00055, 452318],
    [27.00425, 456214],
    [27.00795, 458289],
    [27.01163, 458417],
    [27.01533, 461137],
    [27.01903, 441597],
    [27.02273, 451528],
    [27.02642, 445143],
    [27.03012, 455078],
    [27.03382, 454522],
    [27.0375, 464078],
    [27.0412, 481135],
    [27.0449, 504293],
    [27.0486, 528847],
    [27.05228, 562815],
    [27.05598, 618593],
    [27.05968, 666654],
    [27.06337, 711225],
    [27.06707, 748001],
    [27.07077, 748542],
    [27.07447, 725927],
    [27.07815, 688663],
    [27.08185, 641517],
    [27.08555, 598397],
    [27.08923, 560958],
    [27.09293, 529003],
    [27.09663, 511101],
    [27.10033, 487506],
    [27.10402, 484286],
    [27.10772, 484112],
    [27.11142, 487434],
    [27.1151, 503089],
    [27.1188, 551139],
    [27.1225, 667973],
    [27.1262, 941300],
    [27.12988, 1536440],
    [27.13358, 2668851],
    [27.13728, 4717266],
    [27.14098, 7839997],
    [27.14467, 12013580],
    [27.14837, 16886020],
    [27.15207, 21669870],
    [27.15575, 26339530],
    [27.15945, 29570330],
    [27.16315, 31930190],
    [27.16685, 32906680],
    [27.17053, 31900160],
    [27.17423, 27701520],
    [27.17793, 23289450],
    [27.18162, 17968060],
    [27.18532, 12801730],
    [27.18902, 8636815],
    [27.19272, 5534631],
    [27.1964, 3461583],
    [27.2001, 2318676],
    [27.2038, 1702665],
    [27.20748, 1366702],
    [27.21118, 1173818],
    [27.21488, 1066086],
    [27.21858, 954030],
    [27.22227, 907461],
    [27.22597, 835480],
    [27.22967, 771868],
    [27.23335, 709465],
    [27.23705, 686209],
    [27.24075, 647195],
    [27.24445, 639081],
    [27.24813, 627092],
    [27.25183, 605162],
    [27.25553, 597370],
    [27.25923, 592835],
    [27.26292, 583583],
    [27.26662, 566981],
    [27.27032, 567368],
    [27.274, 575568],
    [27.2777, 592622],
    [27.2814, 644817],
    [27.2851, 759689],
    [27.28878, 1068521],
    [27.29248, 1681225],
    [27.29618, 2671648],
    [27.29987, 4376575],
    [27.30357, 6790548],
    [27.30727, 9638307],
    [27.31097, 13105970],
    [27.31465, 16441760],
    [27.31835, 19393450],
    [27.32205, 22172920],
    [27.32573, 24786440],
    [27.32943, 26305820],
    [27.33313, 27447760],
    [27.33683, 28706750],
    [27.34052, 27236540],
    [27.34422, 24454350],
    [27.34792, 20964410],
    [27.3516, 16957040],
    [27.3553, 13031490],
    [27.359, 10185550],
    [27.3627, 8845969],
    [27.36638, 9204083],
    [27.37008, 10401220],
    [27.37378, 11501600],
    [27.37747, 12228900],
    [27.38117, 12602160],
    [27.38487, 12071000],
    [27.38857, 10918050],
    [27.39225, 9256511],
    [27.39595, 7449186],
    [27.39965, 5650051],
    [27.40335, 4100026],
    [27.40703, 2977276],
    [27.41073, 2262191],
    [27.41443, 1866406],
    [27.41812, 1670508],
    [27.42182, 1653207],
    [27.42552, 1671897],
    [27.42922, 1741110],
    [27.4329, 1801516],
    [27.4366, 1813223],
    [27.4403, 1782841],
    [27.44398, 1670351],
    [27.44768, 1552511],
    [27.45138, 1398747],
    [27.45508, 1253293],
    [27.45877, 1104320],
    [27.46247, 978938],
    [27.46617, 886799],
    [27.46985, 812784],
    [27.47355, 766218],
    [27.47725, 732342],
    [27.48095, 714661],
    [27.48463, 698839],
    [27.48833, 681088],
    [27.49203, 673937],
    [27.49572, 671330],
    [27.49942, 664117],
    [27.50312, 650071],
    [27.50682, 661559],
    [27.5105, 656779],
    [27.5142, 650354],
    [27.5179, 647066],
    [27.5216, 645874],
    [27.52528, 645091],
    [27.52898, 635526],
    [27.53268, 637351],
    [27.53637, 630989],
    [27.54007, 632505],
    [27.54377, 622665],
    [27.54747, 622265],
    [27.55115, 614438],
    [27.55485, 610195],
    [27.55855, 614540],
    [27.56223, 608362],
    [27.56593, 614518],
    [27.56963, 612997],
    [27.57333, 613874],
    [27.57702, 614097],
    [27.58072, 619983],
    [27.58442, 619730],
    [27.5881, 632645],
    [27.5918, 631674],
    [27.5955, 645207],
    [27.5992, 694544],
    [27.60288, 826166],
    [27.60658, 1095248],
    [27.61028, 1719489],
    [27.61397, 2989617],
    [27.61767, 5150229],
    [27.62137, 8337064],
    [27.62507, 12604500],
    [27.62875, 17615090],
    [27.63245, 22487350],
    [27.63615, 27139820],
    [27.63983, 30929840],
    [27.64353, 33853740],
    [27.64723, 36170040],
    [27.65093, 37324860],
    [27.65462, 36673320],
    [27.65832, 33428700],
    [27.66202, 28776600],
    [27.66572, 23292090],
    [27.6694, 17142670],
    [27.6731, 11827080],
    [27.6768, 8248815],
    [27.68048, 6320017],
    [27.68418, 5713408],
    [27.68788, 6070345],
    [27.69158, 6816459],
    [27.69527, 7590978],
    [27.69897, 8052497],
    [27.70267, 8011631],
    [27.70635, 7573864],
    [27.71005, 6633351],
    [27.71375, 5623894],
    [27.71745, 4473021],
    [27.72113, 3502752],
    [27.72483, 2665351],
    [27.72853, 2105686],
    [27.73222, 1706598],
    [27.73592, 1440743],
    [27.73962, 1237085],
    [27.74332, 1122066],
    [27.747, 1040277],
    [27.7507, 989904],
    [27.7544, 939074],
    [27.75808, 895981],
    [27.76178, 878847],
    [27.76548, 870931],
    [27.76918, 840993],
    [27.77287, 852271],
    [27.77657, 879309],
    [27.78027, 918538],
    [27.78397, 994448],
    [27.78765, 1117897],
    [27.79135, 1282954],
    [27.79505, 1446807],
    [27.79873, 1620491],
    [27.80243, 1765005],
    [27.80613, 1809272],
    [27.80983, 1776582],
    [27.81352, 1686108],
    [27.81722, 1529697],
    [27.82092, 1351124],
    [27.8246, 1199101],
    [27.8283, 1057141],
    [27.832, 953215],
    [27.8357, 882495],
    [27.83938, 829961],
    [27.84308, 791195],
    [27.84678, 782062],
    [27.85047, 765769],
    [27.85417, 750042],
    [27.85787, 744911],
    [27.86157, 746747],
    [27.86525, 747225],
    [27.86895, 748371],
    [27.87265, 732991],
    [27.87633, 715939],
    [27.88003, 711416],
    [27.88373, 713088],
    [27.88743, 712855],
    [27.89112, 712904],
    [27.89482, 725437],
    [27.89852, 748254],
    [27.9022, 770527],
    [27.9059, 820040],
    [27.9096, 861649],
    [27.9133, 887297],
    [27.91698, 920835],
    [27.92068, 924024],
    [27.92438, 909977],
    [27.92808, 899722],
    [27.93177, 867685],
    [27.93547, 830155],
    [27.93917, 799134],
    [27.94285, 756790],
    [27.94655, 742168],
    [27.95025, 724907],
    [27.95395, 723986],
    [27.95763, 723018],
    [27.96133, 753684],
    [27.96503, 823455],
    [27.96872, 949085],
    [27.97242, 1192201],
    [27.97612, 1536724],
    [27.97982, 2006921],
    [27.9835, 2606498],
    [27.9872, 3189284],
    [27.9909, 3667636],
    [27.99458, 3939036],
    [27.99828, 4191574],
    [28.00198, 4160378],
    [28.00568, 3961132],
    [28.00937, 3617637],
    [28.01307, 3124358],
    [28.01677, 2555122],
    [28.02045, 2087189],
    [28.02415, 1643463],
    [28.02785, 1333967],
    [28.03155, 1152988],
    [28.03523, 970037],
    [28.03893, 893926],
    [28.04263, 831496],
    [28.04633, 771182],
    [28.05002, 760427],
    [28.05372, 736914],
    [28.05742, 722702],
    [28.0611, 710911],
    [28.0648, 710191],
    [28.0685, 710857],
    [28.0722, 710363],
    [28.07588, 713386],
    [28.07958, 721991],
    [28.08328, 732334],
    [28.08697, 729689],
    [28.09067, 760579],
    [28.09437, 781350],
    [28.09807, 785903],
    [28.10175, 796123],
    [28.10545, 799288],
    [28.10915, 811085],
    [28.11283, 827148],
    [28.11653, 851450],
    [28.12023, 881348],
    [28.12393, 889775],
    [28.12762, 921243],
    [28.13132, 940200],
    [28.13502, 956639],
    [28.1387, 1006263],
    [28.1424, 1034936],
    [28.1461, 1080843],
    [28.1498, 1185014],
    [28.15348, 1310934],
    [28.15718, 1460237],
    [28.16088, 1620503],
    [28.16457, 1811024],
    [28.16827, 1984729],
    [28.17197, 2136749],
    [28.17567, 2400458],
    [28.17935, 2839919],
    [28.18305, 3444031],
    [28.18675, 4540513],
    [28.19045, 6099297],
    [28.19413, 8169953],
    [28.19783, 10817120],
    [28.20153, 13708970],
    [28.20522, 16600780],
    [28.20892, 19422110],
    [28.21262, 22159000],
    [28.21632, 24628210],
    [28.22, 26268120],
    [28.2237, 27670370],
    [28.2274, 27884060],
    [28.23108, 27047790],
    [28.23478, 24782000],
    [28.23848, 22006270],
    [28.24218, 17825590],
    [28.24587, 13674250],
    [28.24957, 9831358],
    [28.25327, 6930801],
    [28.25695, 4891649],
    [28.26065, 3551257],
    [28.26435, 2651032],
    [28.26805, 2147773],
    [28.27173, 1814145],
    [28.27543, 1612113],
    [28.27913, 1506393],
    [28.28282, 1427633],
    [28.28652, 1391795],
    [28.29022, 1331202],
    [28.29392, 1333682],
    [28.2976, 1318212],
    [28.3013, 1331378],
    [28.305, 1316426],
    [28.3087, 1360148],
    [28.31238, 1390232],
    [28.31608, 1441924],
    [28.31978, 1488228],
    [28.32347, 1500333],
    [28.32717, 1484718],
    [28.33087, 1426849],
    [28.33457, 1363919],
    [28.33825, 1285584],
    [28.34195, 1195906],
    [28.34565, 1110560],
    [28.34933, 1052188],
    [28.35303, 989839],
    [28.35673, 952069],
    [28.36043, 921211],
    [28.36412, 894161],
    [28.36782, 880855],
    [28.37152, 857950],
    [28.3752, 841462],
    [28.3789, 822604],
    [28.3826, 816131],
    [28.3863, 812253],
    [28.38998, 814199],
    [28.39368, 793732],
    [28.39738, 798030],
    [28.40107, 792799],
    [28.40477, 783558],
    [28.40847, 774219],
    [28.41217, 767810],
    [28.41585, 769812],
    [28.41955, 758113],
    [28.42325, 758290],
    [28.42693, 757550],
    [28.43063, 740529],
    [28.43433, 747246],
    [28.43803, 742850],
    [28.44172, 774832],
    [28.44542, 821002],
    [28.44912, 893812],
    [28.45282, 1076163],
    [28.4565, 1388374],
    [28.4602, 1923258],
    [28.4639, 2794820],
    [28.46758, 4099310],
    [28.47128, 5974978],
    [28.47498, 8412910],
    [28.47868, 11206620],
    [28.48237, 14111900],
    [28.48607, 17021280],
    [28.48977, 19259270],
    [28.49345, 20748710],
    [28.49715, 21666270],
    [28.50085, 21419040],
    [28.50455, 20316030],
    [28.50823, 18497720],
    [28.51193, 15933370],
    [28.51563, 13220200],
    [28.51932, 10543230],
    [28.52302, 8037420],
    [28.52672, 6067227],
    [28.53042, 4572759],
    [28.5341, 3514973],
    [28.5378, 2778198],
    [28.5415, 2276394],
    [28.54518, 1936969],
    [28.54888, 1661760],
    [28.55258, 1486493],
    [28.55628, 1344722],
    [28.55997, 1246954],
    [28.56367, 1162653],
    [28.56737, 1105604],
    [28.57107, 1046664],
    [28.57475, 1010241],
    [28.57845, 987351],
    [28.58215, 958095],
    [28.58583, 925442],
    [28.58953, 905176],
    [28.59323, 894567],
    [28.59693, 880451],
    [28.60062, 872695],
    [28.60432, 871267],
    [28.60802, 869103],
    [28.6117, 877015],
    [28.6154, 900274],
    [28.6191, 915868],
    [28.6228, 962190],
    [28.62648, 1024844],
    [28.63018, 1078466],
    [28.63388, 1119067],
    [28.63757, 1182126],
    [28.64127, 1213959],
    [28.64497, 1246785],
    [28.64867, 1238328],
    [28.65235, 1197322],
    [28.65605, 1161004],
    [28.65975, 1107241],
    [28.66343, 1058739],
    [28.66713, 1047612],
    [28.67083, 1012059],
    [28.67453, 989279],
    [28.67822, 971911],
    [28.68192, 980866],
    [28.68562, 980884],
    [28.6893, 994829],
    [28.693, 996302],
    [28.6967, 998618],
    [28.7004, 983905],
    [28.70408, 975934],
    [28.70778, 980257],
    [28.71148, 967145],
    [28.71518, 951370],
    [28.71887, 943194],
    [28.72257, 927274],
    [28.72627, 905142],
    [28.72995, 886766],
    [28.73365, 863448],
    [28.73735, 838699],
    [28.74105, 811006],
    [28.74473, 802103],
    [28.74843, 784910],
    [28.75213, 775937],
    [28.75582, 769645],
    [28.75952, 765122],
    [28.76322, 774924],
    [28.76692, 782439],
    [28.7706, 800447],
    [28.7743, 841353],
    [28.778, 859321],
    [28.78168, 898374],
    [28.78538, 933291],
    [28.78908, 970116],
    [28.79278, 1000596],
    [28.79647, 1024938],
    [28.80017, 1034625],
    [28.80387, 1048214],
    [28.80755, 1044506],
    [28.81125, 1042875],
    [28.81495, 1053738],
    [28.81865, 1078227],
    [28.82233, 1128176],
    [28.82603, 1203390],
    [28.82973, 1316818],
    [28.83343, 1451483],
    [28.83712, 1604390],
    [28.84082, 1774448],
    [28.84452, 1947041],
    [28.8482, 2074517],
    [28.8519, 2145529],
    [28.8556, 2110154],
    [28.8593, 2102288],
    [28.86298, 1958855],
    [28.86668, 1798223],
    [28.87038, 1680035],
    [28.87407, 1504201],
    [28.87777, 1338641],
    [28.88147, 1228933],
    [28.88517, 1110213],
    [28.88885, 1018726],
    [28.89255, 957304],
    [28.89625, 926699],
    [28.89993, 900266],
    [28.90363, 863224],
    [28.90733, 837814],
    [28.91103, 829722],
    [28.91472, 829714],
    [28.91842, 817113],
    [28.92212, 812246],
    [28.9258, 808502],
    [28.9295, 795541],
    [28.9332, 808457],
    [28.9369, 794374],
    [28.94058, 781410],
    [28.94428, 780210],
    [28.94798, 776841],
    [28.95167, 776425],
    [28.95537, 781918],
    [28.95907, 772231],
    [28.96277, 782454],
    [28.96645, 783885],
    [28.97015, 782075],
    [28.97385, 790866],
    [28.97755, 810575],
    [28.98123, 812820],
    [28.98493, 808730],
    [28.98863, 839867],
    [28.99232, 849458],
    [28.99602, 852168],
    [28.99972, 871578],
    [29.00342, 891398],
    [29.0071, 922136],
    [29.0108, 971606],
    [29.0145, 1003612],
    [29.01818, 1060987],
    [29.02188, 1118123],
    [29.02558, 1178003],
    [29.02928, 1228443],
    [29.03297, 1268140],
    [29.03667, 1305571],
    [29.04037, 1339461],
    [29.04405, 1366774],
    [29.04775, 1385752],
    [29.05145, 1380567],
    [29.05515, 1385653],
    [29.05883, 1389377],
    [29.06253, 1356541],
    [29.06623, 1312146],
    [29.06992, 1256978],
    [29.07362, 1190809],
    [29.07732, 1130606],
    [29.08102, 1088002],
    [29.0847, 1034969],
    [29.0884, 1041195],
    [29.0921, 1074535],
    [29.0958, 1171970],
    [29.09948, 1336472],
    [29.10318, 1580931],
    [29.10688, 1948275],
    [29.11057, 2426882],
    [29.11427, 3030780],
    [29.11797, 3663939],
    [29.12167, 4276910],
    [29.12535, 4748092],
    [29.12905, 5119432],
    [29.13275, 5253988],
    [29.13643, 5210921],
    [29.14013, 4978820],
    [29.14383, 4579464],
    [29.14753, 4107015],
    [29.15122, 3539456],
    [29.15492, 3057477],
    [29.15862, 2551620],
    [29.1623, 2160599],
    [29.166, 1834836],
    [29.1697, 1570253],
    [29.1734, 1397462],
    [29.17708, 1269540],
    [29.18078, 1162336],
    [29.18448, 1088890],
    [29.18817, 1030733],
    [29.19187, 991351],
    [29.19557, 953570],
    [29.19927, 935338],
    [29.20295, 912159],
    [29.20665, 910484],
    [29.21035, 901177],
    [29.21403, 915633],
    [29.21773, 911103],
    [29.22143, 941630],
    [29.22513, 950368],
    [29.22882, 964227],
    [29.23252, 977012],
    [29.23622, 996913],
    [29.23992, 1037983],
    [29.2436, 1057338],
    [29.2473, 1075738],
    [29.251, 1091660],
    [29.25468, 1112932],
    [29.25838, 1152132],
    [29.26208, 1169055],
    [29.26578, 1200315],
    [29.26947, 1219544],
    [29.27317, 1222788],
    [29.27687, 1215739],
    [29.28055, 1180409],
    [29.28425, 1173073],
    [29.28795, 1140233],
    [29.29165, 1102463],
    [29.29533, 1063096],
    [29.29903, 1023082],
    [29.30273, 978416],
    [29.30642, 950360],
    [29.31012, 938342],
    [29.31382, 912473],
    [29.31752, 870507],
    [29.3212, 877388],
    [29.3249, 849774],
    [29.3286, 832239],
    [29.33228, 829911],
    [29.33598, 817965],
    [29.33968, 809601],
    [29.34338, 800705],
    [29.34707, 802265],
    [29.35077, 824164],
    [29.35447, 832280],
    [29.35817, 873189],
    [29.36185, 958663],
    [29.36555, 1060491],
    [29.36925, 1223001],
    [29.37293, 1450940],
    [29.37663, 1757219],
    [29.38033, 2120032],
    [29.38403, 2615704],
    [29.38772, 3091192],
    [29.39142, 3636185],
    [29.39512, 4141560],
    [29.3988, 4580145],
    [29.4025, 4936112],
    [29.4062, 5169301],
    [29.4099, 5236824],
    [29.41358, 5054771],
    [29.41728, 4770231],
    [29.42098, 4344438],
    [29.42467, 3916520],
    [29.42837, 3499746],
    [29.43207, 3056210],
    [29.43577, 2738426],
    [29.43945, 2528765],
    [29.44315, 2449134],
    [29.44685, 2500482],
    [29.45053, 2661880],
    [29.45423, 2950835],
    [29.45793, 3343783],
    [29.46163, 3778155],
    [29.46532, 4140611],
    [29.46902, 4533252],
    [29.47272, 4771645],
    [29.4764, 4939047],
    [29.4801, 4982856],
    [29.4838, 4884924],
    [29.4875, 4649346],
    [29.49118, 4295916],
    [29.49488, 3770482],
    [29.49858, 3207040],
    [29.50228, 2800964],
    [29.50597, 2335879],
    [29.50967, 2025660],
    [29.51337, 1764239],
    [29.51705, 1535368],
    [29.52075, 1383984],
    [29.52445, 1282045],
    [29.52815, 1183590],
    [29.53183, 1123383],
    [29.53553, 1070625],
    [29.53923, 1034053],
    [29.54292, 987374],
    [29.54662, 959281],
    [29.55032, 935643],
    [29.55402, 932408],
    [29.5577, 914656],
    [29.5614, 898909],
    [29.5651, 895392],
    [29.56878, 894624],
    [29.57248, 884650],
    [29.57618, 855894],
    [29.57988, 881590],
    [29.58357, 876154],
    [29.58727, 866286],
    [29.59097, 875781],
    [29.59465, 867977],
    [29.59835, 868819],
    [29.60205, 879994],
    [29.60575, 878899],
    [29.60943, 892408],
    [29.61313, 934048],
    [29.61683, 949286],
    [29.62053, 1016524],
    [29.62422, 1085401],
    [29.62792, 1177043],
    [29.63162, 1291900],
    [29.6353, 1428771],
    [29.639, 1552185],
    [29.6427, 1666276],
    [29.6464, 1755091],
    [29.65008, 1846229],
    [29.65378, 1870056],
    [29.65748, 1875513],
    [29.66117, 1796995],
    [29.66487, 1738826],
    [29.66857, 1618606],
    [29.67227, 1516401],
    [29.67595, 1402532],
    [29.67965, 1307030],
    [29.68335, 1208021],
    [29.68703, 1116305],
    [29.69073, 1030865],
    [29.69443, 969292],
    [29.69813, 933900],
    [29.70182, 902760],
    [29.70552, 871860],
    [29.70922, 864684],
    [29.7129, 865815],
    [29.7166, 871323],
    [29.7203, 906118],
    [29.724, 966321],
    [29.72768, 1069473],
    [29.73138, 1232711],
    [29.73508, 1477976],
    [29.73877, 1859650],
    [29.74247, 2390776],
    [29.74617, 3147673],
    [29.74987, 4052713],
    [29.75355, 5112691],
    [29.75725, 6344175],
    [29.76095, 7432167],
    [29.76465, 8578466],
    [29.76833, 9427929],
    [29.77203, 10006170],
    [29.77573, 10211360],
    [29.77942, 10098450],
    [29.78312, 9704377],
    [29.78682, 9016204],
    [29.79052, 8005478],
    [29.7942, 7090793],
    [29.7979, 6015333],
    [29.8016, 5030980],
    [29.80528, 4201662],
    [29.80898, 3491345],
    [29.81268, 2929003],
    [29.81638, 2500828],
    [29.82007, 2229810],
    [29.82377, 2031711],
    [29.82747, 1881290],
    [29.83115, 1740727],
    [29.83485, 1708662],
    [29.83855, 1620420],
    [29.84225, 1556201],
    [29.84593, 1489903],
    [29.84963, 1421506],
    [29.85333, 1358853],
    [29.85702, 1294234],
    [29.86072, 1231011],
    [29.86442, 1174839],
    [29.86812, 1134747],
    [29.8718, 1082623],
    [29.8755, 1026205],
    [29.8792, 979109],
    [29.8829, 964919],
    [29.88658, 921705],
    [29.89028, 912755],
    [29.89398, 898935],
    [29.89767, 879401],
    [29.90137, 855269],
    [29.90507, 854628],
    [29.90877, 844219],
    [29.91245, 837710],
    [29.91615, 839136],
    [29.91985, 845632],
    [29.92353, 830377],
    [29.92723, 830880],
    [29.93093, 829236],
    [29.93463, 847738],
    [29.93832, 845282],
    [29.94202, 841234],
    [29.94572, 854999],
    [29.9494, 862468],
    [29.9531, 855242],
    [29.9568, 876523],
    [29.9605, 905944],
    [29.96418, 930925],
    [29.96788, 957716],
    [29.97158, 999664],
    [29.97527, 1074258],
    [29.97897, 1168715],
    [29.98267, 1299502],
    [29.98637, 1455222],
    [29.99005, 1673571],
    [29.99375, 1920935],
    [29.99745, 2228751],
]
export default data