import { useState } from 'react'
import { ChevronDown, HelpCircle, RefreshCw, LayoutGrid } from 'lucide-react'
import { useStore } from '../../store'

const VIEW_OPTIONS = [
  { value: 'mission-control',   label: 'Mission Control' },
  { value: 'signal-analytics',  label: 'Signal Analytics' },
  { value: 'roadway-analytics', label: 'Roadway Analytics' },
  { value: 'forecasting',       label: 'Forecasting' },
] as const

export function NavBar() {
  const activeView  = useStore((s) => s.activeView)
  const setActiveView = useStore((s) => s.setActiveView)
  const [open, setOpen] = useState(false)

  const activeLabel = VIEW_OPTIONS.find((v) => v.value === activeView)?.label ?? ''

  return (
    <nav
      style={{ background: '#0d1f3c', height: 48, minHeight: 48, position: 'relative', zIndex: 900 }}
      className="flex items-center px-3 border-b border-[#1e3a5f] select-none"
    >
      {/* INRIX IQ Logo */}
      <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>INRIX</span>
        <span style={{ border: '1px solid #fff', color: '#fff', fontSize: 9, padding: '0 3px', marginLeft: 3, lineHeight: '14px', fontWeight: 400 }}>IQ</span>
      </div>

      {/* Module dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#fff', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '4px 0',
          }}
        >
          {activeLabel}
          <ChevronDown size={13} style={{ opacity: 0.75, marginTop: 1 }} />
        </button>

        {open && (
          <>
            {/* Click-away backdrop */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 998 }}
              onClick={() => setOpen(false)}
            />
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0,
              background: '#0d1f3c', border: '1px solid #1e3a5f',
              borderRadius: 4, zIndex: 999, minWidth: 170,
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}>
              {VIEW_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setActiveView(opt.value as typeof activeView); setOpen(false) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '9px 14px', fontSize: 13, cursor: 'pointer', border: 'none',
                    color: activeView === opt.value ? '#fff' : '#8ca0bc',
                    background: activeView === opt.value ? '#1e3a5f' : 'transparent',
                    fontWeight: activeView === opt.value ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={{ color: '#4a6080', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><HelpCircle size={16} strokeWidth={1.5} /></button>
        <button style={{ color: '#4a6080', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><RefreshCw size={16} strokeWidth={1.5} /></button>
        <button style={{ color: '#4a6080', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><LayoutGrid size={16} strokeWidth={1.5} /></button>
      </div>
    </nav>
  )
}
