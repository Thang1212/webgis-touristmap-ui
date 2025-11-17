// // import React, { useMemo } from "react";
// // import MarkerClusterGroup from "react-leaflet-cluster";
// // import PlaceMarker from "./PlaceMarker";
// // import type L from "leaflet";

// // interface PlaceMarkersProps {
// //   places: any[];
// //   selectedPlaceId: number | undefined;
// //   onSelectPlace: (place: any) => void;
// //   onMarkerRef: (placeId: number, ref: L.Marker | null) => void;
// //   visible: boolean;
// // }

// // export const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
// //   places,
// //   selectedPlaceId,
// //   onSelectPlace,
// //   onMarkerRef,
// //   visible,
// // }) => {
// //   // ⭐ CHIA PLACES THÀNH 2 NHÓM
// //   const { priorityPlaces, regularPlaces } = useMemo(() => {
// //     const priority: any[] = [];
// //     const regular: any[] = [];
    
// //     places.forEach(place => {
// //       const userRatings = place.userRatingsTotal || 0;
// //       const rating = place.rating || 0;
// //       const score = userRatings * rating;
      
// //       // ⭐ ĐIỀU KIỆN ĐỂ LÀ PRIORITY (Có thể điều chỉnh)
// //       // Option 1: Dựa trên score
// //       if (score >= 10000) {  // Ví dụ: >= 100 điểm
// //         priority.push(place);
// //       } else {
// //         regular.push(place);
// //       }
      
// //       // Option 2: Dựa trên số lượng reviews
// //       // if (userRatings >= 50) {
// //       //   priority.push(place);
// //       // } else {
// //       //   regular.push(place);
// //       // }
      
// //       // Option 3: Kết hợp cả rating và reviews
// //       // if (userRatings >= 20 && rating >= 4.0) {
// //       //   priority.push(place);
// //       // } else {
// //       //   regular.push(place);
// //       // }
// //     });
    
// //     return { priorityPlaces: priority, regularPlaces: regular };
// //   }, [places]);

// //   if (!visible) return null;

// //   return (
// //     <>
// //       {/* ⭐ NHÓM 1: Markers thường - ĐƯỢC CLUSTER */}
// //       <MarkerClusterGroup  //giải thích
// //          chunkedLoading={true}           // Load theo batch, tránh freeze
// //   maxClusterRadius={100}          // 100px radius để gom markers
// //   disableClusteringAtZoom={15}    // Tách cluster ở zoom 18+
// //   spiderfyOnMaxZoom={true}        // Tách hình spider khi max zoom
// //   removeOutsideVisibleBounds={true} // Chỉ render trong viewport
// //       >
// //         {regularPlaces.map((place) => (
// //           <PlaceMarker
// //             key={place.id}
// //             place={place}
// //             isSelected={selectedPlaceId === place.id}
// //             onSelect={onSelectPlace}
// //             markerRef={(ref) => onMarkerRef(place.id, ref)}
// //             zIndexOffset={1000}
// //             isPriority={false}
// //           />
// //         ))}
// //       </MarkerClusterGroup>
      

// //       {priorityPlaces.map((place) => (
// //         <PlaceMarker
// //           key={`priority-${place.id}`}
// //           place={place}
// //           isSelected={selectedPlaceId === place.id}
// //           onSelect={onSelectPlace}
// //           markerRef={(ref) => onMarkerRef(place.id, ref)}
// //           zIndexOffset={10000} // Z-index cao hơn nhiều
// //           isPriority={true}
// //         />
// //       ))}
// //     </>
// //   );
// // };
// import React, { useMemo, useCallback } from "react";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import PlaceMarker from "./PlaceMarker";
// import type L from "leaflet";
// import type { Place } from "../../../store/mapstore";

// interface PlaceMarkersProps {
//   places: Place[];
//   selectedPlaceId: number | undefined;
//   onSelectPlace: (place: Place) => void;
//   onMarkerRef: (placeId: number, ref: L.Marker | null) => void;
//   visible: boolean;
// }

