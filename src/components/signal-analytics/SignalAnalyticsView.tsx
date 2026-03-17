import { KpiPanel } from './KpiPanel'
import { SignalMap } from './SignalMap'

export function SignalAnalyticsView() {
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#e8ecf1' }}>
      <KpiPanel />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <SignalMap />
      </div>
    </div>
  )
}
