import React from "react";
import { WMSTileLayer } from "react-leaflet";
import { GEOSERVER_CONFIG } from "../../../constants/map-constants";
import type { LayerConfig } from "./LayerControl";

interface WMSLayersProps {
  placesLayer: LayerConfig | undefined;
  roadsLayer: LayerConfig | undefined;
  cqlFilter: string;
}

export const WMSLayers: React.FC<WMSLayersProps> = ({
  placesLayer,
  roadsLayer,
  cqlFilter,
  
}) => {
  return (
    <>
      {placesLayer?.visible && (
        <WMSTileLayer
          url={GEOSERVER_CONFIG.baseUrl}
          params={{
            layers: GEOSERVER_CONFIG.placesLayer,
            format: GEOSERVER_CONFIG.format,
            transparent: true,
            version: GEOSERVER_CONFIG.wmsVersion,
            CQL_FILTER: cqlFilter,
          } as any}
          opacity={placesLayer.opacity || 1}
        />
      )}

      {roadsLayer?.visible && (
        <WMSTileLayer
          url={GEOSERVER_CONFIG.baseUrl}
          params={{
            layers: GEOSERVER_CONFIG.roadsLayer,
            format: GEOSERVER_CONFIG.format,
            transparent: true,
            version: GEOSERVER_CONFIG.wmsVersion,
          } as any}
          opacity={roadsLayer.opacity || 1}
        />
      )}
    </>
  );
};