# Pitfalls Research

**Domain:** React + TypeScript + Vite + react-leaflet + Tailwind CSS v3 + Recharts + Zustand investor demo SPA
**Researched:** 2026-03-16
**Confidence:** HIGH (all critical pitfalls verified against official docs, GitHub issues, and community sources)

---

## Critical Pitfalls

### Pitfall 1: Missing Leaflet CSS Import — Grey or Blank Map

**What goes wrong:**
The map container renders as a solid grey rectangle. No tiles load. The map is structurally present in the DOM but visually broken. This is the single most common first-run failure with react-leaflet.

**Why it happens:**
Leaflet's stylesheet (`leaflet/dist/leaflet.css`) is not bundled automatically by react-leaflet — it must be explicitly imported. Without it, tiles have no positioning context, control buttons have no layout, and the map chrome is completely unstyled.

**How to avoid:**
Import the CSS in `main.tsx` (or the top-level entry file) before any component imports:

```typescript
// main.tsx — must be first, before tailwind or app CSS
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App'
```

Import it in `main.tsx` rather than inside a map component — this ensures it is loaded once globally and is not subject to lazy-loading or conditional rendering.

**Warning signs:**
- Solid grey rectangle where the map should be
- Leaflet tile requests succeed in the Network tab (200 status) but tiles are invisible
- Zoom controls present in DOM but unstyled or mispositioned

**Phase to address:** Phase 1 (project scaffold / foundation setup)

---

### Pitfall 2: Vite Breaks Default Leaflet Marker Icons

**What goes wrong:**
Map markers render as broken image icons (empty box with X) or are completely invisible. The browser console shows `GET .../marker-icon.png 404` errors. Works in dev, breaks in production build — or breaks in both.

**Why it happens:**
Leaflet resolves default marker icon URLs at runtime using `L.Icon.Default.prototype._getIconUrl`, which reconstructs paths relative to the Leaflet module itself. When Vite (or Webpack) processes the leaflet package, it hashes and relocates the image assets, making the original relative paths stale. Leaflet's internal path resolver has no knowledge of Vite's asset pipeline.

**How to avoid:**
Delete the broken resolver and replace it with Vite-imported asset URLs. Add this to a `leaflet-setup.ts` file imported once at startup:

```typescript
// src/lib/leaflet-setup.ts
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})
```

For this project specifically, alert pins and camera pins will use `L.divIcon` with custom SVG/HTML, so the default marker icon is less critical — but the fix should still be applied defensively in the scaffold phase to avoid surprises.

**Warning signs:**
- Broken image icons on the map
- 404 errors for `marker-icon.png`, `marker-icon-2x.png`, or `marker-shadow.png` in the network tab
- Icons work during `vite dev` but break after `vite build`

**Phase to address:** Phase 1 (project scaffold / foundation setup)

---

### Pitfall 3: MapContainer Needs Explicit Pixel or Viewport Height

**What goes wrong:**
The map renders as a zero-height div — completely invisible. The page looks blank. No error is thrown. This is completely silent and confusing.

**Why it happens:**
Leaflet's underlying map engine requires the DOM container to have a calculable height before it initializes. A height of `100%` only works if every ancestor in the DOM chain also has an explicit height. In a Vite + React app with Tailwind, body and html elements do not get `height: 100%` by default — they use `height: auto`, which resolves to 0 when the child is absolutely positioned.

**How to avoid:**
Use `h-screen` on the map wrapper, and set the container structure so each parent has a computed height:

```tsx
// Option 1: Direct viewport height via Tailwind
<MapContainer
  center={[34.05, -118.25]}
  zoom={11}
  className="w-full h-full"  // relies on parent having height
  style={{ minHeight: '100vh' }}
>

// Option 2: Parent sets the height
<div className="absolute inset-0">
  <MapContainer center={...} zoom={11} style={{ height: '100%', width: '100%' }}>
```

For the INRIX demo's full-screen Mission Control layout, use `absolute inset-0` on the map container so it fills its positioned parent explicitly.

