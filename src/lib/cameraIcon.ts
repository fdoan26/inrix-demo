import L from 'leaflet'

export function createCameraIcon(count: number): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:28px;height:28px;
      background:#000;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:white;font-weight:bold;font-size:11px;
      border:2px solid #444;
    ">${count}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
