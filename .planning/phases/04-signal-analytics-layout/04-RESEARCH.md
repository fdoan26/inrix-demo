# Phase 4: Signal Analytics Layout - Research

**Researched:** 2026-03-17
**Domain:** React layout composition, Recharts v2 BarChart, react-leaflet light tile layer, inline-style panel components
**Confidence:** HIGH

## Summary

Phase 4 converts the placeholder `SignalAnalyticsView` into a fully populated layout. The view already has a shell with correct background colors (`#e8ecf1` outer, `#dfe5ed` left panel). The mock data file (`signalData.ts`) is completely written with all required values — KPIs, weekly chart points, LOS grades, delay tables, and corridor tables — so DATA-04 is primarily a verification task rather than a creation task.

The core implementation work is three components: a KPI left panel (count rows + delay metrics + Recharts bar chart + LOS grade rows), a center content area that hosts the background map, and the map itself using the CartoDB Light All tile layer already in use in `MapView.tsx`. No new dependencies are needed. Recharts v2.15.4 is pinned and installed. The `BarChart` API from Recharts v2 is well-understood from existing `index.css` styles (`.recharts-cartesian-axis-tick-value`, `.recharts-text` overrides confirm it has been previously configured for this project).

The key layout risk is Recharts `BarChart` requiring an explicit pixel `width` and `height` — it will silently render zero-height inside a flex container if given percentage values or `width="100%"`. The solution is `ResponsiveContainer` wrapping or a fixed pixel height with `width="100%"` on the `BarChart` element itself. The `ResponsiveContainer` approach is safer for the left panel's scrollable interior.

**Primary recommendation:** Build SignalAnalyticsView in one plan: KPI panel (scroll container with five sections) + center area (`<MapContainer>` with CartoDB Light All tiles, non-interactive, no overlays). All data is already in `signalData.ts` — just import and render.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SIG-01 | Signal Analytics view renders with left KPI summary panel and center content area | SignalAnalyticsView placeholder exists — needs real content; flex layout already established |
| SIG-02 | Left panel shows summary KPIs: intersections count, approaches count, corridors count, cameras count | signalData.kpis has all four values: 1064, 3547, 334, 8851 |
| SIG-03 | Left panel shows total control delay and avg control delay per vehicle metrics | signalData.controlDelayTotals and signalData.avgControlDelayPerVehicle both defined |
| SIG-04 | Left panel shows bar chart of avg control delay over time (using Recharts) | signalData.weeklyChart has 5 data points with {week, value} shape; Recharts v2.15.4 installed |
| SIG-05 | Left panel shows intersection counts by LOS grade (A through F) with color coding | signalData.losByGrade has 6 entries with grade, count, color matching Tailwind tokens |
| SIG-06 | Background map renders in light/muted style behind Signal Analytics content | CartoDB Light All tile URL already used in MapView.tsx — same URL works here |
| DATA-04 | Signal analytics mock data defined matching Austin TX screenshot values | signalData.ts is fully written — verification only; all shapes match TypeScript interfaces |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 2.15.4 | Bar chart for control delay over time | Already pinned; v3 has generics API rewrite — must stay on v2 |
| react-leaflet | 4.2.1 | Background map in center area | Already pinned; v5 requires React 19 |
| leaflet | 1.9.4 | Peer dependency for react-leaflet | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.577.0 | Icons for KPI section headers | Same as Mission Control panels — consistent icon style |
| zustand | 5.0.12 | Read activeView to confirm correct view renders | Already wired in App.tsx |

### No New Dependencies Needed

All required libraries are installed. Do not add any new `npm install` commands.

## Architecture Patterns

### Recommended Project Structure
```
src/components/signal-analytics/
├── SignalAnalyticsView.tsx    # Top-level layout host (REPLACE existing placeholder)
├── KpiPanel.tsx               # Left panel — all five sections
└── SignalMap.tsx              # Center area — light background map
```

**Note:** Phase 5 (tables) will add more files to this directory. Keep `SignalAnalyticsView.tsx` as the dumb layout shell that assembles KpiPanel + SignalMap + (later) the table columns. The panel should not import signalData directly — pass nothing; let KpiPanel import signalData internally since it is static mock data.

### Pattern 1: Left Panel Section Layout
**What:** Each distinct section in the KPI panel is separated by a divider line and has a section header label. Five sections in order: (1) count KPIs, (2) total/avg delay metrics, (3) bar chart, (4) LOS grades.
**When to use:** This stacked-section pattern matches the INRIX IQ design shown in all panels in this project.
**Example:**
```typescript
// Each section separator
<div style={{ borderTop: '1px solid #c8d0dc', margin: '0 -16px', padding: '12px 16px 0' }}>
  <span style={{ fontSize: 10, color: '#6a7f9a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    Section Title
  </span>
</div>
```

