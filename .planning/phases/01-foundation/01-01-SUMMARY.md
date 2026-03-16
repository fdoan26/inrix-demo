---
phase: 01-foundation
plan: "01"
subsystem: build-toolchain
tags: [dependencies, tailwind, typescript, leaflet, vite]
dependency_graph:
  requires: []
  provides: [pinned-deps, tailwind-v3-tokens, canonical-types, working-build]
  affects: [all-subsequent-plans]
tech_stack:
  added:
    - tailwindcss@3.4.19 (PostCSS plugin mode, replaces v4 Vite plugin)
    - postcss@8.5.8
    - autoprefixer@10.4.27
    - react@18.3.1 + react-dom@18.3.1 (downgraded from 19)
    - react-leaflet@4.2.1 (downgraded from v5)
    - recharts@2.15.4 (downgraded from v3)
    - vite@5.4.21 (downgraded from v8)
    - "@vitejs/plugin-react@4.7.0" (downgraded from v6)
  patterns:
    - Tailwind v3 PostCSS config (not v4 Vite plugin)
    - "leaflet/dist/leaflet.css imported before all other CSS"
    - "[number, number] tuples for all map coordinates (not LatLng objects)"
    - "ActiveView union type (2 views, not 5-module enum)"
key_files:
  created:
    - package.json (pinned versions)
    - tailwind.config.js (INRIX design tokens)
    - postcss.config.js (Tailwind v3 PostCSS pipeline)
  modified:
    - vite.config.ts (removed @tailwindcss/vite)
    - src/main.tsx (leaflet CSS first import)
    - src/index.css (@tailwind v3 directives)
    - src/types/index.ts (canonical interfaces with tuples)
    - tsconfig.app.json (confirmed bundler mode)
    - src/data/mockAlerts.ts (position tuples, severity values)
    - src/data/mockCameras.ts (position tuples, highway/clusterCount)
    - src/data/mockSegments.ts (positions tuples, new required fields)
    - src/store/useAppStore.ts (ActiveView, local types)
    - src/components/layout/Sidebar.tsx (2 views, ActiveView)
    - src/components/layout/Header.tsx (activeView)
    - src/App.tsx (activeView, 2-view switch)
    - src/components/map/AlertMarkers.tsx (tuple positions)
    - src/components/map/SegmentPolylines.tsx (positions field)
    - src/components/map/TrafficMap.tsx (tuple positions)
    - src/components/modules/SignalAnalytics.tsx (local interfaces)
    - src/components/panels/CameraPanel.tsx (highway, tuple positions)
decisions:
  - "Downgrade entire stack to pinned versions: React 18, Vite 5, react-leaflet 4, Recharts 2, Tailwind 3"
  - "Use Tailwind v3 PostCSS config (postcss.config.js + tailwind.config.js) not v4 @tailwindcss/vite plugin"
  - "Represent all map coordinates as [number, number] tuples throughout codebase"
  - "Reduce active views from 5 modules to 2 (mission-control, signal-analytics) matching CONTEXT.md"
metrics:
  duration_minutes: 5
  completed_date: "2026-03-16"
  tasks_completed: 2
  files_modified: 19
---

# Phase 1 Plan 1: Dependency Pinning and Config Foundation Summary

**One-liner:** Pinned React 18 / Vite 5 / Tailwind v3 / react-leaflet v4 stack, replaced v4 Vite plugin with PostCSS config, and migrated all map coordinates to `[number, number]` tuples throughout the codebase.

## What Was Built

The project scaffolded with wrong versions (React 19, react-leaflet v5, Tailwind v4, Vite 8, Recharts v3). This plan established the correct locked foundation:

1. **Package versions pinned** — Removed `@tailwindcss/vite` and `react-is`. Installed the full correct stack at exact versions matching STACK.md. `@types/leaflet` moved to devDependencies.

2. **Tailwind v3 PostCSS pipeline** — Created `tailwind.config.js` with all INRIX design tokens (navy-deep, navy-nav, accent-blue, all congestion/alert/LOS colors) and extended z-index scale (100, 500, 900, 1000). Created `postcss.config.js`. Replaced `@import "tailwindcss"` (v4) with `@tailwind base/components/utilities` (v3) in `index.css`.

