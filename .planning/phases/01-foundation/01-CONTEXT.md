# Phase 1: Foundation - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Vite + React + TypeScript project with all pinned dependencies, configure Tailwind design tokens, build the INRIX IQ app shell (nav bar + view routing), and define all four mock data TypeScript files with complete data. No map rendering or chart rendering in this phase — that is Phase 2+.

</domain>

<decisions>
## Implementation Decisions

### Nav Bar — Exact Layout (from screenshots)
- Height: ~48px, background: #0d1f3c
- Far left: small collapse chevron icon (">" pointing right)
- Logo: "INRIX" bold white text + "IQ" inside a small outlined rectangle/badge (not just plain text)
- Center-left: module name in regular-weight white — "Mission Control" or "Signal Analytics"
- Right side: exactly 3 icons only (no user avatar, no bell):
  1. HelpCircle (?) — question mark circle
  2. RefreshCw — circular refresh arrow
  3. LayoutGrid (3×3 dots) — apps/modules menu
- Module name is clickable — click toggles between Mission Control and Signal Analytics views

### Default Landing View
- Mission Control loads first on app open (map view is the primary investor demo screen)

### Filter Bar — Mission Control only (exact from screenshots)
Same dark navy background (#0d1f3c), directly below nav. Items left to right:

1. **Network / Corridors** — two radio-style tab options; "Network" selected by default with a filled blue dot; "Corridors" is the unselected option
2. **Map Version** — label + "Latest" dropdown value + chevron
3. **Traffic Flow** — blue pill toggle (ON by default); label "Traffic Flow"; subtitle "Level of Congestion, Auto..." with down chevron for sub-filter
4. **Alerts (7)** — orange/amber pill toggle (ON by default); label "Alerts"; orange count badge "(7)"; subtitle "Congestion, Construction,..." with down chevron
5. **Cameras** — grey/blue pill toggle (ON by default); label "Cameras"; subtitle "Traffic Camera Images" with down chevron

Each toggle item layout: [pill switch] [label] [(count badge if applicable)] [subtitle text ▾]

### Alerts Dropdown Panel (screenshot 3)
White background floating panel that opens below the Alerts filter item:
- Header: "Congestion Alerts" bold
- Radio row: "Active" (selected, blue dot) | "Cleared" | "Both"
- "Severity Filter:" with horizontal range slider — blue fill left of handle, Minimal→Severe labels
- "Elapsed Time Filter:" with range slider — 0hrs→24+hrs labels
- Alert type checklist (left column, each row): colored icon + label + blue toggle switch: Congestion, Construction, Crashes, Dangerous Slowdowns, Events, Hazards, Road Closures — all enabled by default
- Bottom: "Safety Alerts | Documentation" tab row + URL input field below

### Right Panel — Segment Detail (screenshot 3, exact layout)
Light/white background panel, ~320px wide, slides in from right:
- Small grey uppercase label: "SELECTED SEGMENT"
- Segment name large: e.g. "Del Amo Blvd"
- Attribute grid (label + value pairs):
  - Segment ID: 450511337
  - Type: XD
  - FRC Level: 4
  - Length: 0.43 miles
  - Speed Bucket: 3
- Large 2×2 metrics grid:
  - Top-left: "0m 42s" (very large bold) — label below: "Current Avg Travel Time"
  - Top-right: "37mph" (very large bold) — label below: "Current Avg Speed"
  - Bottom-left: "31mph" (medium large) — label below: "Free Flow Speed"
  - Bottom-right: "30mph" — label below: "Historic Avg Speed"
- Bottom: "Segment Speed | Documentation" tab row + URL field

### Right Panel — Camera Detail (screenshot 1, exact layout)
Light/white background panel, same width:
- Small grey uppercase label: "SELECTED CAMERA"
- Subtitle: "Traffic Camera"
- Camera name large: e.g. "CA-91"
- Location subtitle: "East of Cherry Ave (E)"
- "Type: Image" and "Copyright: © Vizzion and its providers www.vizzion.com"
- Full-width camera image (placeholder for demo — show a solid dark grey rectangle with camera icon)
- Bottom: "Traffic Cameras | Documentation" tab row + URL field

### Alert/Camera Marker Appearance (from screenshots)
- Camera markers: black rounded location-pin shape with white number inside
- Alert markers by type:
  - Crashes: red teardrop pin (red #e53935)
  - Dangerous Slowdowns: red teardrop (same red)
  - Construction: orange teardrop (#ff9800)
  - Road Closure: red teardrop
  - Events: blue/teal teardrop (#2196f3)
  - Congestion: yellow/amber teardrop (#ffeb3b or orange)
  - Hazards: orange teardrop

### Congestion Legend Overlay (bottom-left of map)
Small floating panel, semi-transparent dark background, positioned bottom-left:
- "Alerts" section with colored dot + label rows: Dangerous Slowdowns, Construction, Road Closure, Events, Congestion, Hazards, Crashes
- "Congestion" section with color swatch + label rows: 76-100%, 51-75%, 26-50%, 0-25%
- Small "×" close button in top-right corner of panel

### Mock Data — Complete in Phase 1 (not stubs)
All four data files must be fully populated in Phase 1 so Phase 2+ can use them directly:
- `segments.ts`: 25+ LA road segments with real polyline coords, realistic non-round values
- `alerts.ts`: 20+ alerts, all types, realistic LA positions
- `cameras.ts`: 15+ cameras, real CA naming convention (e.g. "CA-91 / East of Cherry Ave (E)")
- `signalData.ts`: Austin TX data matching EXACT screenshot values (see Specifics below)

### Signal Analytics Left Panel (screenshot 2, exact layout)
Light blue-grey background panel, ~280px wide, collapsible:
- Date badge row: "All Licensed 03/11/2026"
- 4-number KPI grid (1×4 or 2×2):
  - 1,064 (Intersections), 3,547 (Approaches), 8,851 (Cameras), 334 (Corridors)
- Section: "Intersections 03/11/2026"
  - Total Control Delay: 8,887.6h | 4wk Avg: 8,022.8h | Delta: +10.80% (green/red delta arrow)
- Section: "Average Control Delay Per Vehicle 03/11/2026"
  - Total: 23.8s | 4wk Avg: 22.6s | Delta: +4.35%
- "Avg Control Delay per Vehicle" Recharts bar chart: 5 amber/yellow bars
- "Intersection Counts by LOS" Recharts bar chart: A/B/C/D/E/F with counts and grade colors

### View Placeholder (Phase 1 only — before map/charts render)
Mission Control: dark navy full-screen background, filter bar at top, empty map area (will be filled in Phase 2)
Signal Analytics: left KPI panel renders with data, center area is light background (map will be added in Phase 4)
No loading skeleton needed — the nav bar, filter bar, and data panels render immediately

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project + Requirements
- `.planning/PROJECT.md` — exact hex colors, tech stack constraints, project context
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-04 (this phase's requirements)

### Stack + Architecture
- `.planning/research/STACK.md` — pinned package versions, tsconfig requirements, Vite config
- `.planning/research/ARCHITECTURE.md` — full component tree, Zustand store slices, TypeScript interfaces, build order
- `.planning/research/PITFALLS.md` — 12 critical pitfalls (Leaflet CSS, icon fix, z-index, Tailwind JIT, etc.)

### Visual Source of Truth
Screenshots in this conversation are the canonical visual reference for pixel-accurate replication:
- Screenshot 1: Mission Control with camera selected — nav bar, filter bar, camera pins, alert pins, right camera panel
- Screenshot 2: Signal Analytics — left KPI panel, bar charts, LOS distribution, ranked tables, light map background
- Screenshot 3: Mission Control with segment selected + Alerts dropdown — segment detail panel layout, alert type toggles

No external spec files. All decisions captured in this CONTEXT.md.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. Phase 1 establishes all patterns.

### Established Patterns
- All patterns from Phase 1 become the baseline. Enforce consistently in Phase 2+.

### Integration Points
- `src/main.tsx`: `import 'leaflet/dist/leaflet.css'` MUST be the first import line
- `src/main.tsx`: Tailwind globals import second
- `tailwind.config.js`: Must extend `extend.zIndex` with values up to 1000 (Leaflet panes sit at 200-650)
- `src/store/index.ts`: Single Zustand store with slices: `mapSlice`, `filterSlice`, `uiSlice`
- `src/App.tsx`: Root component reads `currentView` from Zustand, renders `<MissionControl>` or `<SignalAnalytics>`

</code_context>

<specifics>
## Specific Ideas

### Signal Analytics — Exact Mock Data Values (from screenshot 2, use verbatim in signalData.ts)

**KPIs:**
- Intersections: 1064, Approaches: 3547, Cameras: 8851, Corridors: 334

**Control Delay Totals:**
- Total Control Delay: 8887.6 (unit: hours), 4wk avg: 8022.8, delta: +10.80%
- Avg Control Delay Per Vehicle: 23.8 (unit: seconds), 4wk avg: 22.6, delta: +4.35%

**Weekly Chart Data (5 bars, Avg Control Delay per Vehicle in seconds):**
- { week: '02/11/2026', value: 23 }
- { week: '02/18/2026', value: 22 }
- { week: '02/25/2026', value: 22 }
- { week: '03/04/2026', value: 23 }
- { week: '03/11/2026', value: 24 }

**Intersection Counts by LOS:**
- { grade: 'A', count: 134, color: '#1b5e20' }
- { grade: 'B', count: 359, color: '#4caf50' }
- { grade: 'C', count: 382, color: '#8bc34a' }
- { grade: 'D', count: 166, color: '#ff9800' }
- { grade: 'E', count: 21, color: '#f44336' }
- { grade: 'F', count: 2, color: '#b71c1c' }

**Top 5 Worsened Control Delay (Total):**
1. { name: 'North Capital of Texas Hwy & Westlake Drive', avg4wk: '15.3h', current: '25.0h', delta: '+63.50%' }
2. { name: 'South 1st Street & West Cesar Chavez Street', avg4wk: '19.0h', current: '25.9h', delta: '+36.10%' }
3. { name: 'Barton Springs Road & South Lamar Boulevard', avg4wk: '31.6h', current: '37.7h', delta: '+19.40%' }
4. { name: 'Barton Springs Road & South 1st Street', avg4wk: '25.3h', current: '30.3h', delta: '+19.70%' }
5. { name: 'Loyola Lane & Decker Lane', avg4wk: '18.0h', current: '22.9h', delta: '+27.10%' }

**Top 5 Worsened Control Delay (Per Vehicle):**
1. { name: 'East 2nd Street & San Jacinto Boulevard', avg4wk: '55.2s', current: '1.9m', delta: '+105.20%' }
2. { name: 'East 3rd Street & San Jacinto Boulevard', avg4wk: '37.7s', current: '1.2m', delta: '+89.90%' }
3. { name: 'East 5th Street & Brazos Street', avg4wk: '50.4s', current: '1.4m', delta: '+65.60%' }
4. { name: 'San Jacinto Boulevard & East 10th Street', avg4wk: '20.3s', current: '50.8s', delta: '+150.50%' }
5. { name: 'East 9th Street & San Jacinto Boulevard', avg4wk: '13.6s', current: '43.7s', delta: '+222.00%' }

**Top 3 Corridors — Worsened Travel Times:**
1. { name: 'Arboretum - 183 Serviceroad SB', avg4wk: '3.8m', current: '10.0m', delta: '+6.2m', pct: '165.00%' }
2. { name: 'Downtown - Trinity NB', avg4wk: '5.1m', current: '7.2m', delta: '+2.1m', pct: '41.00%' }
3. { name: 'Riverside - Riverside Dr (EB) 1', avg4wk: '6.5m', current: '7.9m', delta: '+1.4m', pct: '22.00%' }

**Top 3 Corridors — Worsened Travel Time Index:**
1. { name: 'Arboretum - Oak Knoll NB', avg4wk: '2.92x', current: '3.68x', delta: '+0.77x', pct: '26.30%' }
2. { name: 'North Lamar 2 - Rutland EB', avg4wk: '2.55x', current: '2.66x', delta: '+0.66x', pct: '34.60%' }
3. { name: 'Downtown - Colorado NB', avg4wk: '1.19x', current: '1.66x', delta: '+0.47x', pct: '39.40%' }

### INRIX IQ Logo Treatment
"INRIX" in bold white, immediately followed by "IQ" in a small outlined/bordered box (rectangle border, no fill, same white color). Render as: `<span>INRIX</span><span class="border border-white px-0.5 ml-0.5 text-xs">IQ</span>` or similar.

### Segment Detail Panel — Speed Bucket Labels
Speed bucket is displayed as a number (1-5), not text. From research: 1=Very Fast, 2=Fast, 3=Moderate, 4=Slow, 5=Very Slow — but in the screenshot it appears as the numeric bucket "3" not the text label.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-16*
