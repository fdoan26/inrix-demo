import { useState } from 'react'
import { Download, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { IntersectionMap } from './IntersectionMap'

// ─── Mock LA intersection data ─────────────────────────────────────────────

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
  { name: 'Wilshire Blvd & Western Ave',              id: '34.0636,-118.3097', pog: '72%', totalCount: 531, throughCount: 414, stopCount: 117, splitCount: 0, splitPct: '0%',    controlAvg: '6s',  avg: '18s', los: 'A', losColor: '#1b5e20', position: [34.0636, -118.3097] },
  { name: 'Hollywood Blvd & Highland Ave',            id: '34.1019,-118.3388', pog: '46%', totalCount: 530, throughCount: 242, stopCount: 288, splitCount: 1, splitPct: '0.19%', controlAvg: '36s', avg: '51s', los: 'D', losColor: '#ff9800', position: [34.1019, -118.3388] },
  { name: 'Santa Monica Blvd & La Brea Ave',          id: '34.0835,-118.3403', pog: '55%', totalCount: 528, throughCount: 289, stopCount: 239, splitCount: 0, splitPct: '0%',    controlAvg: '29s', avg: '43s', los: 'C', losColor: '#8bc34a', position: [34.0835, -118.3403] },
  { name: 'Sunset Blvd & Vine St',                    id: '34.0983,-118.3267', pog: '38%', totalCount: 528, throughCount: 201, stopCount: 327, splitCount: 3, splitPct: '0.57%', controlAvg: '28s', avg: '42s', los: 'D', losColor: '#ff9800', position: [34.0983, -118.3267] },
  { name: 'Venice Blvd & Lincoln Blvd',               id: '33.9999,-118.4494', pog: '66%', totalCount: 527, throughCount: 350, stopCount: 177, splitCount: 0, splitPct: '0%',    controlAvg: '9s',  avg: '21s', los: 'B', losColor: '#4caf50', position: [33.9999, -118.4494] },
  { name: 'Olympic Blvd & Vermont Ave',               id: '34.0521,-118.2917', pog: '43%', totalCount: 525, throughCount: 224, stopCount: 301, splitCount: 6, splitPct: '1.14%', controlAvg: '39s', avg: '57s', los: 'E', losColor: '#f44336', position: [34.0521, -118.2917] },
  { name: 'Pico Blvd & Fairfax Ave',                  id: '34.0358,-118.3613', pog: '61%', totalCount: 524, throughCount: 318, stopCount: 206, splitCount: 1, splitPct: '0.19%', controlAvg: '15s', avg: '29s', los: 'B', losColor: '#4caf50', position: [34.0358, -118.3613] },
  { name: 'Melrose Ave & Highland Ave',               id: '34.0838,-118.3388', pog: '59%', totalCount: 523, throughCount: 307, stopCount: 216, splitCount: 0, splitPct: '0%',    controlAvg: '19s', avg: '33s', los: 'C', losColor: '#8bc34a', position: [34.0838, -118.3388] },
  { name: 'Crenshaw Blvd & MLK Jr Blvd',             id: '33.9919,-118.3387', pog: '56%', totalCount: 522, throughCount: 290, stopCount: 232, splitCount: 5, splitPct: '0.96%', controlAvg: '23s', avg: '37s', los: 'C', losColor: '#8bc34a', position: [33.9919, -118.3387] },
  { name: 'Figueroa St & Adams Blvd',                 id: '34.0183,-118.2783', pog: '34%', totalCount: 519, throughCount: 178, stopCount: 341, splitCount: 2, splitPct: '0.38%', controlAvg: '44s', avg: '62s', los: 'F', losColor: '#b71c1c', position: [34.0183, -118.2783] },
]

const COLUMNS = [
  { key: 'name',         label: 'Intersection',   width: 280 },
  { key: 'id',           label: 'ID',             width: 160 },
  { key: 'pog',          label: 'POG',            width: 64  },
  { key: 'totalCount',   label: 'Total Count',    width: 96  },
  { key: 'throughCount', label: 'Through Count',  width: 104 },
  { key: 'stopCount',    label: 'Stop Count',     width: 88  },
  { key: 'splitCount',   label: 'Split Count',    width: 88  },
  { key: 'splitPct',     label: 'Split %',        width: 72  },
  { key: 'controlAvg',   label: 'Control Avg',    width: 88  },
  { key: 'avg',          label: 'Avg',            width: 64  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function SignalAnalyticsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f0f2f5' }}>

      {/* ── Sub-header ── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #d0d7e2',
        padding: '0 16px', height: 44, minHeight: 44,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#1a2744', whiteSpace: 'nowrap' }}>
          Intersection_Performance_Report_LA_{new Date().toISOString().slice(0, 10)}
        </span>
        <span style={{ fontSize: 11, color: '#8a9ab8', borderLeft: '1px solid #d0d7e2', paddingLeft: 12 }}>
          {new Date().toISOString().slice(0, 10)}
        </span>

        {/* Time Range */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: '#2c3e5a', background: '#f4f6fa',
          border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 8px', cursor: 'pointer',
        }}>
          <span style={{ color: '#8a9ab8', marginRight: 2 }}>Time Range Display</span>
          24 Hours
          <ChevronDown size={11} style={{ color: '#8a9ab8' }} />
        </button>

        {/* Filter */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 8px',
          background: '#fff', flex: 1, maxWidth: 200,
        }}>
          <span style={{ fontSize: 10, color: '#aab4c8' }}>Filter</span>
          <input
            placeholder="Enter Keyword"
            style={{ border: 'none', outline: 'none', fontSize: 11, color: '#2c3e5a', background: 'transparent', flex: 1 }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Edit Columns */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, color: '#2c3e5a', background: 'none',
          border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 10px', cursor: 'pointer',
        }}>
          <SlidersHorizontal size={12} />
          Edit Columns
        </button>

        {/* Download */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, color: '#2c3e5a', background: 'none',
          border: '1px solid #d0d7e2', borderRadius: 4, padding: '3px 10px', cursor: 'pointer',
        }}>
          <Download size={12} />
          Download
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: '0 0 55%', overflow: 'auto', background: '#fff', borderBottom: '1px solid #d0d7e2' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f7f9fc', borderBottom: '1px solid #d0d7e2', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={{ width: 36, padding: '8px 10px', textAlign: 'center', color: '#8a9ab8', fontWeight: 500 }} />
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width, minWidth: col.width,
                    padding: '8px 10px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: '#5a6a88',
                    whiteSpace: 'nowrap', borderRight: '1px solid #edf0f7',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}
                >
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
                  {/* Radio */}
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

                  {/* Data cells */}
                  {COLUMNS.map((col) => {
                    const val = row[col.key as keyof Intersection]
                    return (
                      <td
                        key={col.key}
                        style={{
                          padding: '7px 10px',
                          color: col.key === 'name' ? '#1a2744' : '#3a4e6a',
                          fontWeight: col.key === 'name' ? 500 : 400,
                          whiteSpace: 'nowrap',
                          borderRight: '1px solid #edf0f7',
                        }}
                      >
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

      {/* ── Map ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        {/* Map Display label */}
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
  )
}
