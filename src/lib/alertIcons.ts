import L from 'leaflet'
import type { AlertType } from '../types'

export const ALERT_COLORS: Record<AlertType, string> = {
  crash: '#e53935',
  dangerous_slowdown: '#e53935',
  road_closure: '#e53935',
  construction: '#ff9800',
  hazard: '#ff9800',
  event: '#2196f3',
  congestion: '#ffeb3b',
}

export function createAlertIcon(type: AlertType): L.DivIcon {
  const color = ALERT_COLORS[type] ?? '#e53935';
  return L.divIcon({
    html: `<div style="
      width:20px;height:20px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 4px rgba(0,0,0,0.4);
    "></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
}
