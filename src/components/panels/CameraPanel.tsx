import React from 'react';
import { X, Video, MapPin, RefreshCw } from 'lucide-react';
import type { Camera } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  camera: Camera;
}

export const CameraPanel: React.FC<Props> = ({ camera }) => {
  const { closePanel } = useAppStore();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div
      className="panel-slide-in"
      style={{
        width: 320,
        minWidth: 320,
        background: '#0d1f3c',
        borderLeft: '1px solid #1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1e3a5f',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{
              background: '#1e90ff20',
              border: '1px solid #1e90ff40',
              borderRadius: 4,
              padding: '2px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <Video size={10} color="#1e90ff" />
              <span style={{ fontSize: 10, color: '#1e90ff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {camera.type}
              </span>
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', lineHeight: 1.35 }}>
            {camera.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <MapPin size={11} color="#4a6080" />
            <span style={{ fontSize: 11, color: '#8ca0bc' }}>
              {camera.highway} — {camera.direction}
            </span>
          </div>
        </div>
        <button
          onClick={closePanel}
          style={{ color: '#4a6080', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 4 }}
          className="hover:text-white hover:bg-[#1e3a5f] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Camera feed placeholder */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: '#070f1e',
          border: '1px solid #1e3a5f',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Fake scanline effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            pointerEvents: 'none',
          }} />

          {/* Grid lines for surveillance aesthetic */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(30,144,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />

          {/* Corner brackets */}
          {[
            { top: 8, left: 8, borderTop: '2px solid #1e90ff44', borderLeft: '2px solid #1e90ff44' },
            { top: 8, right: 8, borderTop: '2px solid #1e90ff44', borderRight: '2px solid #1e90ff44' },
            { bottom: 8, left: 8, borderBottom: '2px solid #1e90ff44', borderLeft: '2px solid #1e90ff44' },
            { bottom: 8, right: 8, borderBottom: '2px solid #1e90ff44', borderRight: '2px solid #1e90ff44' },
          ].map((style, i) => (
            <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...style }} />
          ))}

          <Video size={28} color="#1e3a5f" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#2a4a6a', fontWeight: 500 }}>No Image Available</div>
            <div style={{ fontSize: 10, color: '#1e3050', marginTop: 2 }}>Feed offline or unavailable</div>
          </div>

          {/* Recording indicator */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 6px #ef4444',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: 9, color: '#4a6080', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              REC
            </span>
          </div>

          {/* Timestamp */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            right: 10,
            fontSize: 9,
            color: '#2a4a6a',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}>
            {timeStr}
          </div>
        </div>

        {/* Camera controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['◀◀', '◀', '⏸', '▶', '▶▶'].map((btn) => (
              <button
                key={btn}
                style={{
                  background: '#112040',
                  border: '1px solid #1e3a5f',
                  borderRadius: 4,
                  padding: '3px 6px',
                  fontSize: 9,
                  color: '#4a6080',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                {btn}
              </button>
            ))}
          </div>
          <button style={{
            background: '#112040',
            border: '1px solid #1e3a5f',
            borderRadius: 4,
            padding: '3px 8px',
            fontSize: 10,
            color: '#4a6080',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <RefreshCw size={10} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Camera metadata */}
      <div style={{ padding: '12px 16px', overflowY: 'auto', flex: 1 }}>
        <div style={{ fontSize: 11, color: '#8ca0bc', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Camera Details
        </div>

        {[
          { label: 'Camera Name', value: camera.name },
          { label: 'Road', value: camera.highway },
          { label: 'Direction', value: camera.direction },
          { label: 'Type', value: 'Fixed Surveillance' },
          { label: 'Image Type', value: camera.type },
          {
            label: 'Position',
            value: `${camera.position[0].toFixed(4)}°N, ${Math.abs(camera.position[1]).toFixed(4)}°W`,
          },
          { label: 'Status', value: 'Online' },
          { label: 'Copyright', value: '© 2026 California DOT / INRIX' },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '7px 0',
              borderBottom: '1px solid #112040',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 11, color: '#4a6080', flexShrink: 0 }}>{row.label}</span>
            <span style={{
              fontSize: 11,
              color: row.label === 'Status' ? '#22c55e' : '#c8d8e8',
              textAlign: 'right',
              wordBreak: 'break-word',
            }}>
              {row.value}
            </span>
          </div>
        ))}

        {/* Camera ID */}
        <div style={{ fontSize: 10, color: '#2a4a6a', textAlign: 'center', marginTop: 12 }}>
          Camera ID: {camera.id}
        </div>
      </div>
    </div>
  );
};
