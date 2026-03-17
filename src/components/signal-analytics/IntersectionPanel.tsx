import { useState } from 'react'
import { X } from 'lucide-react'

interface Intersection {
  name: string
  id: string
  totalCount: number
  controlAvg: string
  losColor: string
  los: string
  throughCount: number
  stopCount: number
  splitCount: number
}

interface Props {
  intersection: Intersection
  onClose: () => void
}

const LOS_COLORS: Record<string, string> = {
  A: '#1b5e20', B: '#4caf50', C: '#8bc34a', D: '#ff9800', E: '#f44336', F: '#b71c1c',
}
const GRADES = ['A', 'B', 'C', 'D', 'E', 'F']

function delayToColor(secs: number) {
  if (secs <= 10) return LOS_COLORS.A
  if (secs <= 20) return LOS_COLORS.B
  if (secs <= 35) return LOS_COLORS.C
  if (secs <= 55) return LOS_COLORS.D
  if (secs <= 80) return LOS_COLORS.E
  return LOS_COLORS.F
}

function getMovements(intersection: Intersection) {
  const base = parseInt(intersection.controlAvg) || 20
  const tot = intersection.totalCount
  const v = (tot % 31) / 31  // deterministic 0..1 variation

  const wbDelays = [Math.round(base * 1.45), Math.round(base * 1.1), Math.round(base * 0.22)]
  const ebDelays = [Math.round(base * 0.42), Math.round(base * 1.2), Math.round(base * 1.18)]

  return {
    wb: [
      { count: Math.round(tot * (0.065 + v * 0.02)), delay: wbDelays[0], trend: 'up' as const },
      { count: Math.round(tot * (0.175 + v * 0.025)), delay: wbDelays[1], trend: 'up' as const },
      { count: Math.round(tot * (0.045 + v * 0.015)), delay: wbDelays[2], trend: 'down' as const },
    ],
    eb: [
      { count: Math.round(tot * (0.042 + v * 0.018)), delay: ebDelays[0] },
      { count: Math.round(tot * (0.095 + v * 0.02)), delay: ebDelays[1] },
      { count: Math.round(tot * (0.038 + v * 0.012)), delay: ebDelays[2] },
    ],
    nb: [
      { count: Math.round(tot * (0.05 + v * 0.015)), delay: Math.round(base * 0.9) },
      { count: Math.round(tot * (0.13 + v * 0.02)), delay: Math.round(base * 0.8) },
      { count: Math.round(tot * (0.04 + v * 0.01)), delay: Math.round(base * 0.5) },
    ],
    sb: [
      { count: Math.round(tot * (0.048 + v * 0.012)), delay: Math.round(base * 1.1) },
      { count: Math.round(tot * (0.12 + v * 0.02)), delay: Math.round(base * 0.95) },
      { count: Math.round(tot * (0.035 + v * 0.01)), delay: Math.round(base * 0.3) },
    ],
  }
}

// ─── LOS distribution for bar chart ──────────────────────────────────────────
function losBarWidths(los: string, tot: number) {
  const idx = GRADES.indexOf(los)
  const base = [0, 0, 0, 0, 0, 0]
  base[idx] = 65
  if (idx > 0) base[idx - 1] = 22
  if (idx > 1) base[idx - 2] = 10
  if (idx < 5) base[idx + 1] = 18
  if (idx < 4) base[idx + 2] = 8
  if (idx < 3) base[idx + 3] = 4

  const counts = base.map(w => Math.round(tot * w / 100 * (0.9 + (idx % 3) * 0.05)))
  return GRADES.map((g, i) => ({ grade: g, pct: base[i], count: counts[i] }))
}

