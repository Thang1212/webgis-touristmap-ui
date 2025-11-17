import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface FlyToPlaceProps {
  place: any;
}

const FlyToPlace: React.FC<FlyToPlaceProps> = ({ place }) => {
  const map = useMap();
  console.log(      place.location.coordinates[1],
        place.location.coordinates[0],)
  useEffect(() => {
    if (place) {
      const position: [number, number] = [
        place.location.coordinates[1],
        place.location.coordinates[0],
      ];

      const current = map.getCenter();
      const diffLat = Math.abs(current.lat - position[0]);
      const diffLng = Math.abs(current.lng - position[1]);

      if (diffLat > 0.0005 || diffLng > 0.0005) {
        map.flyTo(position, 18, { duration: 1 });
      }
    }
  }, [place, map]);

  return null;
};

export default FlyToPlace;