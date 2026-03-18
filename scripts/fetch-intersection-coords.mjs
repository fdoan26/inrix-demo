/**
 * Finds intersection coordinates by computing the geometric crossing point
 * of two street polylines directly from public/la-roads.json.
 *
 * Since la-roads.json is the same OSM data that CartoDB renders, any crossing
 * found here lands pixel-perfect on the map — no approximations needed.
 *
 * Algorithm:
 *   1. Load la-roads.json, index ways by name (including N/S/E/W variants)
 *   2. For each intersection pair, collect all segments from both street sets
 *   3. Test every segment pair for geometric intersection (line-segment crossing)
 *   4. Return the crossing point closest to the seed coordinate
 *
 * Usage: node scripts/fetch-intersection-coords.mjs
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const raw = JSON.parse(readFileSync(join(__dir, '../public/la-roads.json'), 'utf8'))

// ─── Build name index ─────────────────────────────────────────────────────────

const byName = new Map()
for (const el of raw.elements) {
  if (!Array.isArray(el.geometry) || el.geometry.length < 2 || !el.tags?.name) continue
  const n = el.tags.name
  if (!byName.has(n)) byName.set(n, [])
  byName.get(n).push(el)
}

function getCoords(geom) {
  if (!geom?.length) return []
  return Array.isArray(geom[0]) ? geom.map(p => [p[0], p[1]]) : geom.map(n => [n.lat, n.lon])
}

/** Return all ways whose name contains any of the given fragments */
function findWays(fragments) {
  const out = []
  for (const [name, ways] of byName) {
    const lc = name.toLowerCase()
    if (fragments.some(f => lc.includes(f.toLowerCase()))) out.push(...ways)
  }
  return out
}

// ─── Geometry ─────────────────────────────────────────────────────────────────

/** Euclidean distance in degrees (fine for small areas) */
function dist(a, b) {
  const d0 = a[0] - b[0], d1 = a[1] - b[1]
  return Math.sqrt(d0 * d0 + d1 * d1)
}

/**
 * Returns the intersection point of segments (p1→p2) and (p3→p4), or null.
 * Uses parametric line intersection; both parameters must be in [0,1].
 */
function segmentCross(p1, p2, p3, p4) {
  const d1 = [p2[0] - p1[0], p2[1] - p1[1]]
  const d2 = [p4[0] - p3[0], p4[1] - p3[1]]
  const cross = d1[0] * d2[1] - d1[1] * d2[0]
  if (Math.abs(cross) < 1e-12) return null  // parallel / collinear

  const dx = p3[0] - p1[0], dy = p3[1] - p1[1]
  const t = (dx * d2[1] - dy * d2[0]) / cross
  const u = (dx * d1[1] - dy * d1[0]) / cross

  if (t >= -0.001 && t <= 1.001 && u >= -0.001 && u <= 1.001) {
    return [p1[0] + t * d1[0], p1[1] + t * d1[1]]
  }
  return null
}

/**
 * Finds all geometric crossing points between two sets of ways.
 * Only considers segments whose midpoint is within `maxDist` degrees of `seed`.
 */
function findCrossings(ways1, ways2, seed, maxDist = 0.006) {
  const crossings = []

  // Minimum distance from point pt to segment (a→b)
  function minDistToSeg(pt, a, b) {
    const d = [b[0] - a[0], b[1] - a[1]]
    const len2 = d[0] * d[0] + d[1] * d[1]
    if (len2 === 0) return dist(pt, a)
    const t = Math.max(0, Math.min(1, ((pt[0] - a[0]) * d[0] + (pt[1] - a[1]) * d[1]) / len2))
    return dist(pt, [a[0] + t * d[0], a[1] + t * d[1]])
  }

  // A segment is "nearby" if the segment LINE passes within maxDist of seed
  function nearSeed(a, b) {
    return minDistToSeg(seed, a, b) < maxDist
  }

  const segs1 = ways1.flatMap(w => {
    const pts = getCoords(w.geometry)
    return pts.slice(0, -1).map((p, i) => [p, pts[i + 1]])
  }).filter(([a, b]) => nearSeed(a, b))

  const segs2 = ways2.flatMap(w => {
    const pts = getCoords(w.geometry)
    return pts.slice(0, -1).map((p, i) => [p, pts[i + 1]])
  }).filter(([a, b]) => nearSeed(a, b))

  for (const [a1, a2] of segs1) {
    for (const [b1, b2] of segs2) {
      const pt = segmentCross(a1, a2, b1, b2)
      if (pt) crossings.push(pt)
    }
  }
  return crossings
}

