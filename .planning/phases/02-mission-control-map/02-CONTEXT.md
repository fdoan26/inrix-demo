# Phase 2: Mission Control Map - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the full Mission Control map view: CartoDB Dark Matter full-screen Leaflet map centered on LA, three overlay layers (road segment polylines, alert pins, camera pins), a working filter bar that shows/hides each layer, and congestion + alerts legend overlays at bottom-left. No detail panels yet (Phase 3). No Signal Analytics (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Map Foundation
- CartoDB Dark Matter tiles: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`
- Center: `[34.05, -118.25]`, zoom: 11, min zoom: 9, max zoom: 16
- MapContainer must have explicit `style={{ height: '100%', width: '100%' }}` — no CSS-only height
- `MissionControlView` wraps map in a `flex-1` div with `position: relative` so legends/panels can position absolutely outside the MapContainer

### Road Segment Polylines (from screenshots — green roads dominate)
- Use react-leaflet `<Polyline>` with `pathOptions={{ color, weight: 4, opacity: 0.85 }}`
- Color by `congestionLevel`: 0-25 → `#4caf50` (green), 26-50 → `#ffeb3b` (yellow), 51-75 → `#ff9800` (orange), 76-100 → `#f44336` (red)
- Use named react-leaflet `<Pane name="segments" style={{ zIndex: 450 }}>` for z-ordering — SVG paths ignore CSS z-index
- Clicking a polyline calls `setSelectedItem({ type: 'segment', id: segmentId })` in Zustand (detail panel is Phase 3 but the click handler should be wired now)
- Visible only when `showTraffic` filter is true

### Alert Pins (from screenshots — colored teardrop shapes)
- Use `L.divIcon` with inline styles (NOT Tailwind classes — JIT scanner misses template strings)
- Pin shape: colored teardrop/location marker using CSS `border-radius: 50% 50% 50% 0; transform: rotate(-45deg);`
- Color by alert type:
  - crash: `#e53935`
  - dangerous_slowdown: `#e53935`
  - road_closure: `#e53935`
  - construction: `#ff9800`
  - hazard: `#ff9800`
  - event: `#2196f3`
  - congestion: `#ffeb3b`
- Icon size: 20×20px anchor at [10, 20]
- Visible only when `showAlerts` filter is true
- Clicking an alert pin calls `setSelectedItem({ type: 'alert', id: alertId })`

### Camera Pins (from screenshots — black rounded markers with white numbers)
- Use `L.divIcon` with inline styles
- Shape: black rounded rectangle/circle (`border-radius: 50%`, background `#000`, 28×28px)
- White text centered showing `camera.clusterCount`
- Font: bold 11px white
- Visible only when `showCameras` filter is true
- Clicking calls `setSelectedItem({ type: 'camera', id: cameraId })`

