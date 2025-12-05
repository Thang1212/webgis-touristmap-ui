// import { useEffect, useMemo } from "react";
// import { useMapEvents, Marker, Popup, useMap } from "react-leaflet";
// import { useRoutingStore } from "@/store/routingstore";
// import L from "leaflet";

// // Predefined Icons
// const icons = {
//   origin: new L.Icon({
//     iconUrl:
//       "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   }),

//   destination: new L.Icon({
//     iconUrl:
//       "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   }),
// };

// // Reusable marker component
// const MarkerComponent = ({
//   type,
//   coordinates,
// }: {
//   type: "origin" | "destination";
//   coordinates: number[];
// }) => {
//   const [lng, lat] = coordinates;

//   return (
//     <Marker
//       position={[lat, lng]}
//       icon={icons[type]}
//       zIndexOffset={1000}
//     >
//       <Popup>
//         <div className="text-center">
//           <div
//             className={`font-semibold ${
//               type === "origin" ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {type === "origin" ? "📍 Điểm xuất phát" : "🎯 Điểm đến"}
//           </div>
//           <div className="text-xs text-gray-600 mt-1">
//             {lat.toFixed(6)}, {lng.toFixed(6)}
//           </div>
//         </div>
//       </Popup>
//     </Marker>
//   );
// };

// const MapClickHandler = () => {
//   const map = useMap();

//   const {
//     pickMode,
//     origin,
//     destination,
//     setOrigin,
//     setDestination,
//     setPickMode,
//   } = useRoutingStore();

//   // Shared validator
//   const isValid = (coords?: number[]) =>
//     coords && coords.length === 2 && (coords[0] !== 0 || coords[1] !== 0);

//   // Handle map click
//   useMapEvents({
//     click: (e) => {
//       if (pickMode === "none") return;

//       const { lat, lng } = e.latlng;

//       if (pickMode === "origin") {
//         setOrigin([lng, lat]);
//         console.log("✅ Đã chọn điểm xuất phát:", [lng, lat]);
//       } else if (pickMode === "destination") {
//         setDestination([lng, lat]);
//         console.log("✅ Đã chọn điểm đến:", [lng, lat]);
//       }

//       setPickMode("none");
//     },
//   });

//   // Cursor & interaction toggle when picking mode
//   useEffect(() => {
//     if (pickMode === "none") return;

//     const container = map.getContainer();
//     const originalCursor = container.style.cursor;

//     container.style.cursor = "crosshair";
//     container.classList.add("picking-location");

//     map.doubleClickZoom.disable();
//     map.touchZoom.disable();

//     return () => {
//       container.style.cursor = originalCursor;
//       container.classList.remove("picking-location");

//       map.doubleClickZoom.enable();
//       map.touchZoom.enable();
//     };
//   }, [pickMode, map]);

//   return (
//     <>
//       {origin?.coordinates && isValid(origin.coordinates) && (
//         <MarkerComponent
//           type="origin"
//           coordinates={origin.coordinates}
//         />
//       )}

//       {destination?.coordinates && isValid(destination.coordinates) && (
//         <MarkerComponent
//           type="destination"
//           coordinates={destination.coordinates}
//         />
//       )}
//     </>
//   );
// };

// export default MapClickHandler;

import { useEffect } from 'react';
import { useMapEvents, useMap, Marker, Popup } from 'react-leaflet';
import { useRoutingStore } from '@/store/routingstore';
import L from 'leaflet';
import { X } from 'lucide-react';

// Custom icons for origin and destination
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapClickHandler = () => {
  const [showOriginMarker, setShowOriginMarker] = useState(true);
  const [showDestinationMarker, setShowDestinationMarker] = useState(true);
  const map = useMap();
  const { 
    pickMode, 
    origin, 
    destination, 
    setOrigin, 
    setDestination, 
    setPickMode,
    clearOrigin,
    clearDestination
  } = useRoutingStore();

  // Handle map clicks
  useMapEvents({
    click: (e) => {
      if (pickMode === 'none') return;

      const { lat, lng } = e.latlng;
      
      if (pickMode === 'origin') {
        setOrigin([lng, lat]);
        setPickMode('none');
        
        console.log('✅ Đã chọn điểm xuất phát:', [lng, lat]);
      } else if (pickMode === 'destination') {
        setDestination([lng, lat]);
        setPickMode('none');
        
        console.log('✅ Đã chọn điểm đến:', [lng, lat]);
      }
    }
  });

  // Change cursor style and manage map interactions when in pick mode
  useEffect(() => {
    const container = map.getContainer();
    
    if (pickMode !== 'none') {
      const originalCursor = container.style.cursor;
      
      container.style.cursor = 'crosshair';
      container.classList.add('picking-location');
      
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      
      return () => {
        container.style.cursor = originalCursor;
        container.classList.remove('picking-location');
        
        map.doubleClickZoom.enable();
        map.touchZoom.enable();
      };
    }
  }, [pickMode, map]);

  // Helper function to check if coordinates are valid (not [0, 0])
  const isValidCoordinates = (coords: number[] | undefined) => {
    return coords && 
           Array.isArray(coords) && 
           coords.length === 2 && 
           (coords[0] !== 0 || coords[1] !== 0);
  };

  // Handle origin marker removal
  const handleRemoveOrigin = (e: L.LeafletMouseEvent) => {
    e.originalEvent.stopPropagation();
    clearOrigin();
    console.log('🗑️ Đã xóa điểm xuất phát');
  };

  // Handle destination marker removal
  const handleRemoveDestination = (e: L.LeafletMouseEvent) => {
    e.originalEvent.stopPropagation();
    clearDestination();
    console.log('🗑️ Đã xóa điểm đến');
  };

  return (
    <>
      {origin && isValidCoordinates(origin.coordinates) && (
        <Marker 
          position={[origin.coordinates[1], origin.coordinates[0]]}
          icon={originIcon}
          zIndexOffset={1000}
          eventHandlers={{
            click: handleRemoveOrigin
          }}
        >
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-green-600 mb-2">📍 Điểm xuất phát</div>
              <div className="text-xs text-gray-600 mb-3">
                {origin.coordinates[1].toFixed(6)}, {origin.coordinates[0].toFixed(6)}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearOrigin();
                }}
                className="w-full px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded flex items-center justify-center gap-1 transition-colors"
              >
                <X size={14} />
                Xóa điểm xuất phát
              </button>
            </div>
          </Popup>
        </Marker>
      )}
      {destination && isValidCoordinates(destination.coordinates) && showDestinationMarker && (
  <Marker 
    position={[destination.coordinates[1], destination.coordinates[0]]}
    icon={destinationIcon}
    zIndexOffset={1000}
  >
    <Popup>
      <div className="text-center">
        <div className="font-semibold text-red-600 mb-2">
          🎯 Điểm đến
        </div>
        <div className="text-xs text-gray-600 mb-3">
          {destination.coordinates[1].toFixed(6)}, {destination.coordinates[0].toFixed(6)}
        </div>
        
        {/* ⭐ Single button - Chỉ ẩn marker */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearRoute()
            setShowDestinationMarker(false);
          }}
          className="w-full px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded flex items-center justify-center gap-1 transition-colors"
        >
          <X size={14} />
          Xóa địa điểm
        </button>
      </div>
    </Popup>
  </Marker>
)}
    </>
  );
};


export default MapClickHandler;
