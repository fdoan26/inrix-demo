import { useState } from 'react'
import { Download, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { IntersectionMap } from './IntersectionMap'
import { IntersectionPanel } from './IntersectionPanel'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Intersection {
  name: string
  id: string
  pog: string
  totalCount: number
  throughCount: number
  stopCount: number
  splitCount: number
  splitPct: string
  controlAvg: string
  avg: string
  los: string
  losColor: string
  position: [number, number]
}

const INTERSECTIONS: Intersection[] = [
  // ── Original 10 — OSM traffic_signals calibrated ──────────────────────────
  { name: 'Wilshire Blvd & Western Ave',      id: 'wil-west',  pog: '72%', totalCount: 531, throughCount: 414, stopCount: 117, splitCount: 0, splitPct: '0%',    controlAvg: '6s',  avg: '18s', los: 'A', losColor: '#1b5e20', position: [34.058029, -118.309105] },
  { name: 'Hollywood Blvd & Highland Ave',    id: 'hwd-high',  pog: '46%', totalCount: 530, throughCount: 242, stopCount: 288, splitCount: 1, splitPct: '0.19%', controlAvg: '36s', avg: '51s', los: 'D', losColor: '#ff9800', position: [34.101545, -118.338718] },
  { name: 'Santa Monica Blvd & La Brea Ave',  id: 'sm-labrea', pog: '55%', totalCount: 528, throughCount: 289, stopCount: 239, splitCount: 0, splitPct: '0%',    controlAvg: '29s', avg: '43s', los: 'C', losColor: '#8bc34a', position: [34.083230, -118.361702] },
  { name: 'Sunset Blvd & Vine St',            id: 'sun-vine',  pog: '38%', totalCount: 528, throughCount: 201, stopCount: 327, splitCount: 3, splitPct: '0.57%', controlAvg: '28s', avg: '42s', los: 'D', losColor: '#ff9800', position: [34.097999, -118.326678] },
  { name: 'Venice Blvd & Lincoln Blvd',       id: 'ven-linc',  pog: '66%', totalCount: 527, throughCount: 350, stopCount: 177, splitCount: 0, splitPct: '0%',    controlAvg: '9s',  avg: '21s', los: 'B', losColor: '#4caf50', position: [34.000005, -118.448489] },
  { name: 'Olympic Blvd & Vermont Ave',       id: 'oly-verm',  pog: '43%', totalCount: 525, throughCount: 224, stopCount: 301, splitCount: 6, splitPct: '1.14%', controlAvg: '39s', avg: '57s', los: 'E', losColor: '#f44336', position: [34.052447, -118.291926] },
  { name: 'Pico Blvd & Fairfax Ave',          id: 'pico-fair', pog: '61%', totalCount: 524, throughCount: 318, stopCount: 206, splitCount: 1, splitPct: '0.19%', controlAvg: '15s', avg: '29s', los: 'B', losColor: '#4caf50', position: [34.035714, -118.361409] },
  { name: 'Melrose Ave & Highland Ave',       id: 'mel-high',  pog: '59%', totalCount: 523, throughCount: 307, stopCount: 216, splitCount: 0, splitPct: '0%',    controlAvg: '19s', avg: '33s', los: 'C', losColor: '#8bc34a', position: [34.083587, -118.338730] },
  { name: 'Crenshaw Blvd & MLK Jr Blvd',     id: 'cren-mlk',  pog: '56%', totalCount: 522, throughCount: 290, stopCount: 232, splitCount: 5, splitPct: '0.96%', controlAvg: '23s', avg: '37s', los: 'C', losColor: '#8bc34a', position: [33.991292, -118.338793] },
  { name: 'Figueroa St & Adams Blvd',         id: 'fig-adams', pog: '34%', totalCount: 519, throughCount: 178, stopCount: 341, splitCount: 2, splitPct: '0.38%', controlAvg: '44s', avg: '62s', los: 'F', losColor: '#b71c1c', position: [34.018435, -118.278391] },
  // ── 20 additional LA intersections ────────────────────────────────────────
  { name: 'Wilshire Blvd & Vermont Ave',      id: 'wil-verm',  pog: '58%', totalCount: 518, throughCount: 301, stopCount: 217, splitCount: 2, splitPct: '0.39%', controlAvg: '22s', avg: '36s', los: 'C', losColor: '#8bc34a', position: [34.062220, -118.292195] },
  { name: 'Wilshire Blvd & La Brea Ave',      id: 'wil-labr',  pog: '64%', totalCount: 516, throughCount: 329, stopCount: 187, splitCount: 0, splitPct: '0%',    controlAvg: '14s', avg: '28s', los: 'B', losColor: '#4caf50', position: [34.061828, -118.354533] },
  { name: 'Hollywood Blvd & Cahuenga Blvd',   id: 'hwd-cahu',  pog: '41%', totalCount: 515, throughCount: 211, stopCount: 304, splitCount: 4, splitPct: '0.78%', controlAvg: '38s', avg: '54s', los: 'D', losColor: '#ff9800', position: [34.101596, -118.326814] },
  { name: 'Beverly Blvd & Fairfax Ave',       id: 'bev-fair',  pog: '67%', totalCount: 513, throughCount: 343, stopCount: 170, splitCount: 0, splitPct: '0%',    controlAvg: '11s', avg: '24s', los: 'B', losColor: '#4caf50', position: [34.075839, -118.361428] },
  { name: 'La Cienega Blvd & Olympic Blvd',   id: 'lac-oly',   pog: '49%', totalCount: 511, throughCount: 250, stopCount: 261, splitCount: 3, splitPct: '0.59%', controlAvg: '31s', avg: '46s', los: 'D', losColor: '#ff9800', position: [34.046119, -118.372619] },
  { name: 'Sepulveda Blvd & Pico Blvd',       id: 'sep-pico',  pog: '53%', totalCount: 509, throughCount: 270, stopCount: 239, splitCount: 1, splitPct: '0.20%', controlAvg: '26s', avg: '40s', los: 'C', losColor: '#8bc34a', position: [34.032638, -118.439241] },
  { name: 'Sunset Blvd & La Brea Ave',        id: 'sun-labr',  pog: '44%', totalCount: 507, throughCount: 223, stopCount: 284, splitCount: 2, splitPct: '0.39%', controlAvg: '33s', avg: '49s', los: 'D', losColor: '#ff9800', position: [34.097344, -118.361701] },
  { name: 'Santa Monica Blvd & Sepulveda Blvd', id: 'sm-sep',  pog: '62%', totalCount: 505, throughCount: 313, stopCount: 192, splitCount: 0, splitPct: '0%',    controlAvg: '17s', avg: '31s', los: 'C', losColor: '#8bc34a', position: [34.079137, -118.439287] },
  { name: 'Wilshire Blvd & Westwood Blvd',    id: 'wil-wwd',   pog: '71%', totalCount: 503, throughCount: 358, stopCount: 145, splitCount: 0, splitPct: '0%',    controlAvg: '8s',  avg: '20s', los: 'A', losColor: '#1b5e20', position: [34.057638, -118.443887] },
  { name: 'Sunset Blvd & Highland Ave',       id: 'sun-high',  pog: '39%', totalCount: 501, throughCount: 195, stopCount: 306, splitCount: 7, splitPct: '1.40%', controlAvg: '41s', avg: '59s', los: 'E', losColor: '#f44336', position: [34.097661, -118.338766] },
  { name: 'Beverly Blvd & La Brea Ave',       id: 'bev-labr',  pog: '57%', totalCount: 498, throughCount: 284, stopCount: 214, splitCount: 1, splitPct: '0.20%', controlAvg: '24s', avg: '38s', los: 'C', losColor: '#8bc34a', position: [34.075839, -118.354533] },
  { name: 'Third St & La Brea Ave',           id: 'trd-labr',  pog: '65%', totalCount: 496, throughCount: 323, stopCount: 173, splitCount: 0, splitPct: '0%',    controlAvg: '13s', avg: '27s', los: 'B', losColor: '#4caf50', position: [34.068107, -118.354668] },
  { name: 'Wilshire Blvd & Doheny Dr',        id: 'wil-doh',   pog: '70%', totalCount: 493, throughCount: 346, stopCount: 147, splitCount: 0, splitPct: '0%',    controlAvg: '10s', avg: '22s', los: 'B', losColor: '#4caf50', position: [34.064417, -118.393827] },
  { name: 'Century Blvd & Sepulveda Blvd',    id: 'cen-sep',   pog: '36%', totalCount: 491, throughCount: 177, stopCount: 314, splitCount: 8, splitPct: '1.63%', controlAvg: '47s', avg: '65s', los: 'F', losColor: '#b71c1c', position: [33.945013, -118.389148] },
  { name: 'Manchester Ave & Vermont Ave',      id: 'man-verm',  pog: '52%', totalCount: 488, throughCount: 254, stopCount: 234, splitCount: 4, splitPct: '0.82%', controlAvg: '27s', avg: '42s', los: 'C', losColor: '#8bc34a', position: [33.958823, -118.292172] },
  { name: 'Florence Ave & Normandie Ave',      id: 'flo-norm',  pog: '48%', totalCount: 486, throughCount: 234, stopCount: 252, splitCount: 3, splitPct: '0.62%', controlAvg: '34s', avg: '50s', los: 'D', losColor: '#ff9800', position: [33.969639, -118.302467] },
  { name: 'Slauson Ave & Crenshaw Blvd',      id: 'sla-cren',  pog: '55%', totalCount: 483, throughCount: 266, stopCount: 217, splitCount: 2, splitPct: '0.41%', controlAvg: '21s', avg: '35s', los: 'C', losColor: '#8bc34a', position: [33.979529, -118.338814] },
  { name: 'Jefferson Blvd & Hoover St',       id: 'jef-hov',   pog: '63%', totalCount: 481, throughCount: 303, stopCount: 178, splitCount: 1, splitPct: '0.21%', controlAvg: '16s', avg: '30s', los: 'B', losColor: '#4caf50', position: [34.026819, -118.284339] },
  { name: 'La Brea Ave & Olympic Blvd',       id: 'labr-oly',  pog: '42%', totalCount: 479, throughCount: 202, stopCount: 277, splitCount: 5, splitPct: '1.04%', controlAvg: '37s', avg: '53s', los: 'D', losColor: '#ff9800', position: [34.050423, -118.354587] },
  { name: 'Cahuenga Blvd & Fountain Ave',     id: 'cahu-fnt',  pog: '69%', totalCount: 476, throughCount: 329, stopCount: 147, splitCount: 0, splitPct: '0%',    controlAvg: '12s', avg: '25s', los: 'B', losColor: '#4caf50', position: [34.087438, -118.328514] },
]

const COLUMNS = [
  { key: 'name',         label: 'Intersection',  width: 260 },
  { key: 'id',           label: 'ID',            width: 110 },
  { key: 'pog',          label: 'POG',           width: 56  },
  { key: 'totalCount',   label: 'Total Count',   width: 92  },
  { key: 'throughCount', label: 'Through Count', width: 100 },
  { key: 'stopCount',    label: 'Stop Count',    width: 84  },
  { key: 'splitCount',   label: 'Split Count',   width: 84  },
  { key: 'splitPct',     label: 'Split %',       width: 66  },
  { key: 'controlAvg',   label: 'Control Avg',   width: 88  },
  { key: 'avg',          label: 'Avg',           width: 56  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function SignalAnalyticsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedIx = selectedId ? INTERSECTIONS.find((i) => i.id === selectedId) ?? null : null

  return (
    // Outer row: left content column + right panel
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* ── Left column: sub-header + table + map ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Sub-header */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #d0d7e2',
          padding: '0 16px', height: 44, minHeight: 44,
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a2744', whiteSpace: 'nowrap' }}>
            Intersection_Performance_Reports_INRIX-Inc_{new Date().toISOString().slice(0, 10)}
          </span>
          <span style={{ fontSize: 11, color: '#8a9ab8', borderLeft: '1px solid #d0d7e2', paddingLeft: 12, whiteSpace: 'nowrap' }}>
            {new Date().toISOString().slice(0, 10)}
          </span>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: '#2c3e5a', background: '#f4f6fa',
            border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <span style={{ color: '#8a9ab8', marginRight: 2 }}>Time Range Display</span>
            24 Hours
            <ChevronDown size={11} style={{ color: '#8a9ab8' }} />
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 8px',
            background: '#fff', flex: 1, maxWidth: 180,
          }}>
            <span style={{ fontSize: 10, color: '#aab4c8' }}>Filter</span>
            <input
              placeholder="Enter Keyword"
              style={{ border: 'none', outline: 'none', fontSize: 11, color: '#2c3e5a', background: 'transparent', flex: 1 }}
            />
          </div>

          <div style={{ flex: 1 }} />

          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: '#2c3e5a', background: 'none',
            border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <SlidersHorizontal size={12} />
            Edit Columns
          </button>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: '#2c3e5a', background: 'none',
            border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 10px', cursor: 'pointer',
          }}>
            <Download size={12} />
            Download
          </button>
        </div>

        {/* Table */}
        <div style={{ flex: '0 0 52%', overflow: 'auto', background: '#fff', borderBottom: '1px solid #d0d7e2' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f7f9fc', borderBottom: '1px solid #d0d7e2', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={{ width: 36, padding: '8px 10px', textAlign: 'center', color: '#8a9ab8', fontWeight: 500 }} />
                {COLUMNS.map((col) => (
                  <th key={col.key} style={{
                    width: col.width, minWidth: col.width,
                    padding: '8px 10px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: '#5a6a88',
                    whiteSpace: 'nowrap', borderRight: '1px solid #edf0f7',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {col.label}
                    {col.key === 'totalCount' && <span style={{ marginLeft: 4, color: '#1a56db' }}>▼</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INTERSECTIONS.map((row) => {
                const isSelected = selectedId === row.id
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedId(isSelected ? null : row.id)}
                    style={{
                      background: isSelected ? '#eaf0fb' : 'transparent',
                      borderBottom: '1px solid #edf0f7',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#1a56db' : '#c0ccd8'}`,
                        background: isSelected ? '#1a56db' : 'transparent',
                        margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </td>
                    {COLUMNS.map((col) => {
                      const val = row[col.key as keyof Intersection]
                      return (
                        <td key={col.key} style={{
                          padding: '7px 10px',
                          color: col.key === 'name' ? '#1a2744' : '#3a4e6a',
                          fontWeight: col.key === 'name' ? 500 : 400,
                          whiteSpace: 'nowrap',
                          borderRight: '1px solid #edf0f7',
                        }}>
                          {col.key === 'controlAvg' ? (
                            <span style={{
                              background: row.losColor + '22',
                              color: row.losColor,
                              fontWeight: 600, padding: '1px 6px', borderRadius: 3, fontSize: 11,
                            }}>{val as string}</span>
                          ) : String(val)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          <div style={{
            position: 'absolute', top: 10, left: 10, zIndex: 1000,
            background: 'rgba(255,255,255,0.95)', border: '1px solid #d0d7e2',
            borderRadius: 4, padding: '4px 10px', fontSize: 11, color: '#2c3e5a',
            display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}>
            Map Display <ChevronDown size={11} />
          </div>
          <IntersectionMap intersections={INTERSECTIONS} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {/* ── Right panel — full height ── */}
      {selectedIx && (
        <IntersectionPanel
          intersection={selectedIx}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
