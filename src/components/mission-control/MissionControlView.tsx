import { FilterBar } from './FilterBar'
import { MapView } from './MapView'

export function MissionControlView() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a1628' }}>
      <FilterBar />
      <MapView />
    </div>
  )
}
