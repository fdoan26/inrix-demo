/**
 * Geocodes LA intersections using the Photon geocoder (photon.komoot.io).
 *
 * Photon is a free, open-source geocoder backed by OpenStreetMap — no API key,
 * no rate limits at moderate usage. Returns coordinates in WGS84, same as
 * CartoDB map tiles, so dots land precisely on the correct streets.
 *
 * Strategy: geocode each street independently near the approximate point,
 * then find the midpoint of the two closest results → intersection center.
 *
 * Usage: node scripts/fetch-intersection-coords.mjs
 */

const BASE = 'https://photon.komoot.io/api'

const INTERSECTIONS = [
  { id: 'wil-west',  s1: 'Wilshire Boulevard',         s2: 'Western Avenue',              approx: [34.0583, -118.3091] },
  { id: 'hwd-high',  s1: 'Hollywood Boulevard',         s2: 'Highland Avenue',             approx: [34.1016, -118.3388] },
  { id: 'sm-labrea', s1: 'Santa Monica Boulevard',      s2: 'La Brea Avenue',              approx: [34.0832, -118.3617] },
  { id: 'sun-vine',  s1: 'Sunset Boulevard',            s2: 'Vine Street',                 approx: [34.0981, -118.3267] },
  { id: 'ven-linc',  s1: 'Venice Boulevard',            s2: 'Lincoln Boulevard',           approx: [34.0000, -118.4485] },
  { id: 'oly-verm',  s1: 'Olympic Boulevard',           s2: 'Vermont Avenue',              approx: [34.0524, -118.2920] },
  { id: 'pico-fair', s1: 'Pico Boulevard',              s2: 'Fairfax Avenue',              approx: [34.0356, -118.3614] },
  { id: 'mel-high',  s1: 'Melrose Avenue',              s2: 'Highland Avenue',             approx: [34.0836, -118.3387] },
  { id: 'cren-mlk',  s1: 'Crenshaw Boulevard',          s2: 'Martin Luther King Jr Boulevard', approx: [33.9913, -118.3387] },
  { id: 'fig-adams', s1: 'Figueroa Street',             s2: 'Adams Boulevard',             approx: [34.0183, -118.2784] },
  { id: 'wil-verm',  s1: 'Wilshire Boulevard',          s2: 'Vermont Avenue',              approx: [34.0622, -118.2921] },
  { id: 'wil-labr',  s1: 'Wilshire Boulevard',          s2: 'La Brea Avenue',              approx: [34.0618, -118.3539] },
  { id: 'hwd-cahu',  s1: 'Hollywood Boulevard',         s2: 'Cahuenga Boulevard',          approx: [34.1016, -118.3268] },
  { id: 'bev-fair',  s1: 'Beverly Boulevard',           s2: 'Fairfax Avenue',              approx: [34.0758, -118.3614] },
  { id: 'lac-oly',   s1: 'La Cienega Boulevard',        s2: 'Olympic Boulevard',           approx: [34.0462, -118.3724] },
  { id: 'sep-pico',  s1: 'Sepulveda Boulevard',         s2: 'Pico Boulevard',              approx: [34.0328, -118.4392] },
  { id: 'sun-labr',  s1: 'Sunset Boulevard',            s2: 'La Brea Avenue',              approx: [34.0973, -118.3617] },
  { id: 'sm-sep',    s1: 'Santa Monica Boulevard',      s2: 'Sepulveda Boulevard',         approx: [34.0791, -118.4393] },
  { id: 'wil-wwd',   s1: 'Wilshire Boulevard',          s2: 'Westwood Boulevard',          approx: [34.0576, -118.4439] },
  { id: 'sun-high',  s1: 'Sunset Boulevard',            s2: 'Highland Avenue',             approx: [34.0977, -118.3387] },
  { id: 'bev-labr',  s1: 'Beverly Boulevard',           s2: 'La Brea Avenue',              approx: [34.0758, -118.3539] },
  { id: 'trd-labr',  s1: 'West 3rd Street',             s2: 'La Brea Avenue',              approx: [34.0681, -118.3617] },
  { id: 'wil-doh',   s1: 'Wilshire Boulevard',          s2: 'Doheny Drive',                approx: [34.0644, -118.3936] },
  { id: 'cen-sep',   s1: 'Century Boulevard',           s2: 'Sepulveda Boulevard',         approx: [33.9451, -118.3892] },
  { id: 'man-verm',  s1: 'Manchester Boulevard',        s2: 'Vermont Avenue',              approx: [33.9591, -118.2921] },
  { id: 'flo-norm',  s1: 'Florence Avenue',             s2: 'Normandie Avenue',            approx: [33.9696, -118.3025] },
  { id: 'sla-cren',  s1: 'Slauson Avenue',              s2: 'Crenshaw Boulevard',          approx: [33.9796, -118.3388] },
  { id: 'jef-hov',   s1: 'Jefferson Boulevard',         s2: 'Hoover Street',               approx: [34.0268, -118.2844] },
  { id: 'labr-oly',  s1: 'La Brea Avenue',              s2: 'Olympic Boulevard',           approx: [34.0504, -118.3617] },
  { id: 'cahu-fnt',  s1: 'Cahuenga Boulevard',          s2: 'Fountain Avenue',             approx: [34.0876, -118.3286] },
]

function dist(a, b) {
  const dlat = a[0] - b[0], dlon = a[1] - b[1]
  return Math.sqrt(dlat * dlat + dlon * dlon)
}

async function geocodeStreet(name, lat, lon) {
  const url = `${BASE}/?q=${encodeURIComponent(name + ', Los Angeles, California')}&lat=${lat}&lon=${lon}&limit=5`
  const resp = await fetch(url, { headers: { 'User-Agent': 'inrix-demo-dev' } })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()

  // Filter to features in LA area and tagged as street/road
  const features = (data.features ?? []).filter(f => {
    const c = f.geometry.coordinates  // [lon, lat]
    return dist([c[1], c[0]], [lat, lon]) < 0.05  // within ~5km
  })
  if (!features.length) return null

  // Pick closest to approx
  const best = features.reduce((a, b) => {
    const ca = a.geometry.coordinates, cb = b.geometry.coordinates
    return dist([ca[1], ca[0]], [lat, lon]) < dist([cb[1], cb[0]], [lat, lon]) ? a : b
  })
  return [best.geometry.coordinates[1], best.geometry.coordinates[0]]  // [lat, lon]
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

console.log('Geocoding via Photon (photon.komoot.io)...\n')

const results = []
for (const entry of INTERSECTIONS) {
  try {
    const [p1, p2] = await Promise.all([
      geocodeStreet(entry.s1, ...entry.approx),
      geocodeStreet(entry.s2, ...entry.approx),
    ])

    if (p1 && p2) {
      const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
      const dm = (dist(mid, entry.approx) * 111000).toFixed(0)
      console.log(`✓ ${entry.id.padEnd(12)} [${mid[0].toFixed(6)}, ${mid[1].toFixed(6)}]  Δ${dm}m`)
      results.push({ id: entry.id, coord: mid })
    } else {
      console.log(`~ ${entry.id.padEnd(12)} partial (s1=${!!p1} s2=${!!p2}) → approx`)
      results.push({ id: entry.id, coord: entry.approx })
    }
  } catch (e) {
    console.error(`✗ ${entry.id}: ${e.message} → approx`)
    results.push({ id: entry.id, coord: entry.approx })
  }
  await sleep(300)
}

console.log('\n─── Updated positions for SignalAnalyticsView.tsx ────────────────────\n')
for (const { id, coord } of results) {
  console.log(`  position: [${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}],  // ${id}`)
}
