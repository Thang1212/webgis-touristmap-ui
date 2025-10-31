import { useEffect } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import { useRoutingStore } from '@/store/routingstore';
import L from 'leaflet';

const MapClickHandler = () => {
  const map = useMap();
  const { pickMode, setOrigin, setDestination, setPickMode } = useRoutingStore();

  // Handle map clicks
  useMapEvents({
    click: (e) => {
      if (pickMode === 'none') return;

      const { lat, lng } = e.latlng;
      
      if (pickMode === 'origin') {
        setOrigin([lng, lat]); // Mapbox format [lng, lat]
        setPickMode('none');
        
        // Optional: Show toast notification
        console.log('✅ Đã chọn điểm xuất phát:', [lng, lat]);
      } else if (pickMode === 'destination') {
        setDestination([lng, lat]);
        setPickMode('none');
        
        console.log('✅ Đã chọn điểm đến:', [lng, lat]);
      }
    }
  });

  // Change cursor style when in pick mode
  useEffect(() => {
    const container = map.getContainer();
    
    if (pickMode !== 'none') {
      container.style.cursor = 'crosshair';
      container.classList.add('picking-location');
      
      // Optional: Disable other map interactions
      //map.dragging.disable();
      //map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
    } else {
      container.style.cursor = '';
      container.classList.remove('picking-location');
      
      // Re-enable interactions
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    }

    return () => {
      container.style.cursor = '';
      container.classList.remove('picking-location');
    };
  }, [pickMode, map]);

  return null;
};

export default MapClickHandler;