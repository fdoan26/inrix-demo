# Stack Research

**Domain:** React + TypeScript + Vite traffic intelligence SaaS demo (geo-visualization, dark UI, charts, state management)
**Researched:** 2026-03-16
**Confidence:** HIGH (all versions verified live against npm registry; integration gotchas verified against GitHub issues and official docs)

---

## Version Lock Table

All versions verified live from the npm registry on 2026-03-16.

| Package | Pinned Version | Why This Version (Not Latest) |
|---------|---------------|-------------------------------|
| react | 18.3.1 | react-leaflet@4.x requires `^18.0.0`; v5 requires React 19 |
| react-dom | 18.3.1 | Must match react |
| typescript | 5.9.3 | Latest; no pinning needed |
| vite | 5.4.21 | Vite 6 / 8 introduced breaking API changes; 5.x is the battle-tested choice for this stack |
| @vitejs/plugin-react | 4.7.0 | Compatible with Vite 5.x; v6 is for Vite 8 |
| leaflet | 1.9.4 | Latest stable; react-leaflet@4 peer dep is `^1.9.0` |
| react-leaflet | 4.2.1 | Latest v4.x — MUST stay on v4. v5.0.0 requires React 19 |
| tailwindcss | 3.4.19 | v3.x specified by project. v4 is CSS-native (no postcss config) — fundamentally different setup |
| postcss | 8.5.8 | Required by tailwindcss v3 |
| autoprefixer | 10.4.27 | Required by tailwindcss v3 |
| recharts | 2.15.4 | Latest v2.x — v3 is in active development; v2 is the stable production choice |
| zustand | 5.0.12 | Latest; React 18 is minimum required for v5 |
| lucide-react | 0.577.0 | Latest; supports React 16.5–19 |
| @types/leaflet | 1.9.21 | Latest; provides Leaflet TypeScript definitions |
| @types/react | 18.3.28 | MUST be v18.x, not v19.x — matches react@18.3.1 |
| @types/react-dom | 18.3.x | Must match @types/react version series |

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 18.3.1 | UI framework | Constrained to 18.x by react-leaflet@4 peer dep. React 18 concurrent features are unused here; stability matters more |
| TypeScript | 5.9.3 | Type safety | Latest stable; Vite's `bundler` module resolution eliminates most TS config headaches |
| Vite | 5.4.21 | Build tooling | Fastest HMR for development; pin to 5.x for plugin ecosystem stability. Vite 8 is too new |
| react-leaflet | 4.2.1 | Interactive map | Only option that wraps Leaflet as React components with hooks API. Pin to v4.x — v5 breaks on React 18 |
| leaflet | 1.9.4 | Map engine | The underlying map library. CartoDB Dark Matter tiles require no API key |
| Tailwind CSS | 3.4.19 | Utility-first CSS | v3 uses PostCSS + config file — the battle-tested approach. Project specified v3 specifically |
| Recharts | 2.15.4 | Data visualization | Composable SVG charts built for React. v2 has stable TypeScript types. Best choice for bar charts and time-series |
| Zustand | 5.0.12 | State management | Minimal boilerplate, no Provider wrapping required, excellent TypeScript inference with `create<T>()()` pattern |
| lucide-react | 0.577.0 | Icon components | Tree-shakeable SVG icon components; each icon is a typed React component |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/leaflet | 1.9.21 | Leaflet TypeScript definitions | Required — Leaflet ships no types of its own |
| @types/react | 18.3.28 | React TypeScript definitions | Required dev dep — pin to 18.x series |
| @types/react-dom | 18.3.x | ReactDOM TypeScript definitions | Required dev dep — pin to 18.x series |
| postcss | 8.5.8 | CSS transformation pipeline | Required by tailwindcss v3 |
| autoprefixer | 10.4.27 | Vendor prefix injection | Required by tailwindcss v3 |
| @vitejs/plugin-react | 4.7.0 | React Fast Refresh in Vite | Required for HMR to work with React |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vite dev server | HMR + fast builds | `npm run dev` — no extra config beyond plugin-react |
| TypeScript strict mode | Type safety | Enable `strict: true` in tsconfig; add `skipLibCheck: true` for Recharts compat |
| Tailwind CSS IntelliSense (VS Code) | Class autocomplete | Requires tailwind.config.js at project root |

---

## Installation

