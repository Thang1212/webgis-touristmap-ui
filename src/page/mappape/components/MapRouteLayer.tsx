// MapRouteLayer.tsx
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { useRoutingStore } from '@/store/routingstore'

const MapRouteLayer = () => {
  const map = useMap()
  const { direction, origin, destination } = useRoutingStore()
  const routeLayerRef = useRef<L.GeoJSON | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    // Xóa route và markers cũ
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }
    
    markersRef.current.forEach(marker => map.removeLayer(marker))
    markersRef.current = []

    if (!direction || !direction.geometry) return

    // Vẽ route line
    routeLayerRef.current = L.geoJSON(direction.geometry, {
      style: {
        color: '#FF00FF',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round'
      }
    }).addTo(map)

    // Tạo custom icons
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const endIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    // Thêm marker điểm xuất phát
    if (origin.coordinates[0] !== 0 && origin.coordinates[1] !== 0) {
      const startMarker = L.marker([origin.coordinates[1], origin.coordinates[0]], {
        icon: startIcon
      }).addTo(map)
      
      startMarker.bindPopup('<b>Điểm xuất phát</b>')
      markersRef.current.push(startMarker)
    }

    // Thêm marker điểm đến
    if (destination.coordinates[0] !== 0 && destination.coordinates[1] !== 0) {
      const endMarker = L.marker([destination.coordinates[1], destination.coordinates[0]], {
        icon: endIcon
      }).addTo(map)
      
      endMarker.bindPopup('<b>Điểm đến</b>')
      markersRef.current.push(endMarker)
    }

    // Fit bounds để hiển thị toàn bộ route
    if (routeLayerRef.current) {
      map.fitBounds(routeLayerRef.current.getBounds(), { 
        padding: [50, 50],
        maxZoom: 15
      })
    }

    // Cleanup
    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current)
      }
      markersRef.current.forEach(marker => map.removeLayer(marker))
    }
  }, [direction, origin, destination, map])

  return null
}

export default MapRouteLayer