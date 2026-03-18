export type ActiveView = 'mission-control' | 'signal-analytics' | 'roadway-analytics' | 'forecasting'

export interface Segment {
  segmentId: string
  name: string
  positions: [number, number][]
  currentSpeed: number
  freeFlowSpeed: number
  historicAvgSpeed: number
  congestionLevel: number
  travelTime: number
  avgTravelTime: number
  type: string
  frc: number
  lengthMiles: number
  speedBucket: number
  highway: string
  direction: 'NB' | 'SB' | 'EB' | 'WB'
}

export type AlertType =
  | 'crash'
  | 'construction'
  | 'dangerous_slowdown'
  | 'road_closure'
  | 'event'
  | 'hazard'
  | 'congestion'

export interface Alert {
  id: string
  type: AlertType
  position: [number, number]
  description: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  roadName: string
}

export interface Camera {
  id: string
  name: string
  position: [number, number]
  highway: string
  direction: string
  type: string
  clusterCount: number
}

export interface SignalKPIs {
  intersections: number
  approaches: number
  cameras: number
  corridors: number
}

export interface ControlDelayTotals {
  total: number
  fourWeekAvg: number
  delta: string
}

export interface WeeklyChartPoint {
  week: string
  value: number
}

export interface LOSGrade {
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  count: number
  color: string
}

export interface DelayIssueRow {
  name: string
  avg4wk: string
  current: string
  delta: string
}

export interface CorridorIssueRow {
  name: string
  avg4wk: string
  current: string
  delta: string
  pct: string
}

export interface SignalData {
  kpis: SignalKPIs
  controlDelayTotals: ControlDelayTotals
  avgControlDelayPerVehicle: ControlDelayTotals
  weeklyChart: WeeklyChartPoint[]
  losByGrade: LOSGrade[]
  topWorsenedTotal: DelayIssueRow[]
  topWorsenedPerVehicle: DelayIssueRow[]
  corridorsTravelTime: CorridorIssueRow[]
  corridorsTTI: CorridorIssueRow[]
}
