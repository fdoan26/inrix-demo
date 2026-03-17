import { useState } from 'react'

interface AlertsLegendProps {
  visible: boolean
}

// Each row: mini teardrop pin (matching actual alert icon colors) + label
const ALERT_TYPES = [
  { color: '#d32f2f', label: 'Dangerous Slow-downs' },
  { color: '#e65100', label: 'Construction' },
  { color: '#c62828', label: 'Road Closure' },
  { color: '#1565c0', label: 'Events' },
  { color: '#1565c0', label: 'Congestion' },
  { color: '#e65100', label: 'Hazards' },
  { color: '#d32f2f', label: 'Crashes' },
]

function MiniPin({ color }: { color: string }) {
  return (
    <div style={{ width: 12, height: 14, flexShrink: 0, position: 'relative' }}>
      <div style={{
        width: 11, height: 11,
        background: color,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        border: '1.5px solid rgba(255,255,255,0.7)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        position: 'absolute', top: 0, left: 0,
      }} />
    </div>
  )
}

export function AlertsLegend({ visible }: AlertsLegendProps) {
  const [showLegend, setShowLegend] = useState(true)

  if (!visible || !showLegend) return null

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1a2744' }}>
          Alerts
        </span>
        <button
          onClick={() => setShowLegend(false)}
          style={{ background: 'none', border: 'none', color: '#9aacbf', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>
      {ALERT_TYPES.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          <MiniPin color={color} />
          <span style={{ fontSize: 11, color: '#2c3e5a', fontWeight: 500 }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
