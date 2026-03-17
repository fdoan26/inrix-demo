import { useState } from 'react'

interface AlertsLegendProps {
  visible: boolean
}

const ALERT_TYPES = [
  { color: '#e53935', label: 'Crashes' },
  { color: '#e53935', label: 'Dangerous Slowdowns' },
  { color: '#e53935', label: 'Road Closures' },
  { color: '#ff9800', label: 'Construction' },
  { color: '#ff9800', label: 'Hazards' },
  { color: '#2196f3', label: 'Events' },
  { color: '#ffeb3b', label: 'Congestion' },
]

export function AlertsLegend({ visible }: AlertsLegendProps) {
  const [showLegend, setShowLegend] = useState(true)

  if (!visible || !showLegend) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 190,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        borderRadius: 6,
        padding: '8px 10px',
        width: 160,
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8ca0bc' }}>
          Alerts
        </span>
        <button
          onClick={() => setShowLegend(false)}
          style={{ background: 'none', border: 'none', color: '#8ca0bc', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>
      {ALERT_TYPES.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, background: color, borderRadius: '50%', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#d0dbe8' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