**Warning signs:**
- Completely blank page where map should be
- MapContainer div exists in DOM with `height: 0`
- No console errors (this is purely a CSS dimension problem)

**Phase to address:** Phase 1 (project scaffold / foundation setup)

---

### Pitfall 4: Tailwind Preflight Breaks Leaflet Control Buttons

**What goes wrong:**
Leaflet's built-in UI controls (zoom buttons `+`/`-`, attribution) lose their borders, padding, and background styles. Buttons appear as flat, unstyled text. The map is functional but the controls look broken.

**Why it happens:**
Tailwind's Preflight (a CSS reset based on `normalize.css`) applies `border-width: 0`, removes button padding/margins, and resets `appearance` for all form elements. This overwrites Leaflet's `.leaflet-control` button styles. Since Leaflet's CSS and Tailwind's Preflight both target the same elements with different specificity, Preflight wins when its `@layer base` rules load after Leaflet CSS.

**How to avoid:**
Import Leaflet CSS before Tailwind's CSS so Tailwind's preflight has higher specificity when a conflict occurs, and override broken styles explicitly:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Re-apply Leaflet control styles that Preflight resets */
.leaflet-control a,
.leaflet-control button {
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
}
```

Alternatively, for a dark theme demo that hides the default Leaflet controls entirely (recommended for investor polish), hide the native controls and implement custom zoom/UI in React:

```tsx
<MapContainer zoomControl={false} attributionControl={false} ...>
```

**Warning signs:**
- Leaflet `+`/`-` zoom buttons visible but borderless and flat
- Attribution text overlapping map content unexpectedly
- Browser dev tools show `border-width: 0` applied to `.leaflet-control` elements

**Phase to address:** Phase 1 (project scaffold / foundation setup)

---

### Pitfall 5: Tailwind and Leaflet Z-Index War

**What goes wrong:**
UI panels (right slide-in panel, filter bar, legend overlays) render behind the map even with high Tailwind z-index classes applied. Or conversely, UI elements unintentionally capture mouse events that should reach the map.

**Why it happens:**
Leaflet internally assigns fixed z-index values to its layers (tile pane: 200, overlay pane: 400, marker pane: 600, popup pane: 700, tooltip pane: 650, controls: 800). Any Tailwind element needs a z-index above these values to appear on top of the map. However, Tailwind v3 only ships `z-0` through `z-50` as named utilities — `z-50` equals `z-index: 50`, which is lower than Leaflet's tile pane at 200. Using `z-50` on a panel puts it behind the map tiles.

**How to avoid:**
Extend Tailwind's z-index scale in `tailwind.config.js` to add values above Leaflet's internal range:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      zIndex: {
        '100': '100',
        '500': '500',
        '900': '900',
        '1000': '1000',
      }
    }
  }
}
```

Then use `z-900` or `z-1000` for UI overlays that must sit above map controls.

For the INRIX demo layout specifically:
- Filter bar: `z-900` (above all Leaflet layers)
- Right slide-in panel: `z-900`
- Legend overlays: `z-900`
- Map container itself: `z-0` (relative positioning, no explicit z-index)

**Warning signs:**
- UI panels render behind the map despite having `z-50` or `z-[50]`
- Clicking on UI elements accidentally triggers map click handlers
- Panel appears only when map tiles haven't loaded yet, then disappears

**Phase to address:** Phase 2 (map layer implementation) — configure z-index system in Phase 1 scaffold

---

### Pitfall 6: MapContainer Props Are Immutable After Mount

**What goes wrong:**
Passing a new `center` prop to `MapContainer` (e.g., from Zustand state) has no effect. The map does not pan or zoom. State updates that are supposed to move the map are silently ignored.

**Why it happens:**
This is an intentional architectural decision in react-leaflet v3+. `MapContainer` is not a controlled component. Its `center`, `zoom`, `bounds`, and similar props are used only for initial mount. After that, Leaflet's native JS API owns the map state. Passing new props triggers no re-render or update to the Leaflet map instance.

