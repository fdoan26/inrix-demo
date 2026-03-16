# Project Research Summary

**Project:** INRIX IQ Demo Clone
**Domain:** Traffic intelligence SaaS platform — React SPA investor demo with geo-visualization, dark UI, signal analytics
**Researched:** 2026-03-16
**Confidence:** HIGH

## Executive Summary

This is a single-page React application designed to visually replicate the INRIX IQ platform for investor demonstration purposes. Experts build this class of product — a dark-map geo-visualization SaaS demo — using react-leaflet for interactive map rendering, Recharts for time-series and distribution charts, Zustand for lightweight client state, and Tailwind CSS for rapid dark-theme UI. The application has two distinct views: Mission Control (full-screen dark map with congestion overlays, alert pins, camera pins, and a slide-in segment detail panel) and Signal Analytics (intersection-level intelligence with KPI cards, control delay bar chart, LOS grade distribution, and ranked issue tables). All data is static mock data — no backend, no API keys, no loading states.

The recommended approach is to build in strict dependency order: types and mock data first, then the Zustand store, then the app shell, then Mission Control map layers, then Signal Analytics. Signal Analytics mock data is independent of Mission Control and can be built in parallel once the store and shell are in place. The entire architecture is designed around credibility — real LA/Austin geography, realistic decimal values, per-type color coding, and authentic INRIX terminology (FRC, TTI, LOS, XD segments, reference speed). The product's clearest investor differentiator is Signal Analytics (intersection LOS without hardware), which no INRIX competitor offers.

The dominant technical risks are all known and preventable with explicit configuration: react-leaflet@5 breaking on React 18 (pin to v4.2.1), Tailwind@4 incompatible with the v3 config approach (pin to v3.4.19), Recharts@3 API changes (pin to v2.15.4), Leaflet CSS not auto-imported (add to main.tsx first), and Tailwind z-index defaults sitting below Leaflet's internal z-index range (extend tailwind.config.js with values to 1000). All of these must be resolved in Phase 1 before any feature work begins.

## Key Findings

### Recommended Stack

The stack is fully version-pinned because npm latest for several packages (react-leaflet, tailwindcss, recharts, @types/react) would install breaking versions as of 2026-03-16. React 18.3.1 is the ceiling because react-leaflet@5 requires React 19. Vite 5.4.21 is the ceiling because plugin-react@4 only supports Vite 5.x. Tailwind 3.4.19 is required because v4 drops the JS config file and PostCSS approach entirely. All versions are verified against the live npm registry and official docs.

**Core technologies:**
- React 18.3.1: UI framework — constrained to 18.x by react-leaflet@4 peer dependency; stability over concurrent features
- TypeScript 5.9.3: Type safety — use `moduleResolution: "bundler"` and `skipLibCheck: true` (required for Recharts compat)
- Vite 5.4.21: Build tooling — fastest HMR; pin to 5.x for plugin-react@4 compatibility; Vite 6/8 breaks the plugin
- react-leaflet 4.2.1: Interactive map — MUST be v4.x; v5 requires React 19 and breaks silently with React 18
- leaflet 1.9.4: Map engine — CartoDB Dark Matter tiles require no API key; `L.divIcon` used for all custom pins
- Tailwind CSS 3.4.19: Utility-first CSS — v3 PostCSS approach required for `extend.colors` design tokens; v4 incompatible
- Recharts 2.15.4: Charts — stable TypeScript types in v2; v3 generics API rewrite breaks all v2 patterns
- Zustand 5.0.12: State management — minimal boilerplate; use `useShallow` from `zustand/react/shallow` for all object selectors

### Expected Features

All features reference INRIX's official documentation, speed bucket definitions, HCM LOS standards (FHWA), and competitor analysis. Using correct INRIX terminology throughout (FRC, TTI, XD segment IDs, reference speed, congestion threshold at 65% of ref speed) is a hard requirement for demo credibility.

