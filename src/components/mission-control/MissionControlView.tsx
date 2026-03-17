export function MissionControlView() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a1628' }}>
      {/* Filter bar placeholder — styled, functionality in Phase 2 */}
      <div
        style={{ background: '#0d1f3c', height: 40, minHeight: 40 }}
        className="flex items-center px-4 border-b border-[#1e3a5f] gap-6"
      >
        <span className="text-[#8ca0bc] text-xs">Network</span>
        <span className="text-[#4a6080] text-xs">Corridors</span>
        <span className="text-[#4a6080] text-xs ml-4">Map Version: Latest</span>
        <span className="text-[#8ca0bc] text-xs ml-4">Traffic Flow</span>
        <span className="text-[#8ca0bc] text-xs">Alerts</span>
        <span className="text-[#8ca0bc] text-xs">Cameras</span>
      </div>
      {/* Map placeholder — will be replaced in Phase 2 */}
      <div className="flex-1 flex items-center justify-center" style={{ background: '#0a1628' }}>
        <span className="text-[#4a6080] text-sm select-none">Map renders here in Phase 2</span>
      </div>
    </div>
  )
}
