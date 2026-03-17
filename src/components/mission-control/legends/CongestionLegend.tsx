import { useState } from 'react'

const CONGESTION_LEVELS = [
  { color: '#4caf50', label: 'Free Flow', range: '0–25%' },
  { color: '#ffeb3b', label: 'Moderate', range: '26–50%' },
  { color: '#ff9800', label: 'Slow', range: '51–75%' },
  { color: '#f44336', label: 'Stopped', range: '76–100%' },
]

export function CongestionLegend() {
  const [showLegend, setShowLegend] = useState(true)

  if (!showLegend) return null

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.7)',
        borderRadius: 6,
        padding: '8px 10px',
        width: 160,
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8ca0bc' }}>
          Congestion
        </span>
        <button
          onClick={() => setShowLegend(false)}
          style={{ background: 'none', border: 'none', color: '#8ca0bc', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>
      {CONGESTION_LEVELS.map(({ color, label, range }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 16, height: 6, background: color, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#d0dbe8' }}>{label}</span>
          <span style={{ fontSize: 10, color: '#6a8099', marginLeft: 'auto' }}>{range}</span>
        </div>
      ))}
    </div>
  )
}
