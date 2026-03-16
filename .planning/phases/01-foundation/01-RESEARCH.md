# Phase 1: Foundation - Research

**Researched:** 2026-03-16
**Domain:** Vite + React + TypeScript SPA scaffold — dependency pinning, Tailwind v3 design tokens, INRIX IQ app shell, Zustand slice store, mock data files
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Package versions are PINNED** — do not install latest: react-leaflet@4.2.1, tailwindcss@3.4.19, recharts@2.15.4, vite@5.4.21
- **Leaflet CSS must be FIRST import** in main.tsx before any other import
- **Tailwind z-index extended to 1000+** in tailwind.config.js
- **Zustand single store with three slices**: mapSlice, filterSlice, uiSlice — composed in store/index.ts
- **Mock data files must be COMPLETE** (not stubs) — 25+ segments, 20+ alerts, 15+ cameras, signalData with exact Austin TX values from CONTEXT.md specifics
- **Nav bar**: 3 right icons only — HelpCircle, RefreshCw, LayoutGrid (from lucide-react) — no user avatar, no bell
- **Module name click toggles** between Mission Control and Signal Analytics views (not a sidebar)
- **No map rendering** in Phase 1 — map area is a dark navy placeholder

### Claude's Discretion

None listed — all Phase 1 decisions are locked.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Project scaffolded with Vite + React 18 + TypeScript, all specified dependencies installed (react-leaflet, Tailwind CSS v3, Recharts, Zustand, lucide-react) | Dependency pinning strategy, version compatibility matrix, npm install commands |
| FOUND-02 | Tailwind configured with INRIX design tokens (exact hex colors for background, nav, accent, congestion, alerts) | Tailwind v3 tailwind.config.js extend.colors pattern, verified token values from CONTEXT.md |
| FOUND-03 | App shell renders with dark navy layout (#0a1628 background) and top nav bar (#0d1f3c) with "INRIX IQ" logo and right-side icons | NavBar component structure, logo HTML pattern, lucide-react icon names |
| FOUND-04 | Navigation between Mission Control and Signal Analytics views via nav bar module name area | Zustand uiSlice activeView, App.tsx conditional render, click handler on module name |
</phase_requirements>

---

## Summary

The project already has files on disk, but the current state has critical incompatibilities with the locked CONTEXT.md requirements. The installed packages use the wrong versions: React 19 (not 18), react-leaflet v5 (not 4.2.1), recharts v3 (not 2.15.4), tailwindcss v4 (not 3.4.19), vite v8 (not 5.4.21), and @vitejs/plugin-react v6 (not 4.7.0). The Tailwind setup is v4-style (`@import "tailwindcss"` + `@tailwindcss/vite` plugin) with no `tailwind.config.js`, which makes it impossible to define custom color design tokens via `extend.colors`. The store is a flat monolithic `useAppStore.ts` instead of the required separate slice files. The nav bar layout uses a left Sidebar (not the specified top-nav-only pattern). No `signalData.ts` file exists.

Phase 1 work therefore involves: (1) downgrading all packages to the pinned versions and removing incompatible packages, (2) switching from Tailwind v4 to Tailwind v3 PostCSS setup, (3) rebuilding main.tsx with Leaflet CSS as first import, (4) replacing the flat store with the slice pattern, (5) rebuilding the nav bar to match CONTEXT.md exactly, (6) migrating/expanding mock data files to the correct TypeScript interfaces and data counts, and (7) adding signalData.ts with exact Austin TX values.

The existing `src/data/mockSegments.ts` (22 segments), `mockAlerts.ts`, and `mockCameras.ts` are close to the required format but use `{ lat, lng }` object notation instead of `[number, number]` tuples, and the Segment interface lacks required fields (`frc`, `lengthMiles`, `speedBucket`, `type`). These files should be migrated rather than discarded — the coordinate data is usable.

**Primary recommendation:** Reinstall all dependencies with pinned versions first, then rebuild the scaffold/config files, then migrate/expand mock data, then build the nav bar and app shell.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 18.3.1 | UI framework | react-leaflet@4.x requires `^18.0.0`; v19 incompatible |
| react-dom | 18.3.1 | DOM renderer | Must match react version |
| typescript | ~5.9.3 | Type safety | Already installed at correct version |
| vite | 5.4.21 | Build tooling | Vite 8 breaks @vitejs/plugin-react v4; pin to 5.x |
| @vitejs/plugin-react | 4.7.0 | React Fast Refresh | v6 requires Vite 8; pin to v4 for Vite 5 |
| tailwindcss | 3.4.19 | Utility CSS | v4 drops tailwind.config.js — no extend.colors possible |
| postcss | 8.5.8 | CSS pipeline | Required by tailwindcss v3 |
| autoprefixer | 10.4.27 | Vendor prefixes | Required by tailwindcss v3 |
| leaflet | 1.9.4 | Map engine | Already correct; react-leaflet@4 peer dep is `^1.9.0` |
| react-leaflet | 4.2.1 | Leaflet React wrapper | v5 requires React 19; pin to v4 |
| recharts | 2.15.4 | SVG charts | v3 rewrites generics API; v2 is stable for this stack |
| zustand | 5.0.12 | State management | Already correct |
| lucide-react | 0.577.0 | Icon components | Already correct |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/leaflet | 1.9.21 | Leaflet TS types | Required — Leaflet ships no types |
| @types/react | 18.3.28 | React TS types | Must be 18.x series to match react@18 |
| @types/react-dom | 18.3.1 | ReactDOM TS types | Must match @types/react version series |

### Packages to REMOVE

| Package | Reason |
|---------|--------|
| `@tailwindcss/vite` | Tailwind v4 plugin — incompatible with v3 PostCSS approach |
| `react@19.x` / `react-dom@19.x` | Downgrade to 18.3.1 |
| `react-is@19.x` | Downgrade to 18.x |
| `react-leaflet@5.x` | Downgrade to 4.2.1 |
| `recharts@3.x` | Downgrade to 2.15.4 |
| `@vitejs/plugin-react@6.x` | Downgrade to 4.7.0 |
| `@types/react@19.x` | Downgrade to 18.3.28 |
| `@types/react-dom@19.x` | Downgrade to 18.3.1 |
| `vite@8.x` | Downgrade to 5.4.21 |

**Installation commands (replace entire package setup):**

```bash
# From project root — clean reinstall with pinned versions
npm install react@18.3.1 react-dom@18.3.1
npm install leaflet@1.9.4 react-leaflet@4.2.1
npm install recharts@2.15.4 zustand@5.0.12 lucide-react@0.577.0
npm install -D tailwindcss@3.4.19 postcss@8.5.8 autoprefixer@10.4.27
npm install -D vite@5.4.21 @vitejs/plugin-react@4.7.0
npm install -D @types/leaflet@1.9.21 @types/react@18.3.28 @types/react-dom@18.3.1
# Remove incompatible packages
npm uninstall @tailwindcss/vite react-is
# Initialize Tailwind v3 (creates tailwind.config.js + postcss.config.js)
npx tailwindcss@3.4.19 init -p
```

---

## Critical Pre-Existing State

The project has files that must be understood before planning tasks:

### What Exists and Can Be Reused (with migration)

| File | Status | Action Needed |
|------|--------|---------------|
| `src/types/index.ts` | Exists, partial | Replace — add `frc`, `lengthMiles`, `speedBucket`, `type`, change coords to `[number, number][]` |
| `src/data/mockSegments.ts` | 22 items, wrong coord format | Migrate + add 3+ more segments |
| `src/data/mockAlerts.ts` | Needs count check | Verify 20+ exist; migrate coord format |
| `src/data/mockCameras.ts` | Needs count check | Verify 15+ exist; migrate coord format |
| `src/index.css` | Tailwind v4 style | Replace with v3 directives + keep Leaflet overrides |
| `src/store/useAppStore.ts` | Flat monolithic store | Replace with slice pattern |
| `src/components/layout/Header.tsx` | Wrong layout (no sidebar toggle, wrong icons) | Rebuild |
| `src/components/layout/Sidebar.tsx` | Exists but CONTEXT says no sidebar | Determine disposition |
| `src/App.tsx` | Has Sidebar in layout, extra modules | Rebuild |

### What Must Be Created Fresh

| File | Reason |
|------|--------|
| `tailwind.config.js` | Does not exist — Tailwind v4 setup had no config file |
| `postcss.config.js` | Does not exist |
| `src/store/index.ts` | New composed store entry point |
| `src/store/mapSlice.ts` | New |
| `src/store/filterSlice.ts` | New |
| `src/store/uiSlice.ts` | New |
| `src/data/signalData.ts` | Missing entirely |

### Sidebar Question

CONTEXT.md specifies no Sidebar — navigation is done via clicking the module name in the top nav bar only, toggling between Mission Control and Signal Analytics. The existing `Sidebar.tsx` lists 5 modules (mission-control, signal-analytics, trip-analyzer, roadway-analytics, curb-analytics). Phase 1 replaces this with module-name-click toggle. The Sidebar component should be removed or left unused.

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 target state)

