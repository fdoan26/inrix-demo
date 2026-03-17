import { useStore } from '../../store'
import { alerts } from '../../data/alerts'

interface PillSwitchProps {
  active: boolean
  color: string
  onClick: () => void
}

function PillSwitch({ active, color, onClick }: PillSwitchProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 36,
        height: 18,
        borderRadius: 9,
        background: active ? color : '#4a5568',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.15s ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: active ? 18 : 2,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: '#fff',
          transition: 'left 0.15s ease',
        }}
      />
    </div>
  )
}

export function FilterBar() {
  const activeTab = useStore((s) => s.activeTab)
  const mapVersion = useStore((s) => s.mapVersion)
  const showTraffic = useStore((s) => s.showTraffic)
  const showAlerts = useStore((s) => s.showAlerts)
  const showCameras = useStore((s) => s.showCameras)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const toggleTraffic = useStore((s) => s.toggleTraffic)
  const toggleAlerts = useStore((s) => s.toggleAlerts)
  const toggleCameras = useStore((s) => s.toggleCameras)

  return (
    <div
      style={{ background: '#0d1f3c', height: 40, minHeight: 40 }}
      className="flex items-center px-4 border-b border-[#1e3a5f] gap-6"
    >
      {/* Network / Corridors toggle */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTab('network')}
          className="text-xs px-2 py-0.5 rounded"
          style={{
            color: activeTab === 'network' ? '#ffffff' : '#4a6080',
            borderBottom: activeTab === 'network' ? '2px solid #2196f3' : '2px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Network
        </button>
        <button
          onClick={() => setActiveTab('corridors')}
          className="text-xs px-2 py-0.5 rounded"
          style={{
            color: activeTab === 'corridors' ? '#ffffff' : '#4a6080',
            borderBottom: activeTab === 'corridors' ? '2px solid #2196f3' : '2px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Corridors
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: '#1e3a5f' }} />

      {/* Map Version */}
      <div className="flex items-center gap-1">
        <span className="text-[#4a6080] text-xs">Map Version:</span>
        <span className="text-[#8ca0bc] text-xs">{mapVersion}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          style={{ marginLeft: 2 }}
        >
          <path d="M1 1L5 5L9 1" stroke="#4a6080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: '#1e3a5f' }} />

      {/* Traffic Flow toggle */}
      <div className="flex items-center gap-2">
        <PillSwitch active={showTraffic} color="#2196f3" onClick={toggleTraffic} />
        <span className="text-[#8ca0bc] text-xs">Traffic Flow</span>
      </div>

      {/* Alerts toggle */}
      <div className="flex items-center gap-2">
        <PillSwitch active={showAlerts} color="#f57c00" onClick={toggleAlerts} />
        <span className="text-[#8ca0bc] text-xs">Alerts</span>
        <div
          style={{
            background: '#2196f3',
            borderRadius: 3,
            padding: '1px 5px',
            fontSize: 10,
            color: '#fff',
            fontWeight: 600,
            lineHeight: '14px',
          }}
        >
          {alerts.length}
        </div>
      </div>

      {/* Cameras toggle */}
      <div className="flex items-center gap-2">
        <PillSwitch active={showCameras} color="#2196f3" onClick={toggleCameras} />
        <span className="text-[#8ca0bc] text-xs">Cameras</span>
      </div>
    </div>
  )
}