### Pattern 2: Recharts ResponsiveContainer + BarChart
**What:** Wrap `BarChart` in `ResponsiveContainer` with a fixed `height`. Set `width="100%"` on ResponsiveContainer. This prevents zero-height render inside flex/overflow containers.
**When to use:** Always — never use `BarChart` without `ResponsiveContainer` in a variable-width container.
**Example:**
```typescript
// Source: Recharts v2 official docs — https://recharts.org/en-US/api/ResponsiveContainer
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

<ResponsiveContainer width="100%" height={80}>
  <BarChart data={signalData.weeklyChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
    <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#6a7f9a' }} tickFormatter={(v) => v.slice(0, 5)} />
    <YAxis tick={{ fontSize: 9, fill: '#6a7f9a' }} domain={['auto', 'auto']} />
    <Bar dataKey="value" fill="#1a6eb5" radius={[2, 2, 0, 0]} />
    <Tooltip
      contentStyle={{ background: '#dfe5ed', border: '1px solid #c8d0dc', borderRadius: 4, fontSize: 11 }}
      labelStyle={{ color: '#2a3f5f' }}
      itemStyle={{ color: '#1a6eb5' }}
    />
  </BarChart>
</ResponsiveContainer>
```

### Pattern 3: Light Background Map (Non-Interactive)
**What:** A `MapContainer` centered on Austin TX (`[30.267, -97.743]`, zoom 12) using CartoDB Light All tiles. The map should be non-interactive — disable drag and zoom to prevent accidental navigation. It sits behind any overlay content in the center area.
**When to use:** For Signal Analytics center area (SIG-06). Do NOT reuse the LA-centered Mission Control MapView.
**Example:**
```typescript
// CartoDB Light All — same domain already in MapView.tsx
<MapContainer
  center={[30.267, -97.743]}
  zoom={12}
  style={{ height: '100%', width: '100%' }}
  zoomControl={false}
  attributionControl={false}
  dragging={false}
  scrollWheelZoom={false}
  doubleClickZoom={false}
  keyboard={false}
>
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    subdomains="abcd"
    maxZoom={19}
  />
</MapContainer>
```

### Pattern 4: LOS Grade Row
**What:** Each LOS grade is a compact horizontal row: colored dot + grade letter + count + percentage bar. Color values already match `tailwind.config.js` tokens (`los-a` through `los-f`).
**When to use:** Rendering the losByGrade array (SIG-05).
**Example:**
```typescript
{signalData.losByGrade.map(({ grade, count, color }) => (
  <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
    <span style={{ fontSize: 12, fontWeight: 600, color: '#2a3f5f', width: 16 }}>{grade}</span>
    <div style={{ flex: 1, height: 4, background: '#c8d0dc', borderRadius: 2 }}>
      <div style={{ height: '100%', width: `${(count / 1064) * 100}%`, background: color, borderRadius: 2 }} />
    </div>
    <span style={{ fontSize: 11, color: '#4a6080', width: 28, textAlign: 'right' }}>{count}</span>
  </div>
))}
```

### Anti-Patterns to Avoid
- **BarChart without ResponsiveContainer:** Chart renders at 0 height in a flex parent. Always wrap in ResponsiveContainer with a pixel height.
- **Importing signalData in SignalAnalyticsView directly:** Couples the layout shell to data. Import in KpiPanel.tsx where the data is actually rendered.
- **Using Tailwind JIT classes for dynamic colors in LOS rows:** The color values come from data (`color: '#4caf50'`). Use inline style — not `className={`text-[${color}]`}`.
- **Reusing MissionControlView MapView for Signal Analytics background:** MapView is LA-centered, dark-tiled, and wired to Zustand filter state. Create a separate lean `SignalMap.tsx`.
- **Percentage width/height on MapContainer without a positioned parent:** `height: '100%'` requires the parent to have an explicit height. Ensure `flex: 1` + `overflow: hidden` on the center column container.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bar chart rendering | Custom `<canvas>` or `<svg>` chart | `recharts` BarChart + ResponsiveContainer | Edge cases: axis scaling, tooltip positioning, responsive resize |
| Map tile display | Raw Leaflet imperative code | `react-leaflet` MapContainer + TileLayer | Lifecycle management, React unmount cleanup |
| Percentage bar for LOS grades | External progress component | Inline `div` with calculated `width` | Simple enough; adding a component library for one progress bar is wasteful |

**Key insight:** Both charting and mapping already have pinned, working libraries. Any custom solution would reintroduce the Leaflet lifecycle bugs and Recharts tooltip issues that took prior phases to resolve.

## Common Pitfalls

