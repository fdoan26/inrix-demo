import { useCallback, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { MapController } from './MapController'
import { SegmentLayer } from './layers/SegmentLayer'
import { AlertLayer } from './layers/AlertLayer'
import { CameraLayer } from './layers/CameraLayer'
import { CongestionLegend } from './legends/CongestionLegend'
import { AlertsLegend } from './legends/AlertsLegend'
import { SimPanel } from './SimPanel'
import { useTrafficData } from '../../hooks/useTrafficData'
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
  useMapEvents({ click: () => clearSelectedItem() })
  return null
}

export function MapView() {
  const showAlerts = useStore((s) => s.showAlerts)

  // Live OSM road data + time-of-day simulation
  const { segments, loading, source, simulatedTime, roadCount } = useTrafficData()

  // Force re-render when SimPanel changes speed/hour
  const [, setRefreshTick] = useState(0)
  const handleSimRefresh = useCallback(() => setRefreshTick((n) => n + 1), [])

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2000,
          background: 'rgba(248,250,252,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, border: '3px solid #dde3ec',
            borderTop: '3px solid #1a56db', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 13, color: '#5a6a88', fontWeight: 500 }}>
            Loading LA road network…
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <MapContainer
        center={[34.05, -118.25]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
          detectRetina={true}
        />
        <MapController />
        <MapClickHandler />
        <SegmentLayer segments={segments} />
        <AlertLayer />
        <CameraLayer />
      </MapContainer>

      {/* Legend stack — bottom left */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <CongestionLegend />
        {showAlerts && <AlertsLegend visible={showAlerts} />}
      </div>

      {/* Simulation control panel — bottom right */}
      <SimPanel
        simulatedTime={simulatedTime}
        source={source}
        roadCount={roadCount}
        onRefresh={handleSimRefresh}
      />
    </div>
  )
}
