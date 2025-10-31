// import React, { useEffect, useRef, useState } from "react";
// import { MapContainer, TileLayer, WMSTileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import { useMapStore } from "../../store/mapstore";
// import FlyToPlace from "./components/FlyToPlace";
// import MapInstanceCapturer from "./components/MapInstanceCapturer";
// import LocationMarker from "./components/LocationMarker";
// import PlaceMarker from "./components/PlaceMarker";
// import LoadingOverlay from "./components/LoadingOverlay";
// import ResultCounter from "./components/ResultCounter";
// import LayerControl from "./components/LayerControl";
// import MobileMenuToggle from "./components/MobileMenuToggle";
// import ResponsiveFilterPanel from "./components/ResponsiveFilterPanel";
// import ResponsiveDetailsPanel from "./components/ResponsiveDetailsPanel";
// import MapRouteLayer from "./components/MapRouteLayer"; // Import mới
// import type { LayerConfig } from "./components/LayerControl";
// import MapClickHandler from "./components/MapClickHandler";
// import { useRoutingStore } from "@/store/routingstore";

// const MapView: React.FC = () => {
//   const {
//     filters,
//     filteredPlaces,
//     selectedPlace,
//     setSelectedPlace,
//     loading,
//     fetchFilteredPlacesFromGeoServer,
//   } = useMapStore();
//   const {useGPS} = useRoutingStore()
//   const markerRefs = useRef<{ [key: number]: L.Marker }>({});
//   const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
//   const hasFetchedRef = useRef(false);

//   // Mobile menu states
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);

//   // Layer visibility and opacity state
//   const [layers, setLayers] = useState<LayerConfig[]>([
//     {
//       id: "places",
//       name: "Địa điểm",
//       visible: true,
//       opacity: 1,
//       icon: "📍",
//       color: "#3b82f6",
//       description: "Các địa điểm du lịch, nhà hàng, khách sạn",
//     },
//     {
//       id: "roads",
//       name: "Đường phố",
//       visible: true,
//       opacity: 0.8,
//       icon: "🛣️",
//       color: "#f59e0b",
//       description: "Mạng lưới đường giao thông",
//     },
//     {
//       id: "route",
//       name: "Tuyến đường",
//       visible: true,
//       opacity: 1,
//       icon: "🗺️",
//       color: "#3b82f6",
//       description: "Chỉ đường từ điểm A đến B",
//     },
//   ]);

//   /* --- Handlers --- */
//   const handleLayerToggle = (layerId: string) => {
//     setLayers((prev) =>
//       prev.map((layer) =>
//         layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
//       )
//     );
//   };

//   const handleOpacityChange = (layerId: string, opacity: number) => {
//     setLayers((prev) =>
//       prev.map((layer) =>
//         layer.id === layerId ? { ...layer, opacity } : layer
//       )
//     );
//   };

//   const getLayerConfig = (layerId: string) => {
//     return layers.find((l) => l.id === layerId);
//   };

//   /* --- Effects --- */
//   useEffect(() => {
//     if (selectedPlace && window.innerWidth < 1024) {
//       setIsDetailOpen(true);
//     }
//   }, [selectedPlace]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsFilterOpen(false);
//         setIsDetailOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!hasFetchedRef.current) {
//       hasFetchedRef.current = true;
//       fetchFilteredPlacesFromGeoServer();
//     }
//   }, [fetchFilteredPlacesFromGeoServer]);

//   useEffect(() => {
//     if (selectedPlace && markerRefs.current[selectedPlace.id]) {
//       markerRefs.current[selectedPlace.id].openPopup();
//     }
//   }, [selectedPlace]);

//   useEffect(() => {
//     if (mapInstance && filteredPlaces.length > 0) {
//       const bounds = L.latLngBounds(
//         filteredPlaces.map((p) => [
//           p.location.coordinates[1],
//           p.location.coordinates[0],
//         ])
//       );
//       mapInstance.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [filteredPlaces, mapInstance]);

//   /* --- CQL Filter --- */
//   const buildCqlFilter = () => {
//     const escape = (s: string) => s.replace(/'/g, "''");
//     const conds: string[] = [];

//     if (filters.categories) {
//       conds.push(`categories ILIKE '%${escape(filters.categories)}%'`);
//     }
//     if (filters.district) {
//       conds.push(`address ILIKE '%${escape(filters.district)}%'`);
//     }
//     if (filters.rating) {
//       conds.push(`rating >= ${filters.rating}`);
//     }
//     if (filters.searchText) {
//       const s = escape(filters.searchText);
//       conds.push(`(name ILIKE '%${s}%' OR description ILIKE '%${s}%')`);
//     }

//     return conds.length ? conds.join(" AND ") : "INCLUDE";
//   };

//   const placesLayer = getLayerConfig("places");
//   const roadsLayer = getLayerConfig("roads");
//   const routeLayer = getLayerConfig("route");

//   return (
//     <div className="h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
//       {/* Mobile Menu Toggles */}
//       <MobileMenuToggle
//         isFilterOpen={isFilterOpen}
//         isDetailOpen={isDetailOpen && !!selectedPlace}
//         onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
//         onDetailToggle={() => setIsDetailOpen(!isDetailOpen)}
//       />