### Filter Bar (exact from screenshots — already in NavBar area)
The filter bar appears BELOW the NavBar, same dark navy background (#0d1f3c):
- `<FilterBar />` component, rendered in MissionControlView above the map container
- Left to right: Network/Corridors toggle → Map Version → Traffic Flow toggle → Alerts toggle → Cameras toggle
- Each toggle item: `[PillSwitch] [Label] [(count badge)] [Subtitle ▾]`
- Traffic Flow toggle reads/sets `showTraffic` from filterSlice
- Alerts toggle reads/sets `showAlerts`, shows count badge with number of active alerts
- Cameras toggle reads/sets `showCameras`
- Toggle pill: blue (`#2196f3`) when ON, grey (`#4a5568`) when OFF
- Alerts toggle pill is orange (`#f57c00`) when ON to match screenshot

### Congestion Legend Overlay (bottom-left, from screenshot)
- Positioned `absolute bottom-4 left-4 z-[1000]` (above Leaflet panes)
- Semi-transparent dark background: `bg-black/70` or `background: rgba(0,0,0,0.7)`
- Rendered OUTSIDE MapContainer in the wrapper div
- "Alerts" section with colored dot + label rows: Dangerous Slowdowns, Construction, Road Closure, Events, Congestion, Hazards, Crashes
- "Congestion" section with color swatch + label: 76-100%, 51-75%, 26-50%, 0-25%
- Small `×` close button (calls a local `showLegend` toggle in component state)
- Width: ~160px

### Data Already Complete
Mock data (segments, alerts, cameras) was completed in Phase 1. DATA-01/02/03 requirements are already satisfied — this phase just renders them. No new data files needed.

### MapController Pattern (required for programmatic panning)
- `MapContainer.center` is init-only. Any future panning (Phase 3: fly to selected segment) requires a `<MapController />` child using `useMap().setView()`
- Build `MapController` in this phase even if not used until Phase 3 — avoids rework

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 Output (read these — they define existing code to build on)
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/types/index.ts` — Segment, Alert, Camera interfaces with exact field names
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/store/index.ts` — useStore, StoreState type
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/store/filterSlice.ts` — showTraffic/showAlerts/showCameras field names
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/store/mapSlice.ts` — selectedItem, setSelectedItem, mapCenter, zoom
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/data/segments.ts` — actual segment data (25 entries)
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/data/alerts.ts` — actual alert data (23 entries)
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/data/cameras.ts` — actual camera data (16 entries)
- `C:/Users/FisherDoan/Workspaces/inrix-demo/src/components/mission-control/MissionControlView.tsx` — existing placeholder to replace/extend

### Planning Reference
- `.planning/PROJECT.md` — color tokens, constraints
- `.planning/research/PITFALLS.md` — 12 pitfalls; Leaflet-specific ones are critical for this phase
- `.planning/research/ARCHITECTURE.md` — component tree, react-leaflet patterns, Pane design

### Visual Source of Truth
Screenshots provided by user (Mission Control view with camera selected, and with segment+alerts dropdown) are the canonical visual reference. CONTEXT.md decisions above are derived from those screenshots.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/store/index.ts`: `useStore` — read `showTraffic`, `showAlerts`, `showCameras`, `selectedItem`, `setSelectedItem`
- `src/store/filterSlice.ts`: `toggleTraffic()`, `toggleAlerts()`, `toggleCameras()` actions
- `src/data/segments.ts`: `segments` array — already typed, ready to map over
- `src/data/alerts.ts`: `alerts` array — ready to render
- `src/data/cameras.ts`: `cameras` array — ready to render
- `src/types/index.ts`: All interfaces — import before creating new files

### Established Patterns (from Phase 1)
- Tailwind utility classes for layout, but `L.divIcon` pins use inline styles only
- `useStore()` with selector for state reads (not destructuring whole store)
- Dark navy colors via Tailwind config tokens (e.g. `bg-navy-nav`)

### Integration Points
- `src/components/mission-control/MissionControlView.tsx`: Replace placeholder with map container
- `src/App.tsx`: Already renders `<MissionControlView />` — no changes needed here
- `tailwind.config.js`: z-index scale already extended to 1000 — safe to use `z-[1000]` in Tailwind

</code_context>

<specifics>
## Specific Ideas

### DivIcon Factory Pattern (avoid Tailwind JIT bug)
```typescript
// All pin colors/styles must be inline, not Tailwind classes
function createAlertIcon(type: AlertType): L.DivIcon {
  const color = ALERT_COLORS[type] ?? '#e53935';
  return L.divIcon({
    html: `<div style="
      width:20px;height:20px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
    "></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
}
```

### Camera Icon Pattern
```typescript
function createCameraIcon(count: number): L.DivIcon {
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
```

### Leaflet Default Icon Fix (must be in map component file)
```typescript
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
```

### Congestion Color Helper
```typescript
export function getCongestionColor(level: number): string {
  if (level <= 25) return '#4caf50';
  if (level <= 50) return '#ffeb3b';
  if (level <= 75) return '#ff9800';
  return '#f44336';
}
```
</specifics>

<deferred>
## Deferred Ideas

- Click-to-open detail panel (Phase 3) — click handlers wire up now but panel renders in Phase 3
- MapController fly-to animation (Phase 3) — stub the component in this phase
- Alerts dropdown sub-panel (Phase 3) — filter bar toggle opens dropdown with alert type checkboxes

</deferred>

---

*Phase: 02-mission-control-map*
*Context gathered: 2026-03-17*
