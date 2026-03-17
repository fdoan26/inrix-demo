import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useStore } from '../../store'

export function MapController() {
  const map = useMap()
  const center = useStore((s) => s.center)
  const zoom = useStore((s) => s.zoom)

  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])

  return null
}