```
src/
├── components/
│   ├── layout/
│   │   └── NavBar.tsx               # Top nav (replaces Header.tsx + Sidebar.tsx)
│   ├── mission-control/
│   │   └── MissionControlView.tsx   # Placeholder: dark navy + filter bar stub
│   └── signal-analytics/
│       └── SignalAnalyticsView.tsx  # Placeholder: light background
├── store/
│   ├── index.ts                     # Composed store
│   ├── mapSlice.ts                  # center, zoom
│   ├── filterSlice.ts               # showTraffic, showAlerts, showCameras
│   └── uiSlice.ts                   # activeView, selectedItem
├── data/
│   ├── segments.ts                  # 25+ segments (migrate from mockSegments.ts)
│   ├── alerts.ts                    # 20+ alerts (migrate from mockAlerts.ts)
│   ├── cameras.ts                   # 15+ cameras (migrate from mockCameras.ts)
│   └── signalData.ts                # Austin TX values (create fresh)
├── types/
│   └── index.ts                     # All interfaces (replace existing)
├── App.tsx                          # Reads activeView, renders view
├── main.tsx                         # Leaflet CSS FIRST, then index.css
└── index.css                        # Tailwind v3 directives + Leaflet overrides
```

### Pattern 1: Zustand Slice Composition

