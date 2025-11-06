// export default MapView;
import React, { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Store hooks
import { useMapStore } from "../../store/mapstore";
import { useRoutingStore } from "@/store/routingstore";

// Custom hooks
import { useMobilePanels } from "../../hooks/useMobilePanels";
import { useLayerManagement } from "../../hooks/useLayerManagement";
import { useMapInitialization } from "../../hooks/useMapInitialization";

// Components
import FlyToPlace from "./components/FlyToPlace";
import MapInstanceCapturer from "./components/MapInstanceCapturer";
import LocationMarker from "./components/LocationMarker";
import LoadingOverlay from "./components/LoadingOverlay";
import LayerControl from "./components/LayerControl";
import MobileMenuToggle from "./components/MobileMenuToggle";
// import MapRouteLayer from "./components/MapRouteLayer";
import MapClickHandler from "./components/MapClickHandler";
import { WMSLayers } from "./components/WMSLayers";
import { PlaceMarkers } from "./components/PlaceMarkers";
import { SidePanels } from "../mappape/components/Sidepanels";
import {BREAKPOINTS} from "../../constants/map-constants"
// Constants and utilities
import { MAP_CONFIG } from "../../constants/map-constants";
import { buildCqlFilter } from "../../utils/cql-filter";
import MapRouteLayer from "./components/MapRouteLayer";
import SatelliteLayer from "./components/SatelliteLayer";

const MapView: React.FC = () => {
  // Store state
  const {
    filters,
    filteredPlaces,
    selectedPlace,
    setSelectedPlace,
    loading,
    fetchFilteredPlacesFromGeoServer,
  } = useMapStore();
  const { useGPS } = useRoutingStore();

  // Custom hooks
  const { isFilterOpen, isDetailOpen, setIsFilterOpen, setIsDetailOpen } =
    useMobilePanels(selectedPlace);

  const { layers, handleLayerToggle, handleOpacityChange, getLayerConfig } =
    useLayerManagement();

  const { mapInstance, setMapInstance, setMarkerRef } = useMapInitialization(
    filteredPlaces,
    selectedPlace,
    fetchFilteredPlacesFromGeoServer
  );
 const sortedPlaces = useMemo(() => {
    return [...filteredPlaces].sort((a, b) => {
      // Tính điểm ưu tiên kết hợp rating và số lượng đánh giá
      const scoreA = (a.userRatingsTotal || 0) * (a.rating || 0);
      const scoreB = (b.userRatingsTotal || 0) * (b.rating || 0);
      
      return scoreB - scoreA;
    });
  }, [filteredPlaces]);
  // Get layer configurations
  const placesLayer = getLayerConfig("places");
  const roadsLayer = getLayerConfig("roads");
  const routeLayer = getLayerConfig("route");
  const sateliteLayer = getLayerConfig("satelite")
  // Build CQL filter
  const cqlFilter = buildCqlFilter(filters);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
      {/* Mobile Menu Toggles */}
      <MobileMenuToggle
        isFilterOpen={isFilterOpen}
        isDetailOpen={isDetailOpen && !!selectedPlace}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        onDetailToggle={() => setIsDetailOpen(!isDetailOpen)}
      />
      <SidePanels
        isFilterOpen={isFilterOpen}
        isDetailOpen={isDetailOpen}
        selectedPlace={selectedPlace}
        onFilterClose={() => setIsFilterOpen(false)}
        onDetailClose={() => setIsDetailOpen(false)}
      />

      {/* Map Container */}
      <div className="flex-1 relative min-h-0">
        <LoadingOverlay isLoading={loading} />
        {/* <ResultCounter count={filteredPlaces.length} /> */}
        <LayerControl
          layers={layers}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
        />

        <MapContainer
          center={[10.935107, 108.106667]} 
          zoom={MAP_CONFIG.zoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          zoomControl={false}
        >
          <MapInstanceCapturer onMapReady={setMapInstance} />
          <MapClickHandler />

          {/* Base Tile Layer */}
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${
              import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
            }`}
            id="mapbox/streets-v11"
            tileSize={MAP_CONFIG.tileSize}
            zoomOffset={MAP_CONFIG.zoomOffset}
            attribution='© <a href="https://www.mapbox.com/">Mapbox</a>'
            keepBuffer={MAP_CONFIG.keepBuffer}
          />

          {/* WMS Layers */}
          <WMSLayers
            placesLayer={placesLayer}
            roadsLayer={roadsLayer}
            cqlFilter={cqlFilter}
          />

          {/* GPS Location Marker */}
          {useGPS && <LocationMarker showMarker={true} />}

          {/* Fly to selected place */}
          {selectedPlace && <FlyToPlace place={selectedPlace} />}

          {/* Route Layer */}
          {routeLayer?.visible && <MapRouteLayer />}
          {sateliteLayer?.visible && <SatelliteLayer/>}
          {/* Place Markers */}
          <PlaceMarkers
            places={sortedPlaces}
            selectedPlaceId={selectedPlace?.id}
            onSelectPlace={setSelectedPlace}
            onMarkerRef={setMarkerRef}
            visible={placesLayer?.visible ?? true}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;