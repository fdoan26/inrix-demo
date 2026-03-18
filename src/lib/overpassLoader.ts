/**
 * Loads LA road network geometry.
 *
 * Priority:
 *   1. Bundled static asset (/la-roads.json) — pre-fetched real OSM data, always available
 *   2. Live Overpass API — fallback if static asset is missing
 *
 * Roads included:
 *   - Motorways + trunk roads (freeways): full LA metro area
 *   - Primary arterials: central LA
 *   - Secondary arterials: inner core
 */

import type { Segment } from '../types'
import type { RoadClass } from './trafficSimulation'
import {
  getCongestionLevel,
  getFreeFlowSpeed,
  getSpeedBucket,
  getFRC,
} from './trafficSimulation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OsmNode { lat: number; lon: number }

export interface OsmWay {
  id: number
  tags: Record<string, string>
  geometry: OsmNode[]
}

// ─── Cache ────────────────────────────────────────────────────────────────────

let cachedBaseRoads: OsmWay[] | null = null

// ─── Helpers ─────────────────────────────────────────────────────────────────

function osmTagToRoadClass(highway: string): RoadClass {
  switch (highway) {
    case 'motorway':
    case 'motorway_link': return 'motorway'
    case 'trunk':
    case 'trunk_link':    return 'trunk'
    case 'primary':
    case 'primary_link':  return 'primary'
    case 'secondary':
    case 'secondary_link':return 'secondary'
    default:              return 'other'
  }
}

/**
 * Normalize geometry that may be stored as [lat, lon][] arrays (static JSON)
 * or as { lat, lon }[] objects (live Overpass response).
 */
function normalizeGeometry(raw: unknown[]): OsmNode[] {
  if (raw.length === 0) return []
  if (Array.isArray(raw[0])) {
    return (raw as [number, number][]).map(([lat, lon]) => ({ lat, lon }))
  }
  return raw as OsmNode[]
}

function osmWayToSegment(way: OsmWay): Segment {
  const highway = way.tags.highway ?? 'primary'
  const roadClass = osmTagToRoadClass(highway)
  const id = `osm-${way.id}`
  const congestion = getCongestionLevel(id, roadClass)
  const freeFlow = getFreeFlowSpeed(roadClass)
  const currentSpeed = Math.round(freeFlow * (1 - congestion / 100) * 0.85 + 5)

  const first = way.geometry[0]
  const last = way.geometry[way.geometry.length - 1]
  const dlat = (last.lat - first.lat) * (Math.PI / 180)
  const dlon = (last.lon - first.lon) * (Math.PI / 180)
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(first.lat * Math.PI / 180) *
    Math.cos(last.lat * Math.PI / 180) *
    Math.sin(dlon / 2) ** 2
  const lengthMiles = 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return {
    segmentId: id,
    name: way.tags.name ?? way.tags.ref ?? `${highway} ${way.id}`,
    highway: way.tags.ref ?? way.tags.name ?? highway,
    direction: 'NB',
    positions: way.geometry.map((n) => [n.lat, n.lon] as [number, number]),
    congestionLevel: congestion,
    currentSpeed,
    freeFlowSpeed: freeFlow,
    historicAvgSpeed: Math.round(freeFlow * 0.75),
    travelTime: Math.round((lengthMiles / Math.max(currentSpeed, 5)) * 3600),
    avgTravelTime: Math.round((lengthMiles / Math.max(freeFlow * 0.75, 5)) * 3600),
    type: roadClass === 'motorway' || roadClass === 'trunk' ? 'XD' : 'XD+',
    frc: getFRC(roadClass),
    lengthMiles,
    speedBucket: getSpeedBucket(congestion),
  }
}

function parseWays(elements: unknown[]): OsmWay[] {
  return (elements as Array<{ id: number; type?: string; tags: Record<string, string>; geometry: unknown[] }>)
    .filter((e) => Array.isArray(e.geometry) && e.geometry.length >= 2)
    .map((e) => ({
      id: e.id,
      tags: e.tags ?? {},
      geometry: normalizeGeometry(e.geometry),
    }))
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Loads LA road geometry from the bundled static asset only.
 * The Overpass API fallback has been removed — la-roads.json is always present.
 */
export async function loadLARoads(): Promise<OsmWay[]> {
  if (cachedBaseRoads) return cachedBaseRoads

  const resp = await fetch('/la-roads.json')
  if (!resp.ok) throw new Error(`[roads] Failed to load la-roads.json: ${resp.status}`)

  const data = await resp.json() as { elements: unknown[] }
  cachedBaseRoads = parseWays(data.elements)
  return cachedBaseRoads
}

/**
 * Converts cached OSM ways to Segment objects with fresh simulation data.
 * Call on each refresh tick — no network request.
 */
export function osmRoadsToSegments(ways: OsmWay[]): Segment[] {
  return ways.map(osmWayToSegment)
}
