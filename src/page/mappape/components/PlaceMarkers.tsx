// import React, { useMemo } from "react";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import PlaceMarker from "./PlaceMarker";
// import type L from "leaflet";

// interface PlaceMarkersProps {
//   places: any[];
//   selectedPlaceId: number | undefined;
//   onSelectPlace: (place: any) => void;
//   onMarkerRef: (placeId: number, ref: L.Marker | null) => void;
//   visible: boolean;
// }

// export const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
//   places,
//   selectedPlaceId,
//   onSelectPlace,
//   onMarkerRef,
//   visible,
// }) => {
//   // ⭐ CHIA PLACES THÀNH 2 NHÓM
//   const { priorityPlaces, regularPlaces } = useMemo(() => {
//     const priority: any[] = [];
//     const regular: any[] = [];
    
//     places.forEach(place => {
//       const userRatings = place.userRatingsTotal || 0;
//       const rating = place.rating || 0;
//       const score = userRatings * rating;
      
//       // ⭐ ĐIỀU KIỆN ĐỂ LÀ PRIORITY (Có thể điều chỉnh)
//       // Option 1: Dựa trên score
//       if (score >= 10000) {  // Ví dụ: >= 100 điểm
//         priority.push(place);
//       } else {
//         regular.push(place);
//       }
      
//       // Option 2: Dựa trên số lượng reviews
//       // if (userRatings >= 50) {
//       //   priority.push(place);
//       // } else {
//       //   regular.push(place);
//       // }
      
//       // Option 3: Kết hợp cả rating và reviews
//       // if (userRatings >= 20 && rating >= 4.0) {
//       //   priority.push(place);
//       // } else {
//       //   regular.push(place);
//       // }
//     });
    
//     return { priorityPlaces: priority, regularPlaces: regular };
//   }, [places]);

//   if (!visible) return null;

//   return (
//     <>
//       {/* ⭐ NHÓM 1: Markers thường - ĐƯỢC CLUSTER */}
//       <MarkerClusterGroup  //giải thích
//          chunkedLoading={true}           // Load theo batch, tránh freeze
//   maxClusterRadius={100}          // 100px radius để gom markers
//   disableClusteringAtZoom={15}    // Tách cluster ở zoom 18+
//   spiderfyOnMaxZoom={true}        // Tách hình spider khi max zoom
//   removeOutsideVisibleBounds={true} // Chỉ render trong viewport
//       >
//         {regularPlaces.map((place) => (
//           <PlaceMarker
//             key={place.id}
//             place={place}
//             isSelected={selectedPlaceId === place.id}
//             onSelect={onSelectPlace}
//             markerRef={(ref) => onMarkerRef(place.id, ref)}
//             zIndexOffset={1000}
//             isPriority={false}
//           />
//         ))}
//       </MarkerClusterGroup>
      

//       {priorityPlaces.map((place) => (
//         <PlaceMarker
//           key={`priority-${place.id}`}
//           place={place}
//           isSelected={selectedPlaceId === place.id}
//           onSelect={onSelectPlace}
//           markerRef={(ref) => onMarkerRef(place.id, ref)}
//           zIndexOffset={10000} // Z-index cao hơn nhiều
//           isPriority={true}
//         />
//       ))}
//     </>
//   );
// };
import React, { useMemo, useCallback } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import PlaceMarker from "./PlaceMarker";
import type L from "leaflet";
import type { Place } from "../../../store/mapstore";

interface PlaceMarkersProps {
  places: Place[];
  selectedPlaceId: number | undefined;
  onSelectPlace: (place: Place) => void;
  onMarkerRef: (placeId: number, ref: L.Marker | null) => void;
  visible: boolean;
}

/**
 * 🚀 PERFORMANCE OPTIMIZATIONS:
 * 1. Aggressive limits on priority places
 * 2. Higher clustering radius
 * 3. Remove outside bounds
 * 4. Memoize callbacks
 * 5. Simplify scoring algorithm
 */

export const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onMarkerRef,
  visible,
}) => {
  /**
   * ⚡ OPTIMIZED: Simpler algorithm + strict limits
   */
  const { priorityPlaces, regularPlaces } = useMemo(() => {
    // 🔥 AGGRESSIVE LIMIT: Max 20 priority places
    const MAX_PRIORITY = 20;
    
    const priority: Place[] = [];
    const regular: Place[] = [];
    
    // Sort by simple score (faster than complex calculation)
    const sorted = [...places].sort((a, b) => {
      const scoreA = (a.userRatingsTotal || 0) * (a.rating || 0);
      const scoreB = (b.userRatingsTotal || 0) * (b.rating || 0);
      return scoreB - scoreA;
    });
    
    // Take top N with minimum requirements
    sorted.forEach(place => {
      if (
        priority.length < MAX_PRIORITY &&
        (place.rating || 0) >= 4.0 &&
        (place.userRatingsTotal || 0) >= 500 // 🔥 HIGHER threshold
      ) {
        priority.push(place);
      } else {
        regular.push(place);
      }
    });
    
    return { priorityPlaces: priority, regularPlaces: regular };
  }, [places]);

  // 🎯 Memoize callbacks to prevent re-renders
  const handleMarkerRef = useCallback((placeId: number, ref: L.Marker | null) => {
    onMarkerRef(placeId, ref);
  }, [onMarkerRef]);

  if (!visible) return null;

  return (
    <>
      {/* ⚡ OPTIMIZED CLUSTERING SETTINGS */}
      <MarkerClusterGroup
        chunkedLoading={true}
        maxClusterRadius={150}  // 🔥 INCREASED: Fewer clusters = better performance
        disableClusteringAtZoom={17} // 🔥 EARLIER: Less rendering at high zoom
        spiderfyOnMaxZoom={false} // 🔥 DISABLED: Avoid complex animations
        // showCoverageOnHover={false} // 🔥 DISABLED: Less repaints
        removeOutsideVisibleBounds={true} // ✅ CRITICAL: Only render visible
        animate={false} // 🔥 DISABLED: No animations = faster
        zoomToBoundsOnClick={true}
      >
        {regularPlaces.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            isSelected={selectedPlaceId === place.id}
            onSelect={onSelectPlace}
            markerRef={(ref) => handleMarkerRef(place.id, ref)}
            zIndexOffset={selectedPlaceId === place.id ? 100000 : 1000}
            isPriority={false}
          />
        ))}
      </MarkerClusterGroup>

      {/* Priority markers - Keep minimal */}
      {priorityPlaces.map((place) => (
        <PlaceMarker
          key={`priority-${place.id}`}
          place={place}
          isSelected={selectedPlaceId === place.id}
          onSelect={onSelectPlace}
          markerRef={(ref) => handleMarkerRef(place.id, ref)}
          zIndexOffset={selectedPlaceId === place.id ? 100000 : 10000}
          isPriority={true}
        />
      ))}
    </>
  );
};

export default React.memo(PlaceMarkers);