import React from 'react';
import { X, Clock, Gauge, TrendingUp, Activity } from 'lucide-react';
import type { Segment } from '../../types';
import { useStore } from '../../store';

interface Props {
  segment: Segment;
}

function getCongestionColor(level: number): string {
  if (level < 25) return '#16a34a';
  if (level < 50) return '#ca8a04';
  if (level < 75) return '#ea580c';
  return '#dc2626';
}

function getCongestionLabel(level: number): string {
  if (level < 25) return 'Free Flow';
  if (level < 50) return 'Moderate';
  if (level < 75) return 'Slow';
  return 'Stopped';
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue, valueColor }) => (
  <div
    style={{
      background: '#f7f9fc',
      border: '1px solid #d0d7e2',
      borderRadius: 6,
      padding: '12px 14px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <span style={{ color: '#8a9ab8' }}>{icon}</span>
      <span style={{ fontSize: 10, color: '#8a9ab8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: valueColor || '#1a2744', lineHeight: 1 }}>
      {value}
    </div>
    {subValue && (
      <div style={{ fontSize: 11, color: '#8a9ab8', marginTop: 4 }}>{subValue}</div>
    )}
  </div>
);

export const SegmentPanel: React.FC<Props> = ({ segment }) => {
  const closePanel = useStore((s) => s.clearSelectedItem);
  const congestionColor = getCongestionColor(segment.congestionLevel);
  const congestionLabel = getCongestionLabel(segment.congestionLevel);

  const delayMultiplier = segment.travelTime / segment.avgTravelTime;

  return (
    <div
      className="panel-slide-in"
      style={{
        width: 320,
        minWidth: 320,
        background: '#fff',
        borderLeft: '1px solid #d0d7e2',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #d0d7e2',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#8a9ab8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Road Segment
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744', lineHeight: 1.3 }}>
            {segment.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: `${congestionColor}18`,
              border: `1px solid ${congestionColor}40`,
              borderRadius: 12,
              padding: '2px 8px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: congestionColor }} />
              <span style={{ fontSize: 11, color: congestionColor, fontWeight: 600 }}>
                {congestionLabel}
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#8a9ab8' }}>
              {segment.highway} {segment.direction}
            </span>
          </div>
        </div>
        <button
          onClick={closePanel}
          style={{ color: '#8a9ab8', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 4 }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Congestion bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #d0d7e2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#5a6a88' }}>Congestion Index</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: congestionColor }}>
            {segment.congestionLevel}%
          </span>
        </div>
        <div style={{ height: 6, background: '#e8edf4', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${segment.congestionLevel}%`,
            background: `linear-gradient(90deg, #16a34a, ${congestionColor})`,
            borderRadius: 3,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard
            icon={<Clock size={14} />}
            label="Current Travel Time"
            value={`${Math.round(segment.travelTime / 60)} min`}
            subValue={`Avg: ${Math.round(segment.avgTravelTime / 60)} min`}
            valueColor={delayMultiplier > 1.5 ? '#dc2626' : delayMultiplier > 1.2 ? '#ea580c' : '#1a2744'}
          />
          <StatCard
            icon={<Gauge size={14} />}
            label="Current Speed"
            value={`${segment.currentSpeed}`}
            subValue="mph"
            valueColor={congestionColor}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard
            icon={<TrendingUp size={14} />}
            label="Free Flow Speed"
            value={`${segment.freeFlowSpeed}`}
            subValue="mph — ideal"
            valueColor="#16a34a"
          />
          <StatCard
            icon={<Activity size={14} />}
            label="Historic Avg Speed"
            value={`${segment.historicAvgSpeed}`}
            subValue="mph — 4wk avg"
          />
        </div>

        {/* Speed breakdown */}
        <div style={{
          background: '#f7f9fc',
          border: '1px solid #d0d7e2',
          borderRadius: 6,
          padding: '14px 16px',
        }}>
          <div style={{ fontSize: 10, color: '#8a9ab8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Speed Breakdown
          </div>
          {[
            { label: 'Current Speed', value: segment.currentSpeed, max: segment.freeFlowSpeed, color: congestionColor },
            { label: 'Historic Avg',  value: segment.historicAvgSpeed, max: segment.freeFlowSpeed, color: '#8a9ab8' },
            { label: 'Free Flow',     value: segment.freeFlowSpeed, max: segment.freeFlowSpeed, color: '#16a34a' },
          ].map((row) => (
            <div key={row.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#5a6a88' }}>{row.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: row.color }}>{row.value} mph</span>
              </div>
              <div style={{ height: 4, background: '#e8edf4', borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (row.value / row.max) * 100)}%`,
                  background: row.color,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Delay indicator */}
        <div style={{
          background: '#f7f9fc',
          border: '1px solid #d0d7e2',
          borderRadius: 6,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#5a6a88', marginBottom: 2 }}>Travel Time Delay</div>
            <div style={{ fontSize: 11, color: '#8a9ab8' }}>vs. average travel time</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: delayMultiplier > 1.5 ? '#dc2626' : delayMultiplier > 1.2 ? '#ea580c' : '#16a34a',
            }}>
              +{Math.round((segment.travelTime - segment.avgTravelTime) / 60)} min
            </div>
            <div style={{ fontSize: 11, color: '#8a9ab8' }}>
              {delayMultiplier.toFixed(1)}× normal
            </div>
          </div>
        </div>

        {/* Segment metadata */}
        <div style={{
          background: '#f7f9fc',
          border: '1px solid #d0d7e2',
          borderRadius: 6,
          padding: '10px 14px',
        }}>
          {[
            { label: 'Type',         value: segment.type },
            { label: 'FRC Level',    value: `FRC ${segment.frc}` },
            { label: 'Length',       value: `${segment.lengthMiles.toFixed(2)} mi` },
            { label: 'Speed Bucket', value: `Bucket ${segment.speedBucket}` },
            { label: 'Segment ID',   value: segment.segmentId },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: '#8a9ab8' }}>{label}</span>
              <span style={{ fontSize: 10, color: '#5a6a88', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
