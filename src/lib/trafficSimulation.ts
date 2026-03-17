/**
 * Traffic simulation engine.
 *
 * Uses time-of-day congestion curves calibrated to LA traffic patterns.
 * Simulation time can run faster than real time for demo purposes.
 *
 * Demo controls (browser console):
 *   window.trafficSim.setSpeed(3600)   // 1 hour passes per real second
 *   window.trafficSim.setHour(8)       // jump to 8 AM
 *   window.trafficSim.setHour(17)      // jump to 5 PM peak
 *   window.trafficSim.useRealTime()    // back to real clock
 *   window.trafficSim.getHour()        // current simulated hour
 */

// ─── Config (mutable — modified by demo controls) ────────────────────────────

export interface SimConfig {
  /** How many real-world seconds count as 1 simulated second. Default 1. */
  speedMultiplier: number
  /**
   * Override the simulated start hour (0–24). null = use real local time.
   * Set via setHour() which also resets baseTimestamp.
   */
  startHour: number | null
  /** Real timestamp when the current sim session started. */
  baseTimestamp: number
}

export const simConfig: SimConfig = {
  speedMultiplier: 1,
  startHour: null,
  baseTimestamp: Date.now(),
}

// ─── Simulated clock ──────────────────────────────────────────────────────────

/** Returns the current simulated hour as a float (e.g., 8.5 = 8:30 AM). */
export function getSimulatedHour(): number {
  const elapsedMs = (Date.now() - simConfig.baseTimestamp) * simConfig.speedMultiplier
  const elapsedHours = elapsedMs / 3_600_000

  const base =
    simConfig.startHour !== null
      ? simConfig.startHour
      : new Date().getHours() + new Date().getMinutes() / 60

  return (base + elapsedHours) % 24
}

/** Returns "HH:MM AM/PM" label for the current simulated time. */
export function getSimulatedTimeLabel(): string {
  const h = getSimulatedHour()
  const hours = Math.floor(h) % 24
  const minutes = Math.floor((h % 1) * 60)
  const ampm = hours < 12 ? 'AM' : 'PM'
  const display = hours % 12 === 0 ? 12 : hours % 12
  return `${display}:${String(minutes).padStart(2, '0')} ${ampm}`
}

// ─── Time-of-day congestion curves ───────────────────────────────────────────
// Each entry is [hour, baseCongestion 0–1].
// Values are interpolated linearly between points.
// Calibrated to LA typical weekday patterns.

type CurvePoint = [number, number] // [hour, congestion 0-1]

const FREEWAY_CURVE: CurvePoint[] = [
  [0,  0.05], [4,  0.04], [5,  0.10], [6,  0.28],
  [7,  0.72], [8,  0.88], [9,  0.62], [10, 0.45],
  [11, 0.40], [12, 0.42], [13, 0.44], [14, 0.50],
  [15, 0.60], [16, 0.82], [17, 0.92], [18, 0.86],
  [19, 0.68], [20, 0.50], [21, 0.34], [22, 0.22],
  [23, 0.13], [24, 0.05],
]

const ARTERIAL_CURVE: CurvePoint[] = [
  [0,  0.06], [4,  0.05], [5,  0.12], [6,  0.30],
  [7,  0.62], [8,  0.75], [9,  0.58], [10, 0.48],
  [11, 0.50], [12, 0.55], [13, 0.52], [14, 0.54],
  [15, 0.63], [16, 0.76], [17, 0.85], [18, 0.80],
  [19, 0.68], [20, 0.55], [21, 0.40], [22, 0.28],
  [23, 0.18], [24, 0.08],
]

/** Linear interpolation along a congestion curve for a given hour. */
function lerpCurve(curve: CurvePoint[], hour: number): number {
  const h = ((hour % 24) + 24) % 24
  for (let i = 0; i < curve.length - 1; i++) {
    const [h0, v0] = curve[i]
    const [h1, v1] = curve[i + 1]
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0)
      return v0 + t * (v1 - v0)
    }
  }
  return curve[0][1]
}

// ─── Per-segment deterministic noise ─────────────────────────────────────────

/**
 * Deterministic pseudo-random offset for a segment ID.
 * Same segment always gets the same offset so colors don't flicker on refresh.
 * Returns a value in [-1, 1].
 */
function segmentNoise(segmentId: string): number {
  let h = 2166136261
  for (let i = 0; i < segmentId.length; i++) {
    h ^= segmentId.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return ((h % 1000) / 1000) * 2 - 1 // -1 to 1
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type RoadClass = 'motorway' | 'trunk' | 'primary' | 'secondary' | 'other'

/**
 * Returns a congestion level (0–100) for a segment given its ID and road class.
 * Deterministic per-segment noise adds variety without flicker.
 */
export function getCongestionLevel(segmentId: string, roadClass: RoadClass): number {
  const hour = getSimulatedHour()
  const curve = roadClass === 'motorway' || roadClass === 'trunk'
    ? FREEWAY_CURVE
    : ARTERIAL_CURVE

  const base = lerpCurve(curve, hour)
  const noise = segmentNoise(segmentId) * 0.12 // ±12% variation per segment
  const raw = Math.max(0, Math.min(1, base + noise))
  return Math.round(raw * 100)
}

/** Free-flow speed (mph) by road class. */
export function getFreeFlowSpeed(roadClass: RoadClass): number {
  switch (roadClass) {
    case 'motorway': return 65
    case 'trunk':    return 55
    case 'primary':  return 40
    case 'secondary':return 35
    default:         return 30
  }
}

/** Speed bucket (1=very slow … 5=free flow) from congestion level. */
export function getSpeedBucket(congestion: number): number {
  if (congestion >= 76) return 1
  if (congestion >= 51) return 2
  if (congestion >= 26) return 3
  if (congestion >= 10) return 4
  return 5
}

/** FRC (functional road class) from OSM highway tag. */
export function getFRC(roadClass: RoadClass): number {
  switch (roadClass) {
    case 'motorway': return 1
    case 'trunk':    return 1
    case 'primary':  return 2
    case 'secondary':return 3
    default:         return 4
  }
}

// ─── Demo controls (window.trafficSim) ───────────────────────────────────────

if (typeof window !== 'undefined') {
  ;(window as any).trafficSim = {
    /** Speed up simulated time. 1=real, 60=1min/sec, 3600=1hr/sec, 86400=1day/sec */
    setSpeed(multiplier: number) {
      simConfig.startHour = getSimulatedHour() // freeze current position
      simConfig.baseTimestamp = Date.now()
      simConfig.speedMultiplier = multiplier
      console.log(`[trafficSim] Speed set to ${multiplier}x — simulated time: ${getSimulatedTimeLabel()}`)
    },
    /** Jump to a specific hour (0–24). Resets speed to current multiplier from that point. */
    setHour(hour: number) {
      simConfig.startHour = hour
      simConfig.baseTimestamp = Date.now()
      console.log(`[trafficSim] Jumped to ${getSimulatedTimeLabel()}`)
    },
    /** Return to real local time at 1x speed. */
    useRealTime() {
      simConfig.startHour = null
      simConfig.speedMultiplier = 1
      simConfig.baseTimestamp = Date.now()
      console.log('[trafficSim] Using real local time')
    },
    getHour: () => getSimulatedHour(),
    getTime: () => getSimulatedTimeLabel(),
    config: simConfig,
  }
  console.log('[trafficSim] Available: window.trafficSim — setSpeed(n), setHour(n), useRealTime(), getTime()')
}
