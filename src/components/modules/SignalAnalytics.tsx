import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
interface ControlDelayDataPoint {
  week: string
  avgDelay: number
  isCurrentWeek: boolean
}

interface IntersectionIssue {
  rank: number
  name: string
  avgDelay4wk: number
  currentDelay: number
  delta: number
}

interface CorridorIssue {
  rank: number
  name: string
  travelTimeIndex: number
  worsened: number
}

// Mock data for Austin TX

const metrics = {
  intersections: 1064,
  approaches: 3547,
  movements: 8851,
  corridors: 334,
};

const controlDelayData: ControlDelayDataPoint[] = [
  { week: 'Jan 20', avgDelay: 42.3, isCurrentWeek: false },
  { week: 'Jan 27', avgDelay: 38.7, isCurrentWeek: false },
  { week: 'Feb 3', avgDelay: 45.1, isCurrentWeek: false },
  { week: 'Feb 10', avgDelay: 41.8, isCurrentWeek: false },
  { week: 'Feb 17', avgDelay: 39.4, isCurrentWeek: false },
  { week: 'Feb 24', avgDelay: 47.2, isCurrentWeek: false },
  { week: 'Mar 3', avgDelay: 43.9, isCurrentWeek: false },
  { week: 'Mar 10', avgDelay: 44.6, isCurrentWeek: false },
  { week: 'Mar 16', avgDelay: 51.3, isCurrentWeek: true },
];

const intersectionIssues: IntersectionIssue[] = [
  {
    rank: 1,
    name: 'I-35 & Ben White Blvd',
    avgDelay4wk: 82.4,
    currentDelay: 104.7,
    delta: 22.3,
  },
  {
    rank: 2,
    name: 'US-183 & Airport Blvd',
    avgDelay4wk: 71.2,
    currentDelay: 89.5,
    delta: 18.3,
  },
  {
    rank: 3,
    name: 'MoPac & Parmer Ln',
    avgDelay4wk: 63.8,
    currentDelay: 79.1,
    delta: 15.3,
  },
  {
    rank: 4,
    name: 'Lamar Blvd & 38th St',
    avgDelay4wk: 58.6,
    currentDelay: 64.2,
    delta: 5.6,
  },
  {
    rank: 5,
    name: 'Congress Ave & Riverside Dr',
    avgDelay4wk: 54.3,
    currentDelay: 61.8,
    delta: 7.5,
  },
];

const worsenedCorridors: CorridorIssue[] = [
  {
    rank: 1,
    name: 'Lamar Blvd (Rundberg → Slaughter)',
    travelTimeIndex: 2.84,
    worsened: 18.2,
  },
  {
    rank: 2,
    name: 'Airport Blvd (US-183 → MLK)',
    travelTimeIndex: 2.51,
    worsened: 14.7,
  },
  {
    rank: 3,
    name: 'Congress Ave (Downtown Core)',
    travelTimeIndex: 2.37,
    worsened: 11.3,
  },
];

const ttiCorridors: CorridorIssue[] = [
  {
    rank: 1,
    name: 'I-35 Central (51st → Oltorf)',
    travelTimeIndex: 3.42,
    worsened: 5.1,
  },
  {
    rank: 2,
    name: 'US-290 E (Manor → Airport)',
    travelTimeIndex: 3.18,
    worsened: 3.8,
  },
  {
    rank: 3,
    name: 'MoPac Expwy (Parmer → Ben White)',
    travelTimeIndex: 2.96,
    worsened: 7.2,
  },
];

