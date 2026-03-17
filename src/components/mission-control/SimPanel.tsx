/**
 * Floating simulation control panel (bottom-right of map).
 * Lets demo operators jump to peak hours and speed up time without the console.
 */

import { simConfig, getSimulatedHour } from '../../lib/trafficSimulation'

interface SimPanelProps {
  simulatedTime: string
  source: 'live' | 'static'
  roadCount: number
  onRefresh: () => void
}

const SPEED_OPTIONS = [
  { label: '1×',    value: 1,      title: 'Real time' },
  { label: '60×',   value: 60,     title: '1 min / sec' },
  { label: '3600×', value: 3600,   title: '1 hr / sec' },
]

const HOUR_PRESETS = [
  { label: 'AM Peak',  hour: 8,  title: '8 AM — morning rush' },
  { label: 'Midday',   hour: 12, title: '12 PM — light traffic' },
  { label: 'PM Peak',  hour: 17, title: '5 PM — evening rush' },
  { label: 'Late Night', hour: 1, title: '1 AM — near empty' },
]

function setSpeed(multiplier: number, onRefresh: () => void) {
  const currentHour = getSimulatedHour()
  simConfig.startHour = currentHour
  simConfig.baseTimestamp = Date.now()
  simConfig.speedMultiplier = multiplier
  onRefresh()
}

function setHour(hour: number, onRefresh: () => void) {
  simConfig.startHour = hour
  simConfig.baseTimestamp = Date.now()
  onRefresh()
}

export function SimPanel({ simulatedTime, source, roadCount, onRefresh }: SimPanelProps) {
  const currentSpeed = simConfig.speedMultiplier

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 6,
        padding: '8px 10px',
        width: 198,
        boxShadow: '0 1px 6px rgba(0,0,0,0.22)',
        border: '1px solid rgba(0,0,0,0.08)',
        fontSize: 11,
        color: '#1a2744',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5a6a88' }}>
          Simulation
        </span>
        <span style={{
          fontSize: 9, padding: '1px 5px', borderRadius: 3,
          background: source === 'live' ? '#e8f5e9' : '#fff8e1',
          color: source === 'live' ? '#2e7d32' : '#f57f17',
          fontWeight: 600,
        }}>
          {source === 'live' ? `OSM · ${roadCount} roads` : `static · ${roadCount} roads`}
        </span>
      </div>

      {/* Simulated clock */}
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1a2744', marginBottom: 6, letterSpacing: '0.02em' }}>
        {simulatedTime}
        {currentSpeed > 1 && (
          <span style={{ fontSize: 9, fontWeight: 600, color: '#1a56db', marginLeft: 6, verticalAlign: 'middle' }}>
            {currentSpeed >= 3600 ? `${currentSpeed / 3600}hr/s` : `${currentSpeed}×`}
          </span>
        )}
      </div>

      {/* Time presets */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 9, color: '#8a9ab8', marginBottom: 3, fontWeight: 600 }}>JUMP TO</div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {HOUR_PRESETS.map(({ label, hour, title }) => (
            <button
              key={label}
              title={title}
              onClick={() => setHour(hour, onRefresh)}
              style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 3, cursor: 'pointer',
                border: '1px solid #dde3ec',
                background: '#f4f6fa',
                color: '#2c3e5a',
                fontWeight: 500,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Speed controls */}
      <div>
        <div style={{ fontSize: 9, color: '#8a9ab8', marginBottom: 3, fontWeight: 600 }}>TIME SPEED</div>
        <div style={{ display: 'flex', gap: 3 }}>
          {SPEED_OPTIONS.map(({ label, value, title }) => (
            <button
              key={label}
              title={title}
              onClick={() => setSpeed(value, onRefresh)}
              style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 3, cursor: 'pointer',
                border: `1px solid ${currentSpeed === value ? '#1a56db' : '#dde3ec'}`,
                background: currentSpeed === value ? '#1a56db' : '#f4f6fa',
                color: currentSpeed === value ? '#fff' : '#2c3e5a',
                fontWeight: currentSpeed === value ? 700 : 500,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