**Must have (table stakes) — investor expects to see:**
- Full-screen dark map (CartoDB Dark Matter tiles, no API key) — every traffic ops product uses dark base maps
- 25+ road segments color-coded by congestion (green/yellow/orange/red per speed bucket thresholds) — the core product visual
- Segment click opens right slide-in detail panel with all required fields (speed, reference speed, FRC, TTI, travel time, XD segment ID)
- 20+ alert pins color-coded by type (crash/construction/event/slowdown) with click-to-detail
- 15+ camera pins with cluster count badges
- Top filter bar (Network/Corridors toggle, Traffic Flow toggle, Alerts toggle with count badge, Cameras toggle)
- Congestion legend overlay (bottom-left, always visible)
- Signal Analytics view (KPI panel, control delay bar chart, LOS distribution A-F, Top 5 delay issues table, Top 3 corridor issues table)
- Navigation between Mission Control and Signal Analytics views

**Should have (differentiators):**
- Speed vs. reference speed display in segment panel ("65 mph / 70 mph ref") — signals data sophistication
- Relative congestion metric ("7% below free flow") — how traffic professionals talk about congestion
- LOS grades A-F with HCM-standard color coding — shows signal analytics depth
- Control delay bar chart with 4-week average reference line
- Ranked tables with delta vs. baseline ("+12.4s, +17%") — shows trend intelligence
- TTI values with two decimal places in corridor issues table
- FRC-level segment weight variation (5px freeways, 3px arterials) — shows data model depth

**Defer to v1.x:**
- Alerts legend overlay (appears when Alerts layer toggled on)
- Camera detail panel (click-through detail for cameras)
- Map version dropdown (currently static label)
- FRC-level filter controls

**Defer to v2+:**
- Historical playback / time scrubber
- Additional INRIX modules (Curb Analytics, Parking Analytics, OD)
- Export / reporting views
- Mobile responsive layout

### Architecture Approach

The architecture is a two-view SPA with a shared Zustand store divided into three slices (mapSlice, filterSlice, uiSlice). Mission Control and Signal Analytics are completely independent view trees — they share only the NavBar and the store. Data lives in four static TypeScript files (segments.ts, alerts.ts, cameras.ts, signalData.ts) imported at bundle time. Zustand stores only IDs and UI state, never full data objects. Components subscribe to individual store properties (not the whole store) to prevent cascading re-renders. The build order is strictly: types → data → lib utilities → store slices → layout shell → map layers → Mission Control assembly → Signal Analytics → App root.