// ─── Intersection definitions ─────────────────────────────────────────────────

const INTERSECTIONS = [
  { id: 'wil-west',  s1: ['wilshire boulevard'],         s2: ['western avenue'],                        seed: [34.0583, -118.3091] },
  { id: 'hwd-high',  s1: ['hollywood boulevard'],         s2: ['highland avenue'],                       seed: [34.1016, -118.3388] },
  { id: 'sm-labrea', s1: ['santa monica boulevard'],      s2: ['la brea avenue'],                        seed: [34.0832, -118.3617] },
  { id: 'sun-vine',  s1: ['sunset boulevard'],            s2: ['vine street'],                           seed: [34.0981, -118.3267] },
  { id: 'ven-linc',  s1: ['venice boulevard'],            s2: ['lincoln boulevard'],                     seed: [34.0000, -118.4485] },
  { id: 'oly-verm',  s1: ['olympic boulevard'],           s2: ['vermont avenue'],                        seed: [34.0524, -118.2920] },
  { id: 'pico-fair', s1: ['pico boulevard'],              s2: ['fairfax avenue'],                        seed: [34.0356, -118.3614] },
  { id: 'mel-high',  s1: ['melrose avenue'],              s2: ['highland avenue'],                       seed: [34.0836, -118.3387] },
  { id: 'cren-mlk',  s1: ['crenshaw boulevard'],          s2: ['martin luther king'],                    seed: [33.9913, -118.3387] },
  { id: 'fig-adams', s1: ['figueroa street'],             s2: ['adams boulevard'],                       seed: [34.0183, -118.2784] },
  { id: 'wil-verm',  s1: ['wilshire boulevard'],          s2: ['vermont avenue'],                        seed: [34.0622, -118.2921] },
  { id: 'wil-labr',  s1: ['wilshire boulevard'],          s2: ['la brea avenue'],                        seed: [34.0618, -118.3545] },
  { id: 'hwd-cahu',  s1: ['hollywood boulevard'],         s2: ['cahuenga boulevard'],                    seed: [34.1016, -118.3268] },
  { id: 'bev-fair',  s1: ['beverly boulevard'],           s2: ['fairfax avenue'],                        seed: [34.0758, -118.3614] },
  { id: 'lac-oly',   s1: ['la cienega boulevard'],        s2: ['olympic boulevard'],                     seed: [34.0462, -118.3724] },
  { id: 'sep-pico',  s1: ['sepulveda boulevard'],         s2: ['pico boulevard'],                        seed: [34.0328, -118.4392] },
  { id: 'sun-labr',  s1: ['sunset boulevard'],            s2: ['la brea avenue'],                        seed: [34.0973, -118.3617] },
  { id: 'sm-sep',    s1: ['santa monica boulevard'],      s2: ['sepulveda boulevard'],                   seed: [34.0791, -118.4393] },
  { id: 'wil-wwd',   s1: ['wilshire boulevard'],          s2: ['westwood boulevard'],                    seed: [34.0576, -118.4440] },
  { id: 'sun-high',  s1: ['sunset boulevard'],            s2: ['highland avenue'],                       seed: [34.0977, -118.3387] },
  { id: 'bev-labr',  s1: ['beverly boulevard'],           s2: ['la brea avenue'],                        seed: [34.0758, -118.3545] },
  { id: 'trd-labr',  s1: ['3rd street', 'west 3rd'],      s2: ['la brea avenue'],                        seed: [34.0681, -118.3617] },
  { id: 'wil-doh',   s1: ['wilshire boulevard'],          s2: ['doheny drive'],                          seed: [34.0644, -118.3936] },
  { id: 'cen-sep',   s1: ['century boulevard'],           s2: ['sepulveda boulevard'],                   seed: [33.9451, -118.3892] },
  { id: 'man-verm',  s1: ['manchester boulevard', 'manchester avenue'], s2: ['vermont avenue'],          seed: [33.9591, -118.2921] },
  { id: 'flo-norm',  s1: ['florence avenue'],             s2: ['normandie avenue'],                      seed: [33.9696, -118.3025] },
  { id: 'sla-cren',  s1: ['slauson avenue'],              s2: ['crenshaw boulevard'],                    seed: [33.9796, -118.3388] },
  { id: 'jef-hov',   s1: ['jefferson boulevard'],         s2: ['hoover street'],                         seed: [34.0268, -118.2844] },
  { id: 'labr-oly',  s1: ['la brea avenue'],              s2: ['olympic boulevard'],                     seed: [34.0504, -118.3617] },
  { id: 'cahu-fnt',  s1: ['cahuenga boulevard'],          s2: ['fountain avenue'],                       seed: [34.0876, -118.3286] },
]

