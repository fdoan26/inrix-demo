import L from 'leaflet'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { MapController } from './MapController'
import { SegmentLayer } from './layers/SegmentLayer'
import { AlertLayer } from './layers/AlertLayer'
import { CameraLayer } from './layers/CameraLayer'
import { CongestionLegend } from './legends/CongestionLegend'
import { AlertsLegend } from './legends/AlertsLegend'
import { useStore } from '../../store'

// Fix Leaflet default icon missing images in bundled environments
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapClickHandler() {
  const clearSelectedItem = useStore((s) => s.clearSelectedItem)
  useMapEvents({
    click: () => clearSelectedItem(),
  })
  return null
}

export function MapView() {
  const showAlerts = useStore((s) => s.showAlerts)

  return (
    <div className="relative flex-1 overflow-hidden">
      <MapContainer
        center={[34.05, -118.25]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
          detectRetina={true}
        />
        <MapController />
        <MapClickHandler />
        <SegmentLayer />
        <AlertLayer />
        <CameraLayer />
      </MapContainer>
      <CongestionLegend />
      {showAlerts && <AlertsLegend visible={showAlerts} />}
    </div>
  )
}
