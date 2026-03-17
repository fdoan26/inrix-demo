# Requirements: INRIX IQ Demo Clone

**Defined:** 2026-03-16
**Core Value:** The demo must look and feel indistinguishable from the real INRIX IQ product — every visual detail, interaction, and data presentation must be investor-ready.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Project scaffolded with Vite + React 18 + TypeScript, all specified dependencies installed (react-leaflet, Tailwind CSS v3, Recharts, Zustand, lucide-react)
- [x] **FOUND-02**: Tailwind configured with INRIX design tokens (exact hex colors for background, nav, accent, congestion, alerts)
- [x] **FOUND-03**: App shell renders with dark navy layout (#0a1628 background) and top nav bar (#0d1f3c) with "INRIX IQ" logo and right-side icons
- [x] **FOUND-04**: Navigation between Mission Control and Signal Analytics views via nav bar module name area

### Mission Control — Map

- [x] **MAP-01**: Full-screen Leaflet map centered on Los Angeles (34.05, -118.25, zoom 11) using CartoDB Dark Matter tiles
- [x] **MAP-02**: 25+ road segment polylines rendered on the map, each colored by congestion level (green <25%, yellow 25-50%, orange 50-75%, red >75% delay)
- [x] **MAP-03**: 20+ alert pins rendered on map, color-coded by type (crash=red, construction=orange, dangerous_slowdown=yellow, event=blue, road_closure=red, hazard=orange, congestion=yellow)
- [x] **MAP-04**: 15+ camera pins rendered on map as black markers with numbered cluster count badges
- [x] **MAP-05**: Clicking a road segment opens the right-side detail panel with segment attributes
- [x] **MAP-06**: Clicking a camera pin opens the right-side detail panel with camera attributes
- [x] **MAP-07**: Congestion legend overlay panel renders at bottom-left of map
- [x] **MAP-08**: Alerts legend overlay panel renders at bottom-left of map (when alerts visible)

### Mission Control — Filter Bar

- [x] **FILTER-01**: Top filter bar renders below nav with Network/Corridors toggle (tab style)
- [x] **FILTER-02**: Map Version dropdown renders and shows current version label
- [x] **FILTER-03**: Traffic Flow toggle with active state; when active shows sub-filter options (congestion levels)
- [x] **FILTER-04**: Alerts toggle with count badge showing number of active alerts; toggles alert pins on/off
- [x] **FILTER-05**: Cameras toggle; toggles camera pins on/off

### Mission Control — Detail Panels

- [x] **PANEL-01**: Segment detail panel slides in from right showing: name, segment ID, type, FRC level, length, speed bucket, current avg travel time, current avg speed, free flow speed, historic avg speed
- [x] **PANEL-02**: Camera detail panel slides in from right showing: name, highway, direction, type, camera image placeholder
- [x] **PANEL-03**: Detail panels have close button to dismiss and slide out

### Signal Analytics — Layout

- [x] **SIG-01**: Signal Analytics view renders with left KPI summary panel and center content area
- [x] **SIG-02**: Left panel shows summary KPIs: intersections count, approaches count, corridors count, cameras count
- [x] **SIG-03**: Left panel shows total control delay and avg control delay per vehicle metrics
- [x] **SIG-04**: Left panel shows bar chart of avg control delay over time (using Recharts)
- [x] **SIG-05**: Left panel shows intersection counts by LOS grade (A through F) with color coding
- [x] **SIG-06**: Background map renders in light/muted style behind Signal Analytics content

### Signal Analytics — Ranked Tables

- [ ] **SIG-07**: Center area shows "Top 5 Control Delay Issues — Worsened Total" table with columns: intersection name, 4-week avg, current week, delta (with up/down arrow and color)
- [ ] **SIG-08**: Center area shows "Top 5 Control Delay Issues — Worsened Per Vehicle" table with same column structure
- [ ] **SIG-09**: Center area shows "Top 3 Corridor Issues" table with: corridor name, travel time, travel time index, delta
- [ ] **SIG-10**: Delta values styled with red up-arrow for worsened, green down-arrow for improved

### Mock Data

- [x] **DATA-01**: 25+ road segments in LA area defined with: segmentId, name, lat/lng polyline coords array, currentSpeed, freeFlowSpeed, congestionLevel (0-100), travelTime, avgTravelTime, type, FRC level, length, speedBucket
- [x] **DATA-02**: 20+ alerts defined with: id, type (crash/construction/dangerous_slowdown/road_closure/event/hazard/congestion), position [lat, lng], description, severity, timestamp
- [x] **DATA-03**: 15+ cameras defined with: id, name (e.g. "CA-91 / East of Cherry Ave (E)"), position [lat, lng], highway, direction, type
- [x] **DATA-04**: Signal analytics mock data defined matching Austin TX screenshot values: KPI counts, control delay totals, LOS distribution, top 5 delay tables, top 3 corridor tables

## v2 Requirements

### Enhancements

- **ENH-01**: Real-time data simulation (animating congestion changes over time)
- **ENH-02**: Additional INRIX IQ modules (Speed, Trips, Parking)
- **ENH-03**: Time-of-day playback slider for historical data
- **ENH-04**: Export/download mock report button
- **ENH-05**: Mobile responsive layout

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real API integrations | Investor demo — mock data only, no API keys or costs |
| User authentication | No login required for demo |
| Backend / server | Pure client-side SPA |
| Mobile responsive layout | Desktop investor demo only |
| Additional modules beyond Mission Control + Signal Analytics | Scope limited to two primary demo screens |
| Real camera video feeds | Image placeholder sufficient for demo |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| MAP-01 | Phase 2 | Complete |
| MAP-02 | Phase 2 | Complete |
| MAP-03 | Phase 2 | Complete |
| MAP-04 | Phase 2 | Complete |
| MAP-05 | Phase 3 | Complete |
| MAP-06 | Phase 3 | Complete |
| MAP-07 | Phase 2 | Complete |
| MAP-08 | Phase 2 | Complete |
| FILTER-01 | Phase 2 | Complete |
| FILTER-02 | Phase 2 | Complete |
| FILTER-03 | Phase 2 | Complete |
| FILTER-04 | Phase 2 | Complete |
| FILTER-05 | Phase 2 | Complete |
| PANEL-01 | Phase 3 | Complete |
| PANEL-02 | Phase 3 | Complete |
| PANEL-03 | Phase 3 | Complete |
| SIG-01 | Phase 4 | Complete |
| SIG-02 | Phase 4 | Complete |
| SIG-03 | Phase 4 | Complete |
| SIG-04 | Phase 4 | Complete |
| SIG-05 | Phase 4 | Complete |
| SIG-06 | Phase 4 | Complete |
| SIG-07 | Phase 5 | Pending |
| SIG-08 | Phase 5 | Pending |
| SIG-09 | Phase 5 | Pending |
| SIG-10 | Phase 5 | Pending |
| DATA-01 | Phase 2 | Complete |
| DATA-02 | Phase 2 | Complete |
| DATA-03 | Phase 2 | Complete |
| DATA-04 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0 (Phase 6 is a polish/audit phase with no new requirements)

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 after roadmap creation (6 phases)*