```bash
# Scaffold project (use Vite 5.x explicitly)
npm create vite@5 inrix-demo -- --template react-ts

# Core runtime
npm install react@18.3.1 react-dom@18.3.1

# Map stack — MUST install leaflet alongside react-leaflet
npm install leaflet@1.9.4 react-leaflet@4.2.1

# Charts + state + icons
npm install recharts@2.15.4 zustand@5.0.12 lucide-react@0.577.0

# Tailwind CSS v3 (PostCSS-based)
npm install -D tailwindcss@3.4.19 postcss@8.5.8 autoprefixer@10.4.27

# Type definitions — pin @types/react to 18.x
npm install -D @types/leaflet@1.9.21 @types/react@18.3.28 @types/react-dom@18.3.1

# Initialize Tailwind
npx tailwindcss init -p
```

---

## Configuration Requirements

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No special Leaflet config needed in Vite 5.x
  // CSS files from node_modules are handled automatically
})
```

No special Vite configuration is needed for Leaflet with Vite 5.x. The `optimizeDeps` exclusion that some older guides recommend is NOT necessary in Vite 5.

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // INRIX IQ design system tokens
        'navy-deep':    '#0a1628',  // Primary background
        'navy-nav':     '#0d1f3c',  // Nav bar
        'accent-blue':  '#1a6eb5',  // Accent/active state
        'toggle-blue':  '#2196f3',  // Toggle active
        'alert-red':    '#e53935',  // Alert pin color
        'text-muted':   '#8899aa',  // Secondary text
        // Congestion scale
        'congestion-green':  '#4caf50',
        'congestion-yellow': '#ffeb3b',
        'congestion-orange': '#ff9800',
        'congestion-red':    '#f44336',
      },
    },
  },
  plugins: [],
}
```

### tsconfig.app.json

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

`skipLibCheck: true` is required. Recharts v2 has a known TypeScript error when building against `@types/react@18.2.74+` related to `forwardRef` inference. This flag suppresses it without affecting your own type safety.

`moduleResolution: "bundler"` is Vite's recommended setting. Do NOT use `NodeNext` — react-leaflet v4 does not support NodeNext module resolution and will throw `ts(1471)` errors.

### src/index.css (Tailwind directives)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Leaflet CSS Import

**Required in main.tsx or App.tsx — before any Leaflet component renders:**

```typescript
import 'leaflet/dist/leaflet.css'
```

Missing this import causes a broken map (tiles load but map controls and container sizing fail silently).

### Leaflet Default Marker Icon Fix

Vite's asset handling breaks Leaflet's default marker icon URL resolution. Required in a setup file or at the top of App.tsx:

```typescript
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})
```

Note: This project uses custom DivIcons for all map pins (alerts, cameras, congestion segments), so the default marker fix is only needed if any `<Marker>` component without an explicit `icon` prop is rendered.

### MapContainer Height Requirement

Leaflet's `MapContainer` renders a `div.leaflet-container`. This div must have an explicit height or it renders as zero-height (invisible):

```css
/* In index.css or a component stylesheet */
.leaflet-container {
  height: 100%;
  width: 100%;
}
```

Or inline via Tailwind: `<MapContainer className="h-full w-full" ...>`

### Zustand Store Pattern

```typescript
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface AppState {
  activeView: 'mission-control' | 'signal-analytics'
  selectedSegmentId: string | null
  setActiveView: (view: AppState['activeView']) => void
  setSelectedSegmentId: (id: string | null) => void
}

export const useAppStore = create<AppState>()((set) => ({
  activeView: 'mission-control',
  selectedSegmentId: null,
  setActiveView: (view) => set({ activeView: view }),
  setSelectedSegmentId: (id) => set({ selectedSegmentId: id }),
}))

// Usage — object selector requires useShallow in v5 to avoid infinite loops
const { activeView, setActiveView } = useAppStore(
  useShallow((s) => ({ activeView: s.activeView, setActiveView: s.setActiveView }))
)
```

**Critical v5 behavior:** In Zustand v5, selectors that return new object references on every call cause infinite re-render loops. Always wrap object/array selectors with `useShallow`. Single-value selectors (e.g., `s => s.activeView`) are safe without it.

---

## Integration Gotchas

### Gotcha 1: react-leaflet v5 requires React 19

**Problem:** `npm install react-leaflet` as of 2026 installs v5.0.0, which declares `react: ^19.0.0` as a peer dependency. Installing it with React 18 produces peer dependency warnings or errors and the map will not initialize.

**Fix:** Pin explicitly: `npm install react-leaflet@4.2.1`

**Confidence:** HIGH — verified from npm registry peer dep declaration.

