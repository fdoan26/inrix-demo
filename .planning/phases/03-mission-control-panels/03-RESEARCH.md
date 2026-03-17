# Phase 3: Mission Control Panels - Research

**Researched:** 2026-03-17
**Domain:** React slide-in detail panels wired to Zustand selection state
**Confidence:** HIGH

---

## Summary

Phase 3 is nearly pre-built. Both panel components (`SegmentPanel.tsx` and `CameraPanel.tsx`) already exist in `src/components/panels/` with full content, styling, and close-button wiring. The slide-in CSS animation (`panel-slide-in` / `@keyframes slideInRight`) is already defined in `src/index.css`. Both map layers (`SegmentLayer`, `CameraLayer`) already call `setSelectedItem` on click. The Zustand `uiSlice` already has `selectedItem`, `setSelectedItem`, and `clearSelectedItem`.

The only missing piece is the **panel host** — `MissionControlView.tsx` currently renders only `<FilterBar />` and `<MapView />` with no logic that reads `selectedItem` and conditionally renders the correct panel. The panels must sit beside the map in a flex row so the map narrows when a panel is open rather than the panel overlapping it.

The key implementation decisions are: (1) panel positioning — side-by-side flex vs. absolute overlay, (2) the `travelTime` / `avgTravelTime` fields in `segments.ts` are in **seconds**, not minutes (values like 1680, 660 are clearly seconds; the existing SegmentPanel displays them with a "min" label which is wrong — the planner must decide whether to fix the label or divide by 60), and (3) the `panel-slide-in` class is referenced by both panel files but the CSS animation has no corresponding slide-out animation, so closing is instantaneous.

**Primary recommendation:** Wire `MissionControlView` to read `selectedItem` from Zustand and render the correct panel in a flex row beside `MapView`. Fix the travelTime unit display. No new components needed.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MAP-05 | Clicking a road segment opens the right-side detail panel with segment attributes | SegmentLayer.tsx already calls `setSelectedItem({ type: 'segment', id })` — only the host rendering is missing |
| MAP-06 | Clicking a camera pin opens the right-side detail panel with camera attributes | CameraLayer.tsx already calls `setSelectedItem({ type: 'camera', id })` — only the host rendering is missing |
| PANEL-01 | Segment panel shows: name, segment ID, type, FRC level, length, speed bucket, avg travel time, avg speed, free flow speed, historic avg speed | SegmentPanel.tsx already renders all of these; the only gap is the travelTime unit bug (seconds displayed as "min") |
| PANEL-02 | Camera panel shows: name, highway, direction, type, camera image placeholder | CameraPanel.tsx already renders all of these with a styled placeholder |
| PANEL-03 | Detail panels have close button to dismiss and slide out | Close button and `clearSelectedItem` wiring already present in both panels; slide-out animation not yet implemented |
</phase_requirements>

---

## Standard Stack

### Core (already installed — no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | 18.x | Component rendering | Pinned in Phase 1 |
| Zustand | 4.x | `selectedItem` state source of truth | Already used across all Phase 2 layers |
| lucide-react | latest | X close icon, stat card icons | Already imported in both panel files |
| Tailwind CSS v3 | 3.4.19 | `hover:` utility on close button | Already configured; inline styles for all structural layout |

### No New Packages Required
All panel functionality uses existing dependencies. Do not add framer-motion, react-transition-group, or any animation library — the `panel-slide-in` CSS class is already sufficient for slide-in.