//       {/* Filter Panel */}
//       <div
//         className={`
//           fixed lg:relative
//           inset-y-0 left-0
//           w-[85vw] sm:w-60 lg:w-60 xl:w-80
//           z-[999]
//           bg-transparent
//           shadow-2xl lg:shadow-none
//           transform transition-transform duration-300 ease-in-out
//           ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           overflow-y-hidden
//           overflow-x-hidden
//         `}
//       >
//         <ResponsiveFilterPanel 
//           isOpen={isFilterOpen}
//           onClose={() => setIsFilterOpen(false)}
//         />
//       </div>

//       {/* Overlay — chỉ hiện trên mobile khi panel mở */}
//       {isFilterOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] lg:hidden"
//           onClick={() => setIsFilterOpen(false)}
//         />
//       )}

//       {/* Map Container */}
//       <div className="flex-1 relative min-h-0">
//         <LoadingOverlay isLoading={loading} />
//         <ResultCounter count={filteredPlaces.length} />
//         <LayerControl
//           layers={layers}
//           onLayerToggle={handleLayerToggle}
//           onOpacityChange={handleOpacityChange}
//         />

//         <MapContainer
//           center={[10.9288, 108.0999]}
//           zoom={13}
//           style={{ height: "100%", width: "100%" }}
//           className="z-0"
//           zoomControl={false}
//         >
//          <MapInstanceCapturer onMapReady={setMapInstance} />
//          <MapClickHandler /> 
//           <TileLayer
//             url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${
//               import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
//             }`}
//             id="mapbox/streets-v11"
//             tileSize={512}
//             zoomOffset={-1}
//             attribution='© <a href="https://www.mapbox.com/">Mapbox</a>'
//             keepBuffer={1024}
//           />

//           {placesLayer?.visible && (
//             <WMSTileLayer
//               url="http://localhost:8080/geoserver/Webgis_project/wms"
//               params={{
//                 layers: "Webgis_project:place",
//                 format: "image/png",
//                 transparent: true,
//                 version: "1.1.1",
//                 CQL_FILTER: buildCqlFilter(),
//               } as any}
//               opacity={placesLayer.opacity || 1}
//             />
//           )}

//           {roadsLayer?.visible && (
//             <WMSTileLayer
//               url="http://localhost:8080/geoserver/Webgis_project/wms"
//               params={{
//                 layers: "Webgis_project:edges",
//                 format: "image/png",
//                 transparent: true,
//                 version: "1.1.1",
//               } as any}
//               opacity={roadsLayer.opacity || 1}
//             />
//           )}

//           {/* <LocationMarker /> */}
//           {useGPS && <LocationMarker autoSetOrigin={true} showMarker={true} />}

//           {selectedPlace && <FlyToPlace place={selectedPlace} />}

//           {/* Route Layer - Hiển thị tuyến đường */}
//           {routeLayer?.visible && <MapRouteLayer />}

//           {placesLayer?.visible && (
//             <MarkerClusterGroup chunkedLoading>
//               {filteredPlaces.map((place) => (
//                 <PlaceMarker
//                   key={place.id}
//                   place={place}
//                   isSelected={selectedPlace?.id === place.id}
//                   onSelect={setSelectedPlace}
//                   markerRef={(ref) => {
//                     if (ref) markerRefs.current[place.id] = ref;
//                   }}
//                 />
//               ))}
//             </MarkerClusterGroup>
//           )}
          
//         </MapContainer>
//       </div>

//       {/* Details Panel */}
//       {selectedPlace && (
//         <div
//           className={`
//             fixed lg:relative
//             inset-y-0 right-0
//             w-full sm:w-96 lg:w-96 xl:w-[450px]
//             z-[999]
//             bg-white
//             transform transition-transform duration-300 ease-in-out
//             ${isDetailOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
//             overflow-y-auto
//           `}
//         >
//           <ResponsiveDetailsPanel
//             isOpen={isDetailOpen}
//             onClose={() => setIsDetailOpen(false)}
//           />
//         </div>
//       )}

//       {/* Details Overlay */}
//       {isDetailOpen && selectedPlace && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-[998]"
//           onClick={() => setIsDetailOpen(false)}
//         />
//       )}
      
//     </div>
//   );
// };

// export default MapView;
import React from "react";
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
import ResultCounter from "./components/ResultCounter";
import LayerControl from "./components/LayerControl";
import MobileMenuToggle from "./components/MobileMenuToggle";
import MapRouteLayer from "./components/MapRouteLayer";
import MapClickHandler from "./components/MapClickHandler";
import { WMSLayers } from "./components/WMSLayers";
import { PlaceMarkers } from "./components/PlaceMarkers";
import { SidePanels } from "../mappape/components/Sidepanels";
import {BREAKPOINTS} from "../../constants/map-constants"
// Constants and utilities
import { MAP_CONFIG } from "../../constants/map-constants";
import { buildCqlFilter } from "../../utils/cql-filter";

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

  // Get layer configurations
  const placesLayer = getLayerConfig("places");
  const roadsLayer = getLayerConfig("roads");
  const routeLayer = getLayerConfig("route");

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

      {/* Side Panels (Filter & Details) */}
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
          center={MAP_CONFIG.center}
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
          {useGPS && <LocationMarker autoSetOrigin={true} showMarker={true} />}

          {/* Fly to selected place */}
          {selectedPlace && <FlyToPlace place={selectedPlace} />}

          {/* Route Layer */}
          {routeLayer?.visible && <MapRouteLayer />}

          {/* Place Markers */}
          <PlaceMarkers
            places={filteredPlaces}
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