import { useCallback, useMemo } from 'react'
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

// Canvas renderer — far faster than SVG for 200+ polylines
const canvasRenderer = L.canvas({ padding: 0.5 })

function MapClickHandler() {
  const clearSelectedItem = useStore((s) => s.clearSelectedItem)
  useMapEvents({ click: () => clearSelectedItem() })
  return null
}

export function MapView() {
  const showAlerts = useStore((s) => s.showAlerts)

  const { segments, loading, source, simulatedTime, roadCount, refresh } = useTrafficData()

  // When SimPanel changes speed or hour: fire an immediate tick so the map
  // reacts right away instead of waiting up to 2 minutes for the next scheduled one.
  const handleSimRefresh = useCallback(() => refresh(), [refresh])

  // Stable map options — canvas renderer set once at map creation
  const mapOptions = useMemo(() => ({ renderer: canvasRenderer }), [])

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Non-blocking background load indicator — top-right badge */}
      {loading && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 1000,
          background: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '5px 10px',
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 11, color: '#5a6a88', fontWeight: 500,
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            width: 12, height: 12, border: '2px solid #dde3ec',
            borderTop: '2px solid #1a56db', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', flexShrink: 0,
          }} />
          Loading road network…
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <MapContainer
        center={[34.05, -118.25]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        {...mapOptions}
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
