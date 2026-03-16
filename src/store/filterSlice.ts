import type { StateCreator } from 'zustand'
import type { StoreState } from './index'

export interface FilterSlice {
  activeTab: 'network' | 'corridors'
  mapVersion: string
  showTraffic: boolean
  showAlerts: boolean
  showCameras: boolean
  setActiveTab: (tab: 'network' | 'corridors') => void
  setMapVersion: (version: string) => void
  toggleTraffic: () => void
  toggleAlerts: () => void
  toggleCameras: () => void
}

export const createFilterSlice: StateCreator<StoreState, [], [], FilterSlice> = (set) => ({
  activeTab: 'network',
  mapVersion: 'Latest',
  showTraffic: true,
  showAlerts: true,
  showCameras: true,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMapVersion: (version) => set({ mapVersion: version }),
  toggleTraffic: () => set((s) => ({ showTraffic: !s.showTraffic })),
  toggleAlerts: () => set((s) => ({ showAlerts: !s.showAlerts })),
  toggleCameras: () => set((s) => ({ showCameras: !s.showCameras })),
})