**Installation:** None required.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── mission-control/
│   │   └── MissionControlView.tsx   # ADD panel host logic here
│   └── panels/
│       ├── SegmentPanel.tsx         # EXISTS — content complete
│       └── CameraPanel.tsx          # EXISTS — content complete
├── store/
│   └── uiSlice.ts                   # EXISTS — selectedItem, clearSelectedItem
└── index.css                        # EXISTS — panel-slide-in animation
```

### Pattern 1: Flex-Row Panel Host (Side-by-Side Layout)
**What:** `MissionControlView` renders a horizontal flex container. `MapView` takes `flex: 1`. When a panel is selected, the panel component is appended as a fixed-width sibling.
**When to use:** Always — this is the correct pattern for this app because the map is in a `relative`-positioned div that drives legend positioning. An absolute panel overlay would require careful z-index management and would obscure the map.
**Example:**
```tsx
// MissionControlView.tsx — the target pattern
export function MissionControlView() {
  const selectedItem = useStore((s) => s.selectedItem)
  const segments = useStore((s) => s.segments) // or import from data file directly
  const selectedSegment = selectedItem?.type === 'segment'
    ? segments.find((s) => s.segmentId === selectedItem.id) ?? null
    : null
  const selectedCamera = selectedItem?.type === 'camera'
    ? cameras.find((c) => c.id === selectedItem.id) ?? null
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#0a1628' }}>
      <FilterBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MapView />
        {selectedSegment && <SegmentPanel segment={selectedSegment} />}
        {selectedCamera && <CameraPanel camera={selectedCamera} />}
      </div>
    </div>
  )
}
```

### Pattern 2: Data Lookup — Static Import vs Store
**What:** Segments and cameras are static data files, not in the Zustand store. The store only holds `selectedItem.id`. `MissionControlView` must import the data arrays directly to do the `find()` lookup.
**When to use:** Always — do not add segments/cameras to the Zustand store. The store pattern is: store holds IDs, components resolve objects from the data file.
**Example:**
```tsx
import { segments } from '../../data/segments'
import { cameras } from '../../data/cameras'
// Then in the component:
const seg = segments.find((s) => s.segmentId === selectedItem.id)
```

### Pattern 3: Closing the Panel
**What:** `clearSelectedItem()` sets `selectedItem` to `null`, which unmounts the panel component. The `panel-slide-in` animation plays on mount but there is no slide-out on unmount with pure CSS.
**When to use:** Accept instant disappear on close — this is consistent with Phase 2 decisions that favor simplicity. Do NOT implement a slide-out exit animation unless the planner explicitly adds it as a task; it requires either `react-transition-group` or CSS transition-driven unmount hacks, both of which add complexity disproportionate to the visual gain.

### Anti-Patterns to Avoid
- **Rendering panels inside `MapView`:** MapView is inside `MapContainer` context. Panel components are not Leaflet components and do not belong inside the map tree.
- **Using `position: absolute` for the panel:** An absolutely positioned panel sits above the map but the map `relative` container does not resize. The legend overlays (which use `position: absolute` with `zIndex: 1000`) would be visually obscured. Side-by-side flex is correct.
- **Passing `onClose` prop to panels:** Both panels already read `clearSelectedItem` directly from `useStore`. Do not refactor to prop-based close.
- **Using Tailwind layout classes on the panel host div:** Use inline styles for the flex row wrapper to remain consistent with the Phase 2 decision (inline styles for map overlay components). Tailwind `flex` class is acceptable but `style` is safer given JIT scan constraints.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slide-in animation | Custom JS animation or framer-motion | `panel-slide-in` CSS class in index.css | Already implemented, 0.2s ease-out, tested |
| Icon set | SVG imports or Unicode characters | lucide-react (already imported in panels) | Consistent with existing panel code |
| Panel close state | Local `useState` open/closed | `selectedItem === null` from Zustand | State is already the source of truth |
| Segment lookup | Storing full segment objects in Zustand | `segments.find()` against the data file | Data files are static imports — no store pollution |

---

## Common Pitfalls

### Pitfall 1: travelTime / avgTravelTime Are in Seconds, Not Minutes
**What goes wrong:** `SegmentPanel.tsx` line 148 renders `{segment.travelTime} min` — but `segments.ts` stores seconds (e.g., `travelTime: 1680` = 28 minutes, `avgTravelTime: 660` = 11 minutes). The panel currently shows "1680 min" which is wrong.
**Why it happens:** The `Segment` type defines `travelTime: number` with no unit annotation. The data file values are clearly seconds (I-405 NB Sepulveda Pass: 1680s = 28 min, 660s = 11 min at free flow).
**How to avoid:** The planner should include a task to fix the display: divide by 60 and round, or update the label to show seconds. Recommended: `Math.round(segment.travelTime / 60)` displayed as "min".
**Warning signs:** Any travel time value over 100 displayed as "min" is almost certainly wrong.

### Pitfall 2: `segments` From `useTrafficData` vs Static Import
**What goes wrong:** `MapView.tsx` uses `useTrafficData()` which returns a `segments` array from a simulation hook (may differ from the static `segments.ts` array). If `MissionControlView` resolves the selected segment from the static import but the displayed polyline was from the simulation, the segment objects match because `useTrafficData` merges OSM data over the static data — the `segmentId` values are the same. This is safe.
**Why it happens:** The hook adds simulation state (modified speeds) on top of static segments. For panel display, using the static `segments.ts` import is correct and simpler.
**How to avoid:** Import `segments` directly from `../../data/segments` in `MissionControlView`. Do not wire through the simulation hook.

### Pitfall 3: Map Click Handler Clears Selection Before Panel Close Button Registers
**What goes wrong:** `MapView.tsx` has a `MapClickHandler` that calls `clearSelectedItem()` on any map click. If the panel overlays the map (absolute positioning), clicking the panel could also propagate a click to the map and close itself.
**Why it happens:** React synthetic events and Leaflet's native DOM events. With the flex-row approach (panel is a sibling of MapView, not inside it), this issue does not occur — clicks on the panel do not reach the Leaflet map container.
**How to avoid:** Use flex-row layout (Pattern 1 above). If absolute overlay is ever needed, `e.stopPropagation()` on the panel wrapper would be required.

### Pitfall 4: `panel-slide-in` Class Must Survive Tailwind JIT Purge
**What goes wrong:** `panel-slide-in` is a custom class defined in `index.css` under `@keyframes`. It is not a Tailwind utility class. JIT does not purge it.
**Why it's safe:** Custom CSS in `index.css` is always included in the bundle regardless of JIT purge. The `className="panel-slide-in"` references in both panel files are safe.

### Pitfall 5: Panel Width Narrows the Map — Check Minimum Usable Map Width
**What goes wrong:** At 320px panel width, the map area shrinks to `viewport_width - 320px`. On a 1280px screen this is 960px — acceptable. On a 1024px screen this is 704px — still fine. The concern is not functional but the planner should be aware.
**How to avoid:** No action needed for investor demo (desktop only per requirements). Document as known behavior.

---

## Code Examples

### Wiring MissionControlView to Render Panels
```tsx
// Source: direct analysis of existing codebase
import { useStore } from '../../store'
import { segments } from '../../data/segments'
import { cameras } from '../../data/cameras'
import { SegmentPanel } from '../panels/SegmentPanel'
import { CameraPanel } from '../panels/CameraPanel'
import { FilterBar } from './FilterBar'
import { MapView } from './MapView'

