/**
 * Finds precise intersection coordinates by querying Overpass for
 * highway=traffic_signals nodes near each approximate location.
 *
 * Signal nodes are placed by OSM mappers at the exact center of the
 * intersection — this gives us sub-meter accuracy without naming issues.
 *
 * Usage: node scripts/fetch-intersection-coords.mjs
 */

const INTERSECTIONS = [
  { id: 'wil-west',  label: 'Wilshire & Western',          approx: [34.0573, -118.3091] },
  { id: 'hwd-high',  label: 'Hollywood & Highland',        approx: [34.1016, -118.3387] },
  { id: 'sm-labrea', label: 'Santa Monica & La Brea',      approx: [34.0831, -118.3618] },
  { id: 'sun-vine',  label: 'Sunset & Vine',               approx: [34.0983, -118.3267] },
  { id: 'ven-linc',  label: 'Venice & Lincoln',            approx: [33.9997, -118.4492] },
  { id: 'oly-verm',  label: 'Olympic & Vermont',           approx: [34.0523, -118.2921] },
  { id: 'pico-fair', label: 'Pico & Fairfax',              approx: [34.0356, -118.3614] },
  { id: 'mel-high',  label: 'Melrose & Highland',          approx: [34.0836, -118.3387] },
  { id: 'cren-mlk',  label: 'Crenshaw & MLK Jr',          approx: [33.9916, -118.3388] },
  { id: 'fig-adams', label: 'Figueroa & Adams',            approx: [34.0183, -118.2784] },
]

function dist(a, b) {
  const dlat = a[0] - b[0], dlon = a[1] - b[1]
  return Math.sqrt(dlat * dlat + dlon * dlon)
}

async function fetchSignalNodes(lat, lon, radius = 120) {
  const query = `[out:json][timeout:10];node["highway"="traffic_signals"](around:${radius},${lat},${lon});out body;`
  const resp = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  return data.elements ?? []
}

console.log('Querying Overpass for traffic_signals nodes...\n')

const results = []
for (const entry of INTERSECTIONS) {
  let success = false
  for (const radius of [80, 150, 250]) {
    try {
      const nodes = await fetchSignalNodes(...entry.approx, radius)
      if (nodes.length > 0) {
        // Pick the node closest to our approximate coordinate
        const best = nodes.reduce((a, b) =>
          dist([a.lat, a.lon], entry.approx) < dist([b.lat, b.lon], entry.approx) ? a : b
        )
        const d = dist([best.lat, best.lon], entry.approx) * 111000
        console.log(`✓ ${entry.id.padEnd(12)} [${best.lat.toFixed(6)}, ${best.lon.toFixed(6)}]  r=${radius}m Δ=${d.toFixed(0)}m  (${nodes.length} signals)  ${entry.label}`)
        results.push({ ...entry, coords: [best.lat, best.lon] })
        success = true
        break
      }
    } catch (e) {
      console.error(`  error at radius ${radius}: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 800))
  }
  if (!success) {
    console.log(`✗ ${entry.id.padEnd(12)} no signal nodes found → keeping approx  ${entry.label}`)
    results.push({ ...entry, coords: entry.approx })
  }
  await new Promise(r => setTimeout(r, 800))
}

console.log('\n--- Updated INTERSECTIONS positions ---\n')
for (const { id, label, coords } of results) {
  console.log(`  { id: '${id}', position: [${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}] },  // ${label}`)
}