// /**
//  * 🚀 PERFORMANCE OPTIMIZATIONS:
//  * 1. Aggressive limits on priority places
//  * 2. Higher clustering radius
//  * 3. Remove outside bounds
//  * 4. Memoize callbacks
//  * 5. Simplify scoring algorithm
//  */

// export const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
//   places,
//   selectedPlaceId,
//   onSelectPlace,
//   onMarkerRef,
//   visible,
// }) => {
//   /**
//    * ⚡ OPTIMIZED: Simpler algorithm + strict limits
//    */
//   const { priorityPlaces, regularPlaces } = useMemo(() => {
//     // 🔥 AGGRESSIVE LIMIT: Max 20 priority places
//     const MAX_PRIORITY = 20;
    
//     const priority: Place[] = [];
//     const regular: Place[] = [];
    
//     // Sort by simple score (faster than complex calculation)
//     const sorted = [...places].sort((a, b) => {
//       const scoreA = (a.userRatingsTotal || 0) * (a.rating || 0);
//       const scoreB = (b.userRatingsTotal || 0) * (b.rating || 0);
//       return scoreB - scoreA;
//     });
    
//     // Take top N with minimum requirements
//     sorted.forEach(place => {
//       if (
//         priority.length < MAX_PRIORITY &&
//         (place.rating || 0) >= 4.0 &&
//         (place.userRatingsTotal || 0) >= 500 // 🔥 HIGHER threshold
//       ) {
//         priority.push(place);
//       } else {
//         regular.push(place);
//       }
//     });
    
//     return { priorityPlaces: priority, regularPlaces: regular };
//   }, [places]);

//   // 🎯 Memoize callbacks to prevent re-renders
//   const handleMarkerRef = useCallback((placeId: number, ref: L.Marker | null) => {
//     onMarkerRef(placeId, ref);
//   }, [onMarkerRef]);

//   if (!visible) return null;

//   return (
//     <>
//       {/* ⚡ OPTIMIZED CLUSTERING SETTINGS */}
//       <MarkerClusterGroup
//         chunkedLoading={true}
//         maxClusterRadius={150}  // 🔥 INCREASED: Fewer clusters = better performance
//         disableClusteringAtZoom={17} // 🔥 EARLIER: Less rendering at high zoom
//         spiderfyOnMaxZoom={false} // 🔥 DISABLED: Avoid complex animations
//         // showCoverageOnHover={false} // 🔥 DISABLED: Less repaints
//         removeOutsideVisibleBounds={true} // ✅ CRITICAL: Only render visible
//         animate={false} // 🔥 DISABLED: No animations = faster
//         zoomToBoundsOnClick={true}
//       >
//         {regularPlaces.map((place) => (
//           <PlaceMarker
//             key={place.id}
//             place={place}
//             isSelected={selectedPlaceId === place.id}
//             onSelect={onSelectPlace}
//             markerRef={(ref) => handleMarkerRef(place.id, ref)}
//             zIndexOffset={selectedPlaceId === place.id ? 100000 : 1000}
//             isPriority={false}
//           />
//         ))}
//       </MarkerClusterGroup>

//       {/* Priority markers - Keep minimal */}
//       {priorityPlaces.map((place) => (
//         <PlaceMarker
//           key={`priority-${place.id}`}
//           place={place}
//           isSelected={selectedPlaceId === place.id}
//           onSelect={onSelectPlace}
//           markerRef={(ref) => handleMarkerRef(place.id, ref)}
//           zIndexOffset={selectedPlaceId === place.id ? 100000 : 10000}
//           isPriority={true}
//         />
//       ))}
//     </>
//   );
// };