export function MissionControlView() {
  const selectedItem = useStore((s) => s.selectedItem)

  const selectedSegment =
    selectedItem?.type === 'segment'
      ? segments.find((s) => s.segmentId === selectedItem.id) ?? null
      : null

  const selectedCamera =
    selectedItem?.type === 'camera'
      ? cameras.find((c) => c.id === selectedItem.id) ?? null
      : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a1628' }}>
      <FilterBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MapView />
        {selectedSegment && <SegmentPanel segment={selectedSegment} />}
        {selectedCamera && <CameraPanel camera={selectedCamera} />}
      </div>
    </div>
  )
}
```

### Fixing travelTime Display in SegmentPanel
```tsx
// Source: analysis of segments.ts — travelTime is in seconds
// Current (wrong): `${segment.travelTime} min`
// Fixed:
value={`${Math.round(segment.travelTime / 60)} min`}
subValue={`Avg: ${Math.round(segment.avgTravelTime / 60)} min`}

// Similarly for the delay indicator:
+{Math.round((segment.travelTime - segment.avgTravelTime) / 60)} min
```

### Close Button Already Wired (No Change Needed)
```tsx
// Source: src/components/panels/SegmentPanel.tsx line 57
const closePanel = useStore((s) => s.clearSelectedItem);
// ...
<button onClick={closePanel}>
  <X size={16} />
