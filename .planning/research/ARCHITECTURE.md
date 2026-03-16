# Architecture Research

**Domain:** React + TypeScript SPA — Traffic Intelligence Investor Demo
**Researched:** 2026-03-16
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Shell                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NavBar (view switcher: Mission Control / Signal Analytics)│   │
│  └──────────────────────────────────────────────────────────┘   │
├────────────────────────┬────────────────────────────────────────┤
│   MissionControlView   │        SignalAnalyticsView             │
│  ┌──────────────────┐  │  ┌────────────────────────────────┐   │
│  │   FilterBar      │  │  │  LeftKPIPanel                  │   │
│  ├──────────────────┤  │  │  ├── SummaryCountsGrid         │   │
│  │   MapView        │  │  │  ├── ControlDelayStats         │   │
│  │  ┌────────────┐  │  │  │  ├── ControlDelayChart (RC)    │   │
│  │  │SegmentLayer│  │  │  │  └── LOSTable                  │   │
│  │  │ AlertLayer │  │  │  ├──────────────────────────────  │   │
│  │  │CameraLayer │  │  │  │  CenterContent                 │   │
│  │  │Legend(s)   │  │  │  │  ├── DelayIssuesTableTotal     │   │
│  │  └────────────┘  │  │  │  ├── DelayIssuesTablePerVeh    │   │
│  └──────────────────┘  │  │  └── CorridorIssuesTable       │   │
│   DetailPanel (slide)  │  │  BackgroundMap (Leaflet)        │   │
└────────────────────────┴──┴────────────────────────────────────┘
│                                                                 │
│                    Zustand Store                                │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐   │
│  │  mapSlice  │  │filterSlice │  │uiSlice   │  │dataSlice │   │
│  └────────────┘  └────────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    Mock Data Layer                              │
│  segments.ts    alerts.ts    cameras.ts    signalData.ts        │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `App` | Root: renders NavBar + active view | Zustand uiSlice (activeView) |
| `NavBar` | Logo, view switcher, right-side icons | Zustand uiSlice (setActiveView) |
| `MissionControlView` | Orchestrates map layout | FilterBar, MapView, DetailPanel |
| `FilterBar` | Network/Corridors toggle, Map Version, Traffic/Alerts/Cameras toggles | Zustand filterSlice |
| `MapView` | MapContainer + TileLayer + all layers + legends | Zustand mapSlice, filterSlice |
| `SegmentLayer` | Renders Polyline per segment, color by congestion | Zustand filterSlice.showTraffic, uiSlice.setSelectedItem |
| `AlertLayer` | Renders Marker per alert with custom divIcon | Zustand filterSlice.showAlerts |
| `CameraLayer` | Renders Marker per camera with cluster badge | Zustand filterSlice.showCameras, uiSlice.setSelectedItem |
| `CongestionLegend` | Static overlay bottom-left | filterSlice.showTraffic (visibility gate) |
| `AlertsLegend` | Static overlay bottom-left | filterSlice.showAlerts (visibility gate) |
| `DetailPanel` | Slide-in right panel for segment or camera detail | Zustand uiSlice.selectedItem, uiSlice.clearSelected |
| `SignalAnalyticsView` | Left KPI panel + center tables + background map | Zustand uiSlice (activeView gate) |
| `LeftKPIPanel` | Summary counts, delay stats, bar chart, LOS table | signalData mock |
| `ControlDelayChart` | Recharts BarChart of avg control delay over time | signalData.controlDelayByHour |
| `LOSTable` | Intersection counts by grade A-F | signalData.losDistribution |
| `DelayIssuesTable` | Top 5 worsened total or per-vehicle rows | signalData.topDelayIssues |
| `CorridorIssuesTable` | Top 3 corridor issues with TTI and delta | signalData.corridorIssues |
| `BackgroundMap` | Light muted Leaflet map behind Signal Analytics | No interaction, display only |

---