**What:** Three separate slice factories composed into one store in `store/index.ts`.
**When to use:** Always — required by CONTEXT.md.

```typescript
// store/index.ts
// Source: ARCHITECTURE.md + Zustand v5 docs
import { create } from 'zustand'
import { createMapSlice, MapSlice } from './mapSlice'
import { createFilterSlice, FilterSlice } from './filterSlice'
import { createUISlice, UISlice } from './uiSlice'

export type StoreState = MapSlice & FilterSlice & UISlice

export const useStore = create<StoreState>()((...a) => ({
  ...createMapSlice(...a),
  ...createFilterSlice(...a),
  ...createUISlice(...a),
}))
```

```typescript
// store/uiSlice.ts
export type ActiveView = 'mission-control' | 'signal-analytics'
export type SelectedItem =
  | { type: 'segment'; id: string }
  | { type: 'camera'; id: string }
  | null

export interface UISlice {
  activeView: ActiveView
  selectedItem: SelectedItem
  setActiveView: (view: ActiveView) => void
  setSelectedItem: (item: SelectedItem) => void
  clearSelectedItem: () => void
}

export const createUISlice = (set: SetState<StoreState>): UISlice => ({
  activeView: 'mission-control',
  selectedItem: null,
  setActiveView: (view) => set({ activeView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
})
```

