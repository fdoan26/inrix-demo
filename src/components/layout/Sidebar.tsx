import React from 'react'
import { Radio, BarChart2 } from 'lucide-react'
import type { ActiveView } from '../../types'
import { useAppStore } from '../../store/useAppStore'

interface NavItem {
  id: ActiveView
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'mission-control',
    label: 'Mission Control',
    icon: <Radio size={20} />,
  },
  {
    id: 'signal-analytics',
    label: 'Signal Analytics',
    icon: <BarChart2 size={20} />,
  },
]

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useAppStore()

  return (
    <aside
      style={{ background: '#0d1f3c', width: 56, minWidth: 56 }}
      className="flex flex-col items-center py-3 gap-1 border-r border-[#1e3a5f] z-50"
    >
      {/* INRIX logo mark */}
      <div className="mb-3 flex items-center justify-center w-9 h-9">
        <div
          style={{ background: '#1e90ff' }}
          className="w-7 h-7 rounded flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9" />
            <rect x="7" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9" />
            <rect x="1" y="7" width="5" height="5" rx="1" fill="white" opacity="0.9" />
            <rect x="7" y="7" width="5" height="5" rx="1" fill="white" opacity="0.6" />
          </svg>
        </div>
      </div>

      <div className="w-8 h-px bg-[#1e3a5f] mb-2" />

      {navItems.map((item) => {
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            title={item.label}
            style={{
              background: isActive ? '#1e90ff22' : 'transparent',
              color: isActive ? '#1e90ff' : '#4a6080',
              borderLeft: isActive ? '2px solid #1e90ff' : '2px solid transparent',
            }}
            className="w-full flex items-center justify-center h-10 transition-all duration-150 hover:bg-[#1e3a5f] hover:text-[#8ca0bc] cursor-pointer"
          >
            {item.icon}
          </button>
        )
      })}
    </aside>
  )
}