### Gotcha 2: Tailwind v4 is incompatible with the v3 setup pattern

**Problem:** `npm install tailwindcss` as of 2026 installs v4.2.1, which uses a CSS-native `@import "tailwindcss"` approach with a Vite plugin — no `tailwind.config.js`, no PostCSS. This is fundamentally incompatible with the v3 setup pattern and custom `extend.colors` tokens.

**Fix:** Pin explicitly: `npm install -D tailwindcss@3.4.19 postcss@8.5.8 autoprefixer@10.4.27`

**Confidence:** HIGH — verified from npm registry and official v3 docs at v3.tailwindcss.com.

### Gotcha 3: Recharts v3 is the latest — v2 is required for type stability

**Problem:** `npm install recharts` as of 2026 installs v3.8.0. Recharts v3 has reworked its TypeScript generics API in ways that break most v2 usage patterns. The ecosystem tutorials and documentation still predominantly cover v2.

**Fix:** Pin explicitly: `npm install recharts@2.15.4`

**Confidence:** HIGH — verified from npm registry; v3 peer deps structure confirms the generics rewrite.

### Gotcha 4: @types/react must match React major version

**Problem:** `npm install -D @types/react` installs v19.x types. Using React 18 with v19 type definitions causes `JSX.Element` inference failures and incompatible `useRef` overload signatures.

**Fix:** Pin explicitly: `npm install -D @types/react@18.3.28 @types/react-dom@18.3.1`

**Confidence:** HIGH — standard TypeScript/DefinitelyTyped versioning contract.

### Gotcha 5: Leaflet CSS must be imported before any map component

**Problem:** Leaflet's styles are not auto-injected. Without `import 'leaflet/dist/leaflet.css'`, the map container renders with zero height, tiles appear misaligned, and controls are invisible.

**Fix:** Import in `main.tsx` before `ReactDOM.createRoot` or at the top of `App.tsx`.

**Confidence:** HIGH — documented in official react-leaflet installation docs and reproduced consistently.

### Gotcha 6: MapContainer is SSR-incompatible (not relevant here)

**Context:** react-leaflet cannot render on the server (`window` is undefined). This is a non-issue for this project (pure Vite SPA, no SSR). Noted here only to confirm no workaround (dynamic import, ssr: false) is needed.

**Confidence:** HIGH.

### Gotcha 7: Vite 8 breaks @vitejs/plugin-react v4

**Problem:** Vite 8.0.0 (the npm latest as of 2026) requires @vitejs/plugin-react v6+. If you install the latest Vite and then install plugin-react without pinning, you get mismatched APIs.

**Fix:** Pin to Vite 5.x + plugin-react 4.x as specified above.

**Confidence:** MEDIUM — inferred from Vite's plugin API versioning convention and plugin-react changelog.

### Gotcha 8: Zustand v5 useShallow is non-optional for object selectors

**Problem:** In Zustand v4, `shallow` from `zustand/shallow` was the equality comparison passed as a second argument. In v5, the pattern changed to `useShallow` as a selector wrapper. Using v4 patterns in v5 causes missed renders or infinite loops.

**Fix:** Use `useShallow` from `zustand/react/shallow` for all selectors returning objects or arrays.

**Confidence:** HIGH — verified from Zustand v5 migration docs.

---

## Alternatives Considered

