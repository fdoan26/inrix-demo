import L from 'leaflet'
import type { AlertType } from '../types'

// Standard upright location-pin path (28×36 viewBox)
const PIN_PATH =
  'M14 1C7.1 1 1.5 6.6 1.5 13.5c0 4.9 2.7 9.2 6.7 11.5L14 35l5.8-10C23.8 22.7 26.5 18.4 26.5 13.5 26.5 6.6 20.9 1 14 1z'

// Unique IDs so multiple hazard pins on the map don't share SVG <defs>
let _uid = 0

function hazardPin(): string {
  const id = `haz${_uid++}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <defs>
      <pattern id="${id}p" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <rect width="4" height="8" fill="#f9a825"/>
        <rect x="4" width="4" height="8" fill="#1a1a1a"/>
      </pattern>
      <clipPath id="${id}c"><path d="${PIN_PATH}"/></clipPath>
    </defs>
    <rect width="28" height="36" fill="url(#${id}p)" clip-path="url(#${id}c)"/>
    <path d="${PIN_PATH}" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/>
  </svg>`
}

// White icon SVGs placed in a 14×14 box, centered at (7,7) → translated to (7,5) in pin
const ICONS: Record<string, string> = {
  // Bold exclamation mark
  dangerous_slowdown: `
    <rect x="5.5" y="0" width="3" height="9" rx="1.5" fill="white"/>
    <circle cx="7" cy="13" r="2" fill="white"/>`,

  // 6-spoked starburst / asterisk
  crash: `
    <line x1="7" y1="0" x2="7" y2="14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="0.5" y1="10.5" x2="13.5" y2="3.5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="0.5" y1="3.5" x2="13.5" y2="10.5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`,

  // X mark
  road_closure: `
    <line x1="1" y1="1" x2="13" y2="13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="13" y1="1" x2="1" y2="13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`,

  // Calendar icon
  event: `
    <rect x="1" y="3" width="12" height="11" rx="1" fill="none" stroke="white" stroke-width="1.5"/>
    <line x1="4" y1="1" x2="4" y2="5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="10" y1="1" x2="10" y2="5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="1" y1="7" x2="13" y2="7" stroke="white" stroke-width="1.5"/>`,

  // Car / vehicle top-view
  congestion: `
    <path d="M11.5 3.5C11.3 2.9 10.8 2.5 10.2 2.5H3.8C3.2 2.5 2.7 2.9 2.5 3.5L1 7.5v5c0 .3.2.5.5.5H2c.3 0 .5-.2.5-.5v-.5h9v.5c0 .3.2.5.5.5h.5c.3 0 .5-.2.5-.5v-5L11.5 3.5zM3.5 10C3.1 10 2.75 9.65 2.75 9.25S3.1 8.5 3.5 8.5s.75.35.75.75S3.9 10 3.5 10zm7 0c-.4 0-.75-.35-.75-.75s.35-.75.75-.75.75.35.75.75S10.9 10 10.5 10zM2.5 6.5 3.4 4h7.2l.9 2.5H2.5z" fill="white"/>`,
}

export const ALERT_COLORS: Record<AlertType, string> = {
  dangerous_slowdown: '#e53935',
  crash:              '#e53935',
  road_closure:       '#b71c1c',
  construction:       '', // uses hazard stripes
  hazard:             '', // uses hazard stripes
  event:              '#2e7d32',
  congestion:         '#1a3a6b',
}

function solidPin(color: string, iconKey: string): string {
  const icon = ICONS[iconKey] ?? ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="${PIN_PATH}" fill="${color}"/>
    <path d="${PIN_PATH}" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
    <g transform="translate(7,5)">${icon}</g>
  </svg>`
}

export function createAlertIcon(type: AlertType): L.DivIcon {
  const html =
    type === 'construction' || type === 'hazard'
      ? hazardPin()
      : solidPin(ALERT_COLORS[type] ?? '#e53935', type)

  return L.divIcon({
    html: `<div style="width:28px;height:36px;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.45))">${html}</div>`,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
  })
}
