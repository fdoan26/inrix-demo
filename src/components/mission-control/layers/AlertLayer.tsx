import { memo } from 'react'
import { Marker } from 'react-leaflet'
import { alerts } from '../../../data/alerts'
import { createAlertIcon } from '../../../lib/alertIcons'
import { useStore } from '../../../store'

export const AlertLayer = memo(function AlertLayer() {
  const showAlerts = useStore((s) => s.showAlerts)
  const setSelectedItem = useStore((s) => s.setSelectedItem)

  if (!showAlerts) return null

  return (
    <>
      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={alert.position}
          icon={createAlertIcon(alert.type)}
          eventHandlers={{
            click: () => setSelectedItem({ type: 'alert', id: alert.id }),
          }}
        />
      ))}
    </>
  )
})
