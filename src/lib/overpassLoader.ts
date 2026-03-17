/**
 * Loads LA road network from the Overpass API (OpenStreetMap data).
 * Results are cached in memory — fetched once per app session.
 *
 * Roads fetched:
 *   - Motorways + trunk roads (freeways): full LA metro area
 *   - Primary arterials: central LA (34.0–34.15, -118.5 to -118.1)
 *   - Secondary arterials: inner core (-118.45 to -118.15)
 */

import type { Segment } from '../types'
import type { RoadClass } from './trafficSimulation'
import {
  getCongestionLevel,
  getFreeFlowSpeed,
  getSpeedBucket,
  getFRC,
} from './trafficSimulation'

// ─── Overpass query ───────────────────────────────────────────────────────────

// Returns GeoJSON-style ways with geometry nodes.
// Bounding box format: south,west,north,east
const QUERY = `
[out:json][timeout:30];
(
  way["highway"~"motorway|trunk"](33.80,-118.70,34.35,-117.80);
  way["highway"="primary"]["name"](33.90,-118.55,34.20,-118.05);
  way["highway"="secondary"]["name"](33.95,-118.48,34.15,-118.12);
);
out geom;
`.trim()

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OsmNode { lat: number; lon: number }

interface OsmWay {
  id: number
  tags: Record<string, string>
  geometry: OsmNode[]
}

interface OverpassResponse {
  elements: OsmWay[]
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

function osmWayToSegment(way: OsmWay): Segment {
  const highway = way.tags.highway ?? 'primary'
  const roadClass = osmTagToRoadClass(highway)
  const id = `osm-${way.id}`
  const congestion = getCongestionLevel(id, roadClass)
  const freeFlow = getFreeFlowSpeed(roadClass)
  const currentSpeed = Math.round(freeFlow * (1 - congestion / 100) * 0.85 + 5)

  // Approximate length from first/last node using Haversine
  const first = way.geometry[0]
  const last = way.geometry[way.geometry.length - 1]
  const dlat = (last.lat - first.lat) * (Math.PI / 180)
  const dlon = (last.lon - first.lon) * (Math.PI / 180)
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(first.lat * Math.PI / 180) * Math.cos(last.lat * Math.PI / 180) * Math.sin(dlon / 2) ** 2
  const lengthMiles = 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return {
    segmentId: id,
    name: way.tags.name ?? way.tags.ref ?? `${highway} ${way.id}`,
    highway: way.tags.ref ?? way.tags.name ?? highway,
    direction: 'NB',
    positions: way.geometry.map(n => [n.lat, n.lon] as [number, number]),
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

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches LA roads from Overpass API (cached after first call).
 * Throws on network failure — caller should fall back to static segments.
 */
export async function loadLARoads(): Promise<OsmWay[]> {
  if (cachedBaseRoads) return cachedBaseRoads

  const resp = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(QUERY)}`,
  })

  if (!resp.ok) throw new Error(`Overpass API ${resp.status}`)

  const data: OverpassResponse = await resp.json()

  // Keep only ways that have at least 2 geometry nodes
  cachedBaseRoads = data.elements.filter(
    (e) => e.type === 'way' && Array.isArray(e.geometry) && e.geometry.length >= 2
  ) as OsmWay[]

  console.log(`[overpass] Loaded ${cachedBaseRoads.length} LA road segments`)
  return cachedBaseRoads
}

/**
 * Converts cached OSM ways to Segment objects with fresh simulation data.
 * Call this on each refresh tick — it's fast (no network request).
 */
export function osmRoadsToSegments(ways: OsmWay[]): Segment[] {
  return ways.map(osmWayToSegment)
}