### Pattern 2: NavBar Module Name Toggle

**What:** Clicking the module name text cycles between Mission Control and Signal Analytics.
**When to use:** Phase 1 nav — this is the only view switching mechanism.

```tsx
// components/layout/NavBar.tsx
// Source: CONTEXT.md decisions
import { HelpCircle, RefreshCw, LayoutGrid } from 'lucide-react'
import { useStore } from '../../store'

const VIEW_LABELS = {
  'mission-control': 'Mission Control',
  'signal-analytics': 'Signal Analytics',
} as const

export function NavBar() {
  const activeView = useStore((s) => s.activeView)
  const setActiveView = useStore((s) => s.setActiveView)

  const toggleView = () => {
    setActiveView(
      activeView === 'mission-control' ? 'signal-analytics' : 'mission-control'
    )
  }

  return (
    <nav style={{ background: '#0d1f3c', height: 48, minHeight: 48 }}
      className="flex items-center px-3 border-b border-[#1e3a5f] z-[900]">
      {/* Collapse chevron */}
      <button className="text-[#4a6080] hover:text-white p-1 mr-2">
        <ChevronRight size={14} />
      </button>
      {/* INRIX IQ Logo */}
      <div className="flex items-center select-none mr-3">
        <span className="text-white font-bold text-sm tracking-wide">INRIX</span>
        <span className="border border-white text-white text-[10px] px-0.5 ml-0.5 leading-tight">IQ</span>
      </div>
      {/* Module name — clickable toggle */}
      <button
        onClick={toggleView}
        className="text-white text-sm font-normal hover:text-[#8ca0bc] transition-colors"
      >
        {VIEW_LABELS[activeView]}
      </button>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Right icons — exactly 3 */}
      <div className="flex items-center gap-2">
        <button className="text-[#4a6080] hover:text-white p-1"><HelpCircle size={16} strokeWidth={1.5} /></button>
        <button className="text-[#4a6080] hover:text-white p-1"><RefreshCw size={16} strokeWidth={1.5} /></button>
        <button className="text-[#4a6080] hover:text-white p-1"><LayoutGrid size={16} strokeWidth={1.5} /></button>
      </div>
    </nav>
  )
}
```

### Pattern 3: main.tsx Import Order

**What:** Leaflet CSS must be the absolute first import.
**When to use:** Always in this project — any deviation breaks the map in Phase 2.

```typescript
// src/main.tsx — EXACT import order required
import 'leaflet/dist/leaflet.css'    // MUST be first
import './index.css'                 // Tailwind v3 directives second
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Pattern 4: Tailwind v3 Config with Design Tokens

**What:** `tailwind.config.js` with `extend.colors` for INRIX design tokens and `extend.zIndex` for Leaflet layering.
**When to use:** Required — this is what FOUND-02 tests.

```javascript
// tailwind.config.js — Source: STACK.md + PITFALLS.md
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy-deep':         '#0a1628',  // body background
        'navy-nav':          '#0d1f3c',  // nav + filter bar
        'accent-blue':       '#1a6eb5',  // active state
        'toggle-blue':       '#2196f3',  // toggle ON
        'alert-red':         '#e53935',  // crash / road_closure
        'alert-orange':      '#ff9800',  // construction / hazard
        'alert-yellow':      '#ffeb3b',  // congestion / dangerous_slowdown
        'alert-blue':        '#2196f3',  // events
        'text-muted':        '#8ca0bc',  // secondary text
        'congestion-green':  '#4caf50',  // 0-25%
        'congestion-yellow': '#ffeb3b',  // 26-50%
        'congestion-orange': '#ff9800',  // 51-75%
        'congestion-red':    '#f44336',  // 76-100%
      },
      zIndex: {
        '100':  '100',
        '500':  '500',
        '900':  '900',
        '1000': '1000',
      },
    },
  },
  plugins: [],
}
```

### Pattern 5: Tailwind v3 index.css

```css
/* src/index.css — v3 directives (not @import "tailwindcss") */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep existing Leaflet overrides from current index.css */
```

### Pattern 6: vite.config.ts for Tailwind v3

```typescript
// vite.config.ts — no @tailwindcss/vite plugin with v3
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Tailwind v3 processes via PostCSS — no Vite plugin needed
})
```

### Pattern 7: TypeScript Interfaces (canonical)

The existing `src/types/index.ts` uses `LatLng` objects. The architecture requires `[number, number]` tuples for react-leaflet compatibility. The replacement interface:

```typescript
// src/types/index.ts — replace entirely
export type ActiveView = 'mission-control' | 'signal-analytics'

