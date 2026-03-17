---
phase: 01-foundation
plan: "03"
subsystem: ui
tags: [react, zustand, tailwind, lucide-react, vite]

# Dependency graph
requires:
  - phase: 01-foundation/01-02
    provides: Zustand store with activeView/setActiveView, showTraffic/showAlerts/showCameras, selectedItem/setSelectedItem
provides:
  - NavBar component (48px, #0d1f3c, INRIX IQ logo, 3 icons, view toggle)
  - MissionControlView placeholder (dark navy #0a1628 with filter bar stub)
  - SignalAnalyticsView placeholder (light #e8ecf1 with KPI panel stub)
  - App.tsx with column flex layout and store-driven view routing
  - Removal of Sidebar, Header, useAppStore, modules/SignalAnalytics
affects:
  - 02-map-layer (MissionControlView hosts the map)
  - 04-signal-analytics (SignalAnalyticsView hosts signal analytics content)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useStore selector pattern: useStore((s) => s.fieldName) throughout all components
    - Column flex shell: App root is 100vw/100vh column flex, NavBar fixed top, view fills remaining height
    - View routing via Zustand: activeView state drives conditional render, no router needed

key-files:
  created:
    - src/components/layout/NavBar.tsx
    - src/components/mission-control/MissionControlView.tsx
    - src/components/signal-analytics/SignalAnalyticsView.tsx
  modified:
    - src/App.tsx
    - src/components/map/TrafficMap.tsx
    - src/components/map/SegmentPolylines.tsx
    - src/components/panels/CameraPanel.tsx
    - src/components/panels/SegmentPanel.tsx

key-decisions:
  - "No router used for view switching — Zustand activeView state drives conditional render directly in App.tsx"
  - "NavBar is stateless — reads and writes only through useStore selectors, no local state"
  - "Placeholder views contain styled stubs (colors, layout skeleton) so Phase 2 can drop map/charts directly into place"

patterns-established:
  - "NavBar toggle pattern: setActiveView toggled inline, no intermediate handler"
  - "View layout contract: each view is flex-1 flex flex-col overflow-hidden filling remaining height below NavBar"
  - "Store migration: all old useAppStore consumers updated to use new useStore API (filters -> showTraffic/showAlerts/showCameras)"

requirements-completed:
  - FOUND-03
  - FOUND-04

# Metrics
duration: 10min
completed: 2026-03-16
---

# Phase 1 Plan 03: App Shell Summary

**NavBar (48px, #0d1f3c, INRIX IQ logo with bordered box, 3 icons) with Zustand-driven view toggle between Mission Control and Signal Analytics placeholders — no sidebar**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-16T23:57:00Z (est.)
- **Completed:** 2026-03-17T00:07:00Z (est.)
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 12

## Accomplishments

- NavBar component matching INRIX IQ screenshot: 48px height, dark navy (#0d1f3c), bold "INRIX" + bordered "IQ" box, clickable module name toggles views, 3 right icons (HelpCircle, RefreshCw, LayoutGrid)
- App.tsx rewritten as column-flex shell with Zustand-driven view routing — no sidebar, no router
- MissionControlView placeholder with filter bar stub at correct dark navy background (#0a1628)
- SignalAnalyticsView placeholder with KPI panel stub at correct light background (#e8ecf1)
- Migrated 4 surviving components (TrafficMap, SegmentPolylines, CameraPanel, SegmentPanel) from old useAppStore to new useStore API
- Deleted 5 obsolete files: Header.tsx, Sidebar.tsx, modules/SignalAnalytics.tsx, store/useAppStore.ts; removed modules/ directory
- Production build passes: 150.95 kB JS, 24.53 kB CSS, zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Build NavBar, App.tsx, and placeholder views** - `51f5d88` (feat)
2. **Task 2: Visual verification of app shell** - user approved, automated verify (npm run build) passed

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `src/components/layout/NavBar.tsx` - Top nav bar component: INRIX IQ logo, view toggle, 3 icon buttons
- `src/components/mission-control/MissionControlView.tsx` - Dark navy placeholder with filter bar stub
- `src/components/signal-analytics/SignalAnalyticsView.tsx` - Light background placeholder with KPI panel stub
- `src/App.tsx` - Root shell: 100vw/100vh column flex, NavBar + view routing via Zustand activeView
- `src/components/map/TrafficMap.tsx` - Migrated from useAppStore to useStore (showTraffic/showAlerts/showCameras)
- `src/components/map/SegmentPolylines.tsx` - Migrated from useAppStore to useStore
- `src/components/panels/CameraPanel.tsx` - Migrated from useAppStore to useStore (closePanel -> clearSelectedItem)
- `src/components/panels/SegmentPanel.tsx` - Migrated from useAppStore to useStore (setPanelContent -> setSelectedItem)
- `src/components/layout/Header.tsx` - DELETED (replaced by NavBar)
- `src/components/layout/Sidebar.tsx` - DELETED (no sidebar in app)
- `src/components/modules/SignalAnalytics.tsx` - DELETED (replaced by SignalAnalyticsView placeholder)
- `src/store/useAppStore.ts` - DELETED (replaced by new sliced store from Plan 02)

## Decisions Made

- No client-side router used — view switching is a simple Zustand boolean toggle between 2 views, no URL state needed
- NavBar reads store via selectors only, no prop drilling, no local state
- Placeholder views include color-correct background and layout skeleton so Phase 2 can insert map/chart content without structural changes

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Migrated surviving components from old useAppStore to new useStore**
- **Found during:** Task 1 (during npm run build verification)
- **Issue:** TrafficMap, SegmentPolylines, CameraPanel still imported useAppStore (deleted in this task). Build would fail with module-not-found errors.
- **Fix:** Updated all 4 components to import from `../../store` and mapped old API (filters -> showTraffic/showAlerts/showCameras, closePanel -> clearSelectedItem, setPanelContent -> setSelectedItem)
- **Files modified:** src/components/map/TrafficMap.tsx, src/components/map/SegmentPolylines.tsx, src/components/panels/CameraPanel.tsx, src/components/panels/SegmentPanel.tsx
- **Verification:** npm run build passes with zero errors
- **Committed in:** 51f5d88 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug blocking build)
**Impact on plan:** Auto-fix was necessary — deleting useAppStore.ts without migrating its consumers would break the build. No scope creep.

## Issues Encountered

None beyond the auto-fixed migration above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- App shell is complete: NavBar renders correctly, view toggle works, both placeholder views confirmed visually
- Phase 2 (Map Layer) can insert Leaflet map directly into MissionControlView — the flex-1 container is ready
- MissionControlView filter bar stub is in place at correct position (40px, #0d1f3c, border-b) — Phase 2 will wire up the toggle buttons
- No blockers for Phase 2

---
*Phase: 01-foundation*
*Completed: 2026-03-16*
