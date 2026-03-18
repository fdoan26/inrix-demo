/**
 * Mock 24-hour congestion forecasts for 15 LA freeway corridors.
 * Three days: today, tomorrow (slightly worse PM), +2 days (weekend-lighter AM).
 * Values are congestion % (0–100) for hours 0–23.
 */

export interface CorridorForecast {
  id: string
  name: string
  subtitle: string
  /** Peak hour label for the "today" forecast, e.g. "5 PM" */
  peakHour: string
  /** Peak congestion % for "today" */
  peakCongestion: number
  data: {
    today:    number[]  // 24 hourly values
    tomorrow: number[]
    plusTwo:  number[]
  }
}

export interface ForecastMeta {
  /** Model hindcast accuracy over last 30 days */
  accuracy: number
  /** Confidence label */
  confidenceLabel: 'High' | 'Medium' | 'Low'
  /** Numeric confidence score 0–1 */
  confidenceScore: number
  /** ID of corridor with worst predicted congestion today */
  worstCorridorId: string
  /** System-wide predicted peak hour */
  systemPeakHour: string
  /** System-wide predicted peak congestion % */
  systemPeakCongestion: number
}

// ─── Corridor forecast data ────────────────────────────────────────────────────
// Each array: hours 0–23 (midnight to 11 PM)
// Patterns calibrated to LA weekday traffic:
//   AM peak  ~7–9 AM, PM peak ~4–7 PM, overnight low ~2–5 AM

