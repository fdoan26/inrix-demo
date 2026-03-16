import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { MissionControl } from './components/modules/MissionControl'
import { SignalAnalytics } from './components/modules/SignalAnalytics'
import { useAppStore } from './store/useAppStore'

function App() {
  const { activeView } = useAppStore()

  const renderView = () => {
    switch (activeView) {
      case 'mission-control':
        return <MissionControl />
      case 'signal-analytics':
        return <SignalAnalytics />
      default:
        return <MissionControl />
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      background: '#0a1628',
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        {renderView()}
      </div>
    </div>
  )
}

export default App
