import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet'
import { loadLARoads, type OsmWay } from '../../lib/overpassLoader'

interface IntersectionPoint {
  id: string
  position: [number, number]
  losColor: string
  name: string
}

interface Props {
  intersections: IntersectionPoint[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const ROAD_STYLES: Record<string, { color: string; weight: number; opacity: number }> = {
  motorway:      { color: '#b0b8c8', weight: 3.5, opacity: 0.7 },
  motorway_link: { color: '#b0b8c8', weight: 2,   opacity: 0.6 },
  trunk:         { color: '#b0b8c8', weight: 3,   opacity: 0.65 },
  trunk_link:    { color: '#b0b8c8', weight: 1.5, opacity: 0.55 },
  primary:       { color: '#c8cdd8', weight: 1.5, opacity: 0.5 },
  secondary:     { color: '#d4d8e0', weight: 1,   opacity: 0.4 },
}

export function IntersectionMap({ intersections, selectedId, onSelect }: Props) {
  const [roads, setRoads] = useState<OsmWay[]>([])

  useEffect(() => {
    loadLARoads().then(setRoads).catch(() => {/* silent */})
  }, [])

  return (
    <MapContainer
      center={[34.05, -118.30]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Road geometry overlay */}
      {roads.map((way) => {
        const hw = way.tags.highway ?? 'secondary'
        const style = ROAD_STYLES[hw] ?? ROAD_STYLES['secondary']
        return (
          <Polyline
            key={way.id}
            positions={way.geometry.map((n) => [n.lat, n.lon] as [number, number])}
            pathOptions={{ color: style.color, weight: style.weight, opacity: style.opacity }}
            interactive={false}
          />
        )
      })}

      {/* Intersection dots */}
      {intersections.map((pt) => {
        const isSelected = selectedId === pt.id
        return (
          <CircleMarker
            key={pt.id}
            center={pt.position}
            radius={isSelected ? 10 : 7}
            pathOptions={{
              fillColor: pt.losColor,
              fillOpacity: isSelected ? 1 : 0.85,
              color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
              weight: isSelected ? 2.5 : 1.5,
            }}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e)
                onSelect(isSelected ? null : pt.id)
              },
            }}
          />
        )
      })}
    </MapContainer>
  )
}
