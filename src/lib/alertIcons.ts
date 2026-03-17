import L from 'leaflet'
import type { AlertType } from '../types'

// SVG symbols for each alert type (white, rendered inside colored teardrop)
const ICONS: Record<AlertType, string> = {
  crash: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
  </svg>`,
  dangerous_slowdown: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>`,
  road_closure: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>`,
  construction: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M13.78 15.3L19.78 9.3L18.37 7.88L13.78 12.47L11.5 10.19L10.09 11.6L13.78 15.3ZM4 18V15L12 7.5C12.27 7.22 12.59 7.08 12.95 7.08C13.31 7.08 13.63 7.22 13.9 7.5L15.5 9C15.77 9.27 15.91 9.59 15.91 9.95C15.91 10.31 15.77 10.63 15.5 10.9L8 18H4ZM5.5 16.5H7.25L12.9 10.9L12.1 10.05L11.25 9.15L5.5 14.75V16.5Z"/>
  </svg>`,
  hazard: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
  </svg>`,
  event: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
  </svg>`,
  congestion: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>`,
}

export const ALERT_COLORS: Record<AlertType, string> = {
  crash: '#d32f2f',
  dangerous_slowdown: '#d32f2f',
  road_closure: '#c62828',
  construction: '#e65100',
  hazard: '#e65100',
  event: '#1565c0',
  congestion: '#1565c0',
}

export function createAlertIcon(type: AlertType): L.DivIcon {
  const color = ALERT_COLORS[type] ?? '#d32f2f'
  const svgIcon = ICONS[type] ?? ICONS.hazard
  return L.divIcon({
    html: `<div style="
      width:24px;height:28px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid rgba(255,255,255,0.9);
      box-shadow:0 2px 6px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
    "><div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
      ${svgIcon}
    </div></div>`,
    className: '',
    iconSize: [24, 28],
    iconAnchor: [12, 28],
  })
}
