import { useStore } from '../../store'
import { segments } from '../../data/segments'
import { cameras } from '../../data/cameras'
import { SegmentPanel } from '../panels/SegmentPanel'
import { CameraPanel } from '../panels/CameraPanel'
import { FilterBar } from './FilterBar'
import { MapView } from './MapView'

export function MissionControlView() {
  const selectedItem = useStore((s) => s.selectedItem)

  const selectedSegment =
    selectedItem?.type === 'segment'
      ? segments.find((s) => s.segmentId === selectedItem.id) ?? null
      : null

  const selectedCamera =
    selectedItem?.type === 'camera'
      ? cameras.find((c) => c.id === selectedItem.id) ?? null
      : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a1628' }}>
      <FilterBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MapView />
        {selectedSegment && <SegmentPanel segment={selectedSegment} />}
        {selectedCamera && <CameraPanel camera={selectedCamera} />}
      </div>
    </div>
  )
}
