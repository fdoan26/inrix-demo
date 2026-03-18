/**
 * React hook that manages live traffic data.
 *
 * Progressive loading flow:
 *   1. Immediately render with static segments.ts (no loading spinner, map is interactive)
 *   2. Fetch la-roads.json in the background — when ready, swap to OSM geometry
 *   3. Refresh congestion every REFRESH_INTERVAL_MS (recalculates colors, no network)
 *
 * refresh() — call immediately when sim speed or hour changes so the map
 * responds right away rather than waiting for the next scheduled tick.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Segment } from '../types'
import { loadLARoads, osmRoadsToSegments } from '../lib/overpassLoader'
import { segments as staticSegments } from '../data/segments'
import { getSimulatedTimeLabel, simConfig } from '../lib/trafficSimulation'

/** How often congestion levels are recalculated during normal playback (ms). */
const REFRESH_INTERVAL_MS = 120_000

export interface TrafficDataState {
  segments: Segment[]
  /** true while OSM road data is still loading in the background */
  loading: boolean
  /** 'live' = OSM data, 'static' = fallback segments.ts */
  source: 'live' | 'static'
  /** Current simulated time string, e.g. "8:30 AM" */
  simulatedTime: string
  /** Number of roads loaded */
  roadCount: number
  /**
   * Call this immediately after changing simConfig (speed or hour) to cancel
   * the pending tick and recalculate segments + time right now.
   */
  refresh: () => void
}

export function useTrafficData(): TrafficDataState {
  // Start with static data immediately — map renders right away
  const [state, setState] = useState<Omit<TrafficDataState, 'refresh'>>({
    segments: staticSegments,
    loading: true,
    source: 'static',
    simulatedTime: getSimulatedTimeLabel(),
    roadCount: staticSegments.length,
  })

  const osmWaysRef = useRef<Awaited<ReturnType<typeof loadLARoads>> | null>(null)
  // Ref to the currently pending tick timeout so refresh() can cancel it
  const tickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Ref to the tick function so refresh() can invoke it without capturing stale closures
  const tickFnRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    let mounted = true

    const getInterval = () => {
      const simSecondsPerRealSecond = simConfig.speedMultiplier
      const msPerSimMinute = 60_000 / simSecondsPerRealSecond
      return Math.max(500, Math.min(REFRESH_INTERVAL_MS, msPerSimMinute))
    }

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
        setState((prev) => ({
          ...prev,
          simulatedTime: getSimulatedTimeLabel(),
        }))
      }
      tickTimerRef.current = setTimeout(tick, getInterval())
    }

    tickFnRef.current = tick

    // ── Background OSM load ───────────────────────────────────────────────────
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
        console.warn('[useTrafficData] Could not load OSM roads, keeping static segments:', err)
        if (!mounted) return
        setState((prev) => ({ ...prev, loading: false }))
      })

    // ── Initial tick ──────────────────────────────────────────────────────────
    tickTimerRef.current = setTimeout(tick, getInterval())

    return () => {
      mounted = false
      if (tickTimerRef.current) clearTimeout(tickTimerRef.current)
    }
  }, [])

  // Stable refresh function — cancels pending tick and fires immediately.
  // Call this right after mutating simConfig so the map reacts without delay.
  const refresh = useCallback(() => {
    if (tickTimerRef.current) clearTimeout(tickTimerRef.current)
    tickFnRef.current?.()
  }, [])

  return { ...state, refresh }
}
