import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getIcon } from "../../../utils/mapIcon";

interface PlaceMarkerProps {
  place: any;
  isSelected: boolean;
  onSelect: (place: any) => void;
  markerRef?: (ref: L.Marker | null) => void;
}

const PlaceMarker: React.FC<PlaceMarkerProps> = ({
  place,
  isSelected,
  onSelect,
  markerRef,
}) => {
  const position: [number, number] = [
    place.location.coordinates[1],
    place.location.coordinates[0],
  ];

  const getPrimaryCategory = (cat: string) => cat?.split(",")[0]?.trim() || "";

  const getMarkerIcon = () => {
    const base = getIcon(getPrimaryCategory(place.categories));

    if (isSelected) {
      return L.divIcon({
        className: "selected-marker",
        html: `
          <div style="position: relative; animation: bounce 0.5s;">
            <div style="
              position: absolute;
              bottom: -5px; left: 50%;
              transform: translateX(-50%);
              width: 40px; height: 40px;
              background: rgba(59,130,246,0.3);
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
    return base;
  };

  return (
    <Marker
      position={position}
      icon={getMarkerIcon()}
      ref={markerRef}
      eventHandlers={{
        //click: () => onSelect(place),
      }}
    >
      <Popup maxWidth={320}>
        <div className="p-3">
          {place.imageThumbnail && (
            <img
              src={place.imageThumbnail}
              alt={place.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}

          <h3 className="font-bold text-base text-gray-800 mb-2">
            {place.name}
          </h3>

          {place.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {place.description}
            </p>
          )}

          {place.address && (
            <p className="text-xs text-gray-500 mb-3 flex items-start gap-1">
              <span>📍</span>
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
            </div>
          )}

          <div className="space-y-2">
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                📞 {place.phone}
              </a>
            )}

            <button
              onClick={() => onSelect(place)}
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