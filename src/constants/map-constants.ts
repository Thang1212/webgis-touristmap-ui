// import type { LayerConfig } from "../page/mappape/components/LayerControl";

// export const INITIAL_LAYERS: LayerConfig[] = [
//   {
//     id: "places",
//     name: "Địa điểm",
//     visible: true,
//     opacity: 1,
//     icon: "📍",
//     color: "#3b82f6",
//     description: "Các địa điểm du lịch, nhà hàng, khách sạn",
//   },
//   {
//     id: "route",
//     name: "Tuyến đường",
//     visible: true,
//     opacity: 1,
//     icon: "🛜",
//     color: "#3b82f6",
//     description: "Chỉ đường từ điểm A đến B",
//   },
//   {
//     id: "roads",
//     name: "Đường phố",
//     visible: true,
//     opacity: 0.8,
//     icon: "🛣️",
//     color: "#f59e0b",
//     description: "Mạng lưới đường giao thông",
//   },
 
//   {
//     id: "satelite",
//     name: "Vệ tinh",
//     visible: true,
//     opacity: 1,
//     icon: "🛰️",
//     color: "#3b82f6",
//     description: "Bản đồ vệ tinh",
//   },
//   {
//      id: "administrative",
//     name: "Hành chính",
//     visible: true,
//     opacity: 1,
//     icon: "🗺️",
//     color: "#3b82f6",
//     description: "Bản đồ hành chính",
//   }
// ];

// export const MAP_CONFIG = {
//   center: [10.930318, 108.099757] as [number, number],
//   zoom: 13,
//   fitBoundsPadding: [50, 50] as [number, number],
//   tileSize: 512,
//   zoomOffset: -1,
//   keepBuffer: 1024,
// };

// export const GEOSERVER_CONFIG = {
//   baseUrl: "http://localhost:8080/geoserver/Webgis_project/wms",
//   workspace: "Webgis_project",
//   placesLayer: "Webgis_project:place_view",
//   roadsLayer: "Webgis_project:edges",
//   administrativeLayer:"Webgis_project:Việt Nam (phường xã) - 63",
//   wmsVersion: "1.1.1",
//   format: "image/png",
// };

// export const BREAKPOINTS = {
//   mobile: 640,
//   tablet: 768,
//   desktop: 1024,
// };
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
    id: "route",
    name: "Tuyến đường",
    visible: true,
    opacity: 1,
    icon: "🛜",
    color: "#3b82f6",
    description: "Chỉ đường từ điểm A đến B",
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
    id: "satelite",
    name: "Vệ tinh",
    visible: true,
    opacity: 1,
    icon: "🛰️",
    color: "#3b82f6",
    description: "Bản đồ vệ tinh",
  },
  // {
  //    id: "administrative",
  //   name: "Hành chính",
  //   visible: true,
  //   opacity: 1,
  //   icon: "🗺️",
  //   color: "#3b82f6",
  //   description: "Bản đồ hành chính",
  // }
];

export const MAP_CONFIG = {
  center: [10.930318, 108.099757] as [number, number],
  zoom: 13,
  fitBoundsPadding: [50, 50] as [number, number],
  tileSize: 512,
  zoomOffset: -1,
  keepBuffer: 1024,
};

export const GEOSERVER_CONFIG = {
  baseUrl: "http://localhost:8080/geoserver/Webgis_project/wms",
  workspace: "Webgis_project",
  placesLayer: "Webgis_project:place_view",
  roadsLayer: "Webgis_project:edges",
  administrativeLayer:"Webgis_project:Việt Nam (phường xã) - 63",
  wmsVersion: "1.1.1",
  format: "image/png",
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};