export interface Segment {
  segmentId: string
  name: string
  positions: [number, number][]  // [lat, lng] tuples for Polyline
  currentSpeed: number           // mph
  freeFlowSpeed: number          // mph
  historicAvgSpeed: number       // mph
  congestionLevel: number        // 0-100
  travelTime: number             // seconds (not minutes)
  avgTravelTime: number          // seconds (not minutes)
  type: string                   // 'Highway' | 'Arterial'
  frc: number                    // Functional Road Class 0-7
  lengthMiles: number
  speedBucket: number            // 1-5 numeric (display as number per CONTEXT.md)
  highway: string
  direction: 'NB' | 'SB' | 'EB' | 'WB'
}

export type AlertType =
  | 'crash' | 'construction' | 'dangerous_slowdown'
  | 'road_closure' | 'event' | 'hazard' | 'congestion'

export interface Alert {
  id: string
  type: AlertType
  position: [number, number]     // [lat, lng] tuple
  description: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  roadName: string
}

export interface Camera {
  id: string
  name: string                   // e.g. "CA-91 / East of Cherry Ave (E)"
  position: [number, number]     // [lat, lng] tuple
  highway: string
  direction: string
  type: 'Image'
  screenshot: null
}
```

### Pattern 8: Mock Data — signalData.ts

The exact Austin TX values from CONTEXT.md must be used verbatim:

```typescript
// src/data/signalData.ts — key values (partial)
export const signalData = {
  kpis: {
    intersections: 1064,
    approaches: 3547,
    cameras: 8851,
    corridors: 334,
  },
  controlDelayTotals: {
    total: 8887.6,        // hours
    fourWeekAvg: 8022.8,
    delta: '+10.80%',
  },
  avgControlDelayPerVehicle: {
    total: 23.8,          // seconds
    fourWeekAvg: 22.6,
    delta: '+4.35%',
  },
  weeklyChart: [
    { week: '02/11/2026', value: 23 },
    { week: '02/18/2026', value: 22 },
    { week: '02/25/2026', value: 22 },
    { week: '03/04/2026', value: 23 },
    { week: '03/11/2026', value: 24 },
  ],
  losByGrade: [
    { grade: 'A', count: 134, color: '#1b5e20' },
    { grade: 'B', count: 359, color: '#4caf50' },
    { grade: 'C', count: 382, color: '#8bc34a' },
    { grade: 'D', count: 166, color: '#ff9800' },
    { grade: 'E', count: 21,  color: '#f44336' },
    { grade: 'F', count: 2,   color: '#b71c1c' },
  ],
  // ... full top-5 tables and corridor data from CONTEXT.md specifics
}
```

### Anti-Patterns to Avoid

- **Using Tailwind v4 `@import "tailwindcss"`**: Not valid for v3. Breaks design token loading.
- **Importing `@tailwindcss/vite` plugin**: v4 only. Remove from vite.config.ts and package.json.
- **Installing packages without `@version`**: npm as of 2026 installs React 19, react-leaflet v5, Tailwind v4 by default. Always pin.
- **Keeping the Sidebar**: CONTEXT.md specifies no sidebar. Module switching is nav bar only.
- **Using `activeModule` in the store**: The required store uses `activeView` in `uiSlice`.
- **LatLng objects in data files**: react-leaflet's `<Polyline positions={...}>` and `<Marker position={...}>` require `[number, number]` tuples, not `{ lat, lng }` objects.
- **Skipping Leaflet CSS import**: Even though Phase 1 has no map, the import must be established in Phase 1 to avoid breaking Phase 2.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Design token CSS variables | Custom CSS vars | Tailwind v3 `extend.colors` | JIT generates utilities automatically |
| Icon SVGs | Inline SVG elements | `lucide-react` named imports | Tree-shakeable, consistent stroke-width |
| State management | Context + useReducer | Zustand v5 slice pattern | Zero boilerplate, no Provider |
| TypeScript module resolution | `paths` config | `moduleResolution: "bundler"` | react-leaflet v4 incompatible with NodeNext |
| CSS slide animation | JavaScript animation | Tailwind `transition-transform` + `translate-x-full` | GPU-accelerated, no deps |

---

## Common Pitfalls

### Pitfall 1: npm installs wrong versions by default

**What goes wrong:** Running `npm install react-leaflet` in 2026 installs v5.0.0 (React 19 required). Running `npm install tailwindcss` installs v4.2.1 (no postcss config).
**Why it happens:** npm resolves `latest` tag which has moved.
**How to avoid:** Every package installation must specify the exact version: `npm install react-leaflet@4.2.1`.
**Warning signs:** `package.json` shows `^5.0.0` or `^4.2.1` instead of the pinned version.

### Pitfall 2: tailwind.config.js does not exist after Tailwind v4 was used

**What goes wrong:** Tailwind v3 expects `tailwind.config.js` at the project root. Since the existing setup used v4 (which has no config file), running `npm run dev` with v3 installed produces "Cannot find module 'tailwindcss'" or generates no utility classes.
**Why it happens:** Tailwind v3 requires PostCSS processing with `postcss.config.js` that references the `tailwindcss` plugin.
**How to avoid:** Run `npx tailwindcss@3.4.19 init -p` after installing Tailwind v3. This creates both `tailwind.config.js` and `postcss.config.js`.
**Warning signs:** No `tailwind.config.js` or `postcss.config.js` in project root after switching to v3.

### Pitfall 3: Tailwind v4 `@import "tailwindcss"` in index.css is invalid for v3

**What goes wrong:** If `index.css` still has `@import "tailwindcss"` after switching to v3, PostCSS throws "Cannot resolve module" errors and Tailwind generates no output.
**Why it happens:** The `@import "tailwindcss"` directive is a v4-only feature. Tailwind v3 uses `@tailwind base; @tailwind components; @tailwind utilities;`.
**How to avoid:** Replace the first line of `index.css` with the three `@tailwind` directives.
**Warning signs:** Console shows `Module not found: @import "tailwindcss"` in PostCSS errors.

### Pitfall 4: `@tailwindcss/vite` plugin left in vite.config.ts

**What goes wrong:** With Tailwind v3 installed but `@tailwindcss/vite` still in `vite.config.ts`, the build fails with "Cannot find package '@tailwindcss/vite'".
**Why it happens:** `@tailwindcss/vite` was the v4 Vite integration plugin. After removing Tailwind v4, this import has no module.
**How to avoid:** Remove `@tailwindcss/vite` from vite.config.ts and from package.json devDependencies entirely.
**Warning signs:** `npm run dev` throws "Failed to resolve import '@tailwindcss/vite'".

### Pitfall 5: LatLng objects vs tuple arrays in data migration

**What goes wrong:** Migrated segments still use `{ lat: 34.05, lng: -118.25 }` from the existing `mockSegments.ts`. When Phase 2 passes these to `<Polyline positions={...}>`, react-leaflet throws a TypeScript error or silently renders nothing.
**Why it happens:** react-leaflet's `LatLngExpression` type for `Polyline.positions` accepts `[lat, lng]` tuples, not plain objects.
**How to avoid:** When migrating data files, convert all `{ lat, lng }` to `[lat, lng]` tuples. Update `positions` field name (was `coords`).
**Warning signs:** TypeScript errors on `<Polyline positions={segment.coords}>` in Phase 2.

### Pitfall 6: travelTime field in minutes vs seconds

**What goes wrong:** The existing `mockSegments.ts` stores `travelTime` as minutes (e.g., `28`). The CONTEXT.md segment detail panel shows `0m 42s` format, implying seconds.
**Why it happens:** The existing data was created before requirements were locked.
**How to avoid:** When migrating/creating segments.ts, store travelTime and avgTravelTime in **seconds** and convert to `Xm Ys` format in the display component.
**Warning signs:** Panel shows "0m 28s" for a value that should be much larger or "28m 0s" for a short segment.

### Pitfall 7: moduleResolution: NodeNext breaks react-leaflet v4 imports

**What goes wrong:** Using `moduleResolution: "NodeNext"` in tsconfig causes `ts(1471)` errors on react-leaflet imports.
**Why it happens:** react-leaflet v4 does not export subpath types in its package.json correctly for NodeNext resolution.
**How to avoid:** Keep `moduleResolution: "bundler"` in `tsconfig.app.json`. Do not change this.
**Warning signs:** `ts(1471): Module has no exported member` errors on `import { MapContainer } from 'react-leaflet'`.

---

## Code Examples

### vite.config.ts (Tailwind v3 compatible)

```typescript
// Source: STACK.md
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### postcss.config.js (required for Tailwind v3)

