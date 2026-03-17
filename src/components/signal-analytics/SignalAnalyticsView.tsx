export function SignalAnalyticsView() {
  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: '#e8ecf1' }}>
      {/* Left KPI panel placeholder */}
      <div
        style={{ width: 280, minWidth: 280, background: '#dfe5ed' }}
        className="border-r border-[#c8d0dc] p-4"
      >
        <span className="text-[#4a6080] text-sm">KPI Panel — Phase 4</span>
      </div>
      {/* Center content placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[#4a6080] text-sm select-none">Signal Analytics content renders here in Phase 4</span>
      </div>
    </div>
  )
}