// ─── Intersection SVG diagram ─────────────────────────────────────────────────
function IntersectionDiagram({ intersection, moves }: {
  intersection: Intersection
  moves: ReturnType<typeof getMovements>
}) {
  const lc = intersection.losColor

  // Approach LOS colors per arm (NB/SB use intersection LOS; WB/EB derived from movement delays)
  const wbColor = delayToColor(moves.wb[1].delay)
  const ebColor = delayToColor(moves.eb[1].delay)
  const nbColor = delayToColor(moves.nb[1].delay)
  const sbColor = delayToColor(moves.sb[1].delay)

  // Lane colors: LT, TH, RT per approach
  const wbLane = moves.wb.map(m => delayToColor(m.delay))
  const ebLane = moves.eb.map(m => delayToColor(m.delay))

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
      {/* Road surface */}
      <rect x="57" y="0"   width="26" height="140" fill="#dde1ea" />
      <rect x="0"  y="57"  width="140" height="26" fill="#dde1ea" />

      {/* NB arm lanes (LT, TH, RT going upward) */}
      <rect x="57" y="2"  width="8" height="52" fill={wbLane[0]} opacity="0.85" rx="1" />
      <rect x="66" y="2"  width="8" height="52" fill={nbColor}   opacity="0.85" rx="1" />
      <rect x="75" y="2"  width="8" height="52" fill={wbLane[2]} opacity="0.85" rx="1" />

      {/* SB arm lanes */}
      <rect x="57" y="86" width="8" height="52" fill={wbLane[0]} opacity="0.85" rx="1" />
      <rect x="66" y="86" width="8" height="52" fill={sbColor}   opacity="0.85" rx="1" />
      <rect x="75" y="86" width="8" height="52" fill={wbLane[2]} opacity="0.85" rx="1" />

      {/* WB arm lanes */}
      <rect x="2"  y="57" width="52" height="8" fill={wbLane[0]} opacity="0.85" rx="1" />
      <rect x="2"  y="66" width="52" height="8" fill={wbColor}   opacity="0.85" rx="1" />
      <rect x="2"  y="75" width="52" height="8" fill={wbLane[2]} opacity="0.85" rx="1" />

      {/* EB arm lanes */}
      <rect x="86" y="57" width="52" height="8" fill={ebLane[0]} opacity="0.85" rx="1" />
      <rect x="86" y="66" width="52" height="8" fill={ebColor}   opacity="0.85" rx="1" />
      <rect x="86" y="75" width="52" height="8" fill={ebLane[2]} opacity="0.85" rx="1" />

      {/* Center box */}
      <rect x="57" y="57" width="26" height="26" fill="#c8cdd8" />
      <circle cx="70" cy="70" r="11" fill="#fff" stroke="#b0b8c8" strokeWidth="1.5" />

      {/* Turn arrows — NB */}
      <text x="61" y="44" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↰</text>
      <text x="70" y="44" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↑</text>
      <text x="79" y="44" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↱</text>

      {/* Turn arrows — SB */}
      <text x="61" y="105" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↱</text>
      <text x="70" y="105" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↓</text>
      <text x="79" y="105" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↰</text>

      {/* Turn arrows — WB */}
      <text x="28" y="62" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↰</text>
      <text x="28" y="71" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">←</text>
      <text x="28" y="80" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↱</text>

      {/* Turn arrows — EB */}
      <text x="112" y="62" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↱</text>
      <text x="112" y="71" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">→</text>
      <text x="112" y="80" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">↰</text>

      {/* LOS badge at center */}
      <text x="70" y="74" textAnchor="middle" fontSize="9" fill={lc} fontWeight="800">{intersection.los}</text>

      {/* Direction labels outside arms */}
      <text x="70" y="12" textAnchor="middle" fontSize="8" fill="#4a5a72" fontWeight="700">N</text>
      <text x="70" y="134" textAnchor="middle" fontSize="8" fill="#4a5a72" fontWeight="700">S</text>
      <text x="8"  y="73" textAnchor="middle" fontSize="8" fill="#4a5a72" fontWeight="700">W</text>
      <text x="132" y="73" textAnchor="middle" fontSize="8" fill="#4a5a72" fontWeight="700">E</text>
    </svg>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function IntersectionPanel({ intersection, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'diagram' | 'list'>('diagram')
  const [activeMove, setActiveMove] = useState<'approaches' | 'movements'>('approaches')

  const moves = getMovements(intersection)
  const bars = losBarWidths(intersection.los, intersection.totalCount)

  const cell: React.CSSProperties = {
    fontSize: 11, color: '#3a4e6a',
    display: 'flex', alignItems: 'center',
  }
  const delayPill = (delay: number) => ({
    fontSize: 10, fontWeight: 700 as const,
    background: delayToColor(delay) + '22',
    color: delayToColor(delay),
    padding: '1px 5px', borderRadius: 3,
    minWidth: 34, textAlign: 'center' as const,
    display: 'inline-block',
  })

  return (
    <div style={{
      width: 320, minWidth: 320,
      background: '#fff',
      borderLeft: '1px solid #d0d7e2',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontSize: 12,
    }}>
      {/* ── Tab bar ── */}
      <div style={{
        borderBottom: '1px solid #d0d7e2', padding: '0 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 38, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          {(['diagram', 'list'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0 10px', height: 38, fontSize: 12,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#1a56db' : '#5a6a88',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #1a56db' : '2px solid transparent',
              textTransform: 'capitalize',
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <div style={{ width: 1, height: 18, background: '#d0d7e2', margin: '0 4px' }} />
          {(['approaches', 'movements'] as const).map((m) => (
            <button key={m} onClick={() => setActiveMove(m)} style={{
              padding: '0 8px', height: 38, fontSize: 11,
              fontWeight: activeMove === m ? 600 : 400,
              color: activeMove === m ? '#1a56db' : '#5a6a88',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeMove === m ? '2px solid #1a56db' : '2px solid transparent',
              textTransform: 'capitalize',
            }}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{
          color: '#8a9ab8', background: 'none', border: 'none',
          cursor: 'pointer', padding: 4, marginLeft: 4, flexShrink: 0,
        }}>
          <X size={14} />
        </button>
      </div>

      {/* ── Intersection name ── */}
      <div style={{
        padding: '8px 14px', borderBottom: '1px solid #edf0f7',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#1a2744', lineHeight: 1.45, flex: 1 }}>
          {intersection.name}
        </span>
        <button style={{
          color: '#aab4c8', background: 'none', border: 'none',
          cursor: 'pointer', flexShrink: 0, marginLeft: 6, padding: 2, fontSize: 13,
        }}>✎</button>
      </div>

      {/* ── Movement diagram area ── */}
      <div style={{
        padding: '10px 8px', background: '#f7f9fc', borderBottom: '1px solid #edf0f7',
        flexShrink: 0,
      }}>
        {/* NB label row */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#6a7a92', fontWeight: 700, letterSpacing: '0.06em' }}>NB</span>
        </div>

        {/* Main row: WB data | diagram | EB data */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* WB movements (LT, TH, RT) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 72, flexShrink: 0 }}>
            {moves.wb.map((m, i) => (
              <div key={i} style={{ ...cell, gap: 4, justifyContent: 'flex-end' }}>
                <span style={{ color: '#5a6a88', width: 26, textAlign: 'right' }}>{m.count}</span>
                <span style={delayPill(m.delay)}>{m.delay}s</span>
                <span style={{ fontSize: 9, color: m.trend === 'up' ? '#f44336' : '#4caf50', width: 8 }}>
                  {m.trend === 'up' ? '▲' : '▼'}
                </span>
              </div>
            ))}
          </div>

          {/* SVG diagram */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <IntersectionDiagram intersection={intersection} moves={moves} />
          </div>

          {/* EB movements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 68, flexShrink: 0 }}>
            {moves.eb.map((m, i) => (
              <div key={i} style={{ ...cell, gap: 4 }}>
                <span style={delayPill(m.delay)}>{m.delay}s</span>
                <span style={{ color: '#5a6a88', width: 26 }}>{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SB label row */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#6a7a92', fontWeight: 700, letterSpacing: '0.06em' }}>SB</span>
        </div>
      </div>

      {/* ── NB/SB movement rows ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        padding: '6px 12px', gap: '4px 8px',
        borderBottom: '1px solid #edf0f7', flexShrink: 0,
      }}>
        {(['nb', 'sb'] as const).map((dir) => (
          <div key={dir}>
            <div style={{ fontSize: 9, color: '#8a9ab8', fontWeight: 700, marginBottom: 3, letterSpacing: '0.05em' }}>
              {dir.toUpperCase()} Approach
            </div>
            {moves[dir].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <span style={delayPill(m.delay)}>{m.delay}s</span>
                <span style={{ fontSize: 10, color: '#5a6a88' }}>{m.count}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #edf0f7', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <span style={{ fontSize: 11, color: '#5a6a88' }}>Total Vehicles</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a2744' }}>
            {intersection.totalCount.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#5a6a88' }}>Avg Control Delay/Ve...</span>
          <span style={{
            fontSize: 15, fontWeight: 700,
            background: intersection.losColor + '22',
            color: intersection.losColor,
            padding: '2px 12px', borderRadius: 4,
          }}>{intersection.controlAvg}</span>
        </div>
      </div>

      {/* ── LOS grade bars ── */}
      <div style={{ padding: '10px 14px', flex: 1, overflowY: 'auto' }}>
        {bars.map(({ grade, pct, count }) => (
          <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 3, flexShrink: 0,
              background: LOS_COLORS[grade],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: '#fff', fontWeight: 800,
            }}>{grade}</div>
            <div style={{ flex: 1, height: 11, background: '#edf0f7', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: LOS_COLORS[grade],
                borderRadius: 3,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{
              fontSize: 10, color: grade === intersection.los ? LOS_COLORS[grade] : '#8a9ab8',
              fontWeight: grade === intersection.los ? 700 : 400,
              width: 28, textAlign: 'right', flexShrink: 0,
            }}>{count > 0 ? count : ''}</span>
          </div>
        ))}
      </div>

      {/* ── Metric selector ── */}
      <div style={{
        padding: '8px 14px 4px', borderTop: '1px solid #edf0f7',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#5a6a88', flexShrink: 0 }}>Metric</span>
        <select style={{
          flex: 1, fontSize: 10, color: '#2c3e5a',
          border: '1px solid #d0d7e2', borderRadius: 3,
          padding: '2px 4px', background: '#fff',
        }}>
          <option>Avg Control Delay/Vehicle</option>
          <option>Total Control Delay</option>
          <option>Total Count</option>
        </select>
      </div>
      <div style={{ padding: '4px 14px 10px', display: 'flex', gap: 16, flexShrink: 0 }}>
        {['Scaled', 'Observed'].map((opt) => (
          <label key={opt} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: '#5a6a88', cursor: 'pointer',
          }}>
            <input type="radio" name="metric-type" defaultChecked={opt === 'Observed'} style={{ accentColor: '#1a56db' }} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}
