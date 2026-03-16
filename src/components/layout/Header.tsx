import React from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const VIEW_LABELS: Record<string, string> = {
  'mission-control': 'Mission Control',
  'signal-analytics': 'Signal Analytics',
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: () => void
}

const FilterToggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
    <span style={{ color: checked ? '#ffffff' : '#4a6080', fontSize: 12, fontWeight: 500 }}>
      {label}
    </span>
  </div>
)

export const Header: React.FC = () => {
  const { activeView, filters, toggleFilter } = useAppStore()
  const viewLabel = VIEW_LABELS[activeView] || activeView
  const isMissionControl = activeView === 'mission-control'

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <header
      style={{ background: '#0d1f3c', height: 48, minHeight: 48 }}
      className="flex items-center px-4 border-b border-[#1e3a5f] gap-4 z-40"
    >
      {/* INRIX IQ logo */}
      <div className="flex items-center gap-2 select-none">
        <div
          style={{ background: '#1e90ff' }}
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.9" />
            <rect x="6.5" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.9" />
            <rect x="1" y="6.5" width="4" height="4" rx="0.8" fill="white" opacity="0.9" />
            <rect x="6.5" y="6.5" width="4" height="4" rx="0.8" fill="white" opacity="0.5" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
          INRIX IQ
        </span>
        <div className="w-px h-4 bg-[#2a4f7f] mx-1" />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#8ca0bc' }}>
          {viewLabel}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Filters — only on Mission Control */}
      {isMissionControl && (
        <div className="flex items-center gap-5">
          <FilterToggle
            label="Traffic Flow"
            checked={filters.trafficFlow}
            onChange={() => toggleFilter('trafficFlow')}
          />
          <FilterToggle
            label="Alerts"
            checked={filters.alerts}
            onChange={() => toggleFilter('alerts')}
          />
          <FilterToggle
            label="Cameras"
            checked={filters.cameras}
            onChange={() => toggleFilter('cameras')}
          />
        </div>
      )}

      <div className="w-px h-4 bg-[#1e3a5f]" />

      {/* Region selector */}
      <button
        style={{ background: '#112040', border: '1px solid #1e3a5f', fontSize: 12, color: '#8ca0bc' }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[#1e3a5f] transition-colors"
      >
        <span>Los Angeles, CA</span>
        <ChevronDown size={13} />
      </button>

      {/* Refresh / time */}
      <div className="flex items-center gap-2">
        <button
          style={{ color: '#4a6080' }}
          className="hover:text-[#8ca0bc] transition-colors p-1"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>
        <span style={{ fontSize: 11, color: '#4a6080', fontVariantNumeric: 'tabular-nums' }}>
          {timeStr}
        </span>
      </div>
    </header>
  )
}
