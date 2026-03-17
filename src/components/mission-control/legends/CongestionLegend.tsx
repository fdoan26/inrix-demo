import { useState } from 'react'

// INRIX scale: % of vehicles at free-flow speed (high = green = flowing)
const CONGESTION_LEVELS = [
  { color: '#43a047', label: '76 to 100%' },
  { color: '#fdd835', label: '51 to 75%' },
  { color: '#fb8c00', label: '26 to 50%' },
  { color: '#b71c1c', label: '0 to 25%' },
]

export function CongestionLegend() {
  const [showLegend, setShowLegend] = useState(true)

  if (!showLegend) return null

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 4,
        padding: '8px 10px',
        width: 170,
        color: '#1a2744',
        boxShadow: '0 1px 6px rgba(0,0,0,0.25)',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1a2744', lineHeight: 1.3 }}>
            Level of Congestion
          </div>
          <div style={{ fontSize: 9, color: '#6b7a99', marginTop: 1 }}>
            % of Veh at Free-flow Speed
          </div>
        </div>
        <button
          onClick={() => setShowLegend(false)}
          style={{ background: 'none', border: 'none', color: '#9aacbf', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 4 }}
        >
          ×
        </button>
      </div>
      {CONGESTION_LEVELS.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
          <div style={{ width: 14, height: 10, background: color, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#2c3e5a', fontWeight: 500 }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