**How to avoid:**
Use the `useMap()` hook inside a child component to access the Leaflet map instance, then call native Leaflet methods:

```tsx
// MapController.tsx — child of MapContainer, reads from Zustand
function MapController() {
  const map = useMap()
  const selectedSegment = useMapStore(s => s.selectedSegment)

  useEffect(() => {
    if (selectedSegment) {
      map.flyTo(selectedSegment.center, 14, { duration: 0.8 })
    }
  }, [selectedSegment, map])

  return null
}

// In MapContainer:
<MapContainer center={[34.05, -118.25]} zoom={11}>
  <MapController />
  ...
</MapContainer>
```

**Warning signs:**
- Map does not respond to state changes
- No errors — it silently ignores prop updates
- Developers spend time debugging Zustand when the issue is react-leaflet's API contract

**Phase to address:** Phase 2 (map layer implementation)

---

### Pitfall 7: DivIcon HTML Cannot Use Tailwind Classes Directly

**What goes wrong:**
Custom markers created with `L.divIcon({ html: '<div class="bg-red-500 rounded-full">...' })` render without any Tailwind styles. The div exists but is unstyled.

**Why it happens:**
`L.divIcon` injects HTML strings into the DOM outside of React's render tree. Tailwind's JIT compiler scans source files for class names at build time and generates only the CSS for classes it finds. If a class name exists only inside a JavaScript string (not a JSX attribute), the JIT scanner misses it and omits its CSS.

**How to avoid:**
Two approaches:

**Option A — Inline styles (recommended for this demo):** Use inline CSS directly in the `html` string. Avoids scanner issues entirely and is perfectly readable for a bounded demo:

```typescript
const alertIcon = L.divIcon({
  html: `<div style="
    width: 12px; height: 12px;
    background: #e53935;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  "></div>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})
```

**Option B — Safelist:** Add dynamically constructed class names to Tailwind's safelist in `tailwind.config.js` so the scanner always includes them:

```javascript
safelist: ['bg-red-500', 'bg-yellow-400', 'bg-green-500', 'rounded-full']
```

For this project, inline styles in icon factory functions is the cleaner approach.

**Warning signs:**
- DivIcon markers render with correct shape/size but no color or border-radius
- Inspecting the element shows the class is present but no CSS rule exists for it
- Works in dev if Tailwind JIT happens to scan the file before tree-shaking (inconsistent behavior)

**Phase to address:** Phase 2 (map layer implementation)

---

### Pitfall 8: Polyline Z-Index Cannot Be Controlled with Standard `zIndex` Props

**What goes wrong:**
Road segment Polylines render in an unpredictable order. High-traffic red segments render behind low-traffic green ones. There is no `zIndex` prop on `<Polyline>` that has any effect. `bringToFront()` must be called imperatively and is hard to control declaratively from React.

**Why it happens:**
SVG path elements in Leaflet's overlay pane do not support `z-index` CSS property (SVG uses `paint-order`, not stacking contexts). Leaflet renders paths in DOM insertion order. The only reliable way to control segment stacking is through Leaflet's custom panes API, which assigns separate DOM layers with distinct z-index values.

**How to avoid:**
Use the react-leaflet `<Pane>` component to assign congestion levels to separate rendering layers:

```tsx
// Create named panes with increasing z-index for congestion levels
<Pane name="congestion-green" style={{ zIndex: 401 }} />
<Pane name="congestion-yellow" style={{ zIndex: 402 }} />
<Pane name="congestion-orange" style={{ zIndex: 403 }} />
<Pane name="congestion-red" style={{ zIndex: 404 }} />

// Assign each polyline to its pane
<Polyline
  positions={segment.coords}
  pathOptions={{ color: '#f44336', weight: 4 }}
  pane="congestion-red"
