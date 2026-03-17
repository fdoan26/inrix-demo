import { useStore } from '../../store'
import { alerts } from '../../data/alerts'
import { segments } from '../../data/segments'

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
        width: 34,
        height: 18,
        borderRadius: 9,
        background: active ? color : '#b0bec5',
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
          left: active ? 16 : 2,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: '#fff',
          transition: 'left 0.15s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}

function ChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
      <path d="M1 1L5 5L9 1" stroke="#6b7a99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#9aacbf" strokeWidth="2"/>
      <path d="M20 20L16.5 16.5" stroke="#9aacbf" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function FilterBar() {
  const activeTab = useStore((s) => s.activeTab)
  const showTraffic = useStore((s) => s.showTraffic)
  const showAlerts = useStore((s) => s.showAlerts)
  const showCameras = useStore((s) => s.showCameras)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const toggleTraffic = useStore((s) => s.toggleTraffic)
  const toggleAlerts = useStore((s) => s.toggleAlerts)
  const toggleCameras = useStore((s) => s.toggleCameras)

  const trafficCount = segments.length
  const alertCount = alerts.length

  return (
    <div
      style={{ background: '#ffffff', height: 44, minHeight: 44, borderBottom: '1px solid #dde3ec' }}
      className="flex items-center px-3 gap-0"
    >
      {/* Network / Corridors tabs */}
      <div className="flex items-center gap-0 mr-3">
        <button
          onClick={() => setActiveTab('network')}
          style={{
            color: activeTab === 'network' ? '#1a2744' : '#6b7a99',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'network' ? '2px solid #1a56db' : '2px solid transparent',
            padding: '0 8px',
            height: 44,
            fontSize: 12,
            fontWeight: activeTab === 'network' ? 600 : 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
          }}
        >
          Network
        </button>
        <button
          onClick={() => setActiveTab('corridors')}
          style={{
            color: activeTab === 'corridors' ? '#1a2744' : '#6b7a99',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'corridors' ? '2px solid #1a56db' : '2px solid transparent',
            padding: '0 8px',
            height: 44,
            fontSize: 12,
            fontWeight: activeTab === 'corridors' ? 600 : 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
          }}
        >
          Corridors
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: '#dde3ec', marginRight: 10 }} />

      {/* Traffic Flow toggle */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
          border: '1px solid #dde3ec', borderRadius: 4, height: 30, marginRight: 6, cursor: 'pointer',
          background: showTraffic ? '#f0f4ff' : '#fafbfc',
        }}
        onClick={toggleTraffic}
      >
        <PillSwitch active={showTraffic} color="#1a56db" onClick={() => {}} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a2744', whiteSpace: 'nowrap' as const, lineHeight: 1.3 }}>
            Traffic Flow ({trafficCount})
          </div>
          <div style={{ fontSize: 9, color: '#6b7a99', whiteSpace: 'nowrap' as const }}>
            Total Fusion, XD Segmen...
          </div>
        </div>
        <ChevronDown />
      </div>

      {/* Alerts toggle */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
          border: '1px solid #dde3ec', borderRadius: 4, height: 30, marginRight: 10, cursor: 'pointer',
          background: showAlerts ? '#fff8f0' : '#fafbfc',
        }}
        onClick={toggleAlerts}
      >
        <PillSwitch active={showAlerts} color="#1a56db" onClick={() => {}} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a2744', whiteSpace: 'nowrap' as const, lineHeight: 1.3 }}>
            Alerts ({alertCount})
          </div>
          <div style={{ fontSize: 9, color: '#6b7a99', whiteSpace: 'nowrap' as const }}>
            Construction, Events, Co...
          </div>
        </div>
        <ChevronDown />
      </div>

      {/* Search */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid #dde3ec', borderRadius: 4, height: 30, padding: '0 10px',
          background: '#f8fafc', minWidth: 180,
        }}
      >
        <SearchIcon />
        <span style={{ fontSize: 12, color: '#9aacbf' }}>Search...</span>
      </div>

      {/* Spacer + Cameras toggle (right side) */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
            border: '1px solid #dde3ec', borderRadius: 4, height: 30, cursor: 'pointer',
            background: showCameras ? '#f0f4ff' : '#fafbfc',
          }}
          onClick={toggleCameras}
        >
          <PillSwitch active={showCameras} color="#1a56db" onClick={() => {}} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1a2744', whiteSpace: 'nowrap' as const }}>Cameras</span>
        </div>
      </div>
    </div>
  )
}
