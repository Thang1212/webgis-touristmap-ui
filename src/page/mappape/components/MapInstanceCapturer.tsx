import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapInstanceCapturerProps {
  onMapReady: (map: L.Map) => void;
}

const MapInstanceCapturer: React.FC<MapInstanceCapturerProps> = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

export default MapInstanceCapturer;