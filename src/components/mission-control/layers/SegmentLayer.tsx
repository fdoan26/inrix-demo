import { Pane, Polyline } from 'react-leaflet'
import type { Segment } from '../../../types'
import { getCongestionColor, getCongestionPane } from '../../../lib/congestion'
import { useStore } from '../../../store'

interface SegmentLayerProps {
  segments: Segment[]
}

const PANES = ['segments-green', 'segments-yellow', 'segments-orange', 'segments-red'] as const
const Z_INDEXES = { 'segments-green': 450, 'segments-yellow': 451, 'segments-orange': 452, 'segments-red': 453 }

export function SegmentLayer({ segments }: SegmentLayerProps) {
  const showTraffic = useStore((s) => s.showTraffic)
  const setSelectedItem = useStore((s) => s.setSelectedItem)

  if (!showTraffic) return null

  // Freeways get bold lines; primary/secondary arterials get thinner lines
  const getWeight = (seg: Segment) => seg.frc === 1 ? 7 : seg.frc === 2 ? 4 : 2.5

  return (
    <>
      {PANES.map((paneName) => (
        <Pane key={paneName} name={paneName} style={{ zIndex: Z_INDEXES[paneName] }}>
          {segments
            .filter((seg) => getCongestionPane(seg.congestionLevel) === paneName)
            .map((seg) => (
              <Polyline
                key={seg.segmentId}
                positions={seg.positions}
                pathOptions={{
                  color: getCongestionColor(seg.congestionLevel),
                  weight: getWeight(seg),
                  opacity: 0.88,
                }}
                eventHandlers={{
                  click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
                }}
              />
            ))}
        </Pane>
      ))}
    </>
  )
}
