import { NavBar } from './components/layout/NavBar'
import { MissionControlView } from './components/mission-control/MissionControlView'
import { SignalAnalyticsView } from './components/signal-analytics/SignalAnalyticsView'
import { useStore } from './store'

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
      {activeView === 'mission-control' ? (
        <MissionControlView />
      ) : (
        <SignalAnalyticsView />
      )}
    </div>
  )
}

export default App