interface MetricCardProps {
  value: number;
  label: string;
  change?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, change }) => (
  <div style={{
    background: '#112040',
    border: '1px solid #1e3a5f',
    borderRadius: 8,
    padding: '16px 20px',
    flex: 1,
  }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#ffffff', lineHeight: 1, marginBottom: 4 }}>
      {value.toLocaleString()}
    </div>
    <div style={{ fontSize: 12, color: '#8ca0bc', fontWeight: 500 }}>{label}</div>
    {change !== undefined && (
      <div style={{ fontSize: 11, color: change > 0 ? '#ef4444' : '#22c55e', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        {change > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {change > 0 ? '+' : ''}{change}% vs last week
      </div>
    )}
  </div>
);

const DeltaBadge: React.FC<{ delta: number }> = ({ delta }) => {
  if (Math.abs(delta) < 1) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#8ca0bc' }}>
        <Minus size={12} />
        <span>{delta.toFixed(1)}</span>
      </div>
    );
  }
  if (delta > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#ef4444', fontWeight: 600 }}>
        <TrendingUp size={12} />
        <span>+{delta.toFixed(1)}</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#22c55e', fontWeight: 600 }}>
      <TrendingDown size={12} />
      <span>{delta.toFixed(1)}</span>
    </div>
  );
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d1f3c',
        border: '1px solid #1e3a5f',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
      }}>
        <div style={{ color: '#8ca0bc', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#ffffff', fontWeight: 600 }}>
          {payload[0].value.toFixed(1)} sec/veh
        </div>
      </div>
    );
  }
  return null;
};

