import { Pane, Polyline } from 'react-leaflet'
import { segments } from '../../../data/segments'
import { getCongestionColor, getCongestionPane } from '../../../lib/congestion'
import { useStore } from '../../../store'

export function SegmentLayer() {
  const showTraffic = useStore((s) => s.showTraffic)
  const setSelectedItem = useStore((s) => s.setSelectedItem)

  if (!showTraffic) return null

  return (
    <>
      <Pane name="segments-green" style={{ zIndex: 450 }}>
        {segments
          .filter((seg) => getCongestionPane(seg.congestionLevel) === 'segments-green')
          .map((seg) => (
            <Polyline
              key={seg.segmentId}
              positions={seg.positions}
              pathOptions={{ color: getCongestionColor(seg.congestionLevel), weight: 4, opacity: 0.85 }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
              }}
            />
          ))}
      </Pane>
      <Pane name="segments-yellow" style={{ zIndex: 451 }}>
        {segments
          .filter((seg) => getCongestionPane(seg.congestionLevel) === 'segments-yellow')
          .map((seg) => (
            <Polyline
              key={seg.segmentId}
              positions={seg.positions}
              pathOptions={{ color: getCongestionColor(seg.congestionLevel), weight: 4, opacity: 0.85 }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
              }}
            />
          ))}
      </Pane>
      <Pane name="segments-orange" style={{ zIndex: 452 }}>
        {segments
          .filter((seg) => getCongestionPane(seg.congestionLevel) === 'segments-orange')
          .map((seg) => (
            <Polyline
              key={seg.segmentId}
              positions={seg.positions}
              pathOptions={{ color: getCongestionColor(seg.congestionLevel), weight: 4, opacity: 0.85 }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
              }}
            />
          ))}
      </Pane>
      <Pane name="segments-red" style={{ zIndex: 453 }}>
        {segments
          .filter((seg) => getCongestionPane(seg.congestionLevel) === 'segments-red')
          .map((seg) => (
            <Polyline
              key={seg.segmentId}
              positions={seg.positions}
              pathOptions={{ color: getCongestionColor(seg.congestionLevel), weight: 4, opacity: 0.85 }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
              }}
            />
          ))}
      </Pane>
    </>
  )
}
