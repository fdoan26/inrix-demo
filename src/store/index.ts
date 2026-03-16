import { create } from 'zustand'
import { createMapSlice, type MapSlice } from './mapSlice'
import { createFilterSlice, type FilterSlice } from './filterSlice'
import { createUISlice, type UISlice } from './uiSlice'

export type StoreState = MapSlice & FilterSlice & UISlice

export const useStore = create<StoreState>()((...a) => ({
  ...createMapSlice(...a),
  ...createFilterSlice(...a),
  ...createUISlice(...a),
}))