/**
 * Find shared nodes between two way sets near a seed point.
 * In OSM, intersecting roads share a node — this handles the common case
 * where the geometric crossing algo finds nothing because roads touch at endpoints.
 */
function findSharedNodes(ways1, ways2, seed, maxDist = 0.006) {
  // Collect all node coords from each way set, keyed by "lat,lon" string
  const nodeKey = (n) => `${n.lat.toFixed(7)},${n.lon.toFixed(7)}`

  const set1 = new Map()
  for (const w of ways1) {
    for (const n of (w.geometry ?? [])) {
      if (typeof n.lat === 'number') {
        const pt = [n.lat, n.lon]
        if (dist(pt, seed) < maxDist) set1.set(nodeKey(n), pt)
      }
    }
  }

  const shared = []
  for (const w of ways2) {
    for (const n of (w.geometry ?? [])) {
      if (typeof n.lat === 'number') {
        const key = nodeKey(n)
        if (set1.has(key)) shared.push(set1.get(key))
      }
    }
  }
  return shared
}

// ─── Run ──────────────────────────────────────────────────────────────────────

let exact = 0, fallback = 0

console.log(`Loaded ${byName.size} named streets from la-roads.json\n`)

const results = []

for (const entry of INTERSECTIONS) {
  const ways1 = findWays(entry.s1)
  const ways2 = findWays(entry.s2)

  // Try geometric crossings first, then shared-node fallback
  let candidates = (ways1.length && ways2.length)
    ? findCrossings(ways1, ways2, entry.seed)
    : []

  if (candidates.length === 0 && ways1.length && ways2.length) {
    candidates = findSharedNodes(ways1, ways2, entry.seed)
  }

  if (candidates.length > 0) {
    // Pick the candidate closest to the seed coordinate
    const best = candidates.reduce((a, b) => dist(a, entry.seed) < dist(b, entry.seed) ? a : b)
    const dm = (dist(best, entry.seed) * 111000).toFixed(0)
    const flag = dm < 200 ? '✓' : '~'
    console.log(`${flag} ${entry.id.padEnd(12)} [${best[0].toFixed(6)}, ${best[1].toFixed(6)}]  Δ${dm}m  (${candidates.length} pts, w1:${ways1.length} w2:${ways2.length})`)
    results.push({ id: entry.id, coord: best })
    exact++
  } else {
    console.log(`✗ ${entry.id.padEnd(12)} no crossing found  (w1:${ways1.length} w2:${ways2.length}) → seed`)
    results.push({ id: entry.id, coord: entry.seed })
    fallback++
  }
}

console.log(`\n${exact} geometric crossings, ${fallback} seeds kept\n`)
console.log('─── Paste into SignalAnalyticsView.tsx ───────────────────────────────\n')
for (const { id, coord } of results) {
  console.log(`  position: [${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}],  // ${id}`)
}
