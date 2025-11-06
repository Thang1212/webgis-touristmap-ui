import { useState, useRef, useEffect, useCallback } from "react";
import L from "leaflet";
import { MAP_CONFIG } from "../constants/map-constants";

export const useMapInitialization = (
  filteredPlaces: any[],
  selectedPlace: any,
  fetchFilteredPlacesFromGeoServer: () => void
) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const markerRefs = useRef<{ [key: number]: L.Marker }>({});
  const hasFetchedRef = useRef(false);

  // Initial data fetch
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchFilteredPlacesFromGeoServer();
    }
  }, [fetchFilteredPlacesFromGeoServer]);

  // Open popup for selected marker
  useEffect(() => {
    if (selectedPlace && markerRefs.current[selectedPlace.id]) {
      markerRefs.current[selectedPlace.id].openPopup();
    }
  }, [selectedPlace]);

  // Auto-fit bounds when places change
  // useEffect(() => {
  //   if (mapInstance && filteredPlaces.length > 0) {
  //     const bounds = L.latLngBounds(
  //       filteredPlaces.map((p) => [
  //         p.location.coordinates[1],
  //         p.location.coordinates[0],
  //       ])
  //     );
  //     mapInstance.fitBounds(bounds, { padding: MAP_CONFIG.fitBoundsPadding });
  //   }
  // }, [filteredPlaces, mapInstance]);

  const setMarkerRef = useCallback((placeId: number, ref: L.Marker | null) => {
    if (ref) {
      markerRefs.current[placeId] = ref;
    }
  }, []);

  return {
    mapInstance,
    setMapInstance,
    markerRefs,
    setMarkerRef,
  };
};