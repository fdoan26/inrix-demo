import type { StateCreator } from 'zustand'
import type { StoreState } from './index'
import type { ActiveView } from '../types'

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

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  activeView: 'mission-control',
  selectedItem: null,
  setActiveView: (view) => set({ activeView: view, selectedItem: null }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
})
