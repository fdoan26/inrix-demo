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
    { week: '02/11/2026', value: 23 },
    { week: '02/18/2026', value: 22 },
    { week: '02/25/2026', value: 22 },
    { week: '03/04/2026', value: 23 },
    { week: '03/11/2026', value: 24 },
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
    { name: 'North Capital of Texas Hwy & Westlake Drive', avg4wk: '15.3h', current: '25.0h', delta: '+63.50%' },
    { name: 'South 1st Street & West Cesar Chavez Street', avg4wk: '19.0h', current: '25.9h', delta: '+36.10%' },
    { name: 'Barton Springs Road & South Lamar Boulevard', avg4wk: '31.6h', current: '37.7h', delta: '+19.40%' },
    { name: 'Barton Springs Road & South 1st Street', avg4wk: '25.3h', current: '30.3h', delta: '+19.70%' },
    { name: 'Loyola Lane & Decker Lane', avg4wk: '18.0h', current: '22.9h', delta: '+27.10%' },
  ],
  topWorsenedPerVehicle: [
    { name: 'East 2nd Street & San Jacinto Boulevard', avg4wk: '55.2s', current: '1.9m', delta: '+105.20%' },
    { name: 'East 3rd Street & San Jacinto Boulevard', avg4wk: '37.7s', current: '1.2m', delta: '+89.90%' },
    { name: 'East 5th Street & Brazos Street', avg4wk: '50.4s', current: '1.4m', delta: '+65.60%' },
    { name: 'San Jacinto Boulevard & East 10th Street', avg4wk: '20.3s', current: '50.8s', delta: '+150.50%' },
    { name: 'East 9th Street & San Jacinto Boulevard', avg4wk: '13.6s', current: '43.7s', delta: '+222.00%' },
  ],
  corridorsTravelTime: [
    { name: 'Arboretum - 183 Serviceroad SB', avg4wk: '3.8m', current: '10.0m', delta: '+6.2m', pct: '165.00%' },
    { name: 'Downtown - Trinity NB', avg4wk: '5.1m', current: '7.2m', delta: '+2.1m', pct: '41.00%' },
    { name: 'Riverside - Riverside Dr (EB) 1', avg4wk: '6.5m', current: '7.9m', delta: '+1.4m', pct: '22.00%' },
  ],
  corridorsTTI: [
    { name: 'Arboretum - Oak Knoll NB', avg4wk: '2.92x', current: '3.68x', delta: '+0.77x', pct: '26.30%' },
    { name: 'North Lamar 2 - Rutland EB', avg4wk: '2.55x', current: '2.66x', delta: '+0.66x', pct: '34.60%' },
    { name: 'Downtown - Colorado NB', avg4wk: '1.19x', current: '1.66x', delta: '+0.47x', pct: '39.40%' },
  ],
}
