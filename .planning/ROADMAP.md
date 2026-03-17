# Roadmap: INRIX IQ Demo Clone

## Overview

This roadmap builds a pixel-accurate investor demo of the INRIX IQ traffic intelligence platform in six phases. The build order follows strict dependencies: foundation and mock data must precede all visual work; the Mission Control map view is built before Signal Analytics to establish design system tokens; detail panels are separated from map layers to keep each phase verifiable; Signal Analytics is split across two phases (layout/KPIs then ranked tables) to maintain manageable scope; and a dedicated polish phase eliminates demo-breaking anti-features before any investor showing.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Scaffold the project with all dependencies and verify the dark app shell renders correctly (completed 2026-03-17)
- [x] **Phase 2: Mission Control Map** - Full-screen dark map with color-coded segments, alert pins, camera pins, filter bar, and legend overlays (completed 2026-03-17)
- [x] **Phase 3: Mission Control Panels** - Slide-in detail panels for road segments and cameras with close animation (completed 2026-03-17)
- [ ] **Phase 4: Signal Analytics Layout** - Signal Analytics view with left KPI panel, control delay chart, LOS distribution, and background map
- [ ] **Phase 5: Signal Analytics Tables** - Ranked issue tables for control delay and corridor problems with delta styling
- [ ] **Phase 6: Polish** - Audit and eliminate all demo anti-features; ensure investor-ready authenticity throughout

## Phase Details

### Phase 1: Foundation
**Goal**: A working Vite + React + TypeScript project renders the dark INRIX IQ app shell with navigation between views and all four mock data files defined
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` opens a dark navy (#0a1628) page in the browser with no errors in the console
  2. The top nav bar (#0d1f3c) displays "INRIX IQ" logo and right-side icon controls
  3. Clicking the module name area in the nav switches between Mission Control and Signal Analytics views
  4. All design tokens (background, nav, accent, congestion colors, alert colors) are available as Tailwind utilities
  5. All four mock data TypeScript files (segments, alerts, cameras, signalData) are importable with correct types
**Plans:** 3/3 plans complete

Plans:
- [x] 01-01-PLAN.md — Dependency reinstall + config files + TypeScript interfaces
- [x] 01-02-PLAN.md — Zustand 3-slice store + all 4 mock data files
- [x] 01-03-PLAN.md — NavBar + App.tsx + placeholder views + visual verification

### Phase 2: Mission Control Map
**Goal**: The Mission Control view shows a full-screen dark map of Los Angeles with all map layers (segments, alerts, cameras), a working filter bar, and legend overlays
**Depends on**: Phase 1
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04, MAP-07, MAP-08, FILTER-01, FILTER-02, FILTER-03, FILTER-04, FILTER-05, DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. The CartoDB Dark Matter map tiles load and display Los Angeles centered at zoom 11 with no grey tiles
  2. 25+ road segments appear as polylines color-coded green/yellow/orange/red by congestion level
  3. 20+ alert pins appear on the map color-coded by type (crash=red, construction=orange, slowdown=yellow, event=blue)
  4. 15+ camera pins appear as black markers with numbered cluster count badges
  5. Traffic Flow, Alerts, and Cameras toggles in the filter bar show and hide their respective map layers
  6. The congestion legend overlay is visible at the bottom-left of the map
**Plans:** 2/2 plans complete

Plans:
- [ ] 02-01-PLAN.md — Utility libs + MapView with all 3 layers + legends + MapController stub
- [ ] 02-02-PLAN.md — FilterBar + MissionControlView wiring + old file cleanup

### Phase 3: Mission Control Panels
**Goal**: Clicking a road segment or camera pin on the map opens a detail panel that slides in from the right with full attribute data and can be closed
**Depends on**: Phase 2
**Requirements**: MAP-05, MAP-06, PANEL-01, PANEL-02, PANEL-03
**Success Criteria** (what must be TRUE):
  1. Clicking any road segment slides in the right panel showing: name, segment ID, type, FRC level, length, speed bucket, avg travel time, avg speed, free flow speed, and historic avg speed
  2. Clicking any camera pin slides in the right panel showing: name, highway, direction, type, and a camera image placeholder
  3. Clicking the close button slides the panel out and it disappears from view
**Plans:** 1/1 plans complete

Plans:
- [ ] 03-01-PLAN.md — Wire MissionControlView panel host + fix SegmentPanel travel time display

### Phase 4: Signal Analytics Layout
**Goal**: Switching to Signal Analytics renders the full KPI layout — left summary panel, control delay bar chart, LOS grade distribution, and a light background map — all populated with Austin TX mock data
**Depends on**: Phase 3
**Requirements**: SIG-01, SIG-02, SIG-03, SIG-04, SIG-05, SIG-06, DATA-04
**Success Criteria** (what must be TRUE):
  1. The Signal Analytics view renders with a left KPI panel and a center content area with no layout collapse
  2. The left panel shows intersection count, approach count, corridor count, camera count, total control delay, and avg control delay per vehicle
  3. A Recharts bar chart of avg control delay over time is visible in the left panel with no zero-height or invisible chart
  4. LOS grades A through F are listed in the left panel with counts and color coding
  5. A light/muted map style is visible behind the Signal Analytics content
**Plans:** 1 plan

Plans:
- [ ] 04-01-PLAN.md — KPI panel (counts, delay metrics, bar chart, LOS grades) + light Austin background map + layout shell

### Phase 5: Signal Analytics Tables
**Goal**: The center content area of Signal Analytics shows all three ranked tables (Top 5 delay total, Top 5 delay per vehicle, Top 3 corridor issues) with authentic values and delta arrow styling
**Depends on**: Phase 4
**Requirements**: SIG-07, SIG-08, SIG-09, SIG-10
**Success Criteria** (what must be TRUE):
  1. The "Top 5 Control Delay Issues — Worsened Total" table is visible with intersection name, 4-week avg, current week, and delta columns
  2. The "Top 5 Control Delay Issues — Worsened Per Vehicle" table is visible with the same column structure
  3. The "Top 3 Corridor Issues" table is visible with corridor name, travel time, travel time index, and delta
  4. Worsened delta values display a red up-arrow; improved delta values display a green down-arrow
**Plans**: TBD

### Phase 6: Polish
**Goal**: Every piece of mock data uses realistic, non-round values with authentic LA/Austin geography and INRIX terminology, and the full demo plays through without any visual or data authenticity issues
**Depends on**: Phase 5
**Requirements**: (Polish phase — no new requirements; validates quality of all prior phases)
**Success Criteria** (what must be TRUE):
  1. No mock data field contains an obviously round number (e.g., speed=60, delay=100) — all values use realistic decimals
  2. LA road segment names match real LA corridors (I-405, US-101, SR-110, etc.) and congestion distribution is realistic (freeways mostly green at off-peak, arterials mixed)
  3. Austin TX intersection and corridor names in Signal Analytics match real Austin geography with plausible control delay values
  4. All chart y-axes auto-scale to data range with no clipping or empty space
  5. All tooltip and label fields in both views are populated — no "undefined", placeholder text, or empty tooltip boxes
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete    | 2026-03-17 |
| 2. Mission Control Map | 2/2 | Complete   | 2026-03-17 |
| 3. Mission Control Panels | 1/1 | Complete    | 2026-03-17 |
| 4. Signal Analytics Layout | 0/1 | Not started | - |
| 5. Signal Analytics Tables | 0/TBD | Not started | - |
| 6. Polish | 0/TBD | Not started | - |
