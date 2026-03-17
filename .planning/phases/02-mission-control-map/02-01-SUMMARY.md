---
phase: 02-mission-control-map
plan: "01"
subsystem: map-view
tags: [leaflet, react-leaflet, map-layers, polylines, divicon, legends, zustand]
dependency_graph:
  requires: [src/data/segments.ts, src/data/alerts.ts, src/data/cameras.ts, src/store/index.ts, src/types/index.ts]
  provides: [src/components/mission-control/MapView.tsx, src/lib/congestion.ts, src/lib/alertIcons.ts, src/lib/cameraIcon.ts]
  affects: [src/store/uiSlice.ts]
tech_stack:
  added: []
  patterns: [react-leaflet Pane z-ordering, L.divIcon inline styles, useMapEvents for map click handler, MapController stub pattern]
key_files:
  created:
    - src/lib/congestion.ts
    - src/lib/alertIcons.ts
    - src/lib/cameraIcon.ts
    - src/components/mission-control/MapView.tsx
    - src/components/mission-control/MapController.tsx
    - src/components/mission-control/layers/SegmentLayer.tsx
    - src/components/mission-control/layers/AlertLayer.tsx
    - src/components/mission-control/layers/CameraLayer.tsx
    - src/components/mission-control/legends/CongestionLegend.tsx
    - src/components/mission-control/legends/AlertsLegend.tsx
  modified:
    - src/store/uiSlice.ts
decisions:
  - "Use 4 separate named Panes (segments-green/yellow/orange/red) for polyline z-ordering — SVG paths ignore CSS z-index"
  - "L.divIcon uses inline styles only — Tailwind JIT scanner misses template string dynamic classes"
  - "Add alert type to SelectedItem union in uiSlice.ts to support AlertLayer click handler type safety"
  - "MapController reads center/zoom from store and calls map.setView() — stub for Phase 3 fly-to-selected"
metrics:
  duration_minutes: 2
  completed_date: "2026-03-17"
  tasks_completed: 2
  files_created: 10
  files_modified: 1
---

# Phase 2 Plan 01: Mission Control Map Layers Summary

**One-liner:** CartoDB Dark Matter map with 4-pane Polyline traffic layer, teardrop alert pins, black circle camera badges, and absolute-positioned legend overlays using react-leaflet and Zustand selectors.

## What Was Built

All 10 new files created under `src/lib/` and `src/components/mission-control/`:

**Utility Libraries (src/lib/):**
- `congestion.ts` — getCongestionColor, getCongestionPane, getCongestionLabel pure functions
- `alertIcons.ts` — createAlertIcon factory with teardrop L.divIcon + ALERT_COLORS record
- `cameraIcon.ts` — createCameraIcon factory with black circle L.divIcon

**Map Layers (src/components/mission-control/layers/):**
- `SegmentLayer.tsx` — 4 named react-leaflet Panes with Polylines from segments.ts, filter-gated on showTraffic
- `AlertLayer.tsx` — Markers from alerts.ts with teardrop icons, filter-gated on showAlerts
- `CameraLayer.tsx` — Markers from cameras.ts with cluster count badges, filter-gated on showCameras

**Legend Overlays (src/components/mission-control/legends/):**
- `CongestionLegend.tsx` — Absolute-positioned bottom-left with local show/hide toggle
- `AlertsLegend.tsx` — Absolute-positioned at left:190px with visible prop gate

**Core Components:**
- `MapController.tsx` — Renderless component using useMap().setView(center, zoom), stub for Phase 3
- `MapView.tsx` — MapContainer with CartoDB Dark Matter tiles, all layers composed, legends outside container

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| 4 separate Pane components | Named Panes are the only way to z-order react-leaflet SVG paths |
| Inline styles for divIcon | Tailwind JIT cannot scan template string class names at build time |
| alert type in SelectedItem union | AlertLayer.setSelectedItem({ type: 'alert' }) requires type coverage |
| MapController stub now | Avoids rework in Phase 3; pattern established for programmatic pan/zoom |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Type] Added 'alert' to SelectedItem union in uiSlice.ts**
- **Found during:** Task 2 implementation
- **Issue:** uiSlice.ts SelectedItem only had segment and camera types; AlertLayer needs to call setSelectedItem({ type: 'alert', id }) which would be a TypeScript error
- **Fix:** Added `| { type: 'alert'; id: string }` to the SelectedItem union type
- **Files modified:** src/store/uiSlice.ts
- **Commit:** a85fe1d

## Self-Check: PASSED

All 10 created files confirmed on disk. Both task commits (a0b2d67, a85fe1d) confirmed in git log.
