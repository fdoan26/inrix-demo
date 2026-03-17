import L from 'leaflet'
import { Marker } from 'react-leaflet'
import { cameras } from '../../../data/cameras'
import { createCameraIcon } from '../../../lib/cameraIcon'
import { useStore } from '../../../store'

export function CameraLayer() {
  const showCameras = useStore((s) => s.showCameras)
  const setSelectedItem = useStore((s) => s.setSelectedItem)

  if (!showCameras) return null

  return (
    <>
      {cameras.map((camera) => (
        <Marker
          key={camera.id}
          position={camera.position}
          icon={createCameraIcon(camera.clusterCount)}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e)
              setSelectedItem({ type: 'camera', id: camera.id })
            },
          }}
        />
      ))}
    </>
  )
}
