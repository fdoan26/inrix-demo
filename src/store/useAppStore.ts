import { create } from 'zustand'
import type { ActiveView, Segment, Camera } from '../types'

type PanelContent =
  | { type: 'segment'; data: Segment }
  | { type: 'camera'; data: Camera }
  | null

interface FilterState {
  trafficFlow: boolean
  alerts: boolean
  cameras: boolean
}

interface AppState {
  activeView: ActiveView
  filters: FilterState
  panelContent: PanelContent

  setActiveView: (view: ActiveView) => void
  toggleFilter: (filter: keyof FilterState) => void
  setPanelContent: (content: PanelContent) => void
  closePanel: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeView: 'mission-control',
  filters: {
    trafficFlow: true,
    alerts: true,
    cameras: true,
  },
  panelContent: null,

  setActiveView: (view) =>
    set({ activeView: view, panelContent: null }),

  toggleFilter: (filter) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filter]: !state.filters[filter],
      },
    })),

  setPanelContent: (content) => set({ panelContent: content }),

  closePanel: () => set({ panelContent: null }),
}))
