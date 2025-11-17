// // src/components/Map/layers/RoadsLayer.tsx
// import { useEffect, useState } from 'react';
// import { GeoJSON, useMap } from 'react-leaflet';
// import type { GeoJsonObject } from 'geojson';
// import type { PathOptions } from 'leaflet';

// interface RoadsLayerProps {
//   visible: boolean;
//   opacity: number;
// }

// export const RoadsLayer: React.FC<RoadsLayerProps> = ({ visible, opacity }) => {
//   const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
//   const [loading, setLoading] = useState(false);
//   const map = useMap();

//   useEffect(() => {
//     if (!visible) {
//       setGeoData(null);
//       return;
//     }

//     const fetchRoads = async () => {
//       setLoading(true);
//       try {
//         const bounds = map.getBounds();
//         const boundsStr = [
//           bounds.getSouth(),
//           bounds.getWest(),
//           bounds.getNorth(),
//           bounds.getEast()
//         ].join(',');

//         const response = await fetch(
//           `http://localhost:8000/api/map/roads/geojson?bounds=${boundsStr}`
//         );
        
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}`);
//         }

//         const data = await response.json();
//         setGeoData(data);

//         console.log(`✅ Roads: Loaded ${data.features?.length || 0} segments`);
//       } catch (error) {
//         console.error('❌ Roads: Error loading', error);
//         setGeoData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleMoveEnd = () => {
//       const zoom = map.getZoom();
//       if (zoom >= 12) {
//         fetchRoads();
//       } else {
//         setGeoData(null);
//       }
//     };

//     if (map.getZoom() >= 12) {
//       fetchRoads();
//     }

//     map.on('moveend', handleMoveEnd);
    
//     return () => {
//       map.off('moveend', handleMoveEnd);
//     };
//   }, [visible, map]);

//   if (!visible || !geoData || loading) {
//     return null;
//   }

//   return (
//     <GeoJSON
//       key={JSON.stringify(geoData)}
//       data={geoData}
//       style={(feature) => getRoadStyle(feature?.properties?.type, opacity)}
//       onEachFeature={(feature, layer) => {
//         const name = feature.properties?.name;
//         const type = feature.properties?.type;

//         // 🎯 Highlight on hover
//         layer.on({
//           mouseover: (e) => {
//             const target = e.target;
//             target.setStyle({
//               weight: target.options.weight * 1.8, // Tăng độ dày
//               color: '#FFD700', // Vàng nổi bật
//               opacity: 1,
//             });
//             target.bringToFront();
//           },
//           mouseout: (e) => {
//             const target = e.target;
//             const originalStyle = getRoadStyle(type, opacity);
//             target.setStyle(originalStyle);
//           }
//         });

//         // Tooltip
//         if (name) {
//           layer.bindTooltip(
//             `<div class="road-tooltip-content">
//               <div class="road-name">${name}</div>
//               <div class="road-type">${getTypeLabel(type)}</div>
//             </div>`,
//             {
//               permanent: false,
//               direction: 'top',
//               className: 'custom-road-tooltip',
//               offset: [0, -10]
//             }
//           );
//         }
//       }}
//     />
//   );
// };

// // 🎨 Enhanced styling với shadows và glow effects
// const getRoadStyle = (type?: string, opacity: number = 0.8): PathOptions => {
//   const baseStyle: PathOptions = {
//     opacity: opacity,
//     lineCap: 'round',
//     lineJoin: 'round',
//   };

//   const styles: Record<string, PathOptions> = {
//     motorway: { 
//       ...baseStyle, 
//       color: '#FF3B30', // Đỏ sáng hơn
//       weight: 7,
//       className: 'road-motorway' // For CSS glow effect
//     },
//     trunk: { 
//       ...baseStyle, 
//       color: '#FF9500', // Cam sáng
//       weight: 6,
//     },
//     primary: { 
//       ...baseStyle, 
//       color: '#FFCC00', // Vàng sáng
//       weight: 5,
//     },
//     secondary: { 
//       ...baseStyle, 
//       color: '#007AFF', // Xanh dương sáng
//       weight: 4,
//     },
//     tertiary: { 
//       ...baseStyle, 
//       color: '#AF52DE', // Tím sáng
//       weight: 3,
//     },
//     residential: { 
//       ...baseStyle, 
//       color: '#8E8E93', // Xám
//       weight: 2.5,
//       opacity: opacity * 0.9,
//     },
//     service: { 
//       ...baseStyle, 
//       color: '#C7C7CC', // Xám nhạt
//       weight: 2,
//       opacity: opacity * 0.7,
//       dashArray: '3, 6', // Nét đứt rõ hơn
//     },
//     unclassified: { 
//       ...baseStyle, 
//       color: '#D1D1D6',
//       weight: 1.5,
//       opacity: opacity * 0.5,
//     },
//   };

