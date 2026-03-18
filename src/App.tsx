import { lazy, Suspense } from 'react'
import { NavBar } from './components/layout/NavBar'
import { useStore } from './store'

// Lazy-load each view — their JS (including Leaflet/Recharts) only downloads
// when the user first navigates to that view.
const MissionControlView  = lazy(() => import('./components/mission-control/MissionControlView').then(m => ({ default: m.MissionControlView })))
const SignalAnalyticsView = lazy(() => import('./components/signal-analytics/SignalAnalyticsView').then(m => ({ default: m.SignalAnalyticsView })))
const RoadwayAnalyticsView = lazy(() => import('./components/roadway-analytics/RoadwayAnalyticsView').then(m => ({ default: m.RoadwayAnalyticsView })))
const ForecastingView      = lazy(() => import('./components/forecasting/ForecastingView').then(m => ({ default: m.ForecastingView })))

function ViewFallback() {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a1628',
    }}>
      <div style={{
        width: 32, height: 32, border: '3px solid #1e3a5f',
        borderTop: '3px solid #1a56db', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function App() {
  const activeView = useStore((s) => s.activeView)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0a1628',
      }}
    >
      <NavBar />
      <Suspense fallback={<ViewFallback />}>
        {activeView === 'mission-control'   && <MissionControlView />}
        {activeView === 'signal-analytics'  && <SignalAnalyticsView />}
        {activeView === 'roadway-analytics' && <RoadwayAnalyticsView />}
        {activeView === 'forecasting'        && <ForecastingView />}
      </Suspense>
    </div>
  )
}

export default App
