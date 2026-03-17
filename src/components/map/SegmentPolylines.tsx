import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import type { Segment } from '../../types';
import { useStore } from '../../store';

interface Props {
  segments: Segment[];
}

function getCongestionColor(level: number): string {
  if (level < 25) return '#22c55e';   // green — free flow
  if (level < 50) return '#eab308';   // yellow — moderate
  if (level < 75) return '#f97316';   // orange — slow
  return '#ef4444';                    // red — stopped
}

function getCongestionLabel(level: number): string {
  if (level < 25) return 'Free Flow';
  if (level < 50) return 'Moderate';
  if (level < 75) return 'Slow';
  return 'Stopped';
}

export const SegmentPolylines: React.FC<Props> = ({ segments }) => {
  const setSelectedItem = useStore((s) => s.setSelectedItem);

  return (
    <>
      {segments.map((seg) => {
        const color = getCongestionColor(seg.congestionLevel);
        const positions = seg.positions;

        return (
          <React.Fragment key={seg.segmentId}>
            {/* Shadow / outline polyline for contrast */}
            <Polyline
              positions={positions}
              pathOptions={{
                color: '#000000',
                weight: 8,
                opacity: 0.4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Main colored polyline */}
            <Polyline
              positions={positions}
              pathOptions={{
                color,
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
                mouseover: (e) => {
                  e.target.setStyle({ weight: 7, opacity: 1 });
                },
                mouseout: (e) => {
                  e.target.setStyle({ weight: 5, opacity: 0.95 });
                },
              }}
            >
              <Tooltip
                sticky
                className="leaflet-tooltip-dark"
                offset={[0, -5]}
              >
                <div style={{
                  background: '#0d1f3c',
                  border: '1px solid #1e3a5f',
                  borderRadius: 6,
                  padding: '6px 10px',
                  fontSize: 12,
                  color: '#ffffff',
                  minWidth: 180,
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{seg.name}</div>
                  <div style={{ color, fontWeight: 700, fontSize: 13 }}>
                    {getCongestionLabel(seg.congestionLevel)} — {seg.currentSpeed} mph
                  </div>
                  <div style={{ color: '#8ca0bc', marginTop: 2 }}>
                    Travel time: {seg.travelTime} min (avg {seg.avgTravelTime} min)
                  </div>
                </div>
              </Tooltip>
            </Polyline>
          </React.Fragment>
        );
      })}
    </>
  );
};
