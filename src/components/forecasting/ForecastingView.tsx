import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { Download, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import {
  CORRIDORS, FORECAST_META, congestionToLOS, LOS_COLOR, formatHour,
} from '../../data/forecastData'

// ─── Types ────────────────────────────────────────────────────────────────────

type DayKey = 'today' | 'tomorrow' | 'plusTwo'

const DAY_TABS: { key: DayKey; label: string }[] = [
  { key: 'today',    label: 'Today'    },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'plusTwo',  label: '+2 Days'  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCongestionColor(pct: number): string {
  if (pct < 25) return '#4caf50'
  if (pct < 50) return '#8bc34a'
  if (pct < 65) return '#ffeb3b'
  if (pct < 80) return '#ff9800'
  return '#f44336'
}

// ─── Corridor row ─────────────────────────────────────────────────────────────

function CorridorRow({
  corridor, active, day, onClick,
}: {
  corridor: typeof CORRIDORS[0]
  active: boolean
  day: DayKey
  onClick: () => void
}) {
  const hourlyData = corridor.data[day]
  const peakPct = Math.max(...hourlyData)
  const peakIdx = hourlyData.indexOf(peakPct)
  const los = congestionToLOS(peakPct)

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
        padding: '7px 16px',
        background: active ? 'rgba(26,86,219,0.06)' : 'transparent',
        borderLeft: active ? '3px solid #1a56db' : '3px solid transparent',
        transition: 'background 0.1s',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: LOS_COLOR[los],
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: '#1a2744', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {corridor.name}
        </div>
        <div style={{ fontSize: 10, color: '#8a9ab8' }}>
          Peak: {formatHour(peakIdx).replace('am', ' AM').replace('pm', ' PM')} · {peakPct}%
        </div>
      </div>
    </button>
  )
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function ForecastTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value as number
  return (
    <div style={{
      background: '#1a2744', border: '1px solid #2a4a6f', borderRadius: 6,
      padding: '6px 10px', fontSize: 11, color: '#e0e8f4',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div>
        Congestion: <span style={{ color: getCongestionColor(val), fontWeight: 700 }}>{val}%</span>
        &nbsp;&nbsp;LOS <span style={{ fontWeight: 700 }}>{congestionToLOS(val)}</span>
      </div>
    </div>
  )
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function ForecastingView() {
  const [selectedId, setSelectedId] = useState(CORRIDORS[0].id)
  const [day, setDay] = useState<DayKey>('today')

  const corridor = CORRIDORS.find((c) => c.id === selectedId) ?? CORRIDORS[0]
  const hourlyData = corridor.data[day]
  const peakPct = Math.max(...hourlyData)
  const worstCorridor = CORRIDORS.find((c) => c.id === FORECAST_META.worstCorridorId)

  const chartData = hourlyData.map((congestion, i) => ({
    label: formatHour(i),
    congestion,
  }))

  const xTicks = [0, 3, 6, 9, 12, 15, 18, 21].map(formatHour)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f9fc' }}>

      {/* ── Top tab bar ─────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #d0d7e2',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        height: 44, minHeight: 44, flexShrink: 0, gap: 24,
      }}>
        {DAY_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setDay(key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: day === key ? 600 : 400,
              color: day === key ? '#1a56db' : '#5a6a88',
              borderBottom: day === key ? '2px solid #1a56db' : '2px solid transparent',
              padding: '0 2px', height: 44, whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#1a56db', color: '#fff', border: 'none', borderRadius: 4,
          padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <Download size={13} />
          Data Downloader
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left panel: KPIs + corridor list ──────────────────────────── */}
        <div style={{
          width: 256, minWidth: 256,
          background: '#fff',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #d0d7e2',
          overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #d0d7e2' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Forecast Overview
            </div>
            <div style={{ fontSize: 10, color: '#8a9ab8', marginTop: 2 }}>
              24-hr congestion outlook · LA Metro
            </div>
          </div>

          {/* KPI metrics */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #d0d7e2' }}>
            {[
              { icon: <CheckCircle size={13} />, label: 'Model Accuracy',    value: `${FORECAST_META.accuracy}%`,                                                              sub: '30-day hindcast' },
              { icon: <Activity size={13} />,    label: 'System Peak Today', value: `${FORECAST_META.systemPeakHour} · ${FORECAST_META.systemPeakCongestion}%`,               sub: `LOS ${congestionToLOS(FORECAST_META.systemPeakCongestion)}` },
              { icon: <AlertTriangle size={13} />, label: 'Worst Corridor',  value: worstCorridor?.name ?? '—',                                                                sub: `Peak: ${worstCorridor?.peakHour} · ${worstCorridor?.peakCongestion}%` },
              { icon: <TrendingUp size={13} />,  label: 'Confidence',        value: `${FORECAST_META.confidenceLabel} (${FORECAST_META.confidenceScore})`,                    sub: 'XGBoost + LSTM ensemble' },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <div style={{ marginTop: 2, color: '#1a56db', flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 10, color: '#8a9ab8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2744', lineHeight: 1.2 }}>{value}</div>
                  {sub && <div style={{ fontSize: 10, color: '#8a9ab8', marginTop: 1 }}>{sub}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Corridor list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '6px 16px 4px', fontSize: 10, fontWeight: 600, color: '#8a9ab8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Corridors
            </div>
            {CORRIDORS.map((c) => (
              <CorridorRow
                key={c.id}
                corridor={c}
                active={c.id === selectedId}
                day={day}
                onClick={() => setSelectedId(c.id)}
              />
            ))}
            <div style={{ height: 8 }} />
          </div>
        </div>

        {/* ── Right content ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '16px 20px', gap: 12, minWidth: 0 }}>

          {/* Content header */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2744' }}>
              {corridor.name}
              <span style={{ fontSize: 12, fontWeight: 400, color: '#8a9ab8', marginLeft: 8 }}>
                {corridor.subtitle}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#8a9ab8', marginTop: 2 }}>
              Predicted congestion · next 24 hours
            </div>
          </div>

          {/* Peak summary chips */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Peak Congestion', value: `${peakPct}%`, color: getCongestionColor(peakPct) },
              { label: 'Peak Hour',       value: formatHour(hourlyData.indexOf(peakPct)).replace('am', ' AM').replace('pm', ' PM') },
              { label: 'LOS at Peak',     value: congestionToLOS(peakPct), color: LOS_COLOR[congestionToLOS(peakPct)] },
              { label: 'Avg Congestion',  value: `${Math.round(hourlyData.reduce((a, b) => a + b, 0) / 24)}%` },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: '#fff', borderRadius: 4, padding: '7px 14px',
                border: '1px solid #d0d7e2',
              }}>
                <div style={{ fontSize: 10, color: '#8a9ab8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: color ?? '#1a2744', marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Forecast chart */}
          <div style={{
            flex: 1, background: '#fff', borderRadius: 4, border: '1px solid #d0d7e2',
            padding: '16px 16px 12px',
            display: 'flex', flexDirection: 'column',
            minHeight: 260,
          }}>
            <div style={{ fontSize: 11, color: '#5a6a88', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Hourly Congestion Forecast
            </div>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%"   stopColor="#4caf50" stopOpacity={0.45} />
                      <stop offset="30%"  stopColor="#8bc34a" stopOpacity={0.55} />
                      <stop offset="55%"  stopColor="#ffeb3b" stopOpacity={0.62} />
                      <stop offset="75%"  stopColor="#ff9800" stopOpacity={0.72} />
                      <stop offset="100%" stopColor="#f44336" stopOpacity={0.80} />
                    </linearGradient>
                    <linearGradient id="forecastStroke" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%"   stopColor="#4caf50" />
                      <stop offset="55%"  stopColor="#ff9800" />
                      <stop offset="100%" stopColor="#f44336" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#edf0f7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    ticks={xTicks}
                    tick={{ fontSize: 10, fill: '#8a9ab8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#d0d7e2' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 10, fill: '#8a9ab8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ForecastTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="congestion"
                    stroke="url(#forecastStroke)"
                    strokeWidth={2.5}
                    fill="url(#forecastGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#1a2744', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Congestion legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, paddingTop: 8, borderTop: '1px solid #edf0f7' }}>
              <span style={{ fontSize: 10, color: '#8a9ab8', fontWeight: 600 }}>CONGESTION</span>
              {[
                { label: 'Free flow', color: '#4caf50' },
                { label: 'Light',     color: '#8bc34a' },
                { label: 'Moderate',  color: '#ffeb3b' },
                { label: 'Heavy',     color: '#ff9800' },
                { label: 'Severe',    color: '#f44336' },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 10, color: '#5a6a88' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
