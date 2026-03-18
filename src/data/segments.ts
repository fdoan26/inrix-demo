import type { Segment } from '../types'

export const segments: Segment[] = [
  // ─── FREEWAYS ──────────────────────────────────────────────────────────────

  // I-405 NB – Sepulveda Pass
  {
    segmentId: 'seg-001', name: 'I-405 NB / Sepulveda Pass', highway: 'I-405', direction: 'NB',
    positions: [
      [34.0217,-118.4437],[34.0302,-118.4460],[34.0390,-118.4500],[34.0478,-118.4539],
      [34.0560,-118.4572],[34.0641,-118.4600],[34.0720,-118.4617],[34.0810,-118.4620],
    ],
    currentSpeed: 11, freeFlowSpeed: 63, historicAvgSpeed: 41, congestionLevel: 93,
    travelTime: 1703, avgTravelTime: 647, type: 'XD', frc: 1, lengthMiles: 4.83, speedBucket: 1,
  },
  // I-405 SB – Sepulveda Pass
  {
    segmentId: 'seg-002', name: 'I-405 SB / Sepulveda Pass', highway: 'I-405', direction: 'SB',
    positions: [
      [34.0810,-118.4628],[34.0722,-118.4622],[34.0642,-118.4608],[34.0562,-118.4580],
      [34.0480,-118.4548],[34.0392,-118.4508],[34.0304,-118.4468],[34.0218,-118.4445],
    ],
    currentSpeed: 27, freeFlowSpeed: 63, historicAvgSpeed: 44, congestionLevel: 57,
    travelTime: 823, avgTravelTime: 531, type: 'XD', frc: 1, lengthMiles: 4.83, speedBucket: 3,
  },
  // I-405 NB – LAX to Culver City
  {
    segmentId: 'seg-003', name: 'I-405 NB / LAX–Culver City', highway: 'I-405', direction: 'NB',
    positions: [
      [33.9523,-118.3900],[33.9644,-118.3885],[33.9770,-118.3868],[33.9896,-118.3852],
      [34.0015,-118.3835],[34.0130,-118.3820],[34.0218,-118.4000],
    ],
    currentSpeed: 13, freeFlowSpeed: 63, historicAvgSpeed: 37, congestionLevel: 88,
    travelTime: 1487, avgTravelTime: 583, type: 'XD', frc: 1, lengthMiles: 5.17, speedBucket: 1,
  },
  // I-405 SB – Culver City to LAX
  {
    segmentId: 'seg-004', name: 'I-405 SB / Culver City–LAX', highway: 'I-405', direction: 'SB',
    positions: [
      [34.0218,-118.4005],[34.0132,-118.3828],[34.0016,-118.3843],[33.9897,-118.3860],
      [33.9771,-118.3875],[33.9645,-118.3892],[33.9523,-118.3907],
    ],
    currentSpeed: 39, freeFlowSpeed: 63, historicAvgSpeed: 43, congestionLevel: 39,
    travelTime: 473, avgTravelTime: 408, type: 'XD', frc: 1, lengthMiles: 5.17, speedBucket: 3,
  },

  // I-10 WB – Downtown to West LA
  {
    segmentId: 'seg-005', name: 'I-10 WB / Downtown–West LA', highway: 'I-10', direction: 'WB',
    positions: [
      [34.0497,-118.2530],[34.0476,-118.2720],[34.0452,-118.2920],[34.0430,-118.3110],
      [34.0390,-118.3300],[34.0350,-118.3510],[34.0315,-118.3720],[34.0285,-118.3930],
      [34.0255,-118.4130],[34.0230,-118.4340],[34.0217,-118.4440],
    ],
    currentSpeed: 7, freeFlowSpeed: 64, historicAvgSpeed: 37, congestionLevel: 97,
    travelTime: 2917, avgTravelTime: 836, type: 'XD', frc: 1, lengthMiles: 12.76, speedBucket: 1,
  },
  // I-10 EB – West LA to Downtown
  {
    segmentId: 'seg-006', name: 'I-10 EB / West LA–Downtown', highway: 'I-10', direction: 'EB',
    positions: [
      [34.0218,-118.4445],[34.0232,-118.4343],[34.0258,-118.4132],[34.0288,-118.3932],
      [34.0318,-118.3722],[34.0355,-118.3512],[34.0394,-118.3302],[34.0434,-118.3113],
      [34.0455,-118.2923],[34.0479,-118.2723],[34.0499,-118.2533],
    ],
    currentSpeed: 54, freeFlowSpeed: 64, historicAvgSpeed: 51, congestionLevel: 16,
    travelTime: 708, avgTravelTime: 887, type: 'XD', frc: 1, lengthMiles: 12.76, speedBucket: 4,
  },

  // US-101 NB – Downtown to Hollywood
  {
    segmentId: 'seg-007', name: 'US-101 NB / Downtown–Hollywood', highway: 'US-101', direction: 'NB',
    positions: [
      [34.0542,-118.2420],[34.0588,-118.2493],[34.0635,-118.2592],[34.0682,-118.2699],
      [34.0720,-118.2790],[34.0763,-118.2889],[34.0815,-118.2990],[34.0870,-118.3089],
      [34.0940,-118.3198],[34.0998,-118.3302],[34.1060,-118.3399],[34.1125,-118.3495],
    ],
    currentSpeed: 31, freeFlowSpeed: 64, historicAvgSpeed: 41, congestionLevel: 63,
    travelTime: 914, avgTravelTime: 547, type: 'XD', frc: 1, lengthMiles: 6.53, speedBucket: 2,
  },
  // US-101 SB – Hollywood to Downtown
  {
    segmentId: 'seg-008', name: 'US-101 SB / Hollywood–Downtown', highway: 'US-101', direction: 'SB',
    positions: [
      [34.1128,-118.3500],[34.1063,-118.3402],[34.1000,-118.3306],[34.0942,-118.3202],
      [34.0872,-118.3092],[34.0817,-118.2993],[34.0765,-118.2892],[34.0722,-118.2793],
      [34.0684,-118.2702],[34.0638,-118.2595],[34.0590,-118.2496],[34.0544,-118.2422],
    ],
    currentSpeed: 21, freeFlowSpeed: 64, historicAvgSpeed: 39, congestionLevel: 76,
    travelTime: 1097, avgTravelTime: 553, type: 'XD', frc: 1, lengthMiles: 6.53, speedBucket: 2,
  },

  // US-101 NB – Hollywood to San Fernando Valley (Cahuenga Pass)
  {
    segmentId: 'seg-009', name: 'US-101 NB / Cahuenga Pass', highway: 'US-101', direction: 'NB',
    positions: [
      [34.1125,-118.3495],[34.1190,-118.3570],[34.1262,-118.3650],[34.1332,-118.3712],
      [34.1400,-118.3760],[34.1468,-118.3810],[34.1535,-118.3864],[34.1620,-118.3960],
    ],
    currentSpeed: 47, freeFlowSpeed: 63, historicAvgSpeed: 51, congestionLevel: 27,
    travelTime: 413, avgTravelTime: 351, type: 'XD', frc: 1, lengthMiles: 3.62, speedBucket: 3,
  },

  // I-110 NB – Harbor Freeway
  {
    segmentId: 'seg-010', name: 'I-110 NB / Harbor Fwy', highway: 'I-110', direction: 'NB',
    positions: [
      [33.9408,-118.2771],[33.9530,-118.2762],[33.9652,-118.2738],[33.9778,-118.2718],
      [33.9905,-118.2703],[34.0028,-118.2688],[34.0155,-118.2678],[34.0278,-118.2670],
      [34.0400,-118.2658],[34.0490,-118.2620],[34.0542,-118.2540],
    ],
    currentSpeed: 46, freeFlowSpeed: 63, historicAvgSpeed: 49, congestionLevel: 31,
    travelTime: 491, avgTravelTime: 427, type: 'XD', frc: 1, lengthMiles: 7.84, speedBucket: 3,
  },
  // I-110 SB – Harbor Freeway
  {
    segmentId: 'seg-011', name: 'I-110 SB / Harbor Fwy', highway: 'I-110', direction: 'SB',
    positions: [
      [34.0542,-118.2545],[34.0490,-118.2625],[34.0400,-118.2663],[34.0278,-118.2675],
      [34.0155,-118.2683],[34.0028,-118.2693],[33.9905,-118.2708],[33.9778,-118.2723],
      [33.9652,-118.2743],[33.9530,-118.2767],[33.9408,-118.2776],
    ],
    currentSpeed: 17, freeFlowSpeed: 63, historicAvgSpeed: 43, congestionLevel: 83,
    travelTime: 1338, avgTravelTime: 607, type: 'XD', frc: 1, lengthMiles: 7.84, speedBucket: 2,
  },

  // I-5 NB – Golden State Fwy
  {
    segmentId: 'seg-012', name: 'I-5 NB / Golden State Fwy', highway: 'I-5', direction: 'NB',
    positions: [
      [34.0570,-118.2370],[34.0698,-118.2340],[34.0832,-118.2318],[34.0968,-118.2295],
      [34.1102,-118.2278],[34.1238,-118.2262],[34.1374,-118.2255],[34.1510,-118.2248],
    ],
    currentSpeed: 43, freeFlowSpeed: 64, historicAvgSpeed: 49, congestionLevel: 37,
    travelTime: 469, avgTravelTime: 411, type: 'XD', frc: 1, lengthMiles: 6.82, speedBucket: 3,
  },
  // I-5 SB – Downtown to South LA
  {
    segmentId: 'seg-013', name: 'I-5 SB / Downtown–South LA', highway: 'I-5', direction: 'SB',
    positions: [
      [34.0568,-118.2373],[34.0440,-118.2295],[34.0312,-118.2228],[34.0185,-118.2168],
      [34.0058,-118.2118],[33.9932,-118.2070],[33.9806,-118.2022],
    ],
    currentSpeed: 37, freeFlowSpeed: 63, historicAvgSpeed: 47, congestionLevel: 41,
    travelTime: 494, avgTravelTime: 416, type: 'XD', frc: 1, lengthMiles: 5.48, speedBucket: 3,
  },

  // SR-134 EB – Ventura Fwy
  {
    segmentId: 'seg-014', name: 'SR-134 EB / Ventura Fwy', highway: 'SR-134', direction: 'EB',
    positions: [
      [34.1622,-118.3962],[34.1610,-118.3720],[34.1598,-118.3480],[34.1588,-118.3240],
      [34.1578,-118.3000],[34.1570,-118.2760],[34.1565,-118.2520],[34.1562,-118.2280],
    ],
    currentSpeed: 29, freeFlowSpeed: 64, historicAvgSpeed: 46, congestionLevel: 69,
    travelTime: 733, avgTravelTime: 488, type: 'XD', frc: 1, lengthMiles: 8.13, speedBucket: 2,
  },

  // I-105 WB – Century Freeway
  {
    segmentId: 'seg-015', name: 'I-105 WB / Century Fwy', highway: 'I-105', direction: 'WB',
    positions: [
      [33.9268,-118.1980],[33.9272,-118.2240],[33.9276,-118.2500],[33.9280,-118.2762],
      [33.9285,-118.3024],[33.9290,-118.3285],[33.9295,-118.3548],[33.9300,-118.3812],
    ],
    currentSpeed: 57, freeFlowSpeed: 63, historicAvgSpeed: 55, congestionLevel: 13,
    travelTime: 476, avgTravelTime: 536, type: 'XD', frc: 1, lengthMiles: 10.76, speedBucket: 4,
  },

  // SR-91 EB – Artesia Fwy
  {
    segmentId: 'seg-016', name: 'SR-91 EB / Artesia Fwy', highway: 'SR-91', direction: 'EB',
    positions: [
      [33.8912,-118.2532],[33.8915,-118.2260],[33.8918,-118.1988],[33.8921,-118.1716],
      [33.8924,-118.1444],[33.8927,-118.1172],
    ],
    currentSpeed: 19, freeFlowSpeed: 64, historicAvgSpeed: 42, congestionLevel: 83,
    travelTime: 1219, avgTravelTime: 553, type: 'XD', frc: 1, lengthMiles: 8.13, speedBucket: 2,
  },

  // I-710 NB – Long Beach Fwy
  {
    segmentId: 'seg-017', name: 'I-710 NB / Long Beach Fwy', highway: 'I-710', direction: 'NB',
    positions: [
      [33.8665,-118.1878],[33.8808,-118.1868],[33.8952,-118.1858],[33.9096,-118.1848],
      [33.9240,-118.1838],[33.9384,-118.1828],[33.9528,-118.1818],[33.9672,-118.1808],
      [33.9816,-118.1798],[33.9960,-118.1788],[34.0104,-118.1778],
    ],
    currentSpeed: 18, freeFlowSpeed: 65, historicAvgSpeed: 42, congestionLevel: 84,
    travelTime: 1440, avgTravelTime: 600, type: 'XD', frc: 1, lengthMiles: 9.7, speedBucket: 2,
  },

  // SR-2 NB – Glendale Fwy
  {
    segmentId: 'seg-018', name: 'SR-2 NB / Glendale Fwy', highway: 'SR-2', direction: 'NB',
    positions: [
      [34.0748,-118.2352],[34.0888,-118.2315],[34.1028,-118.2278],[34.1168,-118.2248],
      [34.1308,-118.2220],[34.1448,-118.2192],
    ],
    currentSpeed: 35, freeFlowSpeed: 65, historicAvgSpeed: 48, congestionLevel: 55,
    travelTime: 540, avgTravelTime: 420, type: 'XD', frc: 1, lengthMiles: 4.8, speedBucket: 3,
  },

  // I-210 EB – Foothill Fwy
  {
    segmentId: 'seg-019', name: 'I-210 EB / Foothill Fwy', highway: 'I-210', direction: 'EB',
    positions: [
      [34.1562,-118.2278],[34.1555,-118.1990],[34.1548,-118.1703],[34.1542,-118.1415],
      [34.1536,-118.1128],[34.1530,-118.0840],
    ],
    currentSpeed: 55, freeFlowSpeed: 63, historicAvgSpeed: 56, congestionLevel: 18,
    travelTime: 417, avgTravelTime: 423, type: 'XD', frc: 1, lengthMiles: 8.47, speedBucket: 4,
  },

  // SR-110 NB – Pasadena Fwy
  {
    segmentId: 'seg-020', name: 'SR-110 NB / Pasadena Fwy', highway: 'SR-110', direction: 'NB',
    positions: [
      [34.0588,-118.2070],[34.0720,-118.2025],[34.0852,-118.1982],[34.0984,-118.1940],
      [34.1118,-118.1898],[34.1252,-118.1858],
    ],
    currentSpeed: 42, freeFlowSpeed: 65, historicAvgSpeed: 49, congestionLevel: 40,
    travelTime: 480, avgTravelTime: 420, type: 'XD', frc: 1, lengthMiles: 5.5, speedBucket: 3,
  },

  // US-101 NB – Ventura Fwy West
  {
    segmentId: 'seg-021', name: 'US-101 NB / Ventura Fwy West', highway: 'US-101', direction: 'NB',
    positions: [
      [34.1620,-118.3960],[34.1658,-118.4108],[34.1696,-118.4258],[34.1720,-118.4408],
      [34.1738,-118.4558],[34.1760,-118.4710],[34.1785,-118.4862],[34.1808,-118.5014],
    ],
    currentSpeed: 52, freeFlowSpeed: 63, historicAvgSpeed: 51, congestionLevel: 21,
    travelTime: 431, avgTravelTime: 426, type: 'XD', frc: 1, lengthMiles: 6.24, speedBucket: 4,
  },

  // SR-60 EB – Pomona Fwy
  {
    segmentId: 'seg-022', name: 'SR-60 EB / Pomona Fwy', highway: 'SR-60', direction: 'EB',
    positions: [
      [34.0445,-118.1780],[34.0440,-118.1530],[34.0435,-118.1280],[34.0430,-118.1030],
      [34.0425,-118.0780],[34.0420,-118.0530],
    ],
    currentSpeed: 40, freeFlowSpeed: 63, historicAvgSpeed: 47, congestionLevel: 34,
    travelTime: 471, avgTravelTime: 413, type: 'XD', frc: 1, lengthMiles: 7.53, speedBucket: 3,
  },

  // ─── MAJOR ARTERIALS (E–W) ─────────────────────────────────────────────────

  // Wilshire Blvd – Westwood to Beverly Hills
  {
    segmentId: 'seg-023', name: 'Wilshire Blvd / Westwood–Beverly Hills', highway: 'Wilshire Blvd', direction: 'EB',
    positions: [
      [34.0634,-118.4449],[34.0628,-118.4280],[34.0622,-118.4110],[34.0618,-118.3940],
      [34.0614,-118.3770],[34.0612,-118.3600],
    ],
    currentSpeed: 22, freeFlowSpeed: 35, historicAvgSpeed: 26, congestionLevel: 78,
    travelTime: 900, avgTravelTime: 540, type: 'XD+', frc: 2, lengthMiles: 3.8, speedBucket: 2,
  },
  // Wilshire Blvd – Beverly Hills to Koreatown
  {
    segmentId: 'seg-024', name: 'Wilshire Blvd / Beverly Hills–Koreatown', highway: 'Wilshire Blvd', direction: 'EB',
    positions: [
      [34.0612,-118.3600],[34.0610,-118.3430],[34.0608,-118.3260],[34.0606,-118.3090],
      [34.0604,-118.2920],[34.0601,-118.2750],[34.0598,-118.2580],
    ],
    currentSpeed: 18, freeFlowSpeed: 35, historicAvgSpeed: 24, congestionLevel: 90,
    travelTime: 1200, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 4.5, speedBucket: 1,
  },
  // Wilshire Blvd – Koreatown to Downtown
  {
    segmentId: 'seg-025', name: 'Wilshire Blvd / Koreatown–Downtown', highway: 'Wilshire Blvd', direction: 'EB',
    positions: [
      [34.0598,-118.2580],[34.0590,-118.2410],[34.0580,-118.2250],[34.0570,-118.2090],
    ],
    currentSpeed: 26, freeFlowSpeed: 35, historicAvgSpeed: 27, congestionLevel: 62,
    travelTime: 600, avgTravelTime: 480, type: 'XD+', frc: 2, lengthMiles: 2.8, speedBucket: 3,
  },

  // Sunset Blvd – WeHo to Hollywood
  {
    segmentId: 'seg-026', name: 'Sunset Blvd / WeHo–Hollywood', highway: 'Sunset Blvd', direction: 'EB',
    positions: [
      [34.0952,-118.3850],[34.0960,-118.3680],[34.0966,-118.3510],[34.0972,-118.3340],
      [34.0978,-118.3170],[34.0983,-118.3000],
    ],
    currentSpeed: 14, freeFlowSpeed: 35, historicAvgSpeed: 22, congestionLevel: 88,
    travelTime: 1080, avgTravelTime: 540, type: 'XD+', frc: 2, lengthMiles: 3.5, speedBucket: 1,
  },
  // Sunset Blvd – Hollywood to Silver Lake
  {
    segmentId: 'seg-027', name: 'Sunset Blvd / Hollywood–Silver Lake', highway: 'Sunset Blvd', direction: 'EB',
    positions: [
      [34.0983,-118.3000],[34.0962,-118.2830],[34.0932,-118.2680],[34.0898,-118.2530],
      [34.0862,-118.2395],[34.0828,-118.2268],
    ],
    currentSpeed: 29, freeFlowSpeed: 35, historicAvgSpeed: 25, congestionLevel: 55,
    travelTime: 720, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 3.8, speedBucket: 3,
  },

  // Hollywood Blvd – Fairfax to Vermont
  {
    segmentId: 'seg-028', name: 'Hollywood Blvd / Fairfax–Vermont', highway: 'Hollywood Blvd', direction: 'EB',
    positions: [
      [34.1018,-118.3708],[34.1014,-118.3540],[34.1010,-118.3380],[34.1006,-118.3220],
      [34.1002,-118.3060],[34.0998,-118.2900],[34.0994,-118.2740],
    ],
    currentSpeed: 16, freeFlowSpeed: 30, historicAvgSpeed: 21, congestionLevel: 85,
    travelTime: 1080, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 4.2, speedBucket: 1,
  },

  // Santa Monica Blvd – West Hollywood
  {
    segmentId: 'seg-029', name: 'Santa Monica Blvd / WeHo', highway: 'Santa Monica Blvd', direction: 'EB',
    positions: [
      [34.0904,-118.3855],[34.0900,-118.3680],[34.0896,-118.3510],[34.0892,-118.3340],
      [34.0888,-118.3170],[34.0884,-118.3000],[34.0882,-118.2838],
    ],
    currentSpeed: 20, freeFlowSpeed: 35, historicAvgSpeed: 25, congestionLevel: 73,
    travelTime: 900, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 4.1, speedBucket: 2,
  },

  // Beverly Blvd – Fairfax to Vermont
  {
    segmentId: 'seg-030', name: 'Beverly Blvd / Fairfax–Vermont', highway: 'Beverly Blvd', direction: 'EB',
    positions: [
      [34.0708,-118.3715],[34.0704,-118.3540],[34.0700,-118.3365],[34.0696,-118.3190],
      [34.0692,-118.3015],[34.0688,-118.2840],[34.0684,-118.2665],
    ],
    currentSpeed: 23, freeFlowSpeed: 35, historicAvgSpeed: 27, congestionLevel: 65,
    travelTime: 840, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 4.0, speedBucket: 3,
  },

  // Melrose Ave
  {
    segmentId: 'seg-031', name: 'Melrose Ave / Fairfax–Vermont', highway: 'Melrose Ave', direction: 'EB',
    positions: [
      [34.0842,-118.3715],[34.0838,-118.3548],[34.0834,-118.3382],[34.0830,-118.3215],
      [34.0826,-118.3048],[34.0822,-118.2882],
    ],
    currentSpeed: 19, freeFlowSpeed: 30, historicAvgSpeed: 23, congestionLevel: 80,
    travelTime: 900, avgTravelTime: 540, type: 'XD+', frc: 3, lengthMiles: 3.6, speedBucket: 2,
  },

  // Olympic Blvd – West LA to Mid-City
  {
    segmentId: 'seg-032', name: 'Olympic Blvd / West LA–Mid-City', highway: 'Olympic Blvd', direction: 'EB',
    positions: [
      [34.0192,-118.4340],[34.0215,-118.4160],[34.0238,-118.3980],[34.0261,-118.3800],
      [34.0284,-118.3620],[34.0307,-118.3440],[34.0330,-118.3260],
    ],
    currentSpeed: 27, freeFlowSpeed: 35, historicAvgSpeed: 28, congestionLevel: 58,
    travelTime: 780, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 6.2, speedBucket: 3,
  },
  // Olympic Blvd – Mid-City to Downtown
  {
    segmentId: 'seg-033', name: 'Olympic Blvd / Mid-City–Downtown', highway: 'Olympic Blvd', direction: 'EB',
    positions: [
      [34.0330,-118.3260],[34.0350,-118.3090],[34.0370,-118.2920],[34.0390,-118.2750],
      [34.0410,-118.2580],[34.0430,-118.2410],[34.0450,-118.2245],
    ],
    currentSpeed: 12, freeFlowSpeed: 35, historicAvgSpeed: 22, congestionLevel: 94,
    travelTime: 1440, avgTravelTime: 720, type: 'XD+', frc: 2, lengthMiles: 5.5, speedBucket: 1,
  },

  // Pico Blvd
  {
    segmentId: 'seg-034', name: 'Pico Blvd / West LA–Mid-City', highway: 'Pico Blvd', direction: 'EB',
    positions: [
      [34.0158,-118.4338],[34.0182,-118.4160],[34.0205,-118.3982],[34.0228,-118.3804],
      [34.0251,-118.3626],[34.0274,-118.3448],[34.0297,-118.3270],
    ],
    currentSpeed: 24, freeFlowSpeed: 35, historicAvgSpeed: 26, congestionLevel: 68,
    travelTime: 840, avgTravelTime: 660, type: 'XD+', frc: 2, lengthMiles: 6.0, speedBucket: 3,
  },

  // Venice Blvd – Mar Vista to Mid-City
  {
    segmentId: 'seg-035', name: 'Venice Blvd / Mar Vista–Mid-City', highway: 'Venice Blvd', direction: 'EB',
    positions: [
      [33.9998,-118.4298],[34.0038,-118.4108],[34.0078,-118.3918],[34.0118,-118.3728],
      [34.0158,-118.3538],[34.0198,-118.3348],[34.0238,-118.3158],
    ],
    currentSpeed: 30, freeFlowSpeed: 35, historicAvgSpeed: 29, congestionLevel: 46,
    travelTime: 720, avgTravelTime: 660, type: 'XD+', frc: 2, lengthMiles: 6.4, speedBucket: 3,
  },

  // ─── MAJOR ARTERIALS (N–S) ─────────────────────────────────────────────────

  // Sepulveda Blvd
  {
    segmentId: 'seg-036', name: 'Sepulveda Blvd / El Segundo–405', highway: 'Sepulveda Blvd', direction: 'NB',
    positions: [
      [33.9222,-118.3948],[33.9365,-118.3925],[33.9508,-118.3902],[33.9651,-118.3879],
      [33.9794,-118.3890],[33.9937,-118.3965],[34.0080,-118.4040],[34.0223,-118.4115],
    ],
    currentSpeed: 28, freeFlowSpeed: 40, historicAvgSpeed: 30, congestionLevel: 62,
    travelTime: 960, avgTravelTime: 720, type: 'XD+', frc: 2, lengthMiles: 7.5, speedBucket: 3,
  },

  // La Brea Ave
  {
    segmentId: 'seg-037', name: 'La Brea Ave / I-10–Hollywood', highway: 'La Brea Ave', direction: 'NB',
    positions: [
      [34.0215,-118.3562],[34.0358,-118.3575],[34.0502,-118.3588],[34.0645,-118.3601],
      [34.0788,-118.3608],[34.0932,-118.3615],[34.1072,-118.3618],
    ],
    currentSpeed: 21, freeFlowSpeed: 35, historicAvgSpeed: 25, congestionLevel: 78,
    travelTime: 840, avgTravelTime: 540, type: 'XD+', frc: 2, lengthMiles: 6.2, speedBucket: 2,
  },

  // Fairfax Ave
  {
    segmentId: 'seg-038', name: 'Fairfax Ave / I-10–Sunset', highway: 'Fairfax Ave', direction: 'NB',
    positions: [
      [34.0215,-118.3718],[34.0358,-118.3718],[34.0502,-118.3715],[34.0645,-118.3712],
      [34.0788,-118.3702],[34.0932,-118.3678],[34.0988,-118.3658],
    ],
    currentSpeed: 18, freeFlowSpeed: 35, historicAvgSpeed: 24, congestionLevel: 85,
    travelTime: 1020, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 6.1, speedBucket: 1,
  },

  // Highland Ave
  {
    segmentId: 'seg-039', name: 'Highland Ave / I-10–Hollywood', highway: 'Highland Ave', direction: 'NB',
    positions: [
      [34.0215,-118.3395],[34.0358,-118.3392],[34.0502,-118.3390],[34.0645,-118.3388],
      [34.0788,-118.3385],[34.0932,-118.3382],[34.1072,-118.3382],
    ],
    currentSpeed: 20, freeFlowSpeed: 35, historicAvgSpeed: 25, congestionLevel: 76,
    travelTime: 960, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 6.1, speedBucket: 2,
  },

  // Western Ave
  {
    segmentId: 'seg-040', name: 'Western Ave / Adams–Hollywood', highway: 'Western Ave', direction: 'NB',
    positions: [
      [34.0050,-118.3098],[34.0192,-118.3098],[34.0335,-118.3098],[34.0478,-118.3098],
      [34.0622,-118.3095],[34.0762,-118.3092],[34.0902,-118.3088],[34.1042,-118.3085],
    ],
    currentSpeed: 25, freeFlowSpeed: 35, historicAvgSpeed: 27, congestionLevel: 60,
    travelTime: 840, avgTravelTime: 660, type: 'XD+', frc: 2, lengthMiles: 7.2, speedBucket: 3,
  },

  // Vermont Ave
  {
    segmentId: 'seg-041', name: 'Vermont Ave / Adams–Hollywood', highway: 'Vermont Ave', direction: 'NB',
    positions: [
      [34.0022,-118.2918],[34.0165,-118.2912],[34.0308,-118.2908],[34.0452,-118.2905],
      [34.0595,-118.2902],[34.0738,-118.2899],[34.0882,-118.2896],[34.1022,-118.2892],
    ],
    currentSpeed: 28, freeFlowSpeed: 35, historicAvgSpeed: 28, congestionLevel: 55,
    travelTime: 840, avgTravelTime: 780, type: 'XD+', frc: 2, lengthMiles: 7.4, speedBucket: 3,
  },

  // Figueroa St – Downtown
  {
    segmentId: 'seg-042', name: 'Figueroa St / Downtown', highway: 'Figueroa St', direction: 'NB',
    positions: [
      [34.0175,-118.2720],[34.0248,-118.2698],[34.0322,-118.2678],[34.0398,-118.2658],
      [34.0472,-118.2642],[34.0545,-118.2622],[34.0618,-118.2602],
    ],
    currentSpeed: 15, freeFlowSpeed: 30, historicAvgSpeed: 20, congestionLevel: 88,
    travelTime: 1080, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 4.2, speedBucket: 1,
  },

  // Lincoln Blvd
  {
    segmentId: 'seg-043', name: 'Lincoln Blvd / Marina–I-10', highway: 'Lincoln Blvd', direction: 'NB',
    positions: [
      [33.9822,-118.4375],[33.9962,-118.4375],[34.0102,-118.4375],[34.0242,-118.4375],
    ],
    currentSpeed: 22, freeFlowSpeed: 40, historicAvgSpeed: 28, congestionLevel: 72,
    travelTime: 720, avgTravelTime: 480, type: 'XD+', frc: 2, lengthMiles: 3.8, speedBucket: 2,
  },

  // La Cienega Blvd
  {
    segmentId: 'seg-044', name: 'La Cienega Blvd / Baldwin Hills–WeHo', highway: 'La Cienega Blvd', direction: 'NB',
    positions: [
      [33.9978,-118.3762],[34.0120,-118.3762],[34.0262,-118.3762],[34.0405,-118.3762],
      [34.0545,-118.3762],[34.0685,-118.3748],[34.0825,-118.3722],[34.0950,-118.3712],
    ],
    currentSpeed: 24, freeFlowSpeed: 35, historicAvgSpeed: 27, congestionLevel: 68,
    travelTime: 900, avgTravelTime: 660, type: 'XD+', frc: 2, lengthMiles: 6.8, speedBucket: 3,
  },

  // Robertson Blvd
  {
    segmentId: 'seg-045', name: 'Robertson Blvd / Culver City–WeHo', highway: 'Robertson Blvd', direction: 'NB',
    positions: [
      [34.0022,-118.3802],[34.0165,-118.3805],[34.0308,-118.3808],[34.0452,-118.3812],
      [34.0595,-118.3825],[34.0738,-118.3835],[34.0878,-118.3828],
    ],
    currentSpeed: 19, freeFlowSpeed: 35, historicAvgSpeed: 24, congestionLevel: 80,
    travelTime: 1020, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 6.0, speedBucket: 2,
  },

  // Cahuenga Blvd
  {
    segmentId: 'seg-046', name: 'Cahuenga Blvd / Hollywood', highway: 'Cahuenga Blvd', direction: 'NB',
    positions: [
      [34.0825,-118.3285],[34.0928,-118.3280],[34.1025,-118.3278],[34.1128,-118.3282],
      [34.1225,-118.3360],[34.1322,-118.3438],
    ],
    currentSpeed: 22, freeFlowSpeed: 35, historicAvgSpeed: 26, congestionLevel: 72,
    travelTime: 720, avgTravelTime: 540, type: 'XD+', frc: 3, lengthMiles: 3.8, speedBucket: 2,
  },

  // Crenshaw Blvd
  {
    segmentId: 'seg-047', name: 'Crenshaw Blvd / Inglewood–Mid-City', highway: 'Crenshaw Blvd', direction: 'NB',
    positions: [
      [33.9558,-118.3382],[33.9702,-118.3382],[33.9845,-118.3382],[33.9988,-118.3382],
      [34.0132,-118.3382],[34.0275,-118.3382],[34.0418,-118.3382],
    ],
    currentSpeed: 26, freeFlowSpeed: 35, historicAvgSpeed: 27, congestionLevel: 58,
    travelTime: 840, avgTravelTime: 720, type: 'XD+', frc: 2, lengthMiles: 6.7, speedBucket: 3,
  },

  // Normandie Ave
  {
    segmentId: 'seg-048', name: 'Normandie Ave / South LA–Koreatown', highway: 'Normandie Ave', direction: 'NB',
    positions: [
      [33.9878,-118.2812],[34.0022,-118.2808],[34.0165,-118.2805],[34.0308,-118.2802],
      [34.0452,-118.2800],[34.0595,-118.2798],
    ],
    currentSpeed: 29, freeFlowSpeed: 35, historicAvgSpeed: 28, congestionLevel: 52,
    travelTime: 720, avgTravelTime: 660, type: 'XD+', frc: 3, lengthMiles: 5.2, speedBucket: 3,
  },

  // ─── ADDITIONAL E–W ARTERIALS ──────────────────────────────────────────────

  // Adams Blvd
  {
    segmentId: 'seg-049', name: 'Adams Blvd / Crenshaw–Vermont', highway: 'Adams Blvd', direction: 'EB',
    positions: [
      [34.0132,-118.3382],[34.0130,-118.3212],[34.0128,-118.3042],[34.0126,-118.2872],
      [34.0124,-118.2702],[34.0122,-118.2532],
    ],
    currentSpeed: 28, freeFlowSpeed: 35, historicAvgSpeed: 28, congestionLevel: 55,
    travelTime: 720, avgTravelTime: 660, type: 'XD+', frc: 3, lengthMiles: 5.0, speedBucket: 3,
  },

  // Washington Blvd
  {
    segmentId: 'seg-050', name: 'Washington Blvd / Culver City–Downtown', highway: 'Washington Blvd', direction: 'EB',
    positions: [
      [34.0022,-118.3802],[34.0022,-118.3632],[34.0023,-118.3462],[34.0024,-118.3292],
      [34.0025,-118.3122],[34.0026,-118.2952],[34.0028,-118.2782],[34.0030,-118.2612],
    ],
    currentSpeed: 24, freeFlowSpeed: 35, historicAvgSpeed: 26, congestionLevel: 68,
    travelTime: 900, avgTravelTime: 720, type: 'XD+', frc: 3, lengthMiles: 7.0, speedBucket: 3,
  },

  // Jefferson Blvd
  {
    segmentId: 'seg-051', name: 'Jefferson Blvd / Culver City–USC', highway: 'Jefferson Blvd', direction: 'EB',
    positions: [
      [34.0068,-118.3998],[34.0065,-118.3828],[34.0062,-118.3658],[34.0059,-118.3488],
      [34.0056,-118.3318],[34.0053,-118.3148],[34.0050,-118.2978],
    ],
    currentSpeed: 31, freeFlowSpeed: 35, historicAvgSpeed: 30, congestionLevel: 48,
    travelTime: 660, avgTravelTime: 600, type: 'XD+', frc: 3, lengthMiles: 6.3, speedBucket: 3,
  },

  // Slauson Ave
  {
    segmentId: 'seg-052', name: 'Slauson Ave / Culver City–South LA', highway: 'Slauson Ave', direction: 'EB',
    positions: [
      [33.9905,-118.3888],[33.9902,-118.3718],[33.9900,-118.3548],[33.9898,-118.3378],
      [33.9896,-118.3208],[33.9894,-118.3038],[33.9892,-118.2868],
    ],
    currentSpeed: 25, freeFlowSpeed: 35, historicAvgSpeed: 27, congestionLevel: 62,
    travelTime: 840, avgTravelTime: 660, type: 'XD+', frc: 3, lengthMiles: 6.5, speedBucket: 3,
  },

  // Fountain Ave
  {
    segmentId: 'seg-053', name: 'Fountain Ave / East Hollywood', highway: 'Fountain Ave', direction: 'EB',
    positions: [
      [34.0908,-118.3558],[34.0904,-118.3388],[34.0900,-118.3218],[34.0897,-118.3048],
      [34.0894,-118.2878],[34.0892,-118.2708],
    ],
    currentSpeed: 22, freeFlowSpeed: 30, historicAvgSpeed: 24, congestionLevel: 72,
    travelTime: 720, avgTravelTime: 540, type: 'XD+', frc: 3, lengthMiles: 5.1, speedBucket: 2,
  },

  // 3rd St
  {
    segmentId: 'seg-054', name: '3rd St / Fairfax–Vermont', highway: '3rd St', direction: 'EB',
    positions: [
      [34.0724,-118.3715],[34.0720,-118.3545],[34.0716,-118.3375],[34.0712,-118.3205],
      [34.0708,-118.3035],[34.0705,-118.2865],[34.0702,-118.2695],
    ],
    currentSpeed: 16, freeFlowSpeed: 30, historicAvgSpeed: 22, congestionLevel: 85,
    travelTime: 1080, avgTravelTime: 600, type: 'XD+', frc: 3, lengthMiles: 5.2, speedBucket: 1,
  },

  // Ventura Blvd – Sherman Oaks to Studio City
  {
    segmentId: 'seg-055', name: 'Ventura Blvd / Sherman Oaks–Studio City', highway: 'Ventura Blvd', direction: 'EB',
    positions: [
      [34.1512,-118.4352],[34.1508,-118.4182],[34.1505,-118.4012],[34.1502,-118.3842],
      [34.1500,-118.3672],[34.1498,-118.3502],[34.1497,-118.3332],
    ],
    currentSpeed: 20, freeFlowSpeed: 35, historicAvgSpeed: 26, congestionLevel: 78,
    travelTime: 1080, avgTravelTime: 660, type: 'XD+', frc: 2, lengthMiles: 6.5, speedBucket: 2,
  },

  // Laurel Canyon Blvd
  {
    segmentId: 'seg-056', name: 'Laurel Canyon Blvd / Hollywood–Valley', highway: 'Laurel Canyon Blvd', direction: 'NB',
    positions: [
      [34.0902,-118.3860],[34.1012,-118.3848],[34.1122,-118.3858],[34.1235,-118.3872],
      [34.1348,-118.3882],[34.1462,-118.3892],
    ],
    currentSpeed: 25, freeFlowSpeed: 35, historicAvgSpeed: 28, congestionLevel: 62,
    travelTime: 720, avgTravelTime: 600, type: 'XD+', frc: 3, lengthMiles: 4.5, speedBucket: 3,
  },

  // Los Feliz Blvd
  {
    segmentId: 'seg-057', name: 'Los Feliz Blvd / Silver Lake–Glendale', highway: 'Los Feliz Blvd', direction: 'EB',
    positions: [
      [34.1075,-118.2758],[34.1072,-118.2590],[34.1068,-118.2422],[34.1065,-118.2255],
      [34.1062,-118.2088],
    ],
    currentSpeed: 31, freeFlowSpeed: 35, historicAvgSpeed: 30, congestionLevel: 50,
    travelTime: 480, avgTravelTime: 480, type: 'XD+', frc: 3, lengthMiles: 4.2, speedBucket: 3,
  },

  // Colorado Blvd – Pasadena
  {
    segmentId: 'seg-058', name: 'Colorado Blvd / Pasadena', highway: 'Colorado Blvd', direction: 'EB',
    positions: [
      [34.1448,-118.1918],[34.1445,-118.1748],[34.1442,-118.1578],[34.1440,-118.1408],
      [34.1438,-118.1238],
    ],
    currentSpeed: 35, freeFlowSpeed: 40, historicAvgSpeed: 36, congestionLevel: 42,
    travelTime: 480, avgTravelTime: 480, type: 'XD+', frc: 3, lengthMiles: 4.2, speedBucket: 3,
  },

  // Lincoln Blvd – Santa Monica south section
  {
    segmentId: 'seg-059', name: 'Lincoln Blvd / Santa Monica', highway: 'Lincoln Blvd', direction: 'SB',
    positions: [
      [34.0242,-118.4375],[34.0102,-118.4378],[33.9962,-118.4382],[33.9822,-118.4385],
      [33.9682,-118.4388],[33.9542,-118.4390],
    ],
    currentSpeed: 20, freeFlowSpeed: 40, historicAvgSpeed: 26, congestionLevel: 75,
    travelTime: 900, avgTravelTime: 600, type: 'XD+', frc: 2, lengthMiles: 5.8, speedBucket: 2,
  },

  // Bundy Dr / Centinela Ave
  {
    segmentId: 'seg-060', name: 'Centinela Ave / Santa Monica–Culver City', highway: 'Centinela Ave', direction: 'SB',
    positions: [
      [34.0358,-118.4578],[34.0242,-118.4538],[34.0128,-118.4498],[34.0018,-118.4458],
      [33.9905,-118.4420],[33.9792,-118.4385],
    ],
    currentSpeed: 32, freeFlowSpeed: 40, historicAvgSpeed: 32, congestionLevel: 48,
    travelTime: 540, avgTravelTime: 540, type: 'XD+', frc: 3, lengthMiles: 4.2, speedBucket: 3,
  },
]