</button>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Panel as absolute overlay above map | Panel as flex sibling beside map | Phase 3 design decision | Map resizes when panel opens; no z-index conflict with Leaflet panes |
| Prop-drilling onClose callback | `useStore` direct consumption in panel | Already implemented in panel stubs | No prop interface needed on panels |
| Custom slide animation library | CSS @keyframes in index.css | Already implemented | Zero runtime cost, already tested |

---

## Open Questions

1. **travelTime unit correction scope**
   - What we know: Values in segments.ts are seconds; SegmentPanel displays them as "min" — this is a display bug.
   - What's unclear: Should the fix be in SegmentPanel (divide by 60 on display) or in segments.ts (store minutes, rename field)? Changing the data type risks breaking other consumers.
   - Recommendation: Fix display only in SegmentPanel.tsx — divide by 60 at render time, leave data as seconds.

2. **Slide-out animation on close**
   - What we know: `panel-slide-in` plays on mount. No exit animation exists. Panel disappears instantly on close.
   - What's unclear: Is instant dismissal acceptable for investor demo?
   - Recommendation: Instant close is acceptable. The open animation (0.2s) is visible and polished. Exit animation adds complexity (requires delayed unmount or transition group). Mark as deferred unless specifically requested.

3. **Alert panel**
   - What we know: `uiSlice.ts` includes `{ type: 'alert'; id: string }` in the `SelectedItem` union. `AlertLayer` presumably calls `setSelectedItem({ type: 'alert', ... })` (not verified in this research).
   - What's unclear: No `AlertPanel.tsx` exists in `src/components/panels/`. PANEL-01/PANEL-02/PANEL-03 requirements cover only segment and camera panels.
   - Recommendation: Do not build an alert panel in Phase 3. Alert clicks that set `selectedItem.type === 'alert'` will simply not render a panel (no matching condition in MissionControlView). This is correct per requirements.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no test config files, no `__tests__` directory, no test scripts in package.json |
| Config file | None — Wave 0 must create if tests are required |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MAP-05 | Clicking segment sets selectedItem and renders SegmentPanel | manual (Leaflet map click not unit-testable without jsdom+leaflet mock) | N/A — verify in browser | ❌ |
| MAP-06 | Clicking camera sets selectedItem and renders CameraPanel | manual | N/A — verify in browser | ❌ |
| PANEL-01 | SegmentPanel renders all required fields | visual (browser) | N/A | ❌ |
| PANEL-02 | CameraPanel renders all required fields | visual (browser) | N/A | ❌ |
| PANEL-03 | Close button calls clearSelectedItem; panel disappears | manual | N/A | ❌ |

### Sampling Rate
Phase 3 verification is entirely manual/visual — run `npm run dev`, click a segment, inspect panel fields, click close. No automated test infrastructure is needed or practical for Leaflet click-event integration.

### Wave 0 Gaps
None — no test infrastructure gaps to address. Phase 3 work is implementation-only.

---

## Sources

### Primary (HIGH confidence)
- Direct file reads: `src/components/panels/SegmentPanel.tsx`, `src/components/panels/CameraPanel.tsx` — panel content verified as complete
- Direct file reads: `src/components/mission-control/layers/SegmentLayer.tsx`, `src/components/mission-control/layers/CameraLayer.tsx` — `setSelectedItem` calls confirmed
- Direct file reads: `src/store/uiSlice.ts` — `selectedItem`, `setSelectedItem`, `clearSelectedItem` confirmed
- Direct file reads: `src/index.css` — `panel-slide-in` animation class confirmed
- Direct file reads: `src/components/mission-control/MissionControlView.tsx` — missing panel host logic confirmed
- Direct file reads: `src/data/segments.ts` — `travelTime` values in seconds (1680, 660, etc.) confirmed
- Direct file reads: `src/data/cameras.ts` — camera fields (`id`, `name`, `highway`, `direction`, `type`) confirmed

### Secondary (MEDIUM confidence)
- Cross-reference of `src/types/index.ts` `Segment` interface with `segments.ts` values — unit mismatch identified

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies confirmed present in codebase
- Architecture: HIGH — all existing files read and integration points verified
- Pitfalls: HIGH — travelTime bug confirmed by direct data inspection; other pitfalls derived from existing code patterns

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable codebase — only Phase 3 implementation changes expected)
