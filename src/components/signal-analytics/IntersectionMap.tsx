import L from 'leaflet'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'

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

export function IntersectionMap({ intersections, selectedId, onSelect }: Props) {
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
