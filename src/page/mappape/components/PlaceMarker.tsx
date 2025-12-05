
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getIcon } from "../../../utils/mapIcon";
import type { Place, Category } from "../../../store/mapstore";

interface PlaceMarkerProps {
  place: Place;
  isSelected: boolean;
  onSelect: (place: Place) => void;
  markerRef?: (ref: L.Marker | null) => void;
  zIndexOffset?: number;
  isPriority?: boolean; 
}

const PlaceMarker: React.FC<PlaceMarkerProps> = ({
  place,
  isSelected,
  onSelect,
  markerRef,
  zIndexOffset = 0,
  isPriority = false, 
}) => {
  const position: [number, number] = [
    place.location.coordinates[1],
    place.location.coordinates[0],
  ];
const {clearRoute} = useRoutingStore()

  const getPrimaryCategory = (categories: Category[]): string => {
    if (!categories || categories.length === 0) return "";
    return categories[0].name;
  };

  const getMarkerIcon = () => {
    const base = getIcon(getPrimaryCategory(place.categories));
    const userRatings = place.userRatingsTotal || 0;

    if (isSelected) {
      return L.divIcon({
        className: "selected-marker",
        html: `
          <div style="position: relative; animation: bounce 2s;">
            <div style="
              position: absolute;
              bottom: -5px; left: 50%;
              transform: translateX(-50%);
              width: 60px; height: 60px;
              background: rgba(59,130,246,0.6);
              border-radius: 50%;
              animation: pulse-blue 2s infinite;">
            </div>
            ${base.options.html}
          </div>
          <style>
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulse-blue {
              0% { transform: translateX(-50%) scale(1); opacity: 1; }
              100% { transform: translateX(-50%) scale(2); opacity: 0; }
            }
          </style>
        `,
        iconSize: base.options.iconSize,
        iconAnchor: base.options.iconAnchor,
      });
    }

    // ⭐ PRIORITY MARKER - Visual đặc biệt
    if (isPriority) {
      return L.divIcon({
        className: "priority-marker-vip",
        html: `
          <div style="position: relative;">
            <!-- Glow effect -->
            <div style="
              position: absolute;
              bottom: -8px; left: 50%;
              transform: translateX(-50%);
              width: 50px; height: 50px;
              background: radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%);
              border-radius: 50%;
              animation: glow-priority 2s ease-in-out infinite;">
            </div>
            
            <!-- Icon chính - scale lớn hơn -->
            <div style="transform: scale(1.4); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
              ${base.options.html}
            </div>
            
            <!-- Badge số lượng reviews -->
            <div style="
              position: absolute;
              top: -12px; right: -12px;
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              color: white;
              border-radius: 50%;
              min-width: 26px; 
              height: 26px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: bold;
              border: 3px solid white;
              box-shadow: 0 3px 8px rgba(0,0,0,0.3);
              padding: 0 4px;
              animation: pulse-badge 2s ease-in-out infinite;">
              ${userRatings}
            </div>
            
            <!-- Star badge -->
            <div style="
              position: absolute;
              bottom: -8px; left: 50%;
              transform: translateX(-50%);
              background: white;
              color: #f59e0b;
              border-radius: 12px;
              padding: 2px 6px;
              font-size: 10px;
              font-weight: bold;
              border: 2px solid #f59e0b;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              white-space: nowrap;">
              ⭐ ${place.rating}
            </div>
          </div>
          <style>
            @keyframes glow-priority {
              0%, 100% { 
                opacity: 0.6; 
                transform: translateX(-50%) scale(1); 
              }
              50% { 
                opacity: 1; 
                transform: translateX(-50%) scale(1.3); 
              }
            }
            @keyframes pulse-badge {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.15); }
            }
          </style>
        `,
        iconSize: [50, 80],
        iconAnchor: [25, 80],
      });
    }

    // ⭐ REGULAR MARKER
    return base;
  };

  return (
    <Marker
      position={position}
      icon={getMarkerIcon()}
      ref={markerRef}
      zIndexOffset={zIndexOffset}
      
      {...({ place } as any)} // Hack để pass custom data
      eventHandlers={{
        //click: () => onSelect(place),
      }}
    >
      <Popup maxWidth={320}>
        <div className="p-3">
          {/* ⭐ Thêm badge priority trong popup */}
          {isPriority && (
            <div className="mb-3 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-center font-bold text-sm">
              🌟 Địa điểm nổi bật
            </div>
          )}
          
          {place.imageThumbnail && (
            <img  referrerPolicy="no-referrer"
              src={place.imageThumbnail}
              alt={place.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}

          <h3 className="font-bold text-base text-gray-800 mb-2">
            {place.name}
          </h3>

          {place.categories && place.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {place.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {place.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {place.description}
            </p>
          )}

          {place.address && (
            <p className="text-xs text-gray-500 mb-3 flex items-start gap-1">
              <span>🍎</span>
              <span className="line-clamp-1">{place.address}</span>
            </p>
          )}

          {place.rating && (
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-semibold text-gray-800">
                  {place.rating.toLocaleString()}
                </span>
              </div>
              {place.userRatingsTotal && (
                <span className="text-xs text-gray-500">
                  ({place.userRatingsTotal.toLocaleString()} đánh giá)
                </span>
                
              )}
              <span className="text-[10px] text-gray-400 pt-[2px]">
                từ google
              </span>
            </div>
          )}

          <div className="space-y-2">
            {place.phone && (
              
             <a   href={`tel:${place.phone}`}
                className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                📞 {place.phone}
              </a>
            )}

            <button
              onClick={() => {onSelect(place)
                clearRoute()
                |}}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};


export default PlaceMarker;