/>
```

This guarantees red segments always render on top of green regardless of insertion order.

**Warning signs:**
- Congestion colors appear in wrong visual stacking order
- Trying to add `zIndex` to `pathOptions` has no effect
- `bringToFront()` called in `eventHandlers.add` appears to work on add but reverts on re-render

**Phase to address:** Phase 2 (map layer implementation)

---

### Pitfall 9: Recharts ResponsiveContainer Collapses in Flex Parents

**What goes wrong:**
A `<ResponsiveContainer width="100%" height="100%">` inside a flex or grid container renders as 0px height. The chart is invisible. The container div is present in the DOM but has no dimensions.

**Why it happens:**
`ResponsiveContainer` uses a ResizeObserver to measure its parent. When the parent is a flex item with no explicit height, the parent's height is `auto` and resolves to 0 before any content renders. The ResponsiveContainer measures 0 and renders nothing. This is a known, long-standing issue (GitHub issue #1545, open since 2019).

**How to avoid:**
Always wrap `ResponsiveContainer` in a div with an explicit height. Never rely on `height="100%"` alone:

```tsx
// Wrong — collapses in flex container
<div className="flex flex-col flex-1">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} />
  </ResponsiveContainer>
</div>

// Correct — explicit wrapper height
<div className="flex flex-col flex-1">
  <div style={{ width: '100%', height: 280 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} />
    </ResponsiveContainer>
  </div>
</div>
```

For the Signal Analytics panel's control delay chart, use a fixed pixel height (e.g., `height: 280`) on the wrapper div.

**Warning signs:**
- Chart area is blank with no error
- Dev tools show `ResponsiveContainer` div with `height: 0`
- Chart appears if you hardcode `height={280}` directly on `BarChart`

**Phase to address:** Phase 3 (Signal Analytics view)

---

### Pitfall 10: CartoDB Tile URL Missing Retina `{r}` Placeholder

**What goes wrong:**
On high-DPI (retina) displays, map tiles appear slightly blurry or lower resolution. Not a functional break, but visually degrades the investor demo quality on modern MacBook screens.

**Why it happens:**
CartoDB Dark Matter serves `@2x` retina tiles when the URL includes the `{r}` placeholder. Without it, Leaflet requests standard resolution tiles regardless of the device pixel ratio.

**How to avoid:**
Use the correct URL format with `{r}` and set `detectRetina`:

```tsx
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  subdomains="abcd"
  maxZoom={20}
  detectRetina={true}
/>
```

The `{r}` placeholder resolves to `@2x` on retina displays and empty string on standard displays.

**Warning signs:**
- Map tiles look slightly soft/blurry on a MacBook Pro or 4K display
- Normal on 1080p monitors (so may not be caught until demo review)

**Phase to address:** Phase 1 (project scaffold / foundation setup)

---

### Pitfall 11: Zustand useShallow Required for Multi-Property Selectors

**What goes wrong:**
Components that select multiple properties from the store (e.g., `const { selectedSegment, panelOpen } = useStore(s => ({ selectedSegment: s.selectedSegment, panelOpen: s.panelOpen }))`) re-render on every single state update — even unrelated ones. The entire component tree flickers on any map interaction.

**Why it happens:**
By default, Zustand uses strict reference equality (`===`) to determine if the selected value has changed. When a selector returns a new object literal `{}` on every call (as multi-property destructuring does), it is always a new reference, so Zustand concludes the value changed and triggers a re-render.

**How to avoid:**
Use Zustand's `useShallow` hook for any selector that returns an object or array:

```typescript
import { useShallow } from 'zustand/react/shallow'

// Wrong — rerenders on every state change
const { selectedSegment, panelOpen } = useMapStore(s => ({
  selectedSegment: s.selectedSegment,
  panelOpen: s.panelOpen,
}))

// Correct — only rerenders when selectedSegment or panelOpen actually change
const { selectedSegment, panelOpen } = useMapStore(
  useShallow(s => ({
    selectedSegment: s.selectedSegment,
    panelOpen: s.panelOpen,
  }))
)
```

**Warning signs:**
- React DevTools profiler shows components re-rendering on every mouse move over the map
- Smooth interactions turn choppy when more than one component subscribes to the store
- All chart components re-render when a map segment is clicked

**Phase to address:** Phase 1 (project scaffold / foundation setup), enforced in Phase 2+

---

### Pitfall 12: TypeScript Strict Mode — Leaflet Event Handler Types

**What goes wrong:**
TypeScript reports type errors on Leaflet event handlers inside react-leaflet's `eventHandlers` prop. Common error: `Argument of type '(e: LeafletMouseEvent) => void' is not assignable to parameter of type 'LeafletEventHandlerFnMap'`.

**Why it happens:**
react-leaflet v4's `eventHandlers` prop uses Leaflet's own type definitions (`LeafletEventHandlerFnMap`). The key names must exactly match Leaflet's event name strings (`click`, `mouseover`, `mouseout`) and the handler function type must be `LeafletMouseEventHandlerFn` from the `leaflet` package, not a generic `(e: MouseEvent) => void`.

**How to avoid:**
Import event types directly from `leaflet` (not from `react-leaflet`):

```typescript
import type { LeafletMouseEvent } from 'leaflet'

// Correct event handler typing
<Polyline
  eventHandlers={{
    click: (e: LeafletMouseEvent) => {
      e.originalEvent.stopPropagation()
      selectSegment(segment.id)
    },
    mouseover: (e: LeafletMouseEvent) => {
      e.target.setStyle({ weight: 6 })
    },
  }}
/>
```

**Warning signs:**
- `tsc --noEmit` fails on event handler props despite the code working at runtime
- TypeScript errors in `eventHandlers` complaining about function signature mismatches
- Errors disappear when strict mode is disabled (signal that types need explicit annotation)

**Phase to address:** Phase 2 (map layer implementation)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline styles on DivIcon HTML instead of Tailwind classes | Avoids JIT scanner miss, no safelist needed | Mixed style approach (some inline, some Tailwind) | Always acceptable for icon factories in this project |
| Single monolithic Zustand store | Less file structure overhead upfront | Re-renders propagate broadly without careful selectors | Acceptable for a demo with ~6-8 state slices |
| Hardcoded pixel heights on Recharts wrappers | Prevents ResponsiveContainer collapse | Charts don't adapt to window resize | Acceptable — demo runs on fixed desktop viewport |
| Hiding Leaflet's default controls (`zoomControl={false}`) | Eliminates Tailwind/Leaflet CSS conflicts on controls | No built-in zoom buttons — must implement custom controls | Acceptable for investor demo polish |
| Mock data in flat TypeScript arrays | Simple, no fetch/loading state needed | No separation of data layer from UI | Always acceptable — demo requirement is mock-only |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| CartoDB TileLayer | Using `http://` instead of `https://` | Always `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` |
| CartoDB TileLayer | Omitting `subdomains="abcd"` | Explicitly set `subdomains="abcd"` — without it, only subdomain `a` is used, reducing tile parallelism |
| Leaflet + Vite | Importing Leaflet before its CSS | `import 'leaflet/dist/leaflet.css'` must come before any Leaflet component code in the entry file |
| react-leaflet + Zustand | Calling Zustand store setters inside `MapContainer` children that aren't components | Map event handlers in `useMapEvents` must be inside a React component that is a child of `MapContainer` |
| Recharts + Tailwind dark theme | Default tooltip background is white | Pass `contentStyle={{ background: '#0a1628', border: '1px solid #1a6eb5' }}` to `<Tooltip>` |
| lucide-react + Tailwind | Default icon stroke-width too heavy for INRIX aesthetic | Always pass `strokeWidth={1.5}` and explicit `size={16}` or `size={20}` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-creating `L.divIcon` instances on every render | Markers flicker on any state change; all markers remount | Create icon factories outside component render functions, or memoize with `useMemo` | At 20+ markers with frequent state updates |
| Rendering all Polyline segments unconditionally | Frame drops when toggling Traffic Flow on/off | Gate on `showTrafficFlow` state; use `null` not empty fragment | At 25+ polylines — likely noticeable |
| Zustand selectors returning new objects without `useShallow` | All subscribed components re-render on unrelated state changes | Use `useShallow` for all multi-property selectors | Immediately visible with 3+ components subscribed |
| CartoDB tiles at `maxZoom` beyond 19 | Blurry upscaled tiles at deep zoom | Set `maxZoom={19}` — CartoDB only has native tiles to zoom 19 | At zoom 20+ |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Map click triggers segment selection AND closes panel simultaneously | Panel flickers open and immediately closes | Use `e.originalEvent.stopPropagation()` on segment click; separate map click (deselect) from segment click (select) |
| Right panel slides in over map without pointer-events adjustment | Panel covers map area; map beneath panel still receives mouse events | Add `pointer-events-none` to the map wrapper when panel is open, or ensure panel sits in a separate stacking context |
| Recharts bar chart tooltip clips outside the chart bounds | Tooltip partially hidden on leftmost/rightmost bars | Set `<Tooltip position={{ x: ..., y: ... }}` or use `allowEscapeViewBox={{ x: true, y: true }}` |
| Leaflet attribution control over dark tiles uses white text on white | Attribution is invisible on dark tiles | If keeping attribution, override to use a semi-transparent dark background |
| Alert/camera pins stacked at same coordinate | User cannot select individual pins | Use `L.markerCluster` or offset overlapping pins at the same lat/lng |

---

## "Looks Done But Isn't" Checklist

- [ ] **Leaflet CSS loaded:** Map shows actual tiles, not a grey box — verify by hard-refreshing with cache cleared
- [ ] **Marker icons working:** Place a `<Marker>` at LA center, confirm default icon appears (not a broken image) even if custom DivIcons are used elsewhere
- [ ] **MapContainer has a computed height:** Open React DevTools, inspect the `div.leaflet-container` element — confirm `height` is a non-zero pixel value
- [ ] **Tailwind z-index scale extended:** Verify filter bar and right panel render above the map by checking their computed z-index is above 800
- [ ] **Polyline panes declared before segments render:** Custom pane components must appear inside MapContainer before any Polyline using them
- [ ] **CartoDB `{r}` in tile URL:** Inspect a tile network request on a retina screen — URL should contain `@2x` for retina devices
- [ ] **ResponsiveContainer has a pixel-height wrapper:** Open Signal Analytics, confirm the bar chart renders with data visible (not zero-height)
- [ ] **Recharts Tooltip styled for dark theme:** Hover over a chart bar — tooltip should match the `#0a1628` background, not white
- [ ] **Zustand selectors use useShallow for objects:** Open React DevTools Profiler, click a map segment — only the right panel and affected map overlay should re-render, not the entire app
- [ ] **TypeScript strict build passes:** Run `npx tsc --noEmit` — zero errors before any phase is considered complete

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Grey map (missing CSS) | LOW | Add `import 'leaflet/dist/leaflet.css'` to `main.tsx`; hard refresh |
| Broken marker icons | LOW | Add `leaflet-setup.ts` with icon override; import in `main.tsx` |
| Zero-height MapContainer | LOW | Add `style={{ height: '100%', width: '100%' }}` plus ensure parent has computed height |
| Tailwind z-index war | LOW | Extend `tailwind.config.js` zIndex scale; apply `z-900` to panels |
| Polylines in wrong order | MEDIUM | Refactor segment renderer to use named `<Pane>` components; requires restructuring JSX |
| Recharts chart invisible | LOW | Wrap in explicit pixel-height div |
| useShallow missing — excessive re-renders | MEDIUM | Audit all multi-property selectors and wrap in `useShallow`; scattered through codebase |
| DivIcon Tailwind classes not applied | LOW | Convert to inline styles in icon factory functions |
| MapContainer not responding to prop changes | MEDIUM | Add `MapController` child component using `useMap()`; requires understanding react-leaflet API |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Missing Leaflet CSS | Phase 1: Project Scaffold | Hard-refresh shows tile-rendered map, not grey box |
| Broken marker icons (Vite) | Phase 1: Project Scaffold | Place test `<Marker>` at LA center; icon renders correctly |
| MapContainer zero height | Phase 1: Project Scaffold | DevTools confirms `leaflet-container` has non-zero pixel height |
| Tailwind Preflight breaks Leaflet controls | Phase 1: Project Scaffold | Hide native controls OR verify `.leaflet-control` buttons have borders |
| Tailwind/Leaflet z-index war | Phase 1: Project Scaffold (config), Phase 2: validation | UI panels render above map tiles in stacking order |
| MapContainer immutable props | Phase 2: Map Layer Implementation | Zustand segment selection pans map correctly via `useMap()` |
| DivIcon + Tailwind JIT miss | Phase 2: Map Layer Implementation | All alert/camera pin styles render correctly |
| Polyline rendering order (z-index) | Phase 2: Map Layer Implementation | Red congestion segments render on top of green in overlapping areas |
| CartoDB tile URL format / retina | Phase 1: Project Scaffold | Network tab shows `@2x` tiles on retina display |
| ResponsiveContainer flex collapse | Phase 3: Signal Analytics | Bar chart renders with visible data, not zero-height |
| Recharts dark theme tooltip | Phase 3: Signal Analytics | Hovering bars shows dark-styled tooltip matching `#0a1628` |
| Zustand useShallow missing | Phase 1: Store Setup | React Profiler shows only relevant components re-render on state change |
| TypeScript strict event types | Phase 2: Map Layer Implementation | `tsc --noEmit` passes with zero errors |

---

## Sources

- [react-leaflet GitHub Issue #453: Marker not appearing](https://github.com/PaulLeCam/react-leaflet/issues/453)
- [Leaflet GitHub Issue #5607: Default marker icon URL incorrect with bundlers](https://github.com/Leaflet/Leaflet/issues/5607)
- [react-leaflet GitHub Issue #902: Map displays mostly gray](https://github.com/PaulLeCam/react-leaflet/issues/902)
- [Leaflet GitHub Issue #1266: Map div does not support 100% height](https://github.com/Leaflet/Leaflet/issues/1266)
- [react-leaflet GitHub Issue #271: Dynamic layer ordering not respected without key changes](https://github.com/PaulLeCam/react-leaflet/issues/271)
- [react-leaflet Panes API documentation](https://react-leaflet.js.org/docs/example-panes/)
- [react-leaflet MapContainer API — immutable props documentation](https://react-leaflet.js.org/docs/api-map/)
- [Recharts GitHub Issue #1545: ResponsiveContainer not filling height](https://github.com/recharts/recharts/issues/1545)
- [Recharts GitHub Issue #2251: ResponsiveContainer behaves differently in grid/flexbox](https://github.com/recharts/recharts/issues/2251)
- [Tailwind CSS v3 z-index documentation](https://v3.tailwindcss.com/docs/z-index)
- [Tailwind CSS Preflight documentation](https://v2.tailwindcss.com/docs/preflight)
- [Tailwind GitHub Issue #6602: Preflight button reset inconsistency](https://github.com/tailwindlabs/tailwindcss/issues/6602)
- [CartoDB basemap styles GitHub](https://github.com/CartoDB/basemap-styles)
- [Leaflet providers demo — CartoDB URL formats](https://leaflet-extras.github.io/leaflet-providers/preview/)
- [Zustand + TypeScript guide 2024](https://tillitsdone.com/blogs/zustand-typescript-guide-2024/)
- [Zustand GitHub Discussion #1279: React 18 strict mode behavior](https://github.com/pmndrs/zustand/discussions/1279)
- [Medium: Fixing React-Leaflet Marker Files Not Found (2024)](https://medium.com/@rivaifnasution/fixing-react-leaflet-marker-files-not-found-error-in-your-project-dc968878a4d5)

---
*Pitfalls research for: React + TypeScript + Vite + react-leaflet + Tailwind CSS v3 + Recharts + Zustand SPA*
*Researched: 2026-03-16*