//   return styles[type || 'unclassified'] || styles.unclassified;
// };

// // 🏷️ Type labels tiếng Việt
// const getTypeLabel = (type?: string): string => {
//   const labels: Record<string, string> = {
//     motorway: '🛣️ Cao tốc',
//     trunk: '🛤️ Quốc lộ',
//     primary: '🚗 Đường chính',
//     secondary: '🚙 Đường phụ',
//     tertiary: '🚕 Đường cấp 3',
//     residential: '🏘️ Đường dân cư',
//     service: '🅿️ Đường phục vụ',
//     unclassified: '📍 Đường khác',
//   };
  
//   return labels[type || 'unclassified'] || '📍 Đường';
// };

// export default RoadsLayer;
// src/components/Map/layers/RoadsLayer.tsx
import { useEffect, useState, useRef, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import type { GeoJsonObject } from 'geojson';
import type { PathOptions } from 'leaflet';
import L from 'leaflet';

interface RoadsLayerProps {
  visible: boolean;
  opacity: number;
}

// ⚡ Debounce helper
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const RoadsLayer: React.FC<RoadsLayerProps> = ({ visible, opacity }) => {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [loading, setLoading] = useState(false);
  const map = useMap();
  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!visible) {
      setGeoData(null);
      return;
    }

    const fetchRoads = async () => {
      // ✅ Cancel previous request
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }

      const zoom = map.getZoom();
      
      // ⚡ Chỉ load khi zoom >= 12
      if (zoom < 12) {
        setGeoData(null);
        return;
      }

      fetchControllerRef.current = new AbortController();
      setLoading(true);

      try {
        const bounds = map.getBounds();
        const boundsStr = [
          bounds.getSouth(),
          bounds.getWest(),
          bounds.getNorth(),
          bounds.getEast()
        ].join(',');

        // ✅ Pass zoom level to backend
        const response = await fetch(
          `http://localhost:8000/api/map/roads/geojson?bounds=${boundsStr}&zoom=${Math.floor(zoom)}`,
          { signal: fetchControllerRef.current.signal }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setGeoData(data);

      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('❌ Roads: Error loading', error);
          setGeoData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    // ⚡ Debounce 700ms - fetch sau khi dừng pan/zoom
    const debouncedFetch = debounce(fetchRoads, 700);

    // Initial load
    if (map.getZoom() >= 12) {
      fetchRoads();
    }

    map.on('moveend', debouncedFetch);
    map.on('zoomend', debouncedFetch);
    
    return () => {
      map.off('moveend', debouncedFetch);
      map.off('zoomend', debouncedFetch);
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [visible, map]);

  // ✅ Memoize style function
  const styleFunction = useMemo(
    () => (feature: any) => {
      const zoom = map.getZoom();
      return getRoadStyle(feature?.properties?.type, opacity, zoom);
    },
    [opacity, map]
  );

  // ✅ Memoize onEachFeature - chỉ bind hover cho roads có tên
  const onEachFeature = useMemo(
    () => (feature: any, layer: L.Layer) => {
      const name = feature.properties?.name;
      const type = feature.properties?.type;

      // ⚡ Chỉ add hover cho roads có tên (giảm listeners)
      if (name) {
        const roadLayer = layer as L.Path;
        
        roadLayer.on('mouseover', () => {
          roadLayer.setStyle({
            weight: (roadLayer.options.weight || 3) * 1.5,
            color: '#FFD700',
            opacity: 1,
          });
          roadLayer.bringToFront();
        });

        roadLayer.on('mouseout', () => {
          const zoom = map.getZoom();
          const originalStyle = getRoadStyle(type, opacity, zoom);
          roadLayer.setStyle(originalStyle);
        });

        // Tooltip
        roadLayer.bindTooltip(
          `<div class="road-tooltip-content">
            <div class="road-name">${name}</div>
            <div class="road-type">${getTypeLabel(type)}</div>
          </div>`,
          {
            permanent: false,
            direction: 'top',
            className: 'custom-road-tooltip',
            offset: [0, -10]
          }
        );
      }
    },
    [opacity, map]
  );

  if (!visible || !geoData || loading) {
    return null;
  }

  return (
    <GeoJSON
      data={geoData}
      style={styleFunction}
      onEachFeature={onEachFeature}
    />
  );
};

// 🎨 Complete road styling - Weight scale theo zoom
const getRoadStyle = (type?: string, opacity: number = 0.8, zoom: number = 13): PathOptions => {
  const baseStyle: PathOptions = {
    opacity: opacity,
    lineCap: 'round',
    lineJoin: 'round',
  };

  // ⚡ Weight multiplier theo zoom
  const getWeight = (baseWeight: number) => {
    if (zoom <= 12) return baseWeight * 0.7;
    if (zoom <= 14) return baseWeight;
    if (zoom <= 16) return baseWeight * 1.2;
    return baseWeight * 1.4;
  };

  const styles: Record<string, PathOptions> = {
    motorway: { 
      ...baseStyle, 
      color: '#E74C3C',
      weight: getWeight(7),
    },
    trunk: { 
      ...baseStyle, 
      color: '#E67E22',
      weight: getWeight(6),
    },
    trunk_link: { 
      ...baseStyle, 
      color: '#E67E22',
      weight: getWeight(4),
      opacity: opacity * 0.8,
      dashArray: '5, 3'
    },
    primary: { 
      ...baseStyle, 
      color: '#F39C12',
      weight: getWeight(5),
    },
    primary_link: { 
      ...baseStyle, 
      color: '#F39C12',
      weight: getWeight(3.5),
      opacity: opacity * 0.8,
      dashArray: '5, 3'
    },
    secondary: { 
      ...baseStyle, 
      color: '#3498DB',
      weight: getWeight(4),
    },
    secondary_link: { 
      ...baseStyle, 
      color: '#3498DB',
      weight: getWeight(3),
      opacity: opacity * 0.8,
      dashArray: '4, 2'
    },
    tertiary: { 
      ...baseStyle, 
      color: '#9B59B6',
      weight: getWeight(3),
    },
    tertiary_link: { 
      ...baseStyle, 
      color: '#9B59B6',
      weight: getWeight(2.5),
      opacity: opacity * 0.8,
      dashArray: '3, 2'
    },
    residential: { 
      ...baseStyle, 
      color: '#95A5A6',
      weight: getWeight(2.5),
      opacity: opacity * 0.9,
    },
    living_street: { 
      ...baseStyle, 
      color: '#7F8C8D',
      weight: getWeight(2),
      opacity: opacity * 0.8
    },
    service: { 
      ...baseStyle, 
      color: '#BDC3C7',
      weight: getWeight(1.5),
      opacity: opacity * 0.6,
      dashArray: '2, 4'
    },
    cycleway: { 
      ...baseStyle, 
      color: '#27AE60',
      weight: getWeight(1.5),
      opacity: opacity * 0.7,
      dashArray: '3, 3'
    },
    footway: { 
      ...baseStyle, 
      color: '#16A085',
      weight: getWeight(1),
      opacity: opacity * 0.5,
      dashArray: '1, 2'
    },
    pedestrian: { 
      ...baseStyle, 
      color: '#1ABC9C',
      weight: getWeight(1.5),
      opacity: opacity * 0.6
    },
    path: { 
      ...baseStyle, 
      color: '#2ECC71',
      weight: getWeight(1),
      opacity: opacity * 0.5,
      dashArray: '1, 3'
    },
    steps: { 
      ...baseStyle, 
      color: '#F1C40F',
      weight: getWeight(1),
      opacity: opacity * 0.4,
      dashArray: '1, 1'
    },
    track: { 
      ...baseStyle, 
      color: '#D35400',
      weight: getWeight(1.5),
      opacity: opacity * 0.6,
      dashArray: '4, 4'
    },
    construction: { 
      ...baseStyle, 
      color: '#E74C3C',
      weight: getWeight(1),
      opacity: opacity * 0.3,
      dashArray: '2, 6'
    },
    proposed: { 
      ...baseStyle, 
      color: '#95A5A6',
      weight: getWeight(1),
      opacity: opacity * 0.2,
      dashArray: '1, 6'
    },
    unclassified: { 
      ...baseStyle, 
      color: '#ECF0F1',
      weight: getWeight(2),
      opacity: opacity * 0.5,
    },
  };

  return styles[type || 'unclassified'] || styles.unclassified;
};

// 🏷️ Type labels tiếng Việt - Complete list
const getTypeLabel = (type?: string): string => {
  const labels: Record<string, string> = {
    motorway: '🛣️ Cao tốc',
    trunk: '🛤️ Quốc lộ',
    trunk_link: '🔗 Nhánh quốc lộ',
    primary: '🚗 Đường chính',
    primary_link: '🔗 Nhánh chính',
    secondary: '🚙 Đường phụ',
    secondary_link: '🔗 Nhánh phụ',
    tertiary: '🚕 Đường cấp 3',
    tertiary_link: '🔗 Nhánh cấp 3',
    residential: '🏘️ Đường dân cư',
    living_street: '🏡 Khu dân cư',
    service: '🅿️ Đường phục vụ',
    cycleway: '🚴 Làn xe đạp',
    footway: '🚶 Đường đi bộ',
    pedestrian: '👣 Khu đi bộ',
    path: '🥾 Lối mòn',
    steps: '🪜 Cầu thang',
    track: '🚜 Đường mòn',
    construction: '🚧 Đang xây',
    proposed: '📋 Đề xuất',
    unclassified: '📍 Đường khác',
  };
  
  return labels[type || 'unclassified'] || '📍 Đường';
};

export default RoadsLayer;