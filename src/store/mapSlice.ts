import type { StateCreator } from 'zustand'
import type { StoreState } from './index'

export interface MapSlice {
  center: [number, number]
  zoom: number
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
}

export const createMapSlice: StateCreator<StoreState, [], [], MapSlice> = (set) => ({
  center: [34.05, -118.25],
  zoom: 11,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
})
