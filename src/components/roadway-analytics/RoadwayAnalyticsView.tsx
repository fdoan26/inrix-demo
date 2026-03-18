import { useState, useEffect } from 'react'
import { Download, ChevronDown, ChevronLeft, ChevronRight, BarChart2, AlignJustify, Minimize2 } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet'
import { loadLARoads, type OsmWay } from '../../lib/overpassLoader'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Bottleneck {
  id: string
  roadName: string
  intersection: string
  direction: string
  impactFactor: number
  occurrences: number
  avgMaxDuration: number
  avgMaxLength: number
  center: [number, number]
  /** Digits-only route number to match against OSM tags.ref (e.g. '405', '101', '2') */
  routeNum: string
  /** Search radius in degrees around center (~km) */
  corridorRadius: number
}

const BOTTLENECKS: Bottleneck[] = [
  { id: 'b01', roadName: 'US-101 / N HIGHWAY 101',          intersection: 'Van Ness Ave',                           direction: 'S', impactFactor: 45680, occurrences: 15, avgMaxDuration: 415, avgMaxLength: 7.34, center: [34.0665, -118.3270], routeNum: '101', corridorRadius: 0.035 },
  { id: 'b02', roadName: 'I-405 / SAN DIEGO FWY',           intersection: 'Wilshire Blvd / Santa Monica',           direction: 'N', impactFactor: 43129, occurrences: 20, avgMaxDuration: 262, avgMaxLength: 8.24, center: [34.0580, -118.4430], routeNum: '405', corridorRadius: 0.040 },
  { id: 'b03', roadName: 'I-10 / SANTA MONICA FWY',         intersection: 'La Cienega Blvd / Robertson',            direction: 'W', impactFactor: 38016, occurrences: 34, avgMaxDuration: 162, avgMaxLength: 6.92, center: [34.0502, -118.3839], routeNum: '10',  corridorRadius: 0.035 },
  { id: 'b04', roadName: 'CA-110 / HARBOR FWY',             intersection: 'Adams Blvd / Exposition',                direction: 'S', impactFactor: 34800, occurrences: 41, avgMaxDuration:  89, avgMaxLength: 9.56, center: [34.0183, -118.2784], routeNum: '110', corridorRadius: 0.035 },
  { id: 'b05', roadName: 'I-405 / SAN DIEGO FWY',           intersection: 'Century Blvd / LAX Interchange',         direction: 'S', impactFactor: 30262, occurrences: 74, avgMaxDuration:  55, avgMaxLength: 7.45, center: [33.9451, -118.3892], routeNum: '405', corridorRadius: 0.040 },
  { id: 'b06', roadName: 'US-101 / VENTURA FWY',            intersection: 'Cahuenga Blvd / Highland Ave',           direction: 'E', impactFactor: 28910, occurrences: 31, avgMaxDuration: 198, avgMaxLength: 5.87, center: [34.1016, -118.3388], routeNum: '101', corridorRadius: 0.035 },
  { id: 'b07', roadName: 'I-10 / SAN BERNARDINO FWY',       intersection: 'Vermont Ave / Normandie Ave',            direction: 'E', impactFactor: 26540, occurrences: 56, avgMaxDuration:  71, avgMaxLength: 6.13, center: [34.0530, -118.2920], routeNum: '10',  corridorRadius: 0.035 },
  { id: 'b08', roadName: 'CA-2 / GLENDALE FWY',             intersection: 'San Fernando Rd / Verdugo',              direction: 'N', impactFactor: 23180, occurrences: 28, avgMaxDuration: 134, avgMaxLength: 4.98, center: [34.1200, -118.2400], routeNum: '2',   corridorRadius: 0.040 },
  { id: 'b09', roadName: 'I-105 / CENTURY FWY',             intersection: 'Sepulveda Blvd / Aviation',              direction: 'W', impactFactor: 21470, occurrences: 62, avgMaxDuration:  48, avgMaxLength: 8.71, center: [33.9503, -118.3975], routeNum: '105', corridorRadius: 0.035 },
  { id: 'b10', roadName: 'CA-60 / POMONA FWY',              intersection: 'Atlantic Blvd / Garfield Ave',           direction: 'E', impactFactor: 19830, occurrences: 19, avgMaxDuration: 221, avgMaxLength: 5.32, center: [34.0600, -118.1680], routeNum: '60',  corridorRadius: 0.040 },
  { id: 'b11', roadName: 'US-101 / HOLLYWOOD FWY',          intersection: 'Vine St / Hollywood Blvd',               direction: 'S', impactFactor: 18200, occurrences: 47, avgMaxDuration:  82, avgMaxLength: 6.80, center: [34.0981, -118.3267], routeNum: '101', corridorRadius: 0.030 },
  { id: 'b12', roadName: 'I-405 / SAN DIEGO FWY',           intersection: 'Getty Center Dr / Mulholland',           direction: 'N', impactFactor: 16950, occurrences: 23, avgMaxDuration: 178, avgMaxLength: 7.12, center: [34.0783, -118.4750], routeNum: '405', corridorRadius: 0.035 },
  { id: 'b13', roadName: 'CA-110 / PASADENA FWY',           intersection: 'Mission St / Ave 26',                    direction: 'N', impactFactor: 15340, occurrences: 37, avgMaxDuration:  93, avgMaxLength: 4.54, center: [34.0700, -118.2200], routeNum: '110', corridorRadius: 0.035 },
  { id: 'b14', roadName: 'I-10 / SANTA MONICA FWY',         intersection: 'Lincoln Blvd / 26th St',                 direction: 'E', impactFactor: 13780, occurrences: 58, avgMaxDuration:  61, avgMaxLength: 5.99, center: [34.0060, -118.4700], routeNum: '10',  corridorRadius: 0.035 },
  { id: 'b15', roadName: 'US-101 / VENTURA FWY',            intersection: 'Woodman Ave / Van Nuys',                 direction: 'W', impactFactor: 12100, occurrences: 14, avgMaxDuration: 302, avgMaxLength: 3.88, center: [34.1750, -118.4480], routeNum: '101', corridorRadius: 0.040 },
]