**Major components:**
1. NavBar + AppShell — view switcher and outer layout; reads/writes `activeView` from uiSlice
2. MissionControlView — orchestrates FilterBar, MapView (SegmentLayer, AlertLayer, CameraLayer, legends), and DetailPanel slide-in
3. SignalAnalyticsView — orchestrates LeftKPIPanel (KPIs, ControlDelayChart, LOSTable) and CenterContent (DelayIssuesTable x2, CorridorIssuesTable) over a BackgroundMap
4. Zustand store (mapSlice, filterSlice, uiSlice) — cross-component state without prop drilling
5. src/data/*.ts — pure TypeScript mock data files; never mutated at runtime

**Key patterns:**
- Legend overlays are absolute-positioned divs outside `<MapContainer>`, not Leaflet Controls — simpler DOM approach
- DetailPanel uses Tailwind `translate-x-full`/`translate-x-0` + `transition-transform` for slide animation; `z-[1000]` to sit above all Leaflet layers
- Polyline rendering order controlled via named react-leaflet `<Pane>` components (congestion-green z:401, yellow z:402, orange z:403, red z:404)
- MapContainer `center` prop is mount-only; programmatic panning requires a `MapController` child using `useMap()`
- `L.divIcon` with inline styles (not Tailwind classes) for all alert and camera pins

### Critical Pitfalls

1. **Missing Leaflet CSS import** — add `import 'leaflet/dist/leaflet.css'` to main.tsx as the first import, before Tailwind. Causes silent grey map. Affects Phase 1.

2. **Tailwind z-index defaults too low for Leaflet** — Tailwind v3 ships `z-50` as its max named utility (`z-index: 50`), which is below Leaflet's tile pane at z-index 200. Extend tailwind.config.js with `zIndex: { '100': '100', '500': '500', '900': '900', '1000': '1000' }`. Affects Phase 1 config and Phase 2 layout.

3. **MapContainer props are immutable after mount** — passing updated `center` or `zoom` to `<MapContainer>` after mount is silently ignored. Use a `MapController` child component that calls `useMap().setView()` in a `useEffect`. Affects Phase 2.

4. **Recharts ResponsiveContainer collapses in flex parents** — wrap every `<ResponsiveContainer>` in a div with an explicit pixel height (e.g., `style={{ height: 280 }}`). Zero-height chart is silent with no errors. Affects Phase 3.

5. **Zustand useShallow required for all object/array selectors** — in Zustand v5, any selector returning a new object reference on every call causes infinite re-render loops. Wrap with `useShallow(s => ({ ... }))` for every multi-property selector. Affects every phase where store is introduced.

6. **DivIcon HTML cannot use Tailwind classes** — JIT scanner misses class names inside JS template strings. Use inline styles exclusively in all `L.divIcon` factory functions. Affects Phase 2.

7. **Polyline rendering order requires named Panes** — SVG paths do not support CSS `z-index`; use react-leaflet `<Pane>` components to ensure red congestion segments always render above green. Affects Phase 2.

## Implications for Roadmap

Based on the dependency chain from ARCHITECTURE.md, the build order is strictly sequential in the early phases and partially parallelizable in later phases. All Phase 1 configuration pitfalls must be resolved before any Phase 2 work begins — a broken map in Phase 2 is disruptive to debug.

### Phase 1: Foundation and Scaffold
**Rationale:** All downstream phases depend on types, data, store, and correct Vite/Tailwind/Leaflet configuration. All 5 Phase 1 pitfalls (missing CSS, marker icon fix, MapContainer height, Tailwind Preflight, z-index extension) must be caught and resolved here before any feature work.
**Delivers:** Working Vite + React + TypeScript + Tailwind project; verified dark map tile loading with CartoDB Dark Matter; Zustand store with all three slices wired; all four mock data files with correct types; NavBar with view switching functional; AppShell layout skeleton.
**Addresses:** Foundation for all features in FEATURES.md MVP list.
**Avoids:** Pitfalls 1 (Leaflet CSS), 2 (marker icon Vite fix), 3 (MapContainer height), 4 (Tailwind Preflight), 5 (z-index war), 8 (Zustand useShallow), 10 (CartoDB retina URL).

### Phase 2: Mission Control Map
**Rationale:** The map view is the product's primary visual identity and the first thing investors see. Building it second (after foundation) establishes the core interaction patterns before Signal Analytics is built. The dependency chain (types → data → lib utilities → store → map layers → detail panel) must be followed in sequence.
**Delivers:** Full-screen dark map with 25+ color-coded road segments, 20+ alert pins, 15+ camera pins, FilterBar toggles, CongestionLegend overlay, and right slide-in DetailPanel. All segment and alert data uses real LA geography and authentic INRIX terminology.
**Uses:** react-leaflet 4.2.1, Leaflet 1.9.4, CartoDB Dark Matter tiles, lucide-react icons, Zustand filterSlice and uiSlice.
**Implements:** SegmentLayer with named Panes, AlertLayer with DivIcons, CameraLayer with badge DivIcons, DetailPanel with CSS slide animation.
**Avoids:** Pitfalls 6 (MapContainer immutable props via MapController), 7 (DivIcon inline styles), 8 (Polyline Panes for z-ordering), 12 (Leaflet event handler TypeScript types).

### Phase 3: Signal Analytics
**Rationale:** Signal Analytics is independent of Mission Control's map data and can be built cleanly after the app shell and store patterns are established. It is the product's primary differentiator and the most complex view in terms of data density and chart rendering. Building it last ensures the design system (colors, spacing, typography) is already established from Phase 2.
**Delivers:** Complete Signal Analytics view: 6 KPI cards, ControlDelayChart (Recharts BarChart with 4-week average reference line), LOS distribution table (A-F grades), Top 5 Control Delay Issues table, Top 3 Corridor Issues table, and light BackgroundMap.
**Uses:** Recharts 2.15.4, signalData.ts mock data, Austin TX geography for intersections and corridors.
**Implements:** LeftKPIPanel, ControlDelayChart, LOSTable, DelayIssuesTable (reused for total and per-vehicle variants), CorridorIssuesTable, BackgroundMap.
**Avoids:** Pitfall 9 (ResponsiveContainer flex collapse — use explicit pixel-height wrapper), Recharts dark theme tooltip styling.

### Phase 4: Polish and Anti-Feature Elimination
**Rationale:** Research identified 11 specific anti-features that make demos look fake (round numbers, uniform congestion distribution, generic road names, static badges, light map for Mission Control, placeholder text). These must be audited and eliminated before any investor showing. This is a distinct phase because it requires reviewing the whole product end-to-end rather than building individual components.
**Delivers:** All mock data uses realistic decimal values and odd numbers; congestion distribution is realistic (freeways mostly green, arterials mixed, surface streets yellow/orange); all 25+ segments use real LA road names; all badges show plausible non-round counts; chart y-axes auto-scale to data range; all tooltips and labels are populated.
**Addresses:** All 11 anti-features listed in FEATURES.md.

### Phase 5: v1.x Additions (Post-Validation)
**Rationale:** Features deferred from MVP that add polish but are not investor-critical. Build only after Phase 4 is complete and demo is validated.
**Delivers:** Alerts legend overlay, camera detail panel, FRC filter controls, map version dropdown.
**Addresses:** FEATURES.md v1.x backlog.

### Phase Ordering Rationale

- Types and mock data must precede all visual work because every layer component depends on typed data structures. Building components before types causes cascading refactors.
- The Zustand store must be initialized before any cross-component interaction is wired. Attempting to add global state after component trees are built requires significant refactoring of prop chains.
- Mission Control precedes Signal Analytics because it establishes the design system tokens, the NavBar interaction, and the Tailwind z-index configuration that Signal Analytics inherits.
- Phase 4 (polish) is intentionally separate from Phase 3 (build) because authenticity requirements (realistic data values, real geography) are best addressed as a focused audit pass rather than interleaved with construction.

### Research Flags

Phases with standard, well-documented patterns (skip deeper research):
- **Phase 1:** Vite + React + TypeScript scaffold is fully documented. All gotchas are pre-identified and have confirmed fixes in STACK.md and PITFALLS.md.
- **Phase 2:** react-leaflet Polyline, Marker, DivIcon, and Pane patterns are well-documented in official docs and verified sources.
- **Phase 3:** Recharts BarChart with ResponsiveContainer is standard usage; wrapper height fix is the only non-obvious requirement.

Phases that may benefit from targeted research during planning:
- **Phase 2 (MapController):** The `MapController` pattern for programmatic map control (fly-to on segment click) is documented but has nuances in TypeScript strict mode. Verify the `useEffect` cleanup pattern before implementing.
- **Phase 4:** Realistic congestion distribution values (which specific LA corridors should show red vs green at a typical 4pm snapshot) could benefit from brief research to improve authenticity.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified live from npm registry on 2026-03-16; peer dependencies confirmed; all gotchas cross-referenced against GitHub issues and official docs |
| Features | HIGH | Terminology from official INRIX docs (speed buckets, FRC, TTI, LOS); HCM LOS thresholds from FHWA; visual patterns verified from INRIX product pages and press releases |
| Architecture | HIGH | Component tree and build order derived from react-leaflet official docs, Zustand slices pattern from official examples, folder structure from established React conventions |
| Pitfalls | HIGH | All 12 critical pitfalls verified against official documentation, specific GitHub issues, and community sources; recovery strategies confirmed |

**Overall confidence:** HIGH

### Gaps to Address

- **Realistic coordinate data for 25+ LA segments:** The data files need actual lat/lng polyline coordinate arrays for real LA roads. Research identified segment names and attributes but not coordinate geometry. This must be sourced during Phase 1 (likely from OpenStreetMap data or manually plotted).
- **Austin TX intersection/corridor values:** The signalData.ts mock needs realistic Austin intersection names and plausible control delay values. ARCHITECTURE.md references an "Austin TX screenshot" as the data source — that specific screenshot's values should be used to populate signalData.ts.
- **Recharts dark Tooltip styling:** The correct `contentStyle` props for dark theme were identified in PITFALLS.md but not fully specified. Verify exact values (`background: '#0a1628', border: '1px solid #1a6eb5'`) render correctly with the chosen chart layout.

## Sources

### Primary (HIGH confidence)
- npm registry (registry.npmjs.org) — all package version verification, 2026-03-16
- [INRIX Speed Buckets documentation](https://docs.inrix.com/reference/speedbuckets/) — congestion thresholds and color system
- [INRIX Signal Analytics Metrics](https://docs.inrix.com/signals/signals-metrics/) — control delay, POG, split failure definitions
- [INRIX Segments documentation](https://docs.inrix.com/traffic/segments/) — FRC levels, XD vs TMC segment types
- [INRIX Data and Metrics definitions](https://docs.inrix.com/ra/dataandmetrics/) — TTI formula and interpretation
- [React Leaflet Installation Docs](https://react-leaflet.js.org/docs/start-installation/) — v4 peer dependencies
- [React Leaflet MapContainer API](https://react-leaflet.js.org/docs/api-map/) — immutable props documentation
- [React Leaflet Panes API](https://react-leaflet.js.org/docs/example-panes/) — z-ordering for Polylines
- [Tailwind CSS v3 Vite Guide](https://v3.tailwindcss.com/docs/guides/vite) — PostCSS setup and content paths
- [Zustand v5 Migration Guide](https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5) — useShallow requirement
- [FHWA Signalized Intersections Guide](https://www.fhwa.dot.gov/publications/research/safety/04091/07.cfm) — HCM LOS thresholds

### Secondary (MEDIUM confidence)
- [Paige Niedringhaus — Multiple Colored Polylines](https://www.paigeniedringhaus.com/blog/render-multiple-colored-lines-on-a-react-map-with-polylines/) — Polyline rendering patterns
- [Atlys Engineering — Zustand Slices Pattern](https://engineering.atlys.com/a-slice-based-zustand-store-for-next-js-14-and-typescript-6b92385a48f5) — slice composition approach
- [Robin Wieruch — React Vite folder structure 2025](https://www.robinwieruch.de/react-folder-structure/) — project structure conventions
- [Recharts GitHub Issue #1545](https://github.com/recharts/recharts/issues/1545) — ResponsiveContainer flex collapse (open since 2019, confirmed unresolved)
- [CartoDB basemap styles GitHub](https://github.com/CartoDB/basemap-styles) — tile URL formats and retina `{r}` placeholder

### Tertiary (LOW confidence)
- INRIX IQ Mission Control and Signal Analytics product pages — visual pattern inference; exact UI layouts inferred, not confirmed from source code
- INRIX Global Traffic Scorecard methodology — 65% reference speed congestion threshold; publicly documented but methodology specifics not fully disclosed

---
*Research completed: 2026-03-16*
*Ready for roadmap: yes*
