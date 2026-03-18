import type { SignalData } from '../types'

export const signalData: SignalData = {
  kpis: {
    intersections: 1064,
    approaches: 3547,
    cameras: 8851,
    corridors: 334,
  },
  controlDelayTotals: {
    total: 8887.6,
    fourWeekAvg: 8022.8,
    delta: '+10.80%',
  },
  avgControlDelayPerVehicle: {
    total: 23.8,
    fourWeekAvg: 22.6,
    delta: '+4.35%',
  },
  weeklyChart: [
    { week: '02/11/2026', value: 19.3 },
    { week: '02/18/2026', value: 21.7 },
    { week: '02/25/2026', value: 20.8 },
    { week: '03/04/2026', value: 22.4 },
    { week: '03/11/2026', value: 23.8 },
  ],
  losByGrade: [
    { grade: 'A', count: 134, color: '#1b5e20' },
    { grade: 'B', count: 359, color: '#4caf50' },
    { grade: 'C', count: 382, color: '#8bc34a' },
    { grade: 'D', count: 166, color: '#ff9800' },
    { grade: 'E', count: 21, color: '#f44336' },
    { grade: 'F', count: 2, color: '#b71c1c' },
  ],
  topWorsenedTotal: [
    { name: 'Wilshire Blvd & Western Ave',        avg4wk: '14.7h', current: '23.9h', delta: '+62.6%' },
    { name: 'Olympic Blvd & Vermont Ave',          avg4wk: '18.3h', current: '24.7h', delta: '+34.8%' },
    { name: 'Hollywood Blvd & Highland Ave',       avg4wk: '29.4h', current: '36.1h', delta: '+22.8%' },
    { name: 'Sunset Blvd & La Brea Ave',           avg4wk: '24.8h', current: '29.6h', delta: '+19.4%' },
    { name: 'Figueroa St & Adams Blvd',            avg4wk: '17.3h', current: '21.8h', delta: '+26.0%' },
  ],
  topWorsenedPerVehicle: [
    { name: 'Wilshire Blvd & Vermont Ave',         avg4wk: '52.4s', current: '1.8m',  delta: '+109.4%' },
    { name: 'La Brea Ave & Olympic Blvd',          avg4wk: '35.9s', current: '1.1m',  delta: '+83.7%'  },
    { name: 'Fairfax Ave & I-10 WB On-Ramp',       avg4wk: '48.2s', current: '1.3m',  delta: '+62.2%'  },
    { name: 'Hollywood Blvd & Cahuenga Blvd',      avg4wk: '19.7s', current: '48.3s', delta: '+145.2%' },
    { name: 'Figueroa St & Adams Blvd',            avg4wk: '12.8s', current: '41.3s', delta: '+222.7%' },
  ],
  corridorsTravelTime: [
    { name: 'Wilshire Blvd – Westwood to Downtown EB', avg4wk: '18.3m', current: '31.7m', delta: '+13.4m', pct: '73.2%' },
    { name: 'Sunset Blvd – WeHo to Silver Lake EB',    avg4wk: '11.2m', current: '16.4m', delta: '+5.2m',  pct: '46.4%' },
    { name: 'I-405 NB – LAX to Culver City',           avg4wk: '14.8m', current: '18.3m', delta: '+3.5m',  pct: '23.6%' },
  ],
  corridorsTTI: [
    { name: 'Wilshire Blvd – Westwood to BH EB',  avg4wk: '2.74x', current: '3.51x', delta: '+0.77x', pct: '28.1%' },
    { name: 'Sunset Blvd Corridor EB',             avg4wk: '2.48x', current: '2.93x', delta: '+0.45x', pct: '18.1%' },
    { name: 'La Brea Ave Corridor NB',             avg4wk: '1.87x', current: '2.34x', delta: '+0.47x', pct: '25.1%' },
  ],
}
