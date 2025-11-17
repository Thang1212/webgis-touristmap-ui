const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  place_name: string;
  formatted_address: string;
  text: string;
  relevance: number;
}

class GeocodingService {
  async geocodeAddress(address: string): Promise<{
    success: boolean;
    results: GeocodeResult[];
    primary?: GeocodeResult;
  }> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `${MAPBOX_BASE_URL}/${encodedAddress}.json?${new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        country: 'VN',
        limit: '5',
        language: 'vi',
        types: 'place,address,poi'
      })}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const results = data.features.map((feature: any) => ({
          latitude: feature.center[1],
          longitude: feature.center[0],
          place_name: feature.place_name,
          formatted_address: feature.place_name,
          text: feature.text,
          relevance: feature.relevance
        }));

        return {
          success: true,
          results,
          primary: results[0]
        };
      }

      return { success: false, results: [] };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  async reverseGeocode(longitude: number, latitude: number): Promise<{
    success: boolean;
    data?: {
      latitude: number;
      longitude: number;
      place_name: string;
      formatted_address: string;
    };
  }> {
    try {
      const url = `${MAPBOX_BASE_URL}/${longitude},${latitude}.json?${new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        country: 'VN',
        limit: '1',
        language: 'vi'
      })}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        return {
          success: true,
          data: {
            latitude,
            longitude,
            place_name: data.features[0].place_name,
            formatted_address: data.features[0].place_name
          }
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  validateCoordinates(latitude: number | string, longitude: number | string): boolean {
    const lat = parseFloat(latitude.toString());
    const lng = parseFloat(longitude.toString());
    
    if (isNaN(lat) || isNaN(lng)) return false;
    
    // Vietnam bounds: lat 8-24, lng 102-110
    if (lat < 8 || lat > 24 || lng < 102 || lng > 110) return false;
    
    return true;
  }
}

export default new GeocodingService();