## Recommended Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── NavBar.tsx               # Top nav + view switcher
│   │   └── AppShell.tsx             # Outer layout wrapper
│   ├── mission-control/
│   │   ├── MissionControlView.tsx   # View orchestrator
│   │   ├── FilterBar.tsx            # Top filter row
│   │   ├── MapView.tsx              # MapContainer root
│   │   ├── layers/
│   │   │   ├── SegmentLayer.tsx     # Polylines for road segments
│   │   │   ├── AlertLayer.tsx       # Alert pin markers
│   │   │   └── CameraLayer.tsx      # Camera markers with badges
│   │   ├── legends/
│   │   │   ├── CongestionLegend.tsx # Bottom-left congestion key
│   │   │   └── AlertsLegend.tsx     # Bottom-left alerts key
│   │   └── DetailPanel.tsx          # Slide-in right panel
│   └── signal-analytics/
│       ├── SignalAnalyticsView.tsx  # View orchestrator
│       ├── LeftKPIPanel.tsx         # Left summary panel
│       ├── ControlDelayChart.tsx    # Recharts bar chart
│       ├── LOSTable.tsx             # LOS grade distribution
│       ├── DelayIssuesTable.tsx     # Top 5 delay table (reused for both)
│       ├── CorridorIssuesTable.tsx  # Top 3 corridor table
│       └── BackgroundMap.tsx        # Light muted map background
├── store/
│   ├── index.ts                     # Combined store creation
│   ├── mapSlice.ts                  # Map center, zoom, bounds
│   ├── filterSlice.ts               # Toggle states (traffic/alerts/cameras)
│   ├── uiSlice.ts                   # Active view, selected item, panel open
│   └── dataSlice.ts                 # (optional) loaded data refs if needed
├── data/
│   ├── segments.ts                  # 25+ LA road segments
│   ├── alerts.ts                    # 20+ alerts
│   ├── cameras.ts                   # 15+ cameras
│   └── signalData.ts                # Austin TX signal analytics values
├── types/
│   └── index.ts                     # All TypeScript interfaces
├── lib/
│   ├── congestion.ts                # getCongestionColor(level) utility
│   ├── alertIcons.ts                # getAlertIcon(type) returns L.divIcon
│   └── cameraIcon.ts                # getCameraIcon(count) returns L.divIcon
├── App.tsx
├── main.tsx
└── index.css                        # Tailwind base imports
```

### Structure Rationale

- **components/mission-control/ vs components/signal-analytics/:** The two views are entirely distinct UIs. Grouping by view prevents cross-contamination and makes phase-by-phase build order obvious.
- **components/layout/:** NavBar and AppShell are shared across views. Separate folder prevents duplication.
- **store/:** Slices in separate files, composed in `index.ts`. Each slice is independently testable and readable.
- **data/:** Pure TypeScript constant files. No runtime fetching. Keeping data separate from components allows easy editing of mock values without touching UI code.
- **types/:** Single source of truth for all interfaces. Imported everywhere — prevents drift between data files and components.
- **lib/:** Pure utility functions (color mapping, icon factories). These have no React dependencies and are easily tested.

---

## Component Tree (Explicit)

### Mission Control View

```
App
└── MissionControlView
    ├── FilterBar
    │   ├── NetworkCorridorsToggle
    │   ├── MapVersionDropdown
    │   ├── TrafficFlowToggle
    │   ├── AlertsToggle (with count badge)
    │   └── CamerasToggle
    ├── MapView  (react-leaflet MapContainer)
    │   ├── TileLayer (CartoDB Dark Matter)
    │   ├── SegmentLayer
    │   │   └── Polyline × N (one per segment, color from congestionLevel)
    │   ├── AlertLayer (gated: filterSlice.showAlerts)
    │   │   └── Marker × N (custom divIcon by alert type)
    │   │       └── Popup (description, type, severity)
    │   ├── CameraLayer (gated: filterSlice.showCameras)
    │   │   └── Marker × N (black marker with badge)
    │   │       └── Popup (camera name, highway)
    │   ├── CongestionLegend (Leaflet Control or absolute-positioned div)
    │   └── AlertsLegend (gated: filterSlice.showAlerts)
    └── DetailPanel (slide-in, gated: uiSlice.selectedItem !== null)
        ├── SegmentDetailView (when selectedItem.type === 'segment')
        └── CameraDetailView  (when selectedItem.type === 'camera')