// export default React.memo(PlaceMarkers);
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import PlaceMarker from "./PlaceMarker";
import type L from "leaflet";
import type { Place } from "../../../store/mapstore";
interface PlaceMarkersProps {
  places: any[];
  selectedPlaceId: number | undefined;
  onSelectPlace: (place: any) => void;
  onMarkerRef: (placeId: number, ref: L.Marker | null) => void;
  visible: boolean;
}
export const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onMarkerRef,
  visible,
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map]);

  const { priorityPlaces, regularPlaces } = useMemo(() => {
    const MAX_PRIORITY = 20;
    const priority: Place[] = [];
    const regular: Place[] = [];
    
    const sorted = [...places].sort((a, b) => {
      const scoreA = (a.userRatingsTotal || 0) * (a.rating || 0);
      const scoreB = (b.userRatingsTotal || 0) * (b.rating || 0);
      return scoreB - scoreA;
    });
    
    sorted.forEach(place => {
      if (
        priority.length < MAX_PRIORITY &&
        (place.rating || 0) >= 4.0 &&
        (place.userRatingsTotal || 0) >= 500
      ) {
        priority.push(place);
      } else {
        regular.push(place);
      }
    });
    
    return { priorityPlaces: priority, regularPlaces: regular };
  }, [places]);

  const handleMarkerRef = useCallback(
    (placeId: number, ref: L.Marker | null) => {
      onMarkerRef(placeId, ref);
    },
    [onMarkerRef]
  );

  if (!visible) return null;

  return (
    <>
      <MarkerClusterGroup
        chunkedLoading={true}
        maxClusterRadius={zoom < 11 ? 200 : zoom < 13 ? 150 : zoom < 15 ? 100 : 50}
        disableClusteringAtZoom={17}
        spiderfyOnMaxZoom={false}
        removeOutsideVisibleBounds={true}
        animate={false}
        zoomToBoundsOnClick={true}
        // ⭐ CUSTOM ICON với thông tin chi tiết
        iconCreateFunction={(cluster) => {
          const childMarkers = cluster.getAllChildMarkers();
          const count = childMarkers.length;
          
          // Phân tích categories trong cluster
          const categoryCounts: Record<string, number> = {};
          let totalRating = 0;
          let ratingCount = 0;
          
          childMarkers.forEach((marker: any) => {
            const place = marker.options.place; // Cần pass place vào marker options
            
            if (place?.categories?.[0]?.name) {
              const cat = place.categories[0].name;
              categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            }
            
            if (place?.rating) {
              totalRating += place.rating;
              ratingCount++;
            }
          });

          // Top 3 categories
          const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

          const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : null;

          // Size dựa trên số lượng
          let sizeClass = 'small';
          let iconSize = 60;
          if (count > 100) {
            sizeClass = 'large';
            iconSize = 90;
          } else if (count > 50) {
            sizeClass = 'medium';
            iconSize = 75;
          }

          return L.divIcon({
            html: `
              <div class="custom-cluster custom-cluster-${sizeClass}">
                <div class="cluster-main">
                  <div class="cluster-count">${count}</div>
                  ${avgRating ? `<div class="cluster-rating">⭐ ${avgRating}</div>` : ''}
                </div>
                <div class="cluster-tooltip">
                  ${topCategories.map(([cat, cnt]) => `
                    <div class="cluster-category">
                      ${getCategoryIcon(cat)} ${cat} (${cnt})
                    </div>
                  `).join('')}
                  ${topCategories.length < Object.keys(categoryCounts).length ? 
                    `<div class="cluster-more">+ ${Object.keys(categoryCounts).length - topCategories.length} loại khác</div>` 
                    : ''
                  }
                </div>
              </div>
            `,
            className: 'marker-cluster-custom',
            iconSize: L.point(iconSize, iconSize),
          });
        }}
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

      {/* Priority markers */}
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

// Helper function
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Bãi biển': '🏖️',
    'Nhà hàng': '🍽️',
    'Khách sạn': '🏨',
    'Điểm tham quan': '🎭',
    'Công viên': '🌳',
    'Bảo tàng': '🏛️',
  };
  return icons[category] || '📍';
}

export default React.memo(PlaceMarkers);