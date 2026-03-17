/**
 * React hook that manages live traffic data.
 *
 * Flow:
 *   1. Fetch LA road geometry from Overpass API (once, cached)
 *   2. Apply time-of-day traffic simulation → Segment[]
 *   3. Refresh every REFRESH_INTERVAL_MS (recalculates congestion, no network)
 *   4. Falls back to static segments.ts if Overpass is unreachable
 */

import { useState, useEffect, useRef } from 'react'
import type { Segment } from '../types'
import { loadLARoads, osmRoadsToSegments } from '../lib/overpassLoader'
import { segments as staticSegments } from '../data/segments'
import { getSimulatedTimeLabel, simConfig } from '../lib/trafficSimulation'

/** How often congestion levels are recalculated (ms). */
const REFRESH_INTERVAL_MS = 30_000

export interface TrafficDataState {
  segments: Segment[]
  loading: boolean
  /** 'live' = Overpass data, 'static' = fallback segments.ts */
  source: 'live' | 'static'
  /** Current simulated time string, e.g. "8:30 AM" */
  simulatedTime: string
  /** Number of roads loaded */
  roadCount: number
}

export function useTrafficData(): TrafficDataState {
  const [state, setState] = useState<TrafficDataState>({
    segments: [],
    loading: true,
    source: 'live',
    simulatedTime: getSimulatedTimeLabel(),
    roadCount: 0,
  })

  // Hold the raw OSM ways so we can re-apply simulation without re-fetching
  const osmWaysRef = useRef<Awaited<ReturnType<typeof loadLARoads>> | null>(null)

  useEffect(() => {
    let mounted = true

    // ── Initial load ──────────────────────────────────────────────────────────
    loadLARoads()
      .then((ways) => {
        if (!mounted) return
        osmWaysRef.current = ways
        const segs = osmRoadsToSegments(ways)
        setState({
          segments: segs,
          loading: false,
          source: 'live',
          simulatedTime: getSimulatedTimeLabel(),
          roadCount: segs.length,
        })
      })
      .catch((err) => {
        console.warn('[useTrafficData] Overpass unavailable, using static segments:', err)
        if (!mounted) return
        setState({
          segments: staticSegments,
          loading: false,
          source: 'static',
          simulatedTime: getSimulatedTimeLabel(),
          roadCount: staticSegments.length,
        })
      })

    // ── Refresh tick ──────────────────────────────────────────────────────────
    // Runs every REFRESH_INTERVAL_MS to recalculate congestion.
    // Also runs more frequently when speed multiplier is high so the display
    // stays smooth during demo time-lapse (every ~1 simulated minute minimum).
    const getInterval = () => {
      const simSecondsPerRealSecond = simConfig.speedMultiplier
      const msPerSimMinute = 60_000 / simSecondsPerRealSecond
      return Math.max(500, Math.min(REFRESH_INTERVAL_MS, msPerSimMinute))
    }

    let tickTimer: ReturnType<typeof setTimeout>

    function tick() {
      if (!mounted) return
      if (osmWaysRef.current) {
        const segs = osmRoadsToSegments(osmWaysRef.current)
        setState((prev) => ({
          ...prev,
          segments: segs,
          simulatedTime: getSimulatedTimeLabel(),
        }))
      } else {
        // Still on static fallback — just update time label
        setState((prev) => ({
          ...prev,
          simulatedTime: getSimulatedTimeLabel(),
        }))
      }
      tickTimer = setTimeout(tick, getInterval())
    }

    tickTimer = setTimeout(tick, getInterval())

    return () => {
      mounted = false
      clearTimeout(tickTimer)
    }
  }, [])

  return state
}
