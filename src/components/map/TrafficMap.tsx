import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet'
import { mockSegments } from '../../data/mockSegments'
import { mockAlerts } from '../../data/mockAlerts'
import { mockCameras } from '../../data/mockCameras'
import { useAppStore } from '../../store/useAppStore'
import { SegmentPolylines } from './SegmentPolylines'
import { AlertMarkers } from './AlertMarkers'
import type { Camera } from '../../types'

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createCameraIcon(): L.DivIcon {
  const html = `
    <div style="
      width: 22px;
      height: 22px;
      border-radius: 4px;
      background: #112040;
      border: 1.5px solid #1e90ff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1e90ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 7l-7 5 7 5V7z"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'camera-marker-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    tooltipAnchor: [11, 0],
  });
}

// Congestion legend overlay
const CongestionLegend: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      bottom: 32,
      left: 16,
      background: 'rgba(13, 31, 60, 0.92)',
      border: '1px solid #1e3a5f',
      borderRadius: 8,
      padding: '10px 14px',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      minWidth: 180,
    }}
  >
    <div style={{ fontSize: 10, fontWeight: 600, color: '#8ca0bc', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
      Congestion Level
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[
        { color: '#22c55e', label: '0 – 25%', sublabel: 'Free Flow' },
        { color: '#eab308', label: '26 – 50%', sublabel: 'Moderate' },
        { color: '#f97316', label: '51 – 75%', sublabel: 'Slow' },
        { color: '#ef4444', label: '76 – 100%', sublabel: 'Stopped' },
      ].map((item) => (
        <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 4,
            borderRadius: 2,
            background: item.color,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 11, color: '#c8d8e8' }}>{item.sublabel}</span>
          <span style={{ fontSize: 10, color: '#4a6080', marginLeft: 'auto' }}>{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

// Alert legend overlay
const AlertLegend: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      bottom: 32,
      left: 210,
      background: 'rgba(13, 31, 60, 0.92)',
      border: '1px solid #1e3a5f',
      borderRadius: 8,
      padding: '10px 14px',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      minWidth: 160,
    }}
  >
    <div style={{ fontSize: 10, fontWeight: 600, color: '#8ca0bc', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
      Alert Types
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[
        { color: '#dc2626', label: 'Dangerous Slowdowns' },
        { color: '#f97316', label: 'Construction' },
        { color: '#ef4444', label: 'Crashes' },
        { color: '#7c3aed', label: 'Road Closures' },
        { color: '#22c55e', label: 'Events' },
        { color: '#3b82f6', label: 'Congestion' },
        { color: '#fbbf24', label: 'Hazards' },
      ].map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: item.color,
            flexShrink: 0,
            boxShadow: `0 0 4px ${item.color}80`,
          }} />
          <span style={{ fontSize: 11, color: '#c8d8e8' }}>{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

// Camera markers component
const CameraMarkers: React.FC<{ cameras: Camera[] }> = ({ cameras }) => {
  const { setPanelContent } = useAppStore();
  const icon = createCameraIcon();

  return (
    <>
      {cameras.map((cam) => (
        <Marker
          key={cam.id}
          position={cam.position}
          icon={icon}
          eventHandlers={{
            click: () => setPanelContent({ type: 'camera', data: cam }),
          }}
        >
          <Tooltip sticky offset={[12, 0]}>
            <div style={{
              background: '#0d1f3c',
              border: '1px solid #1e3a5f',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12,
              color: '#ffffff',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{cam.name}</div>
              <div style={{ color: '#8ca0bc', fontSize: 11 }}>{cam.type} Camera</div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};

// Close panel when clicking map background
const MapClickHandler: React.FC = () => {
  const map = useMap();
  const { closePanel } = useAppStore();

  useEffect(() => {
    const handler = () => closePanel();
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, closePanel]);

  return null;
};

export const TrafficMap: React.FC = () => {
  const { filters } = useAppStore();

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      <MapContainer
        center={[34.05, -118.25]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl
        attributionControl
      >
        {/* Carto Dark Matter tiles — no API key required */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        <MapClickHandler />

        {/* Traffic flow segments */}
        {filters.trafficFlow && <SegmentPolylines segments={mockSegments} />}

        {/* Alert markers */}
        {filters.alerts && <AlertMarkers alerts={mockAlerts} />}

        {/* Camera markers */}
        {filters.cameras && <CameraMarkers cameras={mockCameras} />}
      </MapContainer>

      {/* Legend overlays (outside Leaflet to avoid z-index issues) */}
      <CongestionLegend />
      {filters.alerts && <AlertLegend />}
    </div>
  );
};
