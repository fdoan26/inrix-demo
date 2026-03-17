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

export function IntersectionPanel({ intersection, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'diagram' | 'list'>('diagram')
  const [activeMove, setActiveMove] = useState<'approaches' | 'movements'>('approaches')

  // Simple approach breakdown from total count
  const approaches = [
    { dir: 'NB', total: Math.round(intersection.totalCount * 0.29), control: intersection.controlAvg, trend: 'up' },
    { dir: 'SB', total: Math.round(intersection.totalCount * 0.26), control: '7s',  trend: 'down' },
    { dir: 'EB', total: Math.round(intersection.totalCount * 0.24), control: '12s', trend: 'up' },
    { dir: 'WB', total: Math.round(intersection.totalCount * 0.21), control: '9s',  trend: 'down' },
  ]

  return (
    <div style={{
      width: 280, minWidth: 280,
      background: '#fff',
      borderLeft: '1px solid #d0d7e2',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontSize: 12,
    }}>
      {/* ── Header tabs ── */}
      <div style={{ borderBottom: '1px solid #d0d7e2', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {(['diagram', 'list'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 12px', fontSize: 12, fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#1a56db' : '#5a6a88',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #1a56db' : '2px solid transparent',
              textTransform: 'capitalize',
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <div style={{ width: 1, background: '#d0d7e2', margin: '8px 4px' }} />
          {(['approaches', 'movements'] as const).map((m) => (
            <button key={m} onClick={() => setActiveMove(m)} style={{
              padding: '10px 10px', fontSize: 12, fontWeight: activeMove === m ? 600 : 400,
              color: activeMove === m ? '#1a56db' : '#5a6a88',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeMove === m ? '2px solid #1a56db' : '2px solid transparent',
              textTransform: 'capitalize',
            }}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ color: '#8a9ab8', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={15} />
        </button>
      </div>

      {/* ── Name ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #edf0f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#1a2744', lineHeight: 1.4 }}>{intersection.name}</span>
        <button style={{ color: '#aab4c8', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, marginLeft: 6, padding: 2 }}>✎</button>
      </div>

      {/* ── Intersection diagram ── */}
      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'center', background: '#f7f9fc', borderBottom: '1px solid #edf0f7' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Road cross */}
          <rect x="52" y="0" width="16" height="120" fill="#d0d7e2" rx="2" />
          <rect x="0" y="52" width="120" height="16" fill="#d0d7e2" rx="2" />
          {/* Center circle */}
          <circle cx="60" cy="60" r="14" fill="#fff" stroke="#bbc8d8" strokeWidth="1.5" />
          {/* Approach arrows */}
          {/* NB */}
          <polygon points="60,8 55,18 65,18" fill={LOS_COLORS['B']} />
          {/* SB */}
          <polygon points="60,112 55,102 65,102" fill={LOS_COLORS[intersection.los]} />
          {/* EB */}
          <polygon points="112,60 102,55 102,65" fill={LOS_COLORS['C']} />
          {/* WB */}
          <polygon points="8,60 18,55 18,65" fill={LOS_COLORS['A']} />
          {/* Direction labels */}
          <text x="60" y="32" textAnchor="middle" fontSize="8" fill="#5a6a88" fontWeight="600">NB</text>
          <text x="60" y="96" textAnchor="middle" fontSize="8" fill="#5a6a88" fontWeight="600">SB</text>
          <text x="88" y="63" textAnchor="middle" fontSize="8" fill="#5a6a88" fontWeight="600">EB</text>
          <text x="32" y="63" textAnchor="middle" fontSize="8" fill="#5a6a88" fontWeight="600">WB</text>
        </svg>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #edf0f7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#5a6a88' }}>Total Vehicles</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1a2744' }}>{intersection.totalCount.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#5a6a88' }}>Avg Control Delay/Ve...</span>
          <span style={{
            fontSize: 15, fontWeight: 700,
            background: intersection.losColor + '22',
            color: intersection.losColor,
            padding: '2px 10px', borderRadius: 4,
          }}>{intersection.controlAvg}</span>
        </div>
      </div>

      {/* ── Approach rows ── */}
      <div style={{ padding: '0 14px', borderBottom: '1px solid #edf0f7' }}>
        {approaches.map((a) => (
          <div key={a.dir} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #f2f4f8' }}>
            <span style={{ fontSize: 11, color: '#8a9ab8', width: 24, fontWeight: 600 }}>{a.dir}</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: '#ff980022', color: '#ff9800',
              padding: '1px 7px', borderRadius: 3, minWidth: 36, textAlign: 'center',
            }}>{a.control}</span>
            <span style={{ fontSize: 10, color: a.trend === 'up' ? '#f44336' : '#4caf50', marginLeft: 2 }}>
              {a.trend === 'up' ? '▲' : '▼'}
            </span>
            <span style={{ fontSize: 11, color: '#3a4e6a', marginLeft: 'auto' }}>{a.total}</span>
          </div>
        ))}
      </div>

      {/* ── LOS grade bars ── */}
      <div style={{ padding: '10px 14px', flex: 1 }}>
        {GRADES.map((g) => (
          <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 2, flexShrink: 0,
              background: LOS_COLORS[g],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: '#fff', fontWeight: 700,
            }}>{g}</div>
            <div style={{ flex: 1, height: 10, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: g === intersection.los ? '65%' : g < intersection.los ? `${30 + Math.random() * 30}%` : `${5 + Math.random() * 15}%`,
                background: LOS_COLORS[g],
                borderRadius: 3,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Metric selector ── */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid #edf0f7', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#5a6a88', flexShrink: 0 }}>Metric</span>
        <select style={{ flex: 1, fontSize: 10, color: '#2c3e5a', border: '1px solid #d0d7e2', borderRadius: 3, padding: '2px 4px', background: '#fff' }}>
          <option>Avg Control Delay/Vehicle</option>
          <option>Total Control Delay</option>
          <option>Total Count</option>
        </select>
      </div>
      <div style={{ padding: '6px 14px 10px', display: 'flex', gap: 16 }}>
        {['Scaled', 'Observed'].map((opt) => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#5a6a88', cursor: 'pointer' }}>
            <input type="radio" name="metric-type" defaultChecked={opt === 'Observed'} style={{ accentColor: '#1a56db' }} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}