export const CORRIDORS: CorridorForecast[] = [
  {
    id: 'i405-nb',
    name: 'I-405 NB',
    subtitle: 'Sherman Oaks → LAX',
    peakHour: '5 PM',
    peakCongestion: 91,
    data: {
      today:    [8,6,5,5,8,18,38,74,89,66,47,40,42,45,50,61,78,91,86,67,50,34,22,14],
      tomorrow: [8,6,5,5,8,17,37,73,88,65,47,41,43,46,52,64,81,93,88,69,51,34,22,13],
      plusTwo:  [6,5,4,4,6,12,26,52,67,54,42,39,42,46,49,57,68,77,73,59,45,30,19,11],
    },
  },
  {
    id: 'i405-sb',
    name: 'I-405 SB',
    subtitle: 'LAX → Sherman Oaks',
    peakHour: '8 AM',
    peakCongestion: 87,
    data: {
      today:    [9,7,6,5,9,22,52,84,81,58,42,38,40,44,51,63,76,82,77,59,43,28,17,11],
      tomorrow: [9,7,6,5,9,21,51,83,80,57,42,39,41,45,52,65,78,84,79,60,44,29,18,11],
      plusTwo:  [7,5,4,4,7,15,35,60,64,50,38,36,38,42,47,58,66,72,68,53,38,25,15,9],
    },
  },
  {
    id: 'us101-nb',
    name: 'US-101 NB',
    subtitle: 'Downtown → Hollywood',
    peakHour: '6 PM',
    peakCongestion: 88,
    data: {
      today:    [7,5,5,4,7,16,34,68,79,62,45,41,43,47,54,65,80,88,83,64,47,31,20,11],
      tomorrow: [7,5,5,4,7,16,33,67,78,61,45,42,44,48,55,67,82,90,85,65,48,31,20,11],
      plusTwo:  [5,4,4,3,5,11,23,48,62,52,41,39,41,44,50,59,71,78,74,57,42,27,17,9],
    },
  },
  {
    id: 'us101-sb',
    name: 'US-101 SB',
    subtitle: 'Hollywood → Downtown',
    peakHour: '8 AM',
    peakCongestion: 86,
    data: {
      today:    [8,6,5,5,10,24,58,86,84,60,43,38,40,43,49,60,72,79,75,57,41,27,16,10],
      tomorrow: [8,6,5,5,10,23,57,85,83,59,43,39,41,44,50,62,74,81,77,58,42,28,17,10],
      plusTwo:  [6,5,4,4,7,16,39,62,67,52,39,36,38,41,46,55,63,70,67,51,37,24,14,8],
    },
  },
  {
    id: 'i10-eb',
    name: 'I-10 EB',
    subtitle: 'Santa Monica → Downtown',
    peakHour: '8 AM',
    peakCongestion: 89,
    data: {
      today:    [9,7,6,6,11,26,62,89,85,58,41,37,39,42,48,58,70,78,74,56,40,26,16,10],
      tomorrow: [9,7,6,6,11,25,61,88,84,57,41,38,40,43,49,60,72,80,76,57,41,27,16,10],
      plusTwo:  [7,5,4,4,8,17,41,65,68,51,38,35,37,40,45,53,62,70,66,50,36,23,14,8],
    },
  },
  {
    id: 'i10-wb',
    name: 'I-10 WB',
    subtitle: 'Downtown → Santa Monica',
    peakHour: '5 PM',
    peakCongestion: 90,
    data: {
      today:    [8,6,5,5,8,17,36,70,84,63,45,40,42,46,53,65,81,90,84,65,48,32,20,12],
      tomorrow: [8,6,5,5,8,17,35,69,83,62,45,41,43,47,54,67,83,92,86,66,49,32,20,12],
      plusTwo:  [6,5,4,4,6,11,24,50,67,55,42,39,41,44,50,60,72,80,75,59,44,29,18,10],
    },
  },
  {
    id: 'ca110-nb',
    name: 'CA-110 NB',
    subtitle: 'Harbor Fwy → Downtown',
    peakHour: '8 AM',
    peakCongestion: 81,
    data: {
      today:    [7,5,4,4,9,21,50,81,80,57,41,37,39,43,50,61,74,80,75,57,41,26,16,9],
      tomorrow: [7,5,4,4,9,20,49,80,79,56,41,38,40,44,51,63,76,82,77,58,42,27,16,9],
      plusTwo:  [5,4,3,3,6,14,33,58,64,49,37,35,37,40,46,56,65,71,67,51,37,23,14,7],
    },
  },
  {
    id: 'ca110-sb',
    name: 'CA-110 SB',
    subtitle: 'Downtown → Pasadena',
    peakHour: '5 PM',
    peakCongestion: 87,
    data: {
      today:    [6,5,4,4,7,15,32,64,76,60,44,41,43,47,53,64,79,87,82,63,46,30,19,10],
      tomorrow: [6,5,4,4,7,15,31,63,75,59,44,42,44,48,54,66,81,89,84,64,47,30,19,10],
      plusTwo:  [5,4,3,3,5,10,21,45,60,52,40,39,41,44,49,59,70,77,73,57,41,26,16,8],
    },
  },
  {
    id: 'i5-nb',
    name: 'I-5 NB',
    subtitle: 'Downtown → Burbank',
    peakHour: '5 PM',
    peakCongestion: 84,
    data: {
      today:    [7,5,5,4,8,18,40,76,85,64,47,43,45,48,54,63,76,84,79,60,43,28,17,10],
      tomorrow: [7,5,5,4,8,18,39,75,84,63,47,44,46,49,55,65,78,86,81,61,44,29,17,10],
      plusTwo:  [5,4,4,3,6,12,27,54,68,55,43,41,43,46,51,58,67,75,70,54,39,25,15,8],
    },
  },
  {
    id: 'i5-sb',
    name: 'I-5 SB',
    subtitle: 'Burbank → Downtown',
    peakHour: '8 AM',
    peakCongestion: 82,
    data: {
      today:    [8,6,5,5,9,20,48,79,82,59,42,38,40,44,51,62,74,81,76,58,42,27,16,10],
      tomorrow: [8,6,5,5,9,20,47,78,81,58,42,39,41,45,52,64,76,83,78,59,43,28,17,10],
      plusTwo:  [6,5,4,4,6,13,32,57,65,51,39,36,38,41,47,57,65,72,68,52,37,24,14,8],
    },
  },
  {
    id: 'i105-wb',
    name: 'I-105 WB',
    subtitle: 'Century Fwy → LAX',
    peakHour: '5 PM',
    peakCongestion: 78,
    data: {
      today:    [6,4,4,3,6,14,30,62,72,55,40,36,38,42,48,57,68,78,73,56,40,26,15,9],
      tomorrow: [6,4,4,3,6,14,29,61,71,54,40,37,39,43,49,59,70,80,75,57,41,26,15,9],
      plusTwo:  [5,3,3,3,5,9,20,44,57,47,37,35,37,40,45,52,61,69,65,50,36,23,13,7],
    },
  },
  {
    id: 'ca60-eb',
    name: 'CA-60 EB',
    subtitle: 'Pomona Fwy → San Gabriel',
    peakHour: '5 PM',
    peakCongestion: 76,
    data: {
      today:    [6,5,4,4,7,15,32,63,70,53,38,34,36,40,46,55,67,76,71,54,38,24,14,8],
      tomorrow: [6,5,4,4,7,15,31,62,69,52,38,35,37,41,47,57,69,78,73,55,39,25,15,8],
      plusTwo:  [5,4,3,3,5,10,21,45,56,46,35,33,35,38,43,50,60,68,63,48,34,22,13,7],
    },
  },
  {
    id: 'i210-eb',
    name: 'I-210 EB',
    subtitle: 'Pasadena → Arcadia',
    peakHour: '5 PM',
    peakCongestion: 70,
    data: {
      today:    [5,4,3,3,6,13,27,56,63,49,35,32,34,37,42,51,62,70,65,49,35,22,13,7],
      tomorrow: [5,4,3,3,6,13,27,55,62,48,35,33,35,38,43,53,64,72,67,50,36,22,13,7],
      plusTwo:  [4,3,3,2,4,9,18,40,50,42,33,31,33,36,40,47,55,62,58,44,31,19,12,6],
    },
  },
  {
    id: 'ca91-eb',
    name: 'CA-91 EB',
    subtitle: 'Long Beach → Riverside',
    peakHour: '5 PM',
    peakCongestion: 91,
    data: {
      today:    [7,6,5,5,8,19,40,74,83,62,44,39,41,45,52,65,82,91,86,66,49,33,20,12],
      tomorrow: [7,6,5,5,8,18,39,73,82,61,44,40,42,46,53,67,84,93,88,67,50,33,20,12],
      plusTwo:  [5,4,4,4,6,12,27,53,66,53,41,38,40,43,49,60,73,81,76,59,44,28,17,9],
    },
  },
  {
    id: 'i710-nb',
    name: 'I-710 NB',
    subtitle: 'Long Beach → Commerce',
    peakHour: '7 AM',
    peakCongestion: 83,
    data: {
      today:    [10,8,7,7,12,27,55,83,80,60,45,42,44,47,53,62,73,79,74,56,40,26,17,11],
      tomorrow: [10,8,7,7,12,26,54,82,79,59,45,43,45,48,54,64,75,81,76,57,41,27,17,11],
      plusTwo:  [8,6,5,5,9,18,37,59,64,52,42,40,42,45,50,57,64,70,66,51,36,23,14,9],
    },
  },
]

export const FORECAST_META: ForecastMeta = {
  accuracy: 94.2,
  confidenceLabel: 'High',
  confidenceScore: 0.91,
  worstCorridorId: 'i405-nb',
  systemPeakHour: '5 PM',
  systemPeakCongestion: 91,
}

/** Maps congestion % to LOS grade */
export function congestionToLOS(pct: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  if (pct < 25) return 'A'
  if (pct < 40) return 'B'
  if (pct < 55) return 'C'
  if (pct < 70) return 'D'
  if (pct < 85) return 'E'
  return 'F'
}

export const LOS_COLOR: Record<string, string> = {
  A: '#1b5e20',
  B: '#4caf50',
  C: '#8bc34a',
  D: '#ff9800',
  E: '#f44336',
  F: '#b71c1c',
}

/** Format hour 0–23 as "12am", "1am", …, "12pm", "1pm", … */
export function formatHour(h: number): string {
  if (h === 0)  return '12am'
  if (h < 12)  return `${h}am`
  if (h === 12) return '12pm'
  return `${h - 12}pm`
}
