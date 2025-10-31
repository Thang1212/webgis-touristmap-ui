import type { LayerConfig } from "../page/mappape/components/LayerControl";

export const INITIAL_LAYERS: LayerConfig[] = [
  {
    id: "places",
    name: "Địa điểm",
    visible: true,
    opacity: 1,
    icon: "📍",
    color: "#3b82f6",
    description: "Các địa điểm du lịch, nhà hàng, khách sạn",
  },
  {
    id: "roads",
    name: "Đường phố",
    visible: true,
    opacity: 0.8,
    icon: "🛣️",
    color: "#f59e0b",
    description: "Mạng lưới đường giao thông",
  },
  {
    id: "route",
    name: "Tuyến đường",
    visible: true,
    opacity: 1,
    icon: "🗺️",
    color: "#3b82f6",
    description: "Chỉ đường từ điểm A đến B",
  },
];

export const MAP_CONFIG = {
  center: [10.9288, 108.0999] as [number, number],
  zoom: 13,
  fitBoundsPadding: [50, 50] as [number, number],
  tileSize: 512,
  zoomOffset: -1,
  keepBuffer: 1024,
};

export const GEOSERVER_CONFIG = {
  baseUrl: import.meta.env.VITE_GEOSERVER_BASE_URL || "http://localhost:8080/geoserver/Webgis_project/wms",
  workspace: "Webgis_project",
  placesLayer: "Webgis_project:place",
  roadsLayer: "Webgis_project:edges",
  wmsVersion: "1.1.1",
  format: "image/png",
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};