| Recommended | Alternative | Why Not Alternative |
|-------------|-------------|---------------------|
| react-leaflet | MapLibre GL JS / react-map-gl | MapLibre uses WebGL (more complex, GPU dependency). react-leaflet has simpler DOM-based rendering and a smaller bundle for a demo. CartoDB tiles work natively with Leaflet |
| react-leaflet | Google Maps React | Requires API key. Project explicitly excludes API keys |
| Recharts | Victory | Victory has more complex API, heavier bundle. Recharts `ResponsiveContainer` + `BarChart` is idiomatic for this use case |
| Recharts | Chart.js / react-chartjs-2 | Canvas-based (harder to style with Tailwind). Recharts is SVG-native and composable as JSX |
| Zustand | Redux Toolkit | 5x more boilerplate, Provider wrapping required. Overkill for a single-session demo with no persistence |
| Zustand | Jotai | Atom-based model is better for fine-grained subscriptions; Zustand's single-store model maps better to the app's two-view structure |
| Tailwind CSS v3 | Tailwind CSS v4 | v4 is CSS-native with no JS config — cannot define custom color tokens via `extend.colors`. v3 is required for the project's design token approach |
| Vite 5.x | Vite 6 / 8 | Plugin ecosystem stability. The @vitejs/plugin-react v4 line only supports Vite 5.x |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `react-leaflet@5.x` | Requires React 19 — hard incompatibility with this stack | `react-leaflet@4.2.1` |
| `tailwindcss@4.x` | CSS-native setup, no JS config, incompatible with `extend.colors` token approach | `tailwindcss@3.4.19` |
| `recharts@3.x` | Reworked generics API; stable ecosystem is on v2 | `recharts@2.15.4` |
| `@types/react@19.x` | Type definitions mismatch with React 18 runtime | `@types/react@18.3.28` |
| `vite@6.x` or `vite@8.x` | Breaking changes in plugin API; plugin-react v4 only supports Vite 5 | `vite@5.4.21` + `@vitejs/plugin-react@4.7.0` |
| `moduleResolution: "NodeNext"` in tsconfig | react-leaflet v4 does not export subpath types; causes `ts(1471)` error | `moduleResolution: "bundler"` |
| `@types/recharts` (DefinitelyTyped) | Recharts v2+ ships its own types; the DefinitelyTyped package is stale and conflicts | No separate types package needed |
| MapLibre GL JS | WebGL renderer, much heavier, overkill for a tile-based demo | Leaflet (DOM-based, lighter) |

---

## Version Compatibility Matrix

| Package A | Package B | Status | Notes |
|-----------|-----------|--------|-------|
| react@18.3.1 | react-leaflet@4.2.1 | COMPATIBLE | v4 peer dep is `^18.0.0` |
| react@18.3.1 | react-leaflet@5.0.0 | INCOMPATIBLE | v5 peer dep is `^19.0.0` |
| react@18.3.1 | zustand@5.0.12 | COMPATIBLE | v5 minimum is `>=18.0.0` |
| react@18.3.1 | recharts@2.15.4 | COMPATIBLE | v2 peer dep includes `^18.0.0` |
| react@18.3.1 | lucide-react@0.577.0 | COMPATIBLE | Peer dep includes `^18.0.0` |
| tailwindcss@3.4.19 | vite@5.4.21 | COMPATIBLE | Requires PostCSS plugin in vite config or postcss.config.js |
| tailwindcss@4.x | postcss + tailwind.config.js | INCOMPATIBLE | v4 uses `@tailwindcss/vite` plugin, not PostCSS |
| recharts@2.15.4 | @types/react@18.3.28 | COMPATIBLE with skipLibCheck | `skipLibCheck: true` required to suppress forwardRef typing issue |
| vite@5.4.21 | @vitejs/plugin-react@4.7.0 | COMPATIBLE | v4 plugin targets Vite 5.x |
| vite@8.0.0 | @vitejs/plugin-react@4.7.0 | INCOMPATIBLE | plugin-react v6 is required for Vite 8 |

---

## Sources

- npm registry (`registry.npmjs.org`) — live version queries, 2026-03-16 — HIGH confidence
- [React Leaflet Installation Docs](https://react-leaflet.js.org/docs/start-installation/) — peer dependency requirements — HIGH confidence
- [React Leaflet v4 Installation](https://react-leaflet.js.org/docs/v4/start-installation/) — v4-specific peer deps — HIGH confidence
- [Tailwind CSS v3 Vite Guide](https://v3.tailwindcss.com/docs/guides/vite) — PostCSS setup, content paths — HIGH confidence
- [Tailwind CSS v3 Theme Configuration](https://v3.tailwindcss.com/docs/theme) — extend.colors pattern — HIGH confidence
- [Zustand v5 Migration Guide](https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5) — useShallow requirement — HIGH confidence
- [react-leaflet Issue #1003](https://github.com/PaulLeCam/react-leaflet/issues/1003) — NodeNext moduleResolution incompatibility — HIGH confidence
- [Recharts Issue #4382](https://github.com/recharts/recharts/issues/4382) — TypeScript skipLibCheck requirement — HIGH confidence
- [Leaflet Issue #5607](https://github.com/Leaflet/Leaflet/issues/5607) — Default marker icon broken in bundlers — HIGH confidence
- [Vite Getting Started](https://vite.dev/guide/) — configuration patterns — HIGH confidence

---

*Stack research for: INRIX IQ Demo Clone — React 18 + TypeScript + Vite + react-leaflet + Tailwind v3 + Recharts + Zustand*
*Researched: 2026-03-16*