### Pitfall 1: Zero-Height BarChart
**What goes wrong:** Chart renders but is invisible — no bars visible, chart takes up 0px height.
**Why it happens:** Recharts `BarChart` uses an internal SVG that requires an explicit pixel dimension from its parent. Inside a `display: flex` container with no fixed height, it cannot calculate its own height.
**How to avoid:** Always use `<ResponsiveContainer width="100%" height={80}>` with a numeric pixel `height`. Never pass `height="100%"` to ResponsiveContainer inside a scrolling flex container.
**Warning signs:** Chart renders in the DOM (inspect shows SVG element) but visually invisible. Recharts does not throw an error.

### Pitfall 2: Map Tile Layer CORS / Grey Tiles
**What goes wrong:** Map renders but tiles are grey or fail to load.
**Why it happens:** This was solved in Phase 1 — `import 'leaflet/dist/leaflet.css'` must be the first import in `main.tsx`. It already is. However, a new `MapContainer` also needs Leaflet's icon patch if any markers are used. Since this map is tile-only (no markers), the icon patch is not required.
**How to avoid:** No extra work needed. The `leaflet/dist/leaflet.css` import already covers tile rendering. Use the same CartoDB Light All URL pattern from `MapView.tsx`.
**Warning signs:** Grey tiles with no network errors means CSS is missing. Network errors (403/404) mean wrong tile URL.

### Pitfall 3: Left Panel Overflow Collapse
**What goes wrong:** KPI panel contents overflow and push layout outside the viewport, or the panel itself collapses to 0 height.
**Why it happens:** The panel has `width: 280, minWidth: 280` set on the placeholder but no `overflow-y: auto` or `flex: 1` on the inner scroll container. If content height exceeds viewport, the panel grows and breaks the parent layout.
**How to avoid:** Give the outer panel `display: flex; flex-direction: column; height: 100%`. Give the inner scrollable section `overflow-y: auto; flex: 1`. Never set `height: 100%` on a flex child without confirming the parent has an explicit height.
**Warning signs:** Scrollbar appears on the whole page instead of inside the panel. Content bleeds outside the panel border.

### Pitfall 4: Austin Map Center vs LA
**What goes wrong:** The background map displays Los Angeles instead of Austin TX.
**Why it happens:** If `SignalMap.tsx` reuses `MapView.tsx` or imports map state from Zustand (`mapSlice` stores `center: [34.05, -118.25]`), it will render the LA view.
**How to avoid:** Hardcode Austin coordinates `[30.267, -97.743]` directly in `SignalMap.tsx`. Do NOT connect this map to Zustand's `center`/`zoom` state — those belong to Mission Control.
**Warning signs:** Map shows downtown LA. City names visible on tiles confirm the wrong city.

### Pitfall 5: Recharts Text Color Not Matching Design
**What goes wrong:** Axis tick labels render in black against the light `#e8ecf1` background, clashing with the design.
**Why it happens:** `index.css` already has `.recharts-cartesian-axis-tick-value { fill: #8ca0bc }` — but that dark blue-grey was for the dark Mission Control background. For the light Signal Analytics background, `#8ca0bc` may be too light.
**How to avoid:** Override tick colors inline via the `tick` prop on `XAxis`/`YAxis`: `<XAxis tick={{ fontSize: 9, fill: '#6a7f9a' }} />`. The inline prop takes precedence over the global CSS class.
**Warning signs:** Axis labels invisible or too faint against the light background.

## Code Examples

Verified patterns from project source and Recharts v2 documentation:

### KPI Count Row
```typescript
// Pattern from SegmentPanel.tsx metadata rows — adapted for light panel
function KpiRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: '#4a6080' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1a2f4a' }}>
        {value.toLocaleString()}
      </span>
    </div>
  )
}
```

### Delay Metric Block
```typescript
// totalControlDelay + delta indicator
<div style={{ marginBottom: 12 }}>
  <div style={{ fontSize: 10, color: '#6a7f9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
    Total Control Delay
  </div>
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
    <span style={{ fontSize: 22, fontWeight: 700, color: '#1a2f4a' }}>
      {signalData.controlDelayTotals.total.toLocaleString()}
    </span>
    <span style={{ fontSize: 11, color: '#6a7f9a' }}>hrs</span>
    <span style={{ fontSize: 12, fontWeight: 600, color: '#f44336', marginLeft: 4 }}>
      {signalData.controlDelayTotals.delta}
    </span>
  </div>
  <div style={{ fontSize: 11, color: '#6a7f9a' }}>
    4wk avg: {signalData.controlDelayTotals.fourWeekAvg.toLocaleString()} hrs
  </div>
</div>
```

