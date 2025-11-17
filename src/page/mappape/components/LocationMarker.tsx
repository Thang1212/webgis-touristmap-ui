// import { useState, useEffect } from "react";
// import { Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import { useRoutingStore } from "@/store/routingstore";

// interface LocationMarkerProps {
//   autoSetOrigin?: boolean; // Tự động set làm điểm xuất phát
//   showMarker?: boolean; // Hiển thị marker trên map
// }

// const LocationMarker: React.FC<LocationMarkerProps> = ({ 
//   autoSetOrigin = false,
//   showMarker = true 
// }) => {
//   const [position, setPosition] = useState<[number, number] | null>(null);
//   const [accuracy, setAccuracy] = useState<number | null>(null);
//   const [usingGPS, setUsingGPS] = useState(false)
//   const map = useMap();
//   const { setOrigin, origin, useGPS } = useRoutingStore();

//   useEffect(() => {
//     const onLocationFound = (e: L.LocationEvent) => {
//       const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
//       setPosition(newPosition);
//       setAccuracy(e.accuracy);
//       if (!useGPS) {
//         map.stopLocate();
//         return;
//       }
//       if (useGPS) {
//         if (origin.coordinates[0] === 0 && origin.coordinates[1] === 0) {
//           setOrigin([e.latlng.lng, e.latlng.lat]);
//         }
//       }
  

//       // Tự động set làm điểm xuất phát nếu được bật
//       if (useGPS && origin.coordinates[0] === 0 && origin.coordinates[1] === 0) {
//         setOrigin([e.latlng.lng, e.latlng.lat]);
//       }
      
//     };

//     const onLocationError = (e: L.ErrorEvent) => {
//       console.log("Could not get user location:", e.message);
//     };

//    // ⭐ Bật GPS tracking
//     map
//       .locate({ 
//         watch: true, 
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 30000
//       })
//       .on("locationfound", onLocationFound)
//       .on("locationerror", onLocationError);

//     // ⭐ Cleanup: tắt GPS khi unmount hoặc useGPS thay đổi
//     return () => {
//       map.off("locationfound", onLocationFound);
//       map.off("locationerror", onLocationError);
//       map.stopLocate();
//     };
//   }, [map, autoSetOrigin, setOrigin, origin.coordinates, useGPS]);

//   const icon = L.divIcon({
//     className: "current-location-marker",
//     html: `
//       <div style="position: relative; width: 24px; height: 24px;">
//         <div style="
//           position: absolute;
//           width: 24px;
//           height: 24px;
//           background: rgba(66,133,244,0.3);
//           border-radius: 50%;
//           animation: pulse 2s infinite;">
//         </div>
//         <div style="
//           position: absolute;
//           top: 50%; left: 50%;
//           transform: translate(-50%, -50%);
//           width: 14px; height: 14px;
//           background: #4285F4;
//           border: 3px solid white;
//           border-radius: 50%;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
//         </div>
//       </div>
//       <style>
//         @keyframes pulse {
//           0% { transform: scale(1); opacity: 1; }
//           100% { transform: scale(2.5); opacity: 0; }
//         }
//       </style>
//     `,
//     iconSize: [24, 24],
//     iconAnchor: [12, 12],
//   });

//   // Accuracy circle (optional)
//   const accuracyCircle = accuracy && position ? (
//     <circle
//       center={position}
//       radius={accuracy}
//       pathOptions={{
//         color: '#4285F4',
//         fillColor: '#4285F4',
//         fillOpacity: 0.1,
//         weight: 1
//       }}
//     />
//   ) : null;

//   return showMarker && position ? (
//     <>
//       {accuracyCircle}
//       <Marker position={position} icon={icon}>
//         <Popup>
//           <div className="text-center p-2">
//             <p className="font-semibold text-blue-600">📍 Vị trí của bạn</p>
//             <p className="text-xs text-gray-500 mt-1">
//               {position[0].toFixed(6)}, {position[1].toFixed(6)}
//             </p>
//             {accuracy && (
//               <p className="text-xs text-gray-400 mt-1">
//                 Độ chính xác: ±{accuracy.toFixed(0)}m
//               </p>
//             )}
//           </div>
//         </Popup>
//       </Marker>
//     </>
//   ) : null;
// };

