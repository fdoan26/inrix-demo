import React from 'react'
import { signalData } from '../../data/signalData'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

function KpiRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: '#4a6080' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1a2f4a' }}>{value}</span>
    </div>
  )
}

const sectionDivider: React.CSSProperties = {
  borderTop: '1px solid #c8d0dc',
  margin: '0 -16px',
  padding: '12px 16px 0',
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#6a7f9a',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
}

export function KpiPanel() {
  return (
    <div
      style={{
        width: 280,
        minWidth: 280,
        background: '#dfe5ed',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      className="border-r border-[#c8d0dc]"
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

        {/* Section 1 — Count KPIs */}
        <KpiRow label="Intersections" value={signalData.kpis.intersections.toLocaleString()} />
        <KpiRow label="Approaches" value={signalData.kpis.approaches.toLocaleString()} />
        <KpiRow label="Corridors" value={signalData.kpis.corridors.toLocaleString()} />
        <KpiRow label="Cameras" value={signalData.kpis.cameras.toLocaleString()} />

        {/* Section 2 — Control Delay Metrics */}
        <div style={sectionDivider}>
          {/* Total Control Delay */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Total Control Delay</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#1a2f4a' }}>
                {signalData.controlDelayTotals.total.toLocaleString()}
              </span>
              <span style={{ fontSize: 11, color: '#6a7f9a' }}>hrs</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f44336' }}>
                {signalData.controlDelayTotals.delta}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#6a7f9a' }}>
              4wk avg: {signalData.controlDelayTotals.fourWeekAvg.toLocaleString()} hrs
            </div>
          </div>

          {/* Avg Control Delay / Vehicle */}
          <div>
            <div style={labelStyle}>Avg Control Delay / Vehicle</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#1a2f4a' }}>
                {signalData.avgControlDelayPerVehicle.total}
              </span>
              <span style={{ fontSize: 11, color: '#6a7f9a' }}>sec</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f44336' }}>
                {signalData.avgControlDelayPerVehicle.delta}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#6a7f9a' }}>
              4wk avg: {signalData.avgControlDelayPerVehicle.fourWeekAvg} sec
            </div>
          </div>
        </div>

        {/* Section 3 — Bar Chart */}
        <div style={sectionDivider}>
          <div style={labelStyle}>Avg Control Delay / Vehicle</div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={signalData.weeklyChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 9, fill: '#6a7f9a' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.slice(0, 5)}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#6a7f9a' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Bar dataKey="value" fill="#1a6eb5" radius={[2, 2, 0, 0]} />
              <Tooltip
                contentStyle={{ background: '#dfe5ed', border: '1px solid #c8d0dc', borderRadius: 4, fontSize: 11 }}
                labelStyle={{ color: '#2a3f5f' }}
                itemStyle={{ color: '#1a6eb5' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Section 4 — LOS Grades */}
        <div style={sectionDivider}>
          <div style={labelStyle}>Level of Service</div>
          {signalData.losByGrade.map(({ grade, count, color }) => (
            <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#2a3f5f', width: 16 }}>{grade}</span>
              <div style={{ flex: 1, height: 4, background: '#c8d0dc', borderRadius: 2 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(count / signalData.kpis.intersections) * 100}%`,
                    background: color,
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: '#4a6080', width: 28, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
