import { useState } from 'react'

// Standard pin path scaled to 14×18
const MINI_PIN =
  'M7 0.5C3.55 0.5 0.75 3.3 0.75 6.75c0 2.45 1.35 4.6 3.35 5.75L7 17.5l2.9-5C11.9 11.35 13.25 9.2 13.25 6.75 13.25 3.3 10.45 0.5 7 0.5z'

// Mini solid pin with a small white icon marker (or no icon for simple color swatch)
function SolidMiniPin({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" style={{ flexShrink: 0 }}>
      <path d={MINI_PIN} fill={color} />
      <path d={MINI_PIN} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.75" />
    </svg>
  )
}

// Mini hazard-stripe pin (construction / hazard)
function HazardMiniPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" style={{ flexShrink: 0 }}>
      <defs>
        <pattern id="mhp" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <rect width="2" height="4" fill="#f9a825" />
          <rect x="2" width="2" height="4" fill="#1a1a1a" />
        </pattern>
        <clipPath id="mhc"><path d={MINI_PIN} /></clipPath>
      </defs>
      <rect width="14" height="18" fill="url(#mhp)" clipPath="url(#mhc)" />
      <path d={MINI_PIN} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.75" />
    </svg>
  )
}

const ALERT_TYPES = [
  { pin: <SolidMiniPin color="#e53935" />, label: 'Dangerous Slow-downs' },
  { pin: <HazardMiniPin />,               label: 'Construction' },
  { pin: <SolidMiniPin color="#b71c1c" />, label: 'Road Closure' },
  { pin: <SolidMiniPin color="#2e7d32" />, label: 'Events' },
  { pin: <SolidMiniPin color="#1a3a6b" />, label: 'Congestion' },
  { pin: <HazardMiniPin />,               label: 'Hazards' },
  { pin: <SolidMiniPin color="#e53935" />, label: 'Crashes' },
]

interface AlertsLegendProps {
  visible: boolean
}

export function AlertsLegend({ visible }: AlertsLegendProps) {
  const [showLegend, setShowLegend] = useState(true)

  if (!visible || !showLegend) return null

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 4,
      padding: '8px 10px',
      width: 170,
      color: '#1a2744',
      boxShadow: '0 1px 6px rgba(0,0,0,0.25)',
      border: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1a2744' }}>Alerts</span>
        <button
          onClick={() => setShowLegend(false)}
          style={{ background: 'none', border: 'none', color: '#9aacbf', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>
      {ALERT_TYPES.map(({ pin, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          {pin}
          <span style={{ fontSize: 11, color: '#2c3e5a', fontWeight: 500 }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
