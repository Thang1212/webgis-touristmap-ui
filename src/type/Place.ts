export type Place = {
  id: number;
  // place_id: string;                 // ✅ NEW: Google Place ID (unique)
  name: string;
  categories: string;              // ✅ CHANGED: Thay type, format: "hotel,luxury,spa"
  description?: string;            // ✅ Optional
  address?: string;                // ✅ Địa chỉ đầy đủ
  location: {                      // ✅ CHANGED: GeoJSON Point
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  rating?: number;                 // ✅ Decimal (0-5)
  userRatingsTotal?: number;       // ✅ CHANGED: Thay reviews
  phone?: string;
  website?: string;
  imageThumbnail?: string;         // ✅ CHANGED: Thay image
  open_hour?: string;               // ✅ CHANGED: Format "HH:mm:ss"
  close_hour?: string;              // ✅ CHANGED: Format "HH:mm:ss"
  createdAt?: string;              // ✅ NEW: Timestamp
  updatedAt?: string;              // ✅ NEW: Timestamp
}