### SignalAnalyticsView Layout Shell
```typescript
// Replaces the placeholder — flex row, full height
export function SignalAnalyticsView() {
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#e8ecf1' }}>
      <KpiPanel />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <SignalMap />
      </div>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Recharts `<BarChart width={300} height={200}>` with hardcoded pixel size | `<ResponsiveContainer width="100%" height={80}><BarChart>` | Recharts v2 (stable since v2.1) | Chart adapts to panel width; no fixed width needed |
| CartoDB Dark Matter for all maps | CartoDB Light All for Signal Analytics background | Phase design decision | Light tile matches INRIX IQ Signal Analytics screenshot aesthetic |

**Deprecated/outdated:**
- `width="100%"` directly on `BarChart`: Not supported — always use `ResponsiveContainer` as the sizing parent.

## Open Questions

1. **Exact Austin TX center coordinates for map**
   - What we know: Austin city center is approximately `[30.267, -97.743]` (standard lat/lng for Austin TX)
   - What's unclear: The INRIX screenshot zoom level is not captured in requirements — zoom 12 is a reasonable default showing downtown Austin
   - Recommendation: Use `[30.267, -97.743]` at zoom 12; this can be adjusted in Phase 6 polish if reference screenshots show a different area

2. **Left panel exact width**
   - What we know: Placeholder sets `width: 280, minWidth: 280`
   - What's unclear: The INRIX IQ reference screenshot panel width — 280px may be slightly narrower than the original
   - Recommendation: Keep 280px from the existing placeholder; the reference data all fits at this width

3. **DATA-04 verification status**
   - What we know: `signalData.ts` has all required data including KPIs, weekly chart, LOS grades, delay tables, corridor tables — all typed correctly against `SignalData` interface
   - What's unclear: Whether the specific numeric values match the "Austin TX screenshot values" mentioned in STATE.md concern (line 99)
   - Recommendation: DATA-04 plan task should verify values against the original INRIX IQ screenshot description rather than rewriting the file; the data shape is correct

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured — no test files found in project |
| Config file | None |
| Quick run command | `npm run build` (TypeScript compile = structural validation) |
| Full suite command | `npm run build && npm run dev` (visual verification) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SIG-01 | View renders with left panel + center area, no layout collapse | visual/smoke | `npm run build` | ❌ Wave 0 |
| SIG-02 | Left panel shows four KPI count rows with correct values | visual/smoke | `npm run build` | ❌ Wave 0 |
| SIG-03 | Left panel shows total and avg control delay with delta | visual/smoke | `npm run build` | ❌ Wave 0 |
| SIG-04 | Recharts BarChart renders with bars visible (non-zero height) | visual/smoke | `npm run build` | ❌ Wave 0 |
| SIG-05 | LOS A-F rows render with correct colors and counts | visual/smoke | `npm run build` | ❌ Wave 0 |
| SIG-06 | Light map tiles load behind content | visual/smoke | `npm run build` | ❌ Wave 0 |
| DATA-04 | signalData.ts imports cleanly, all types match interfaces | unit/compile | `npm run build` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (TypeScript compile catches type errors)
- **Per wave merge:** `npm run build` (full compile)
- **Phase gate:** `npm run build` green + visual browser verification before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No automated test framework — all validation is TypeScript compile + visual browser verification
- [ ] `npm run build` is the primary automated gate; it catches: missing imports, type mismatches in signalData, bad JSX

*(This project uses no test runner. The build compile is the automated validation gate. Visual verification against the browser is the acceptance test.)*

## Sources

### Primary (HIGH confidence)
- Direct file reads: `src/data/signalData.ts` — data shape confirmed complete
- Direct file reads: `src/types/index.ts` — all Signal Analytics interfaces confirmed
- Direct file reads: `src/components/signal-analytics/SignalAnalyticsView.tsx` — placeholder confirmed
- Direct file reads: `src/components/mission-control/MapView.tsx` — CartoDB Light All URL confirmed
- Direct file reads: `package.json` — recharts 2.15.4, react-leaflet 4.2.1 confirmed
- Direct file reads: `tailwind.config.js` — LOS color tokens confirmed
- Direct file reads: `src/index.css` — Recharts global style overrides confirmed

### Secondary (MEDIUM confidence)
- Recharts v2 official docs (https://recharts.org/en-US/api/ResponsiveContainer) — ResponsiveContainer height requirement
- react-leaflet v4 docs — MapContainer prop `dragging={false}` for non-interactive map

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed installed via package.json
- Architecture: HIGH — all source files read directly; data shape confirmed complete
- Pitfalls: HIGH — ResponsiveContainer zero-height is a known Recharts v2 issue; LA vs Austin center is directly observable in source; other pitfalls derived from reading existing code
- Data completeness: HIGH — signalData.ts fully written with correct types

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable libraries; no API changes expected)