```javascript
// Source: Tailwind v3 docs — https://v3.tailwindcss.com/docs/guides/vite
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### tsconfig.app.json (critical settings)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

`skipLibCheck: true` — required because recharts v2 has a known TypeScript error with `@types/react@18.2.74+`.

### App.tsx (Phase 1 structure)

```tsx
// Source: ARCHITECTURE.md
import { NavBar } from './components/layout/NavBar'
import { MissionControlView } from './components/mission-control/MissionControlView'
import { SignalAnalyticsView } from './components/signal-analytics/SignalAnalyticsView'
import { useStore } from './store'

function App() {
  const activeView = useStore((s) => s.activeView)

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a1628' }}>
      <NavBar />
      {activeView === 'mission-control' ? <MissionControlView /> : <SignalAnalyticsView />}
    </div>
  )
}

export default App
```

### MissionControlView.tsx (Phase 1 placeholder)

```tsx
// Phase 1 placeholder — no map yet
export function MissionControlView() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a1628' }}>
      {/* Filter bar stub — styled placeholder, functionality in Phase 2 */}
      <div style={{ background: '#0d1f3c', height: 40, minHeight: 40 }}
        className="flex items-center px-4 border-b border-[#1e3a5f] gap-6">
        {/* Filter items — visual stubs */}
      </div>
      {/* Map placeholder — will be replaced in Phase 2 */}
      <div className="flex-1 flex items-center justify-center" style={{ background: '#0a1628' }}>
        <span className="text-[#4a6080] text-sm">Map — Phase 2</span>
      </div>
    </div>
  )
}
```

---

## State of the Art

| Old Approach (current codebase) | Required Approach (CONTEXT.md) | Why Changed |
|--------------------------------|-------------------------------|-------------|
| React 19 + react-leaflet v5 | React 18.3.1 + react-leaflet 4.2.1 | Peer dep incompatibility |
| Tailwind v4 (`@import "tailwindcss"`) | Tailwind v3 PostCSS setup | v4 cannot use extend.colors config |
| `@tailwindcss/vite` plugin | Standard PostCSS pipeline | v4 plugin incompatible with v3 |
| Flat `useAppStore.ts` | Three separate slice files | CONTEXT.md requires slice pattern |
| `activeModule` with 5 values | `activeView` with 2 values | Scope — only 2 views in demo |
| Left Sidebar for navigation | Top nav module name click | CONTEXT.md nav bar spec |
| `LatLng { lat, lng }` objects | `[number, number]` tuples | react-leaflet Polyline/Marker requires tuples |
| travelTime in minutes | travelTime in seconds | Panel displays `Xm Ys` format |
| No `signalData.ts` | Complete `signalData.ts` with Austin TX values | Required for Phase 4+ |
| Vite 8 + plugin-react v6 | Vite 5.4.21 + plugin-react 4.7.0 | Breaking API change in Vite 8 |

---

## Open Questions

1. **Sidebar disposition**
   - What we know: `Sidebar.tsx` exists and is imported in `App.tsx`. CONTEXT.md specifies no sidebar — only top nav with module name toggle.
   - What's unclear: Should the planner task explicitly delete Sidebar.tsx, or leave it unused?
   - Recommendation: The plan should include a task to remove `Sidebar.tsx` and all its imports to prevent confusion.

2. **Segment count gap**
   - What we know: `mockSegments.ts` has 22 segments; CONTEXT.md requires 25+.
   - What's unclear: Should the migrated `segments.ts` add exactly 3 more (to reach 25), or more for future-proofing?
   - Recommendation: Add 3 more to reach exactly 25 — match requirement exactly to minimize scope.

3. **Alert and camera counts**
   - What we know: `mockAlerts.ts` is 157 lines; `mockCameras.ts` is 112 lines.
   - What's unclear: Need to confirm both meet 20+ alerts and 15+ cameras without full read.
   - Recommendation: Plan should include a verification step that counts exported array length.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test config or test files exist in the project |
| Config file | Does not exist — Wave 0 must create |
| Quick run command | `npm test` (after setup) |
| Full suite command | `npm test` (after setup) |

No test infrastructure exists. However, `nyquist_validation: true` in `.planning/config.json` requires tests. Given this is a greenfield Vite + React project, Vitest is the appropriate framework (ships with Vite ecosystem, no extra config).

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | All pinned packages installed at correct versions | smoke | `node -e "const p=require('./package.json'); ['react','react-dom'].forEach(k=>{ if(!p.dependencies[k].includes('18')) throw new Error(k+' wrong version') })"` | ❌ Wave 0 |
| FOUND-02 | Tailwind design tokens available as utilities | smoke | `npx tailwindcss --content './src/**/*.tsx' --output /tmp/tw-test.css && grep 'navy-deep' /tmp/tw-test.css` | ❌ Wave 0 |
| FOUND-03 | App shell renders with correct background and nav | smoke/visual | Manual — verify `npm run dev` shows dark navy, INRIX IQ text, 3 right icons | Manual only |
| FOUND-04 | Clicking module name toggles between views | unit/integration | Vitest + React Testing Library — render `<App>`, click module name, assert view changes | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx tsc --noEmit` (zero TypeScript errors)
- **Per wave merge:** `npm run build` (zero build errors)
- **Phase gate:** `npm run dev` — visual check that success criteria 1-5 all pass before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.ts` — Vitest setup for React Testing Library
- [ ] `src/test/setup.ts` — jsdom environment setup
- [ ] Framework install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — pinned versions, configuration patterns, integration gotchas
- `.planning/research/ARCHITECTURE.md` — component tree, Zustand slice design, TypeScript interfaces
- `.planning/research/PITFALLS.md` — 12 critical pitfalls with phase mapping
- `.planning/phases/01-foundation/01-CONTEXT.md` — locked decisions, exact nav layout, mock data values

### Secondary (MEDIUM confidence)
- Live inspection of `src/` directory and existing files — confirmed current wrong-version state
- `package.json` audit — confirmed exact wrong package versions installed

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from STACK.md which ran live npm registry queries on 2026-03-16
- Architecture: HIGH — from ARCHITECTURE.md with authoritative component tree
- Pitfalls: HIGH — from PITFALLS.md with GitHub issue citations
- Current codebase state: HIGH — directly read from project files

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (packages change slowly; re-verify versions if more than 30 days pass)
