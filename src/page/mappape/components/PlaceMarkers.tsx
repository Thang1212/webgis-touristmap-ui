import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import PlaceMarker from "./PlaceMarker";
import type L from "leaflet";

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
  if (!visible) return null;

  return (
    <MarkerClusterGroup chunkedLoading>
      {places.map((place) => (
        <PlaceMarker
          key={place.id}
          place={place}
          isSelected={selectedPlaceId === place.id}
          onSelect={onSelectPlace}
          markerRef={(ref) => onMarkerRef(place.id, ref)}
        />
      ))}
    </MarkerClusterGroup>
  );
};