```

### Signal Analytics View

```
App
└── SignalAnalyticsView
    ├── BackgroundMap  (react-leaflet MapContainer, no-interaction, light tiles)
    └── ContentOverlay  (absolute-positioned over map)
        ├── LeftKPIPanel
        │   ├── SummaryCountsGrid  (intersections / approaches / corridors / cameras)
        │   ├── ControlDelayStats  (total delay, avg per vehicle)
        │   ├── ControlDelayChart  (Recharts BarChart)
        │   └── LOSTable  (grades A-F with counts and color dots)
        └── CenterContent
            ├── DelayIssuesTable (variant="total")
            ├── DelayIssuesTable (variant="perVehicle")
            └── CorridorIssuesTable
```

---

## Zustand Store Design

### Store Composition Pattern

Use the Zustand slices pattern: each slice is a function returning its state and actions, composed in a single `create()` call in `store/index.ts`.

```typescript
// store/index.ts
import { create } from 'zustand'
import { createMapSlice, MapSlice } from './mapSlice'
import { createFilterSlice, FilterSlice } from './filterSlice'
import { createUISlice, UISlice } from './uiSlice'

export type StoreState = MapSlice & FilterSlice & UISlice

export const useStore = create<StoreState>()((...a) => ({
  ...createMapSlice(...a),
  ...createFilterSlice(...a),
  ...createUISlice(...a),
}))
```

### Slice 1: mapSlice

Owns Leaflet map viewport state. Used for any feature that needs to programmatically pan/zoom (e.g. clicking a segment to zoom to it).

```typescript
export interface MapSlice {
  center: [number, number]         // [lat, lng]
  zoom: number
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
}

export const createMapSlice = (set): MapSlice => ({
  center: [34.05, -118.25],        // Los Angeles
  zoom: 11,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
})
```

### Slice 2: filterSlice

Owns all FilterBar toggle states. Components subscribe to individual flags to avoid re-rendering on unrelated toggle changes.

```typescript
export interface FilterSlice {
  activeTab: 'network' | 'corridors'
  mapVersion: string
  showTraffic: boolean
  showAlerts: boolean
  showCameras: boolean
  alertCount: number
  setActiveTab: (tab: 'network' | 'corridors') => void
  setMapVersion: (version: string) => void
  toggleTraffic: () => void
  toggleAlerts: () => void
  toggleCameras: () => void
}

export const createFilterSlice = (set): FilterSlice => ({
  activeTab: 'network',
  mapVersion: 'Current',
  showTraffic: true,
  showAlerts: true,
  showCameras: true,
  alertCount: 23,                  // derived from alerts.ts at import time
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMapVersion: (version) => set({ mapVersion: version }),
  toggleTraffic: () => set((s) => ({ showTraffic: !s.showTraffic })),
  toggleAlerts: () => set((s) => ({ showAlerts: !s.showAlerts })),
  toggleCameras: () => set((s) => ({ showCameras: !s.showCameras })),
})
```

### Slice 3: uiSlice

Owns active view and selected item. The `selectedItem` drives DetailPanel open/close and which panel variant renders.

```typescript
export type SelectedItem =
  | { type: 'segment'; id: string }
  | { type: 'camera';  id: string }
  | null

export interface UISlice {
  activeView: 'mission-control' | 'signal-analytics'
  selectedItem: SelectedItem
  setActiveView: (view: 'mission-control' | 'signal-analytics') => void
  setSelectedItem: (item: SelectedItem) => void
  clearSelectedItem: () => void
}