export const SignalAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intersections' | 'corridors'>('intersections');

  return (
    <div style={{
      flex: 1,
      background: '#0a1628',
      overflowY: 'auto',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Metric cards row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard value={metrics.intersections} label="Intersections" change={2.1} />
        <MetricCard value={metrics.approaches} label="Approaches" />
        <MetricCard value={metrics.movements} label="Movements" />
        <MetricCard value={metrics.corridors} label="Corridors" change={-0.3} />
      </div>

      {/* Chart + summary row */}
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Main chart */}
        <div style={{
          flex: 2,
          background: '#0d1f3c',
          border: '1px solid #1e3a5f',
          borderRadius: 10,
          padding: '18px 20px',
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 3 }}>
              Average Control Delay per Vehicle
            </div>
            <div style={{ fontSize: 11, color: '#4a6080' }}>
              seconds per vehicle — Austin TX signal network (9 weeks)
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={controlDelayData} barCategoryGap="25%">
              <CartesianGrid vertical={false} stroke="#1e3a5f" strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fill: '#8ca0bc', fontSize: 10 }}
                axisLine={{ stroke: '#1e3a5f' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#8ca0bc', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 60]}
                tickCount={7}
                tickFormatter={(v) => `${v}s`}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(30,144,255,0.05)' }}
              />
              <Bar dataKey="avgDelay" radius={[3, 3, 0, 0]}>
                {controlDelayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrentWeek ? '#1e90ff' : '#1e3a5f'}
                    opacity={entry.isCurrentWeek ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1e3a5f' }} />
              <span style={{ fontSize: 10, color: '#4a6080' }}>Previous Weeks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1e90ff' }} />
              <span style={{ fontSize: 10, color: '#4a6080' }}>Current Week</span>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {[
            { label: 'Current Week Avg', value: '51.3s', change: '+6.7s', up: true },
            { label: '4-Week Average', value: '44.1s', change: '+16.3%', up: true },
            { label: 'Best Week (9wk)', value: '38.7s', note: 'Jan 27' },
            { label: 'Worst Week (9wk)', value: '51.3s', note: 'This week' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#0d1f3c',
              border: '1px solid #1e3a5f',
              borderRadius: 8,
              padding: '12px 16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{ fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                {stat.value}
              </div>
              {stat.change && (
                <div style={{ fontSize: 11, color: stat.up ? '#ef4444' : '#22c55e', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {stat.change} vs 4wk avg
                </div>
              )}
              {stat.note && (
                <div style={{ fontSize: 11, color: '#4a6080', marginTop: 3 }}>{stat.note}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e3a5f' }}>
        {(['intersections', 'corridors'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 500,
              color: activeTab === tab ? '#1e90ff' : '#4a6080',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1e90ff' : '2px solid transparent',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s ease',
              marginBottom: -1,
            }}
          >
            {tab === 'intersections' ? 'Intersections' : 'Corridors'}
          </button>
        ))}
      </div>

      {/* Intersections tab */}
      {activeTab === 'intersections' && (
        <div style={{
          background: '#0d1f3c',
          border: '1px solid #1e3a5f',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
              Intersections: Top 5 Control Delay Issues
            </div>
            <div style={{ fontSize: 11, color: '#4a6080', marginTop: 2 }}>
              Ranked by current week control delay — seconds per vehicle
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0a1628' }}>
                {['Rank', 'Intersection', '4wk Avg', 'Current Week', 'Delta'].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '10px 20px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#4a6080',
                      textAlign: col === 'Rank' ? 'center' : col === 'Intersection' ? 'left' : 'right',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderBottom: '1px solid #1e3a5f',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {intersectionIssues.map((issue, i) => (
                <tr
                  key={issue.rank}
                  style={{
                    borderBottom: i < intersectionIssues.length - 1 ? '1px solid #112040' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: i === 0 ? '#1e90ff' : '#1e3a5f',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#ffffff',
                    }}>
                      {issue.rank}
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: '#c8d8e8', fontWeight: 500 }}>
                    {issue.name}
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: '#8ca0bc', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {issue.avgDelay4wk.toFixed(1)}s
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: '#ffffff', fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {issue.currentDelay.toFixed(1)}s
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <DeltaBadge delta={issue.delta} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Corridors tab */}
      {activeTab === 'corridors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Worsened Travel Times */}
          <div style={{
            background: '#0d1f3c',
            border: '1px solid #1e3a5f',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
                  Corridors: Worsened Travel Times
                </div>
                <div style={{ fontSize: 11, color: '#4a6080', marginTop: 2 }}>
                  Top 3 corridors with greatest % travel time increase this week
                </div>
              </div>
              <div style={{
                background: '#ef444420',
                border: '1px solid #ef444440',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#ef4444',
                fontWeight: 600,
              }}>
                Worsened
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0a1628' }}>
                  {['Rank', 'Corridor Name', 'Travel Time Index', '% Worsened'].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '10px 20px',
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#4a6080',
                        textAlign: col === 'Rank' ? 'center' : col === 'Corridor Name' ? 'left' : 'right',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        borderBottom: '1px solid #1e3a5f',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {worsenedCorridors.map((corridor, i) => (
                  <tr
                    key={corridor.rank}
                    style={{ borderBottom: i < worsenedCorridors.length - 1 ? '1px solid #112040' : 'none' }}
                  >
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#ef444430',
                        border: '1px solid #ef444460',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#ef4444',
                      }}>
                        {corridor.rank}
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: '#c8d8e8', fontWeight: 500 }}>
                      {corridor.name}
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: '#fbbf24', fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {corridor.travelTimeIndex.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, color: '#ef4444', fontWeight: 600, fontSize: 12 }}>
                        <TrendingUp size={12} />
                        +{corridor.worsened.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Travel Time Index */}
          <div style={{
            background: '#0d1f3c',
            border: '1px solid #1e3a5f',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
                  Corridors: Top Travel Time Index
                </div>
                <div style={{ fontSize: 11, color: '#4a6080', marginTop: 2 }}>
                  Ratio of peak period travel time to free-flow travel time
                </div>
              </div>
              <div style={{
                background: '#fbbf2420',
                border: '1px solid #fbbf2440',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                color: '#fbbf24',
                fontWeight: 600,
              }}>
                TTI
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0a1628' }}>
                  {['Rank', 'Corridor Name', 'Travel Time Index', '% Change'].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '10px 20px',
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#4a6080',
                        textAlign: col === 'Rank' ? 'center' : col === 'Corridor Name' ? 'left' : 'right',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        borderBottom: '1px solid #1e3a5f',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ttiCorridors.map((corridor, i) => (
                  <tr
                    key={corridor.rank}
                    style={{ borderBottom: i < ttiCorridors.length - 1 ? '1px solid #112040' : 'none' }}
                  >
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#fbbf2420',
                        border: '1px solid #fbbf2440',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#fbbf24',
                      }}>
                        {corridor.rank}
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: '#c8d8e8', fontWeight: 500 }}>
                      {corridor.name}
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 12, color: '#fbbf24', fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {corridor.travelTimeIndex.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, color: '#ef4444', fontWeight: 600, fontSize: 12 }}>
                        <TrendingUp size={12} />
                        +{corridor.worsened.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: 16 }} />
    </div>
  );
};
