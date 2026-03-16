# INRIX IQ Demo Clone

## What This Is

A pixel-accurate investor demo clone of the INRIX IQ traffic intelligence platform, built as a React + TypeScript + Vite single-page application using mock data only (no real APIs). The goal is an impressive, polished demo that replicates the look, feel, and interactivity of the real INRIX IQ product to showcase the platform's capabilities to investors.

## Core Value

The demo must look and feel indistinguishable from the real INRIX IQ product — every visual detail, interaction, and data presentation must be investor-ready.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Full-screen dark map centered on Los Angeles using react-leaflet with CartoDB Dark Matter tiles
- [ ] Road segments color-coded by congestion level (green/yellow/orange/red)
- [ ] Alert pins on map color-coded by alert type (crash, construction, slowdown, event)
- [ ] Camera pins with cluster count badges
- [ ] Dark navy Mission Control layout matching INRIX IQ design system
- [ ] Top filter bar with Network/Corridors toggle, Map Version dropdown, Traffic Flow toggle, Alerts toggle with count badge, Cameras toggle
- [ ] Right panel slide-in for segment details (name, ID, type, FRC, length, speed, travel times)
- [ ] Right panel slide-in for camera details (name, highway, direction, type, image placeholder)
- [ ] Congestion legend overlay (bottom-left)
- [ ] Alerts legend overlay (bottom-left)
- [ ] Signal Analytics view with left KPI panel (intersections, approaches, corridors, cameras, total/avg control delay)
- [ ] Signal Analytics bar chart of avg control delay over time (Recharts)
- [ ] Signal Analytics intersection counts by LOS (A-F)
- [ ] Signal Analytics ranked tables: Top 5 Control Delay Issues (worsened total and per vehicle)
- [ ] Signal Analytics Top 3 Corridor Issues with travel time index
- [ ] Signal Analytics background light/muted map style
- [ ] 25+ mock road segments in LA area with full attribute data
- [ ] 20+ mock alerts across all types
- [ ] 15+ mock cameras
- [ ] Mock signal analytics data matching Austin TX screenshot values
- [ ] Zustand state management
- [ ] Navigation between Mission Control and Signal Analytics views

### Out of Scope

- Real API calls or live data — investor demo only, mock data throughout
- User authentication — no login required
- Backend/server — pure client-side SPA
- Mobile responsiveness — desktop investor demo only
- Additional INRIX IQ modules beyond Mission Control and Signal Analytics

## Context

- Tech stack is fully specified: React 18 + TypeScript + Vite, react-leaflet (CartoDB Dark Matter tiles, no API key), Tailwind CSS v3, Recharts, Zustand, lucide-react
- Project location: C:\Users\FisherDoan\Workspaces\inrix-demo
- Design system specified with exact hex values:
  - Primary background: #0a1628 (dark navy)
  - Nav bar: #0d1f3c
  - Accent/active: #1a6eb5
  - Toggle active: #2196f3
  - Alert red: #e53935
  - Text primary: #ffffff
  - Text secondary: #8899aa
  - Congestion: green #4caf50, yellow #ffeb3b, orange #ff9800, red #f44336
- Map centered on Los Angeles (34.05, -118.25), zoom 11
- Two primary views: Mission Control (map-focused) and Signal Analytics (data/charts)
- Screenshots of Austin TX Signal Analytics data provided as reference for mock values

## Constraints

- **Tech Stack**: React 18 + TypeScript + Vite + react-leaflet + Tailwind CSS v3 + Recharts + Zustand + lucide-react — all specified, no deviation
- **Data**: Mock data only — no real APIs, no API keys required (CartoDB tiles are free/no-key)
- **Location**: Project must be created at C:\Users\FisherDoan\Workspaces\inrix-demo
- **Scope**: Investor demo quality — pixel accuracy and visual polish take priority over code abstraction

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mock data only | Investor demo — no real API dependencies or keys needed | — Pending |
| CartoDB Dark Matter tiles | Free, no API key, matches INRIX dark aesthetic | — Pending |
| Tailwind CSS v3 | Specified in requirements, rapid dark UI styling | — Pending |
| Zustand for state | Lightweight, specified in requirements | — Pending |
| Two views only | Mission Control + Signal Analytics are core demo screens | — Pending |

---
*Last updated: 2026-03-16 after initialization*
