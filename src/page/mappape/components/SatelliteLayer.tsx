import React, { useState } from "react";
import { TileLayer, useMap } from "react-leaflet";


 const SatelliteLayer = ({  }) => {

  return (
    <TileLayer
      url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${
        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
      }`}
      tileSize={512}
      zoomOffset={-1}
      attribution='© <a href="https://www.mapbox.com/">Mapbox</a>'
    />
  );
};

export default SatelliteLayer;