export const createUISlice = (set): UISlice => ({
  activeView: 'mission-control',
  selectedItem: null,
  setActiveView: (view) => set({ activeView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
})
```

### Selector Usage Pattern

Each component subscribes to only what it needs to prevent cascading re-renders:

```typescript
// CameraLayer only re-renders when showCameras changes
const showCameras = useStore((s) => s.showCameras)

// DetailPanel only re-renders when selectedItem changes
const selectedItem = useStore((s) => s.selectedItem)
const clearSelectedItem = useStore((s) => s.clearSelectedItem)
```

---

## TypeScript Type Definitions

All interfaces in `src/types/index.ts`:

```typescript
// Road segment with polyline geometry and traffic attributes
export interface Segment {
  segmentId: string
  name: string
  positions: [number, number][]    // array of [lat, lng] for Polyline
  congestionLevel: number          // 0-100
  currentSpeed: number             // mph
  freeFlowSpeed: number            // mph
  speedBucket: 'free' | 'moderate' | 'heavy' | 'stop-and-go'
  travelTime: number               // seconds
  avgTravelTime: number            // seconds
  type: string                     // e.g. "Highway", "Arterial"
  frc: number                      // Functional Road Class 0-7
  lengthMiles: number
}

// Alert pin on the map
export interface Alert {
  id: string
  type: 'crash' | 'construction' | 'dangerous_slowdown' | 'road_closure' | 'event' | 'hazard' | 'congestion'
  position: [number, number]       // [lat, lng]
  description: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string                // ISO 8601
}

// Camera pin on the map
export interface Camera {
  id: string
  name: string                     // e.g. "CA-91 / East of Cherry Ave (E)"
  position: [number, number]       // [lat, lng]
  highway: string
  direction: 'N' | 'S' | 'E' | 'W' | 'NB' | 'SB' | 'EB' | 'WB'
  type: string                     // e.g. "CCTV"
}

// Signal analytics KPI summary
export interface SignalKPIs {
  intersectionCount: number
  approachCount: number
  corridorCount: number
  cameraCount: number
  totalControlDelay: number        // vehicle-hours
  avgControlDelayPerVehicle: number // seconds/vehicle
}

// One bar in the control delay chart
export interface ControlDelayDataPoint {
  label: string                    // e.g. "Mon", "Tue" or hour string
  avgDelay: number                 // seconds
}

// LOS grade distribution row
export interface LOSGrade {
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  count: number
  color: string                    // hex
}

// Top delay issue row
export interface DelayIssueRow {
  intersection: string
  fourWeekAvg: number              // seconds
  currentWeek: number              // seconds
  delta: number                    // positive = worsened
}

// Corridor issue row
export interface CorridorIssueRow {
  corridor: string
  travelTime: number               // seconds
  travelTimeIndex: number          // ratio e.g. 1.42
  delta: number                    // positive = worsened
}

// Full signal analytics dataset
export interface SignalData {
  kpis: SignalKPIs
  controlDelayHistory: ControlDelayDataPoint[]
  losDistribution: LOSGrade[]
  topDelayIssuesTotal: DelayIssueRow[]
  topDelayIssuesPerVehicle: DelayIssueRow[]
  corridorIssues: CorridorIssueRow[]
}
```

---

## react-leaflet Patterns

### MapContainer Setup

MapContainer must have an explicit height (not "100%" from a parent with no height). Use Tailwind `h-full` with a parent that has a fixed height or `h-screen`.

```tsx
// MapView.tsx
<div className="relative w-full h-full">
  <MapContainer
    center={[34.05, -118.25]}
    zoom={11}
    className="w-full h-full"
    zoomControl={false}
  >
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      maxZoom={19}
    />
    <SegmentLayer />
    <AlertLayer />
    <CameraLayer />
  </MapContainer>
  <CongestionLegend />   {/* absolute-positioned overlay — outside MapContainer */}
  <AlertsLegend />
</div>
```

**Critical:** Legend overlays are positioned absolutely over the map div, NOT inside MapContainer. Inside MapContainer they require Leaflet Control wrappers which adds complexity. Absolute-positioned divs with `pointer-events-none` on the map wrapper is simpler and sufficient.

### Polyline for Road Segments

```tsx
// SegmentLayer.tsx
import { Polyline } from 'react-leaflet'
import { segments } from '../../data/segments'
import { getCongestionColor } from '../../lib/congestion'
import { useStore } from '../../store'

export function SegmentLayer() {
  const showTraffic = useStore((s) => s.showTraffic)
  const setSelectedItem = useStore((s) => s.setSelectedItem)

  if (!showTraffic) return null

  return (
    <>
      {segments.map((seg) => (
        <Polyline
          key={seg.segmentId}
          positions={seg.positions}
          pathOptions={{
            color: getCongestionColor(seg.congestionLevel),
            weight: 4,
            opacity: 0.85,
          }}
          eventHandlers={{
            click: () => setSelectedItem({ type: 'segment', id: seg.segmentId }),
          }}
        />
      ))}
    </>
  )
}
```

### Custom DivIcon for Alerts

Leaflet's `L.divIcon` renders arbitrary HTML. This is the correct approach for color-coded alert pins (no external marker image files needed).

```typescript
// lib/alertIcons.ts
import L from 'leaflet'

const ALERT_COLORS: Record<string, string> = {
  crash: '#e53935',
  construction: '#ff9800',
  dangerous_slowdown: '#ffeb3b',
  road_closure: '#e53935',
  event: '#2196f3',
  hazard: '#ff9800',
  congestion: '#ffeb3b',
}

export function getAlertIcon(type: string): L.DivIcon {
  const color = ALERT_COLORS[type] ?? '#ffffff'
  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.6)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}
```

### Camera Marker with Badge

```typescript
// lib/cameraIcon.ts
import L from 'leaflet'

export function getCameraIcon(badgeCount?: number): L.DivIcon {
  const badge = badgeCount
    ? `<span style="position:absolute;top:-4px;right:-4px;background:#1a6eb5;color:#fff;border-radius:50%;width:14px;height:14px;font-size:9px;display:flex;align-items:center;justify-content:center;">${badgeCount}</span>`
    : ''
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:20px;height:20px;background:#222;border-radius:3px;border:1px solid #555;">
      <div style="position:absolute;inset:3px;background:#888;border-radius:50%"></div>
      ${badge}
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}
```

### Detail Panel Slide Animation

Use Tailwind `translate-x-full` / `translate-x-0` with `transition-transform` for slide-in from right. No animation library needed.

```tsx
// DetailPanel.tsx
<div
  className={`fixed top-[88px] right-0 h-[calc(100vh-88px)] w-80 bg-[#0d1f3c] border-l border-[#1e3a5f] transition-transform duration-300 z-[1000] ${
    selectedItem ? 'translate-x-0' : 'translate-x-full'
  }`}
>
```

**Note:** `z-[1000]` is required. Leaflet uses z-index 400–600 for its layers; the panel must be above all of them.

---

## Mock Data File Structure

```typescript
// src/data/segments.ts
import { Segment } from '../types'

export const segments: Segment[] = [
  {
    segmentId: 'SEG-001',
    name: 'I-10 / Santa Monica Freeway — Downtown to Beverly Hills',
    positions: [
      [34.0522, -118.2437],
      [34.0520, -118.2600],
      [34.0519, -118.2800],
      // ... more coords for polyline shape
    ],
    congestionLevel: 78,
    currentSpeed: 18,
    freeFlowSpeed: 65,
    speedBucket: 'stop-and-go',
    travelTime: 420,
    avgTravelTime: 180,
    type: 'Highway',
    frc: 1,
    lengthMiles: 4.2,
  },
  // ... 24 more
]
```

```typescript
// src/data/signalData.ts
import { SignalData } from '../types'

export const signalData: SignalData = {
  kpis: {
    intersectionCount: 342,
    approachCount: 1156,
    corridorCount: 18,
    cameraCount: 89,
    totalControlDelay: 2847,           // vehicle-hours (matches Austin screenshot)
    avgControlDelayPerVehicle: 34.2,   // seconds
  },
  controlDelayHistory: [
    { label: 'Mon', avgDelay: 29.1 },
    { label: 'Tue', avgDelay: 31.4 },
    { label: 'Wed', avgDelay: 33.8 },
    { label: 'Thu', avgDelay: 36.2 },
    { label: 'Fri', avgDelay: 34.2 },
  ],
  // ... rest of Austin TX screenshot values
}
```

---

## Data Flow

### User Clicks a Segment

```
User clicks Polyline
    ↓
SegmentLayer eventHandlers.click
    ↓
useStore.setSelectedItem({ type: 'segment', id: 'SEG-001' })
    ↓
Zustand uiSlice updates selectedItem
    ↓
DetailPanel re-renders (subscribed to selectedItem)
    ↓
DetailPanel reads segments.find(id) for display data
    ↓
Panel slides in via CSS transition
```

### Filter Toggle

```
User clicks Alerts toggle in FilterBar
    ↓
FilterBar calls useStore.toggleAlerts()
    ↓
Zustand filterSlice updates showAlerts: false
    ↓
AlertLayer re-renders (subscribed to showAlerts)
    ↓
AlertLayer returns null → pins removed from map
    ↓
AlertsLegend re-renders (subscribed to showAlerts) → hidden
```

### View Switch

```
User clicks "Signal Analytics" in NavBar
    ↓
NavBar calls useStore.setActiveView('signal-analytics')
    ↓
App re-renders (subscribed to activeView)
    ↓
Renders SignalAnalyticsView instead of MissionControlView
```

---

## Build Order (Phase Dependencies)

Components must be built in this order because later components depend on earlier ones:

| Build Order | Component / File | Depends On |
|-------------|-----------------|------------|
| 1 | `src/types/index.ts` | Nothing — define all interfaces first |
| 2 | `src/data/*.ts` (all 4 files) | types/index.ts |
| 3 | `src/lib/congestion.ts`, `alertIcons.ts`, `cameraIcon.ts` | types/index.ts |
| 4 | `src/store/*.ts` (all slices + index) | types (SelectedItem) |
| 5 | `NavBar.tsx`, `AppShell.tsx` | store/uiSlice (setActiveView, activeView) |
| 6 | `MapView.tsx` (empty MapContainer + TileLayer only) | Nothing beyond react-leaflet |
| 7 | `SegmentLayer.tsx` | types, data/segments, lib/congestion, store/filterSlice |
| 8 | `AlertLayer.tsx` | types, data/alerts, lib/alertIcons, store/filterSlice |
| 9 | `CameraLayer.tsx` | types, data/cameras, lib/cameraIcon, store/filterSlice |
| 10 | `CongestionLegend.tsx`, `AlertsLegend.tsx` | store/filterSlice |
| 11 | `FilterBar.tsx` | store/filterSlice |
| 12 | `DetailPanel.tsx` + sub-views | types, data/segments, data/cameras, store/uiSlice |
| 13 | `MissionControlView.tsx` | All of 6-12 |
| 14 | `ControlDelayChart.tsx` | data/signalData, Recharts |
| 15 | `LOSTable.tsx`, `DelayIssuesTable.tsx`, `CorridorIssuesTable.tsx` | data/signalData, types |
| 16 | `LeftKPIPanel.tsx` | 14, 15 |
| 17 | `BackgroundMap.tsx` | react-leaflet |
| 18 | `SignalAnalyticsView.tsx` | 16, 17 |
| 19 | `App.tsx` | store/uiSlice, MissionControlView, SignalAnalyticsView |

---

## Anti-Patterns

### Anti-Pattern 1: Putting Legend Overlays Inside MapContainer

**What people do:** Place `<CongestionLegend />` as a direct child of `<MapContainer>` for "proper" positioning.
**Why it's wrong:** MapContainer children must be valid React-Leaflet layer components. Plain divs inside MapContainer do not render correctly — they are passed to Leaflet's layer system, not the DOM. You would need `createPortal` or the Leaflet `Control` API to make it work.
**Do this instead:** Position legends as absolute-positioned divs inside the map wrapper div, outside `<MapContainer>`. Use `z-[500]` to float above map tiles.

### Anti-Pattern 2: Storing Full Data Objects in Zustand

**What people do:** `setSelectedItem(fullSegmentObject)` — put the entire Segment into the store.
**Why it's wrong:** Creates serialization/equality issues, makes the store a second copy of the data layer, and makes TypeScript unwieldy. Any update to the segment data means updating both the data file and the store.
**Do this instead:** Store only `{ type, id }` in Zustand. Components that need the full object do a lookup: `segments.find(s => s.segmentId === selectedItem.id)`. Data stays in `src/data/`, store stays lean.

### Anti-Pattern 3: Subscribing to the Entire Store

**What people do:** `const store = useStore()` — subscribe to everything.
**Why it's wrong:** Component re-renders on every state change across all slices, even unrelated ones. CameraLayer re-renders when the active view changes.
**Do this instead:** Use targeted selectors: `const showCameras = useStore((s) => s.showCameras)`. Each component subscribes only to what it reads.

### Anti-Pattern 4: Using `useMap()` Outside MapContainer

**What people do:** Call `useMap()` hook in a component rendered outside `<MapContainer>` (e.g. in FilterBar or DetailPanel).
**Why it's wrong:** `useMap()` relies on React context provided by `MapContainer`. Calling it outside throws a runtime error: "No map context provided".
**Do this instead:** Any programmatic map control (pan, zoom) must happen inside a child component of MapContainer, or through a Zustand action that a component inside MapContainer subscribes to and applies via `useMap()`.

### Anti-Pattern 5: Passing `center` Directly to MapContainer for Dynamic Panning

**What people do:** `<MapContainer center={storeCenter}>` and updating `storeCenter` to pan the map.
**Why it's wrong:** `center` on `MapContainer` is an initialization-only prop — changes after mount are silently ignored by react-leaflet. The map does not re-center.
**Do this instead:** Create a `MapController` component inside `MapContainer` that calls `useMap().setView(center, zoom)` when Zustand state changes:
```tsx
function MapController() {
  const map = useMap()
  const center = useStore((s) => s.center)
  const zoom = useStore((s) => s.zoom)
  useEffect(() => { map.setView(center, zoom) }, [center, zoom])
  return null
}
```

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| CartoDB Dark Matter tiles | `TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"` | No API key required. Free for demo use. |
| CartoDB Positron tiles (light) | `TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"` | Used for Signal Analytics BackgroundMap. No API key required. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| FilterBar ↔ MapView layers | Zustand filterSlice (showTraffic, showAlerts, showCameras) | No prop drilling — layers read store directly |
| Map layers ↔ DetailPanel | Zustand uiSlice (selectedItem) | Click in layer, display in panel — no shared parent props |
| NavBar ↔ Views | Zustand uiSlice (activeView) | App.tsx reads activeView to conditionally render view |
| SignalAnalyticsView ↔ data | Direct import from data/signalData.ts | No store needed — signal data is static display |

---

## Scaling Considerations

This is a single-user investor demo with static mock data. Scaling is not a concern. The notes below apply only if this were extended to a real product.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Demo (current) | All mock data imported at bundle time — fast, zero latency |
| Real product (future) | Replace `src/data/*.ts` with API service layer; add React Query for fetching/caching |
| Multi-user SaaS (v2+) | Extract Zustand store to server state (React Query) + client UI state (Zustand); add WebSocket for live updates |

---

## Sources

- [React Leaflet documentation — Child Components](https://react-leaflet.js.org/docs/api-components/) — HIGH confidence
- [React Leaflet — Vector Layers examples](https://react-leaflet.js.org/docs/example-vector-layers/) — HIGH confidence
- [Render Multiple Colored Polylines — Paige Niedringhaus](https://www.paigeniedringhaus.com/blog/render-multiple-colored-lines-on-a-react-map-with-polylines/) — MEDIUM confidence
- [Zustand Slices Pattern — Atlys Engineering](https://engineering.atlys.com/a-slice-based-zustand-store-for-next-js-14-and-typescript-6b92385a48f5) — MEDIUM confidence
- [Zustand pmndrs GitHub](https://github.com/pmndrs/zustand) — HIGH confidence
- [Optimizing Zustand re-renders](https://dev.to/eraywebdev/optimizing-zustand-how-to-prevent-unnecessary-re-renders-in-your-react-app-59do) — MEDIUM confidence
- [React Vite folder structure 2025 — Robin Wieruch](https://www.robinwieruch.de/react-folder-structure/) — HIGH confidence

---

*Architecture research for: React + TypeScript SPA — INRIX IQ Traffic Intelligence Demo*
*Researched: 2026-03-16*
