# Phase 7: Forecasting - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a Forecasting view to the INRIX IQ demo — a 4th standalone view accessible from the nav dropdown that shows predicted congestion levels for LA metro freeway corridors across a 24-hour window. The view displays mock forecast data in a visual, investor-impressive layout. Route optimization, live API forecasting, and mobile layout are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Module placement
- 4th standalone view in the nav dropdown: Mission Control / Signal Analytics / Roadway Analytics / **Forecasting**
- Add `'forecasting'` to the `ActiveView` union type in `src/types/index.ts`
- Add `ForecastingView` to `src/App.tsx` using the existing lazy-load + Suspense pattern
- Layout: left KPI panel (fixed width, matching Signal Analytics pattern) + center content area

### Geographic scope
- Same 15 LA freeway corridor names already used in Roadway Analytics
- No new corridor data — reuse corridor names from the existing bottleneck list (I-405 NB, US-101 NB, SR-110 NB, I-10 EB, I-210 WB, etc.)
- No map component in this view — left panel list + right chart only

### Forecast type & data
- Metric: congestion level (0–100%) per hour over a 24-hour window
- Time horizon: 24 hours in hourly buckets (hours 0–23, labeled 12am → 11pm)
- 3 day tabs above the chart: **Today / Tomorrow / +2 Days** — each tab has distinct mock data so switching feels live
- Data: static hardcoded `forecastData.ts` file — no computation, no API

### Left KPI panel content
- Model accuracy badge: e.g. "94.2% accuracy" (last 30-day hindcast)
- Predicted peak hour: "5 PM" with congestion % e.g. "88%"
- Expected worst corridor: e.g. "I-405 NB" with predicted LOS grade "F"
- Confidence score: e.g. "High (0.91)" — feels like an ML product
- Below KPIs: clickable corridor list (all ~15 corridors)
  - Each row: corridor name + "Peak: 5PM • 87%" summary
  - Active corridor row highlighted with blue accent (#1a56db left border + background tint)

### Forecast chart (center content)
- Recharts `AreaChart` — 24 data points (one per hour)
- X-axis: hour labels (12am, 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm, 12am)
- Y-axis: 0–100% congestion
- Area fill: gradient from green (#4caf50) at low values → yellow (#ffeb3b) → orange (#ff9800) → red (#f44336) at high values. Use SVG `<linearGradient>` with stops at 25/50/75% y-values
- Single curve — no historical average overlay
- Recharts built-in `<Tooltip>` showing hour + congestion % on hover
- Chart title shows selected corridor name + selected day tab

### Day tab interaction
- 3 tab buttons above chart: "Today" / "Tomorrow" / "+2 Days"
- Each tab loads different mock congestion values for the selected corridor
- "Today" data should mirror the current simulated traffic patterns (busier AM + PM peaks)
- "Tomorrow" and "+2 Days" have slight variations (different peak heights, shifted peak hours)

### Claude's Discretion
- Exact spacing, typography, and panel proportions (match existing Signal Analytics / Roadway Analytics patterns)
- Gradient implementation details for the area fill
- Loading skeleton or transition when switching corridors/days
- Exact mock values for each corridor × day combination (make them realistic and varied)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing view patterns to match
- `src/components/signal-analytics/SignalAnalyticsView.tsx` — Left KPI panel + center content layout pattern
- `src/components/roadway-analytics/RoadwayAnalyticsView.tsx` — Corridor list with clickable rows, active row highlighting, tab pattern
- `src/components/signal-analytics/KpiPanel.tsx` — KPI panel structure and styling

### State management integration
- `src/types/index.ts` — ActiveView union type (must add 'forecasting')
- `src/store/` — Zustand store (check how activeView is managed)
- `src/App.tsx` — Lazy-load pattern for views (must add ForecastingView with React.lazy)
- `src/components/layout/NavBar.tsx` — VIEW_OPTIONS array (must add Forecasting entry)

### Design tokens
- `src/components/signal-analytics/KpiPanel.tsx` — Color values: #dfe5ed panel bg, #1a2f4a text, #4a6080 label, #1a56db accent
- `tailwind.config.js` — Available Tailwind classes and z-index values

### Recharts patterns (existing usage)
- `src/components/signal-analytics/KpiPanel.tsx` — BarChart implementation with Recharts (axis, tooltip, styling)

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useTrafficData` hook: not needed for Forecasting (static mock data only)
- `src/lib/congestion.ts`: `getCongestionColor()` function — reuse for corridor row color dots and gradient stops
- `src/components/roadway-analytics/RoadwayAnalyticsView.tsx`: tab button pattern, corridor row click pattern — copy these interaction patterns directly
- Recharts `AreaChart` from `recharts` package (already installed) — no new dependencies needed
- `lucide-react` icons already installed (for KPI panel icons if needed)

### Established Patterns
- Views are full-height flex columns with the app shell providing the outer container
- Left panels: `width: 280px`, `minWidth: 280px`, `background: #dfe5ed`, `border-r border-[#c8d0dc]`
- Active state: `border-left: 3px solid #1a56db` + light blue background tint
- Section dividers: `borderTop: '1px solid #c8d0dc'`, negative horizontal margin to full-bleed
- Label style: `fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6a7f9a'`

### Integration Points
- `src/types/index.ts` line ~1: Add `'forecasting'` to ActiveView union
- `src/components/layout/NavBar.tsx` VIEW_OPTIONS array: add `{ value: 'forecasting', label: 'Forecasting' }`
- `src/App.tsx`: add `React.lazy(() => import('./components/forecasting/ForecastingView'))` and conditional render
- New files: `src/data/forecastData.ts` + `src/components/forecasting/ForecastingView.tsx`

</code_context>

<specifics>
## Specific Ideas

- The KPI panel's "Expected worst corridor" row should feel like it's highlighting an actionable insight — not just a number
- The day tabs (Today / Tomorrow / +2 Days) should show visually different curves so the demo feels dynamic when clicking between them
- The gradient area fill is the visual centerpiece — make it look impressive (smooth gradient, not hard color stops)
- "Forecasting" in the nav positions INRIX as an AI/ML company, not just a data company — the confidence score and accuracy badge reinforce this

</specifics>

<deferred>
## Deferred Ideas

- None raised during discussion — discussion stayed within phase scope

</deferred>

---

*Phase: 07-forecasting*
*Context gathered: 2026-03-17*
