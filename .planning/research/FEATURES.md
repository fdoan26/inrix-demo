# Feature Research

**Domain:** Traffic intelligence SaaS platform (INRIX IQ demo clone)
**Researched:** 2026-03-16
**Confidence:** HIGH (terminology from official INRIX docs, HCM standards from FHWA; visual patterns inferred from product pages and documentation)

---

## INRIX-Specific Terminology Reference

This section defines the domain vocabulary required for the demo to look credible. Every label, tooltip, and data value in the UI must use these exact terms.

### FRC — Functional Road Class

INRIX uses five FRC levels. These appear in segment detail panels and filter controls.

| FRC Code | Name | Display Label | Example Roads |
|----------|------|---------------|---------------|
| 1 | National Interstates | Interstate / Freeway | I-10, I-405, I-110 |
| 2 | Regional Highways / Expressways | Expressway | SR-2, US-101, SR-60 |
| 3 | Arterials | Major Arterial | Wilshire Blvd, Santa Monica Blvd |
| 4 | Collector Roads | Collector | Venice Blvd, Pico Blvd |
| 5 | Local Roads | Local Street | Neighborhood streets |

Source: [INRIX Data Network and XD Traffic docs](https://docs.inrix.com/ra/datanetworkandxdtraffic/), [INRIX Segments docs](https://docs.inrix.com/traffic/segments/)

### Speed Buckets — Congestion Color System

INRIX maps current speed as a percentage of Reference Speed (free-flow speed) to a color bucket. The default bucket set (ID 1 — "Congestion" type) uses these thresholds:

| Bucket | % of Reference Speed | INRIX Color | Display Color | Suggested Label |
|--------|---------------------|-------------|---------------|-----------------|
| 0 | 0–31% | Black | `#212121` dark | Standstill / Gridlock |
| 1 | 32–62% | Red | `#f44336` | Very Slow |
| 2 | 63–92% | Yellow | `#ffeb3b` | Slow / Moderate |
| 3 | 93–100% | Forest Green | `#4caf50` | Free Flow |

For a 4-color demo (green / yellow / orange / red) mapping to standard traffic mental models:

| Display Name | Color | Hex | % of Free Flow | Speed Range (typical 65 mph freeway) |
|---|---|---|---|---|
| Free Flow | Green | `#4caf50` | > 90% | > 58 mph |
| Light Traffic | Yellow | `#ffeb3b` | 65–90% | 42–58 mph |
| Moderate Congestion | Orange | `#ff9800` | 40–65% | 26–42 mph |
| Heavy Congestion | Red | `#f44336` | < 40% | < 26 mph |

Note: INRIX's official 4-bucket system collapses to green/yellow/red with an additional near-stop black. The 4-color green/yellow/orange/red scheme used in the PROJECT.md is the industry convention used by Google Maps, TomTom, HERE, and Waze — it is more legible and matches user expectations for an investor demo.

Source: [INRIX Speed Buckets docs](https://docs.inrix.com/reference/speedbuckets/)

### Reference Speed

Definition: "The free flow speed on the segment for the given day and time." Often equals the posted speed limit but may be lower on roads that never reach the limit. All congestion percentages and TTI calculations are relative to this value.

Source: [INRIX Speed API docs](https://docs.inrix.com/traffic/speed/)

### Congestion Threshold

INRIX formally defines a segment as **congested** when speed falls below **65% of reference speed**. Bottlenecks are detected when speeds drop to ~65% of reference and sustain. This is the threshold used in their Global Traffic Scorecard methodology.

Source: [INRIX Global Traffic Scorecard methodology](https://inrix.com/scorecard/)

### TTI — Travel Time Index

**Definition:** Average travel time as a percentage of ideal (free-flow) travel time. Measures congestion intensity for a corridor.

**Formula:** TTI = Actual Travel Time / Free-Flow Travel Time

**Interpretation:**
- TTI = 1.00 → free flow, no delay
- TTI = 1.30 → 30% longer than free flow (a 20-min trip takes 26 min)
- TTI = 1.50 → 50% longer (a 20-min trip takes 30 min)
- TTI > 2.00 → severe congestion

**Display convention:** Shown as a decimal (e.g., "1.42") or a percentage above free flow (e.g., "+42%"). In the Signal Analytics Corridor Issues table, show as decimal with 2 decimal places.

Source: [INRIX Data and Metrics definitions](https://docs.inrix.com/ra/dataandmetrics/)

### LOS — Level of Service (HCM Standard)

Used in Signal Analytics for intersections. Based on HCM (Highway Capacity Manual) standards — the industry-authoritative method from FHWA.

| LOS Grade | Control Delay (seconds/vehicle) | Traffic Condition | Color Convention |
|-----------|--------------------------------|-------------------|------------------|
| A | ≤ 10 sec | Excellent — minimal delay | Dark green `#1b5e20` |
| B | 10–20 sec | Good — minor delay | Light green `#4caf50` |
| C | 20–35 sec | Acceptable — moderate delay | Yellow `#ffeb3b` |
| D | 35–55 sec | Poor — approaching unstable | Orange `#ff9800` |
| E | 55–80 sec | Very Poor — unstable flow | Deep orange `#f4511e` |
| F | > 80 sec | Failure — forced flow | Red `#f44336` |

Source: [FHWA Signalized Intersections Guide](https://www.fhwa.dot.gov/publications/research/safety/04091/07.cfm), [INRIX Signal Analytics Metrics docs](https://docs.inrix.com/signals/signals-metrics/)

### Control Delay

**Definition:** Average seconds of delay per vehicle caused by signal operations at an intersection approach. Includes deceleration delay, stop delay, and acceleration delay.

**Units:** Seconds per vehicle (s/veh)

**Where it appears:** Signal Analytics KPI panel (total and average), control delay bar chart over time, Top 5 Control Delay Issues table (both total delay and per-vehicle delay columns).

### Percent Arrivals on Green (POG)

**Definition:** Percentage of vehicles that arrive during the green phase and can pass without stopping. High POG = good signal progression along a corridor.

**LOS for POG:**
- A: > 90%
- B: 80–90%
- C: 70–80%
- D: 60–70%
- E: 50–60%
- F: < 50%

### Split Failure

**Definition:** Occurs when the green time allocated to a phase is insufficient to serve the queued vehicles — drivers must stop more than once. A key signal timing problem indicator.

### XD Segment vs TMC Segment

| Type | Coverage | Granularity | Display Code Format |
|------|----------|-------------|---------------------|
| TMC | FRC 1–3 roads | Lower | `+US101N00123` |
| XD Segment | FRC 1–5 (broader) | Higher — max 1,600m per segment | `101+05423` |

For the demo, use XD-style segment IDs. The segment detail panel should show "Type: XDS" for freeways and "Type: TMC" for arterials.

---

## Feature Landscape

### Table Stakes — Features Investors Expect to See

Missing any of these makes the demo feel unfinished or like a prototype.

| Feature | Why Expected | Complexity | Implementation Notes |
|---------|--------------|------------|----------------------|
| Full-screen dark map | Every traffic monitoring product uses dark base maps — dark backgrounds make colored overlays pop and are the industry standard for ops dashboards | LOW | CartoDB Dark Matter tiles via react-leaflet, no API key needed |
| Road segment color coding | Green/yellow/orange/red congestion coloring is the universal traffic visualization language — absence would be disqualifying | MEDIUM | Polylines drawn via Leaflet, colors from speed bucket thresholds |
| Clickable segment detail panel | Every enterprise GIS product shows details on click — signals data depth | MEDIUM | Right slide-in panel with segment name, speed, travel time, FRC |
| Alert pins on map | Incidents/crashes/construction are core to traffic ops monitoring | MEDIUM | Color-coded markers by alert type, click to expand |
| Camera pins with cluster badges | Traffic management centers use camera feeds — cameras signal real-world infrastructure integration | MEDIUM | Camera icon markers, count badge overlays |
| Congestion legend overlay | Users cannot interpret a color map without a legend | LOW | Bottom-left overlay, always visible, shows color-to-condition mapping |
| Top nav/filter bar | Enterprise tools have persistent filter controls at top | LOW | Network/Corridors toggle, Traffic Flow, Alerts, Cameras toggles |
| Multiple views (map + analytics) | A map-only tool is a viewer, not a platform; analytics view shows intelligence depth | HIGH | Mission Control (map) + Signal Analytics (charts/tables) |
| Loading/data freshness indicator | Real enterprise tools show data timestamp ("Last updated 2 min ago") | LOW | Static timestamp in header, e.g., "Live — Updated 11:47 AM" |
| Alert type filter | Users need to filter by crash vs construction vs event | LOW | Toggle buttons with count badges per type |

### Differentiators — Features That Signal Enterprise-Grade Intelligence

These separate "just a map" from "intelligence platform."

| Feature | Value Proposition | Complexity | Implementation Notes |
|---------|-------------------|------------|----------------------|
| Signal Analytics with LOS grades | Intersection-level intelligence is INRIX's key differentiator vs HERE/TomTom — no hardware required | HIGH | Separate view with KPI panel, bar chart, LOS distribution, ranked tables |
| Control delay bar chart over time | Shows temporal analysis capability — not just current state but trends | MEDIUM | Recharts bar chart, 24-hour or 7-day x-axis, seconds/vehicle y-axis |
| Top 5 Control Delay Issues table | Ranked problem identification is the "so what" of analytics — tells operators where to act | MEDIUM | Table with intersection name, total delay, per-vehicle delay, delta vs baseline |
| Top 3 Corridor Issues with TTI | Corridor-level aggregation shows network thinking | MEDIUM | Table with corridor name, TTI value, intersections count, trend indicator |
| Intersection counts by LOS grade | Distribution chart (A–F) shows systemwide health at a glance | LOW | Horizontal bar chart or count list with color-coded grade badges |
| FRC-level filtering | Ability to filter by road class signals deep data model — not just "show all roads" | LOW | FRC toggle in filter bar, controls which road classes appear on map |
| Speed vs Reference Speed display | Showing current speed AND reference speed in segment panel signals data sophistication | LOW | In segment detail panel: "65 mph / 70 mph ref" format |
| Relative congestion metric | Showing "23% below free flow" vs just raw speed is how pros talk about congestion | LOW | In segment panel, below speed field |

### Anti-Features — What Makes a Demo Look Fake or Low-Quality

These are the signals that tell investors the product is a mockup, not software.

| Anti-Feature | Why Requested | Why It Destroys Credibility | What to Do Instead |
|---|---|---|---|
| Round/even numbers everywhere | Seems "cleaner" | Real traffic data is never round — "Control Delay: 45.0 sec" looks fake; "43.7 sec" looks real | Use realistic decimal values: 43.7, 128.4, 1.37 |
| Uniform road colors with no variation | Simpler to implement | All-green or evenly-distributed colors across all roads at once looks like a static image, not live data | Vary congestion levels: freeways mostly green, arterials mixed, surface streets yellow/orange |
| Alert count badges that never change | Badges are visible | A "23 alerts" badge that never updates or changes looks static | Use plausible numbers: 7 crashes, 12 construction, 4 events — odd numbers feel real |
| Generic placeholder text in panels | Easier than real data | "Road Name Here" or "Segment 001" breaks immersion immediately | All 25+ segments need real LA road names: "I-10 W Freeway", "Wilshire Blvd at Westwood" |
| Light/white map for Mission Control | Default Leaflet tiles are light | INRIX Mission Control uses dark map — light map signals wrong product style | CartoDB Dark Matter tiles only for Mission Control view |
| Pixel-perfect but non-interactive | Looks polished | If clicking on roads/alerts does nothing, investors notice | Every segment click opens right panel; every alert click shows alert detail |
| Single color for all alert types | Simplifies implementation | Real products differentiate crashes (red), construction (orange), events (blue) by color | Maintain per-type color coding throughout |
| Charts with 0-100 y-axis but data only in 20-50 range | Technically correct | Wasted whitespace makes charts look sparse and unprofessional | Auto-scale y-axis to data range with appropriate padding |
| Lorem ipsum or missing labels on charts | Placeholder while building | Any placeholder text visible during demo is disqualifying | All chart axes, tooltips, and legends must have real labels before demo |
| Hardcoded "Loading..." states | Easy to add for realism | If loading state persists or appears on data that should already be there, it breaks flow | Mock data loads instantly — no loading states for pre-populated views |
| Signal Analytics with uniform control delay values | Simpler mock data | All intersections at exactly 45 sec looks like test data | Use a realistic bell curve: a few LOS A/B, most LOS C/D, a handful of LOS E/F |

---

## Visual Pattern Reference

These are the specific visual conventions required for the demo to look like the real INRIX IQ product.

### Map Layer Visual Conventions

**Segment line weights by FRC:**
- FRC 1 (Freeway): 5px line weight
- FRC 2 (Expressway): 4px line weight
- FRC 3 (Arterial): 3px line weight
- FRC 4 (Collector): 2px line weight
- FRC 5 (Local): 1–2px line weight (may omit at zoom < 12)

**Congestion color values (PROJECT.md canonical):**
- Free Flow: `#4caf50` (Material Green 500)
- Light/Moderate: `#ffeb3b` (Material Yellow 400)
- Congested: `#ff9800` (Material Orange 500)
- Heavy/Stopped: `#f44336` (Material Red 500)

**Alert pin color conventions:**
- Crash / Accident: Red `#e53935`
- Construction: Orange `#f57c00`
- Event (concert, game): Blue `#1976d2`
- Slowdown / Congestion: Yellow `#fbc02d`

**Camera pins:**
- Icon: Video camera symbol (lucide `Camera` icon)
- Color: Steel blue / white on dark background
- Cluster badge: Count number, dark background pill

### Segment Detail Panel — Required Fields

The right slide-in panel for a clicked road segment must show exactly these fields in this order:

```
[Segment Name]              e.g., "I-10 Westbound"
[Segment ID]                e.g., "XDS+10423871"
[Road Type / Direction]     e.g., "Freeway · Westbound"

Speed                       65 mph
Reference Speed             70 mph
Congestion                  7% below free flow

Travel Time                 4.2 min
Historic Avg Travel Time    3.8 min

Functional Class            FRC 1 — Interstate
Segment Length              0.8 mi
Segment Type                XDS
```

### Camera Detail Panel — Required Fields

```
[Camera Name]               e.g., "I-405 NB at Wilshire"
Highway                     I-405
Direction                   Northbound
Camera Type                 Fixed
[Image Placeholder]         Dark gray box with camera icon centered
Status                      Active
```

### Congestion Legend Overlay — Bottom Left

Position: bottom-left, above Leaflet attribution.

```
TRAFFIC FLOW
● Free Flow       > 90% ref speed
● Light Traffic   65–90% ref speed
● Congested       40–65% ref speed
● Heavy           < 40% ref speed
```

### Alerts Legend Overlay — Bottom Left (when alerts enabled)

```
ALERTS
● Crash / Accident
● Construction
● Event
● Slowdown
```

### Signal Analytics KPI Panel — Left Side

Five KPI cards stacked vertically:

```
[COUNT]     Intersections monitored        e.g., 847
[COUNT]     Approaches analyzed            e.g., 3,214
[COUNT]     Corridors tracked              e.g., 23
[COUNT]     Cameras integrated             e.g., 156
[HH:MM:SS]  Total Control Delay (daily)    e.g., 14,823 hrs
[X.X sec]   Avg Control Delay / Vehicle    e.g., 43.7 sec
```

### Signal Analytics Control Delay Bar Chart

- X-axis: Time of day (12 AM – 11 PM, 1-hour intervals)
- Y-axis: Average Control Delay (seconds/vehicle), auto-scaled to data
- Bar color: Primary accent blue `#1a6eb5` default; red `#e53935` for peak congestion hours
- Tooltip: "10:00 AM — 52.3 sec/vehicle"
- Reference line: 4-week average (dashed line in muted color)

### Signal Analytics LOS Distribution

Display as a horizontal count list or small bar chart:

```
LOS A  ████  124 intersections
LOS B  ████████  287 intersections
LOS C  ████████████  312 intersections
LOS D  ████████  198 intersections
LOS E  ███  87 intersections
LOS F  █  39 intersections
```

### Signal Analytics Top 5 Control Delay Issues Table

Columns: Rank | Intersection Name | Avg Control Delay | Change vs Baseline | LOS Grade

```
# | Intersection               | Avg Delay  | vs Baseline  | LOS
1 | Wilshire Blvd @ Westwood   | 87.3 s/veh | +12.4 s (+17%) | F
2 | La Cienega Blvd @ Venice   | 76.1 s/veh | +9.8 s (+15%)  | E
3 | Olympic Blvd @ Bundy Dr    | 71.4 s/veh | +8.2 s (+13%)  | E
4 | Santa Monica @ Sepulveda   | 68.9 s/veh | +7.1 s (+11%)  | E
5 | Beverly Blvd @ La Brea     | 64.2 s/veh | +5.9 s (+10%)  | D
```

### Signal Analytics Top 3 Corridor Issues Table

Columns: Rank | Corridor Name | Travel Time Index | # Intersections | Trend

```
# | Corridor                   | TTI  | Intersections | Trend
1 | Wilshire Blvd (10.2 mi)    | 1.73 | 18            | ▲ Worsening
2 | La Cienega Blvd (7.8 mi)   | 1.54 | 12            | ▲ Worsening
3 | Lincoln Blvd (9.4 mi)      | 1.41 | 15            | → Stable
```

---

## Feature Dependencies

```
Dark Map Base (CartoDB Dark Matter)
    └──required by──> Segment Color Overlay (colors only pop on dark background)
    └──required by──> Alert Pins (colors legible on dark background)
    └──required by──> Camera Pins

Segment Data Model (25+ segments with full attributes)
    └──required by──> Congestion Color Overlay
    └──required by──> Segment Detail Panel
    └──required by──> Filter Bar (FRC filter needs FRC data on segments)

Alert Data Model (20+ alerts with type, position, attributes)
    └──required by──> Alert Pins
    └──required by──> Alerts Legend
    └──required by──> Alert Detail Panel

Signal Analytics Mock Data (intersection metrics, corridor metrics)
    └──required by──> KPI Panel
    └──required by──> Control Delay Bar Chart
    └──required by──> LOS Distribution
    └──required by──> Top 5 / Top 3 Tables

Zustand Store
    └──required by──> View switching (Mission Control ↔ Signal Analytics)
    └──required by──> Panel open/close state
    └──required by──> Toggle states (Traffic Flow, Alerts, Cameras)
```

### Dependency Notes

- **Segment data model must exist before any map overlay work:** All visual features depend on having 25+ segments with lat/lng paths, speed values, FRC, and segment IDs populated in mock data.
- **Signal Analytics mock data is independent of Mission Control:** The two views don't share data — Signal Analytics can be built in parallel with Mission Control map work.
- **Zustand must be set up before any cross-component interaction:** Panel state, toggle state, and active view are all global — these must be wired before building UI components that depend on them.

---

## MVP Definition

### Launch With (v1) — Investor Demo Complete

- [ ] Dark map with CartoDB Dark Matter tiles centered on LA — establishes product identity
- [ ] 25+ road segments color-coded by congestion — the core product visual
- [ ] Segment click → right panel slide-in with all required fields — shows data depth
- [ ] 20+ alert pins, color-coded by type, with click-to-detail — shows incident monitoring
- [ ] 15+ camera pins with cluster badges — shows infrastructure integration
- [ ] Top filter bar with Network/Corridors toggle, Traffic Flow toggle, Alerts toggle (count badge), Cameras toggle — shows UI sophistication
- [ ] Congestion legend overlay (bottom-left, always visible) — required for map legibility
- [ ] Signal Analytics view: KPI panel, control delay bar chart, LOS distribution, Top 5 table, Top 3 corridors — the analytics differentiator
- [ ] Navigation between Mission Control and Signal Analytics views — demonstrates platform scope
- [ ] All segment/intersection names are real LA/Austin geography — immersion requirement

### Add After Validation (v1.x)

- [ ] Alerts legend overlay (appears when Alerts layer is toggled on)
- [ ] Camera detail panel (clickable cameras currently show no detail)
- [ ] Map version dropdown (currently a static label)
- [ ] FRC-level filter controls (currently all FRC classes always shown)

### Future Consideration (v2+)

- [ ] Additional INRIX IQ modules: Curb Analytics, Parking Analytics, Origin-Destination
- [ ] Historical playback / time scrubber
- [ ] Export / reporting views
- [ ] Mobile responsive layout

---

## Feature Prioritization Matrix

| Feature | Investor Value | Implementation Cost | Priority |
|---------|---------------|---------------------|----------|
| Dark map + segment color overlay | HIGH | LOW | P1 |
| Segment detail panel (slide-in) | HIGH | MEDIUM | P1 |
| Signal Analytics full view | HIGH | HIGH | P1 |
| Alert pins with type colors | HIGH | LOW | P1 |
| Top filter bar with toggles | HIGH | LOW | P1 |
| Camera pins + cluster badges | MEDIUM | LOW | P1 |
| Congestion legend overlay | MEDIUM | LOW | P1 |
| LOS grades A–F in analytics | HIGH | LOW | P1 |
| Control delay bar chart | HIGH | MEDIUM | P1 |
| Top 5 / Top 3 ranked tables | HIGH | LOW | P1 |
| Camera detail panel | LOW | LOW | P2 |
| Alerts legend overlay | LOW | LOW | P2 |
| Map version dropdown | LOW | LOW | P2 |
| FRC filter controls | LOW | MEDIUM | P3 |

---

## Competitor Feature Analysis

| Feature | INRIX IQ | HERE Traffic | TomTom | Waze for Cities |
|---------|----------|--------------|--------|-----------------|
| Dark map UI | Yes (dark navy) | Light default, dark option | Light default | Light/branded |
| Road congestion coloring | Green/Yellow/Red + Black | Green/Orange/Red | Green/Orange/Red | Green/Orange/Red |
| Speed buckets | 4 buckets (% of ref speed) | currentSpeed / freeFlowSpeed ratio | currentSpeed / freeFlowSpeed ratio | Not published |
| Segment click detail panel | Yes (speed, TTI, FRC, travel time) | Yes (speed, confidence) | Yes (speed, travel time) | Limited |
| Alert/incident layer | 7 types (crash, construction, closure, event, congestion, hazard, slowdown) | Incidents layer | Incidents layer | Real-time user reports |
| Signal analytics / LOS | Yes — key differentiator, no hardware needed | No equivalent | No equivalent | No equivalent |
| Camera integration | Yes | No | No | No |
| TTI / corridor analysis | Yes | Available via API | Available via API | No |
| FRC filtering | Yes (FRC 1–5) | Road class filters | Road class filters | No |

INRIX's clearest differentiator in the demo is Signal Analytics (intersection LOS without hardware). No competitor has an equivalent product in the market. This should be the analytics view's visual centerpiece.

---

## Sources

- [INRIX Speed Buckets documentation](https://docs.inrix.com/reference/speedbuckets/)
- [INRIX Segments documentation](https://docs.inrix.com/traffic/segments/)
- [INRIX Speed API documentation](https://docs.inrix.com/traffic/speed/)
- [INRIX Glossary](https://docs.inrix.com/reference/glossary/)
- [INRIX Data Network and XD Traffic](https://docs.inrix.com/ra/datanetworkandxdtraffic/)
- [INRIX Data and Metrics definitions](https://docs.inrix.com/ra/dataandmetrics/)
- [INRIX Signal Analytics Metrics](https://docs.inrix.com/signals/signals-metrics/)
- [INRIX Signal Analytics product page](https://inrix.com/products/signal-analytics/)
- [INRIX Mission Control product page](https://inrix.com/products/mission-control/)
- [INRIX Signal Analytics press release](https://inrix.com/press-releases/inrix-iq-signal-analytics/)
- [INRIX Reference Speeds blog](https://inrix.com/blog/reference-speeds-the-backbone-of-better-traffic-intelligence/)
- [Getting Started with Signal Analytics Part 1](https://inrix.com/blog/getting-started-with-signal-analytics-part-1-seeing-the-big-picture-with-the-daily-dashboard/)
- [Getting Started with Signal Analytics Part 2](https://inrix.com/blog/getting-started-with-signal-analytics-part-2-how-to-analyze-intersection-performance-measures/)
- [FHWA Signalized Intersections Guide — HCM LOS thresholds](https://www.fhwa.dot.gov/publications/research/safety/04091/07.cfm)
- [TomTom Traffic API — speed category thresholds](https://developer.tomtom.com/knowledgebase/apis/faq/intermediate-traffic/what-are-the-definitions-of-the-different-traffic-condition-values-in-the-flow-feed/)
- [INRIX Global Traffic Scorecard — congestion threshold definition](https://inrix.com/scorecard/)

---

*Feature research for: INRIX IQ traffic intelligence platform demo clone*
*Researched: 2026-03-16*