3. **Import order fixed** — `src/main.tsx` now imports `leaflet/dist/leaflet.css` as its first line before `./index.css`, preventing the grey map tile bug.

4. **Canonical TypeScript interfaces** — `src/types/index.ts` rewritten with `[number, number]` tuples for all positions, `ActiveView` replacing the 5-module `Module` type, and new fields (`frc`, `lengthMiles`, `speedBucket`, `clusterCount`).

5. **Zero-error build** — `npm run build` completes cleanly. `npx tsc --noEmit` reports zero errors.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed all downstream breakages from type interface changes**
- **Found during:** Task 2 (first build attempt after type rewrite)
- **Issue:** Changing `Segment.coords: LatLng[]` to `Segment.positions: [number, number][]`, removing `LatLng`, `Module`, `FilterState`, `PanelContent`, and changing `Alert.severity` caused TypeScript errors in 12 source files.
- **Fix:** Updated all 12 affected files to use new types:
  - `mockAlerts.ts`: `position` object literals → tuples; severity `moderate`/`severe` → `medium`/`high`
  - `mockCameras.ts`: `position` object literals → tuples; `roadName` → `highway`; added `clusterCount: 1`; removed `screenshot`
  - `mockSegments.ts`: `coords` → `positions` tuples; added `type`, `frc`, `lengthMiles`, `speedBucket` to all 22 segments
  - `useAppStore.ts`: `Module`/`PanelContent`/`FilterState` defined locally; `activeModule` → `activeView`; `setActiveModule` → `setActiveView`
  - `Sidebar.tsx`: `Module` → `ActiveView`; 5 nav items → 2; store calls updated
  - `Header.tsx`: `activeModule` → `activeView`
  - `App.tsx`: `activeModule` → `activeView`; removed 3 "coming soon" modules; removed unused `React` import
  - `AlertMarkers.tsx`: `alert.position.lat/lng` → `alert.position` (direct tuple)
  - `SegmentPolylines.tsx`: `seg.coords.map(c => [c.lat, c.lng])` → `seg.positions`
  - `TrafficMap.tsx`: `cam.position.lat/lng` → `cam.position` tuple; removed redundant leaflet CSS import
  - `SignalAnalytics.tsx`: `ControlDelayDataPoint`, `IntersectionIssue`, `CorridorIssue` defined locally (removed from shared types)
  - `CameraPanel.tsx`: `camera.roadName` → `camera.highway`; `position.lat/lng` → `position[0]/position[1]`
- **Files modified:** 12 files (see key_files above)
- **Commit:** 85972f2

## Verification Results

All acceptance criteria met:

- `npm run build` completes with zero errors
- `npx tsc --noEmit` reports zero errors
- All package versions at pinned values (React 18.3.1, react-leaflet 4.2.1, Recharts 2.15.4, Tailwind 3.4.19, Vite 5.4.21)
- `@tailwindcss/vite` absent from package.json
- `tailwind.config.js` contains all design tokens including `navy-deep` and z-index `1000`
- `postcss.config.js` contains `tailwindcss: {}`
- `src/main.tsx` first import: `import 'leaflet/dist/leaflet.css'`
- `src/index.css` uses `@tailwind base/components/utilities`
- `src/index.css` preserves `.leaflet-container` override
- `src/types/index.ts` contains `positions: [number, number][]`, `ActiveView`, `frc`, `clusterCount`; no `LatLng` or `Module`

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 07d15e6 | chore(01-01): reinstall all packages at pinned versions |
| Task 2 + Rule 1 fixes | 85972f2 | feat(01-01): rewrite config files, types, and fix all downstream type references |

## Self-Check: PASSED

- package.json: FOUND
- tailwind.config.js: FOUND
- postcss.config.js: FOUND
- src/types/index.ts: FOUND
- src/main.tsx: FOUND
- commit 07d15e6: FOUND
- commit 85972f2: FOUND
