import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Alert, AlertType } from '../../types';

interface Props {
  alerts: Alert[];
}

const ALERT_COLORS: Record<AlertType, string> = {
  crash: '#ef4444',
  construction: '#f97316',
  dangerous_slowdown: '#dc2626',
  road_closure: '#7c3aed',
  event: '#22c55e',
  congestion: '#3b82f6',
  hazard: '#fbbf24',
};

const ALERT_LABELS: Record<AlertType, string> = {
  crash: 'Crash',
  construction: 'Construction',
  dangerous_slowdown: 'Dangerous Slowdown',
  road_closure: 'Road Closure',
  event: 'Event',
  congestion: 'Congestion',
  hazard: 'Hazard',
};

function createAlertIconWithType(type: AlertType): L.DivIcon {
  const color = ALERT_COLORS[type];

  // Use letter abbreviation instead of emoji for reliable rendering
  const letters: Record<AlertType, string> = {
    crash: 'C',
    construction: 'W',
    dangerous_slowdown: '!',
    road_closure: 'X',
    event: 'E',
    congestion: 'T',
    hazard: 'H',
  };
  const letter = letters[type];

  const html = `
    <div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Inter, system-ui, sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: white;
      line-height: 1;
    ">${letter}</div>
    <div style="
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${color};
      opacity: 0.15;
      position: absolute;
      top: -6px;
      left: -6px;
      pointer-events: none;
    "/>
  `;

  return L.divIcon({
    html,
    className: 'alert-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    tooltipAnchor: [12, 0],
  });
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export const AlertMarkers: React.FC<Props> = ({ alerts }) => {
  return (
    <>
      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={alert.position}
          icon={createAlertIconWithType(alert.type)}
        >
          <Tooltip
            permanent={false}
            sticky
            offset={[12, 0]}
          >
            <div style={{
              background: '#0d1f3c',
              border: `1px solid ${ALERT_COLORS[alert.type]}`,
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 12,
              color: '#ffffff',
              minWidth: 220,
              maxWidth: 280,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4,
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: ALERT_COLORS[alert.type],
                  flexShrink: 0,
                }} />
                <span style={{ fontWeight: 600, color: ALERT_COLORS[alert.type] }}>
                  {ALERT_LABELS[alert.type]}
                </span>
                <span style={{ color: '#4a6080', marginLeft: 'auto', fontSize: 11 }}>
                  {formatTime(alert.timestamp)}
                </span>
              </div>
              <div style={{ color: '#a0b4cc', fontSize: 11, lineHeight: 1.4, marginBottom: 3 }}>
                {alert.roadName}
              </div>
              <div style={{ color: '#c8d8e8', fontSize: 11, lineHeight: 1.4 }}>
                {alert.description}
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};
