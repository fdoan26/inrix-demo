import { ChevronRight, HelpCircle, RefreshCw, LayoutGrid } from 'lucide-react'
import { useStore } from '../../store'

const VIEW_LABELS = {
  'mission-control': 'Mission Control',
  'signal-analytics': 'Signal Analytics',
} as const

export function NavBar() {
  const activeView = useStore((s) => s.activeView)
  const setActiveView = useStore((s) => s.setActiveView)

  const toggleView = () => {
    setActiveView(
      activeView === 'mission-control' ? 'signal-analytics' : 'mission-control'
    )
  }

  return (
    <nav
      style={{ background: '#0d1f3c', height: 48, minHeight: 48 }}
      className="flex items-center px-3 border-b border-[#1e3a5f] z-[900] select-none"
    >
      {/* Collapse chevron */}
      <button className="text-[#4a6080] hover:text-white p-1 mr-2">
        <ChevronRight size={14} />
      </button>

      {/* INRIX IQ Logo */}
      <div className="flex items-center mr-3">
        <span className="text-white font-bold text-sm tracking-wide">INRIX</span>
        <span className="border border-white text-white text-[10px] px-0.5 ml-0.5 leading-tight font-normal">IQ</span>
      </div>

      {/* Module name — clickable toggle */}
      <button
        onClick={toggleView}
        className="text-white text-sm font-normal hover:text-[#8ca0bc] transition-colors"
      >
        {VIEW_LABELS[activeView]}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right icons — exactly 3 */}
      <div className="flex items-center gap-2">
        <button className="text-[#4a6080] hover:text-white p-1">
          <HelpCircle size={16} strokeWidth={1.5} />
        </button>
        <button className="text-[#4a6080] hover:text-white p-1">
          <RefreshCw size={16} strokeWidth={1.5} />
        </button>
        <button className="text-[#4a6080] hover:text-white p-1">
          <LayoutGrid size={16} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