// export default LocationMarker;
import { useState, useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useRoutingStore } from "@/store/routingstore";

interface LocationMarkerProps {
  showMarker?: boolean;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ 
  showMarker = true 
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const map = useMap();
  const { setOrigin, origin, useGPS } = useRoutingStore();

  // ⭐ Effect 1: Monitor permission state
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        
        result.onchange = () => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        };
      });
    }
  }, []);

  // ⭐ Effect 2: Handle GPS tracking based on useGPS
  useEffect(() => {
    // Nếu GPS toggle OFF → Stop tracking và KHÔNG xin quyền
    if (!useGPS) {
      map.stopLocate();
      //console.log('🔴 GPS disabled - not requesting permission');
      return;
    }

    // Nếu GPS toggle ON → XIN QUYỀN và start tracking
  //  console.log('🟢 GPS enabled - requesting permission...');

    const onLocationFound = (e: L.LocationEvent) => {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      setAccuracy(e.accuracy);

     // console.log('✅ Location found:', newPosition);

      // Auto set origin nếu chưa có
      if (origin.coordinates[0] === 0 && origin.coordinates[1] === 0) {
        setOrigin([e.latlng.lng, e.latlng.lat]);
      }
    };

    const onLocationError = (e: L.ErrorEvent) => {
      console.error('❌ GPS Error:', e.message);
      
      // Update permission state based on error
      if (e.code === 1) { // PERMISSION_DENIED
        setPermissionState('denied');
      }
      
      setPosition(null);
      setAccuracy(null);
    };

    // ⭐ Gọi map.locate() → Browser sẽ XIN QUYỀN (nếu chưa có)
    map
      .locate({ 
        watch: true, 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      })
      .on("locationfound", onLocationFound)
      .on("locationerror", onLocationError);

   // console.log('📡 GPS tracking started, waiting for browser permission...');

    // Cleanup
    return () => {
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
      map.stopLocate();
     // console.log('🛑 GPS tracking stopped');
    };
  }, [map, setOrigin, origin.coordinates, useGPS]);

  const getMarkerColor = () => {
    if (permissionState === 'denied') return '#ef4444'; // Red
    if (!useGPS) return '#9ca3af'; // Gray
    return '#4285F4'; // Blue
  };

  const icon = L.divIcon({
    className: "current-location-marker",
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          background: ${useGPS && permissionState === 'granted' ? 'rgba(66,133,244,0.3)' : 'rgba(156,163,175,0.3)'};
          border-radius: 50%;
          animation: ${useGPS && permissionState === 'granted' ? 'pulse 2s infinite' : 'none'};">
        </div>
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 14px; height: 14px;
          background: ${getMarkerColor()};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        </div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const getPopupMessage = () => {
    if (permissionState === 'denied') {
      return '🚫 Quyền truy cập GPS bị từ chối';
    }
    if (!useGPS) {
      return '⚪ GPS đã tắt';
    }
    if (permissionState === 'granted') {
      return '📍 Vị trí của bạn';
    }
    return '⏳ Đang xin quyền GPS...';
  };

  return showMarker && position ? (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="text-center p-2">
          <p className={`font-semibold ${
            permissionState === 'denied' ? 'text-red-600' :
            !useGPS ? 'text-gray-600' :
            'text-blue-600'
          }`}>
            {getPopupMessage()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
          {accuracy && (
            <p className="text-xs text-gray-400 mt-1">
              Độ chính xác: ±{accuracy.toFixed(0)}m
            </p>
          )}
          {permissionState === 'denied' && (
            <p className="text-xs text-red-600 mt-2 font-medium">
              Vui lòng bật quyền vị trí trong trình duyệt
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  ) : null;
};

export default LocationMarker;