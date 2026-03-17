import { MapContainer, TileLayer } from 'react-leaflet'

export function SignalMap() {
  return (
    <MapContainer
      center={[30.267, -97.743]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
    </MapContainer>
  )
}