// ─── Road geometry helpers ─────────────────────────────────────────────────────

/**
 * Find OSM ways that belong to the given route and pass near the center point.
 * Matches by stripping non-digits from each semicolon-delimited ref part.
 */
function getCorridorWays(allRoads: OsmWay[], b: Bottleneck): OsmWay[] {
  const [clat, clon] = b.center
  const r = b.corridorRadius

  return allRoads.filter((way) => {
    // Must be a motorway (freeway) or trunk
    const hw = way.tags.highway ?? ''
    if (!hw.startsWith('motorway') && !hw.startsWith('trunk')) return false

    // Ref must match the route number
    const ref = way.tags.ref ?? ''
    const refParts = ref.split(';').map((p) => p.replace(/\D/g, ''))
    if (!refParts.includes(b.routeNum)) return false

    // At least one node must be within the search radius
    return way.geometry.some(
      (n) => Math.abs(n.lat - clat) < r && Math.abs(n.lon - clon) < r
    )
  })
}

/**
 * Pick up to `count` evenly-spaced nodes from the combined corridor geometry
 * to use as incident marker positions.
 */
function getIncidentPositions(
  ways: OsmWay[],
  count: number,
  center: [number, number],
  radius: number
): [number, number][] {
  // Collect all nodes within radius, deduplicated
  const seen = new Set<string>()
  const nodes: [number, number][] = []
  for (const way of ways) {
    for (const n of way.geometry) {
      if (Math.abs(n.lat - center[0]) < radius * 0.7 && Math.abs(n.lon - center[1]) < radius * 0.7) {
        const key = `${n.lat.toFixed(5)},${n.lon.toFixed(5)}`
        if (!seen.has(key)) { seen.add(key); nodes.push([n.lat, n.lon]) }
      }
    }
  }
  if (nodes.length === 0) return []
  // Pick evenly spaced
  const step = Math.max(1, Math.floor(nodes.length / count))
  return Array.from({ length: Math.min(count, nodes.length) }, (_, i) => nodes[i * step])
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

function generateHeatmap(seed: number): number[][] {
  return Array.from({ length: 5 }, (_, d) =>
    Array.from({ length: 24 }, (_, h) => {
      const amPeak = h >= 7 && h <= 9 ? 0.7 + 0.3 * Math.sin((h - 7) * Math.PI / 2) : 0
      const pmPeak = h >= 16 && h <= 19 ? 0.6 + 0.4 * Math.sin((h - 16) * Math.PI / 3) : 0
      const noise = Math.sin(seed * 13 + d * 7 + h * 3) * 0.15
      return Math.max(0, Math.min(1, Math.max(amPeak, pmPeak) + noise))
    })
  )
}

function heatColor(v: number): string {
  if (v < 0.05) return '#e8f5e9'
  if (v < 0.3)  return '#4caf50'
  if (v < 0.6)  return '#ff9800'
  return '#f44336'
}

// ─── Inline bar ───────────────────────────────────────────────────────────────

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, color: '#1a2744' }}>{value.toLocaleString()}</span>
      <div style={{ height: 4, width: 80, background: '#e8edf4', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'performance' | 'bottlenecks'

const PAGE_SIZE = 5
const DATES = Array.from({ length: 5 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (4 - i))
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
})

export function RoadwayAnalyticsView() {
  const [tab, setTab]               = useState<Tab>('bottlenecks')
  const [page, setPage]             = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>('b05')
  const [allRoads, setAllRoads]     = useState<OsmWay[]>([])

  useEffect(() => {
    loadLARoads().then(setAllRoads).catch(() => {})
  }, [])

  const totalPages    = Math.ceil(BOTTLENECKS.length / PAGE_SIZE)
  const pageRows      = BOTTLENECKS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  const selected      = BOTTLENECKS.find((b) => b.id === selectedId) ?? null
  const heatmap       = selected ? generateHeatmap(BOTTLENECKS.findIndex((b) => b.id === selected.id)) : null

  const maxImpact   = Math.max(...BOTTLENECKS.map((b) => b.impactFactor))
  const maxOcc      = Math.max(...BOTTLENECKS.map((b) => b.occurrences))
  const maxDuration = Math.max(...BOTTLENECKS.map((b) => b.avgMaxDuration))
  const maxLength   = Math.max(...BOTTLENECKS.map((b) => b.avgMaxLength))

  // Derived corridor geometry for selected bottleneck
  const corridorWays     = selected ? getCorridorWays(allRoads, selected) : []
  const incidentPositions = selected
    ? getIncidentPositions(corridorWays, 5, selected.center, selected.corridorRadius)
    : []

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f9fc' }}>

      {/* ── Top tab bar ── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #d0d7e2',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        height: 44, minHeight: 44, flexShrink: 0, gap: 24,
      }}>
        {(['overview', 'performance', 'bottlenecks'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#1a56db' : '#5a6a88',
              borderBottom: tab === t ? '2px solid #1a56db' : '2px solid transparent',
              padding: '0 2px', height: 44, whiteSpace: 'nowrap',
            }}
          >
            {t === 'overview' ? 'Overview' : t === 'performance' ? 'Performance Charts' : 'Bottlenecks'}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#1a56db', color: '#fff', border: 'none', borderRadius: 4,
          padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <Download size={13} />
          Data Downloader
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>

        {tab === 'bottlenecks' && (
          <>
            {/* Study header + table */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a2744', marginBottom: 10 }}>
                Bottleneck Location for &ldquo;LA Metro Bottleneck Study&rdquo;: {DATES[0]} – {DATES[4]}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744', marginBottom: 8 }}>Summary Table</div>

              <div style={{ background: '#fff', border: '1px solid #d0d7e2', borderRadius: 4, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f7f9fc', borderBottom: '1px solid #d0d7e2' }}>
                      {[
                        { label: 'Road Name',              width: 220 },
                        { label: 'Intersection',           width: 240 },
                        { label: 'Direction',              width: 80  },
                        { label: 'Impact Factor',          width: 130 },
                        { label: 'Occurrences',            width: 110 },
                        { label: 'Avg Max Duration (min)', width: 150 },
                        { label: 'Average Max Length (km)',width: 160 },
                      ].map((col) => (
                        <th key={col.label} style={{
                          width: col.width, minWidth: col.width,
                          padding: '8px 12px', textAlign: 'left',
                          fontSize: 11, fontWeight: 600, color: '#5a6a88',
                          whiteSpace: 'nowrap', borderRight: '1px solid #edf0f7',
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>
                          {col.label} <span style={{ color: '#b0bcc8', fontSize: 9 }}>↕</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => {
                      const isSel = selectedId === row.id
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(isSel ? null : row.id)}
                          style={{ background: isSel ? '#eaf0fb' : 'transparent', borderBottom: '1px solid #edf0f7', cursor: 'pointer' }}
                        >
                          <td style={{ padding: '8px 12px', color: '#1a2744', fontWeight: 500, whiteSpace: 'nowrap', borderRight: '1px solid #edf0f7', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row.roadName}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#3a4e6a', borderRight: '1px solid #edf0f7', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.intersection}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#3a4e6a', borderRight: '1px solid #edf0f7', textAlign: 'center' }}>
                            {row.direction}
                          </td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #edf0f7' }}>
                            <Bar value={row.impactFactor} max={maxImpact} color='#8b1a1a' />
                          </td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #edf0f7' }}>
                            <Bar value={row.occurrences} max={maxOcc} color='#c2310a' />
                          </td>
                          <td style={{ padding: '8px 12px', borderRight: '1px solid #edf0f7' }}>
                            <Bar value={row.avgMaxDuration} max={maxDuration} color='#e67e22' />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <Bar value={row.avgMaxLength} max={maxLength} color='#1a56db' />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderTop: '1px solid #edf0f7',
                  fontSize: 11, color: '#5a6a88',
                }}>
                  <span>
                    {page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, BOTTLENECKS.length)} of {BOTTLENECKS.length} Entries
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Show items</span>
                    <select style={{ fontSize: 11, border: '1px solid #d0d7e2', borderRadius: 3, padding: '1px 4px', color: '#2c3e5a' }}>
                      <option>5</option>
                    </select>
                    <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                      style={{ background: 'none', border: '1px solid #d0d7e2', borderRadius: 3, padding: '2px 6px', cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}>
                      <ChevronLeft size={11} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)}
                        style={{ background: page === i ? '#1a56db' : 'none', color: page === i ? '#fff' : '#5a6a88', border: '1px solid #d0d7e2', borderRadius: 3, padding: '2px 7px', fontSize: 11, cursor: 'pointer' }}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                      style={{ background: 'none', border: '1px solid #d0d7e2', borderRadius: 3, padding: '2px 6px', cursor: page === totalPages - 1 ? 'default' : 'pointer', opacity: page === totalPages - 1 ? 0.4 : 1 }}>
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Detail: map + heatmap ── */}
            {selected && heatmap && (
              <div style={{ display: 'flex', gap: 16, height: 360, flexShrink: 0 }}>

                {/* Map */}
                <div style={{ flex: '0 0 45%', background: '#fff', border: '1px solid #d0d7e2', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    padding: '8px 12px', borderBottom: '1px solid #edf0f7',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, fontWeight: 600, color: '#1a2744', flexShrink: 0,
                  }}>
                    <span>{selected.roadName.split('/')[0].trim()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#5a6a88', fontWeight: 400 }}>Incidents:</span>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        All Selected (9) <ChevronDown size={11} />
                      </button>
                    </div>
                  </div>

                  <div style={{ flex: 1, minHeight: 0 }}>
                    <MapContainer
                      key={selected.id}
                      center={selected.center}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={true}
                      attributionControl={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        subdomains="abcd"
                        maxZoom={19}
                      />

                      {/* Real road geometry from la-roads.json — each OSM way is a separate polyline */}
                      {corridorWays.map((way) => (
                        <Polyline
                          key={way.id}
                          positions={way.geometry.map((n) => [n.lat, n.lon] as [number, number])}
                          pathOptions={{ color: '#e53935', weight: 5, opacity: 0.85 }}
                          interactive={false}
                        />
                      ))}

                      {/* Incident markers placed at actual road nodes */}
                      {incidentPositions.map((pos, i) => (
                        <CircleMarker
                          key={i}
                          center={pos}
                          radius={7}
                          pathOptions={{
                            fillColor: i % 2 === 0 ? '#e53935' : '#ff9800',
                            fillOpacity: 0.9,
                            color: '#fff',
                            weight: 1.5,
                          }}
                        />
                      ))}
                    </MapContainer>
                  </div>
                </div>

                {/* Occurrences heatmap */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #d0d7e2', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                  {/* Header row */}
                  <div style={{
                    padding: '6px 10px', borderBottom: '1px solid #edf0f7', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>Occurrences</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {/* Bar chart – active */}
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: '#1a56db', border: 'none', borderRadius: 3, cursor: 'pointer', color: '#fff' }}>
                        <BarChart2 size={12} />
                      </button>
                      {/* Table view */}
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: 'none', border: '1px solid #d0d7e2', borderRadius: 3, cursor: 'pointer', color: '#8a9ab8' }}>
                        <AlignJustify size={12} />
                      </button>
                      {/* Minimize */}
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: 'none', border: '1px solid #d0d7e2', borderRadius: 3, cursor: 'pointer', color: '#8a9ab8' }}>
                        <Minimize2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Chart body */}
                  <div style={{ flex: 1, padding: '8px 10px 6px 10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

                    {/* "Time" label centered above grid */}
                    <div style={{ fontSize: 10, color: '#5a6a88', textAlign: 'center', marginBottom: 3, marginLeft: 52 }}>Time</div>

                    {/* Hour tick labels — one per column, left-aligned at column start */}
                    <div style={{ display: 'flex', marginLeft: 52, marginBottom: 0 }}>
                      {Array.from({ length: 25 }, (_, h) => (
                        <div key={h} style={{
                          flex: h < 24 ? 1 : 0,
                          minWidth: h < 24 ? 0 : 'auto',
                          fontSize: 8,
                          color: '#8a9ab8',
                          textAlign: 'left',
                          paddingLeft: 1,
                          whiteSpace: 'nowrap',
                        }}>
                          {String(h % 24).padStart(2, '0')}
                        </div>
                      ))}
                    </div>

                    {/* Main grid area: [Date vertical label] [date labels] [cells] */}
                    <div style={{ flex: 1, display: 'flex', minHeight: 0, marginTop: 1 }}>

                      {/* "Date" rotated label */}
                      <div style={{ width: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: '#5a6a88', transform: 'rotate(-90deg)', whiteSpace: 'nowrap', display: 'block' }}>Date</span>
                      </div>

                      {/* Date row labels */}
                      <div style={{ width: 36, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                        {DATES.map((d) => (
                          <div key={d} style={{
                            flex: 1, display: 'flex', alignItems: 'flex-end',
                            justifyContent: 'flex-end', paddingRight: 4, paddingBottom: 2,
                            fontSize: 9, color: '#5a6a88',
                          }}>
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Heatmap grid with border + grid lines */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #c8d0de', overflow: 'hidden' }}>
                        {heatmap.map((row, di) => (
                          <div key={di} style={{
                            flex: 1, display: 'flex',
                            borderBottom: di < heatmap.length - 1 ? '1px solid #dce3ee' : 'none',
                          }}>
                            {row.map((v, hi) => (
                              <div
                                key={hi}
                                title={`${DATES[di]} ${String(hi).padStart(2, '0')}:00`}
                                style={{
                                  flex: 1,
                                  background: v < 0.04 ? '#fff' : heatColor(v),
                                  borderRight: hi < row.length - 1 ? '1px solid #dce3ee' : 'none',
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gradient legend bar */}
                    <div style={{ marginLeft: 52, marginTop: 6 }}>
                      <div style={{
                        height: 8, borderRadius: 3,
                        background: 'linear-gradient(to right, #4caf50 0%, #ff9800 45%, #c62828 100%)',
                      }} />
                      {/* Tick labels */}
                      <div style={{ position: 'relative', height: 14, marginTop: 1 }}>
                        {[{ val: '0', pct: 0 }, { val: '3.3', pct: 25 }, { val: '8', pct: 62 }, { val: '13', pct: 100 }].map(({ val, pct }) => (
                          <span key={val} style={{
                            position: 'absolute',
                            left: `${pct}%`,
                            transform: pct === 100 ? 'translateX(-100%)' : pct > 0 ? 'translateX(-50%)' : 'none',
                            fontSize: 9, color: '#8a9ab8',
                          }}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {(tab === 'overview' || tab === 'performance') && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#8a9ab8' }}>
            {tab === 'overview' ? 'Overview' : 'Performance Charts'} — select Bottlenecks tab to explore data
          </div>
        )}

      </div>
    </div>
  )
}
