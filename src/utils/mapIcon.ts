// utils/mapIcons.ts
import L from 'leaflet';

/**
 * Tạo custom marker icon với màu sắc và emoji
 */
export const createCustomIcon = (color: string, icon: string, size: number = 40) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: ${size * 0.5}px;
        ">${icon}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// ============================================
// CATEGORY ICONS
// ============================================

// Tourist Attractions (Du lịch)
export const attractionIcon = createCustomIcon('#f59e0b', '🎯');      // Amber
export const naturalFeatureIcon = createCustomIcon('#10b981', '🏞️'); // Emerald
export const parkIcon = createCustomIcon('#22c55e', '🌳');            // Green
export const beachIcon = createCustomIcon('#06b6d4', '🏖️');          // Cyan
export const lakeIcon = createCustomIcon('#0ea5e9', '💧');            // Sky Blue
export const waterfallIcon = createCustomIcon('#3b82f6', '💦');       // Blue
export const natureIcon = createCustomIcon('#84cc16', '🌿');          // Lime

// Culture (Văn hóa)
export const culturalIcon = createCustomIcon('#dc2626', '🏛️');       // Red
export const templeIcon = createCustomIcon('#f97316', '⛩️');         // Orange
export const museumIcon = createCustomIcon('#7c3aed', '🖼️');         // Violet

// Accommodation (Chỗ ở)
export const accommodationIcon = createCustomIcon('#3b82f6', '🏨');   // Blue - General
export const hotelIcon = createCustomIcon('#2563eb', '🏨');           // Blue - Darker
export const resortIcon = createCustomIcon('#8b5cf6', '🏝️');         // Purple
export const lodgingIcon = createCustomIcon('#6366f1', '🏠');         // Indigo

// Food & Dining (Ẩm thực)
export const foodIcon = createCustomIcon('#10b981', '🍽️');           // Green - General
export const restaurantIcon = createCustomIcon('#059669', '🍽️');     // Green - Darker
export const vietnameseRestaurantIcon = createCustomIcon('#ef4444', '🇻🇳'); // Red
export const cafeIcon = createCustomIcon('#a78bfa', '☕');            // Light Purple

// Shopping (Mua sắm)
export const shoppingIcon = createCustomIcon('#f97316', '🛍️');       // Orange
export const mallIcon = createCustomIcon('#fb923c', '🏬');            // Light Orange
export const marketIcon = createCustomIcon('#ea580c', '🛒');          // Dark Orange

// Entertainment (Giải trí)
export const entertainmentIcon = createCustomIcon('#ec4899', '🎭');   // Pink
export const cinemaIcon = createCustomIcon('#db2777', '🎬');          // Dark Pink
export const nightlifeIcon = createCustomIcon('#a855f7', '🎉');       // Purple

// Transportation (Giao thông)
export const transportationIcon = createCustomIcon('#64748b', '🚌'); // Slate
export const busStationIcon = createCustomIcon('#475569', '🚏');      // Dark Slate
export const trainStationIcon = createCustomIcon('#334155', '🚆');    // Darker Slate
export const airportIcon = createCustomIcon('#1e293b', '✈️');         // Very Dark Slate

// Sports & Recreation (Thể thao)
export const sportsIcon = createCustomIcon('#16a34a', '⚽');          // Green
export const gymIcon = createCustomIcon('#15803d', '🏋️');            // Dark Green
export const stadiumIcon = createCustomIcon('#166534', '🏟️');        // Darker Green

// Services (Dịch vụ)
export const servicesIcon = createCustomIcon('#0891b2', '🔧');       // Cyan
export const spaIcon = createCustomIcon('#ec4899', '💆');            // Pink
export const luxuryIcon = createCustomIcon('#fbbf24', '⭐');         // Yellow
export const bankIcon = createCustomIcon('#0e7490', '🏦');           // Dark Cyan
export const atmIcon = createCustomIcon('#155e75', '💳');            // Darker Cyan

// Health (Sức khỏe)
export const healthIcon = createCustomIcon('#dc2626', '💊');         // Red
export const hospitalIcon = createCustomIcon('#b91c1c', '🏥');       // Dark Red
export const pharmacyIcon = createCustomIcon('#ef4444', '💉');       // Light Red
export const clinicIcon = createCustomIcon('#f87171', '🩺');         // Lighter Red

// Default
export const defaultIcon = createCustomIcon('#6b7280', '📍');        // Gray

// ============================================
// ICON MAPPING
// ============================================

/**
 * Map category to icon
 */
const iconMap: Record<string, L.DivIcon> = {
  // Tourist Attractions
  'tourist_attraction': attractionIcon,
  'natural_feature': naturalFeatureIcon,
  'park': parkIcon,
  'beach': beachIcon,
  'lake': lakeIcon,
  'waterfall': waterfallIcon,
  'nature': natureIcon,
  
  // Culture
  'cultural': culturalIcon,
  'temple': templeIcon,
  'museum': museumIcon,
  
  // Accommodation
  'accommodation': accommodationIcon,
  'hotel': hotelIcon,
  'resort': resortIcon,
  'lodging': lodgingIcon,
  
  // Food & Dining
  'food': foodIcon,
  'restaurant': restaurantIcon,
  'vietnamese_restaurant': vietnameseRestaurantIcon,
  'cafe': cafeIcon,
  
  // Shopping
  'shopping': shoppingIcon,
  'mall': mallIcon,
  'market': marketIcon,
  
  // Entertainment
  'entertainment': entertainmentIcon,
  'cinema': cinemaIcon,
  'nightlife': nightlifeIcon,
  
  // Transportation
  'transportation': transportationIcon,
  'bus_station': busStationIcon,
  'train_station': trainStationIcon,
  'airport': airportIcon,
  
  // Sports
  'sports': sportsIcon,
  'gym': gymIcon,
  'stadium': stadiumIcon,
  
  // Services
  'services': servicesIcon,
  'spa': spaIcon,
  'luxury': luxuryIcon,
  'bank': bankIcon,
  'atm': atmIcon,
  
  // Health
  'health': healthIcon,
  'hospital': hospitalIcon,
  'pharmacy': pharmacyIcon,
  'clinic': clinicIcon,
};

/**
 * Lấy icon dựa trên category
 * @param category - Category string (có thể là single hoặc comma-separated)
 * @returns L.DivIcon
 */
export const getIcon = (category: string): L.DivIcon => {
  if (!category) return defaultIcon;
  
  // Lấy category đầu tiên nếu có nhiều categories
  const primaryCategory = category.split(',')[0].trim().toLowerCase();
  
  // Tìm icon tương ứng
  return iconMap[primaryCategory] || defaultIcon;
};

/**
 * Lấy icon với size tùy chỉnh
 */
export const getIconWithSize = (category: string, size: number): L.DivIcon => {
  const primaryCategory = category.split(',')[0].trim().toLowerCase();
  
  // Lấy config từ category
  const config = getCategoryConfig(primaryCategory);
  
  return createCustomIcon(config.color, config.emoji, size);
};

/**
 * Lấy config (color + emoji) cho category
 */
export const getCategoryConfig = (category: string): { color: string; emoji: string } => {
  const configs: Record<string, { color: string; emoji: string }> = {
    // Tourist Attractions
    'tourist_attraction': { color: '#f59e0b', emoji: '🎯' },
    'natural_feature': { color: '#10b981', emoji: '🏞️' },
    'park': { color: '#22c55e', emoji: '🌳' },
    'beach': { color: '#06b6d4', emoji: '🏖️' },
    'lake': { color: '#0ea5e9', emoji: '💧' },
    'waterfall': { color: '#3b82f6', emoji: '💦' },
    'nature': { color: '#84cc16', emoji: '🌿' },
    
    // Culture
    'cultural': { color: '#dc2626', emoji: '🏛️' },
    'temple': { color: '#f97316', emoji: '⛩️' },
    'museum': { color: '#7c3aed', emoji: '🖼️' },
    
    // Accommodation
    'accommodation': { color: '#3b82f6', emoji: '🏨' },
    'hotel': { color: '#2563eb', emoji: '🏨' },
    'resort': { color: '#8b5cf6', emoji: '🏝️' },
    'lodging': { color: '#6366f1', emoji: '🏠' },
    
    // Food & Dining
    'food': { color: '#10b981', emoji: '🍽️' },
    'restaurant': { color: '#059669', emoji: '🍽️' },
    'vietnamese_restaurant': { color: '#ef4444', emoji: '🇻🇳' },
    'cafe': { color: '#a78bfa', emoji: '☕' },
    
    // Shopping
    'shopping': { color: '#f97316', emoji: '🛍️' },
    'mall': { color: '#fb923c', emoji: '🏬' },
    'market': { color: '#ea580c', emoji: '🛒' },
    
    // Entertainment
    'entertainment': { color: '#ec4899', emoji: '🎭' },
    'cinema': { color: '#db2777', emoji: '🎬' },
    'nightlife': { color: '#a855f7', emoji: '🎉' },
    
    // Transportation
    'transportation': { color: '#64748b', emoji: '🚌' },
    'bus_station': { color: '#475569', emoji: '🚏' },
    'train_station': { color: '#334155', emoji: '🚆' },
    'airport': { color: '#1e293b', emoji: '✈️' },
    
    // Sports
    'sports': { color: '#16a34a', emoji: '⚽' },
    'gym': { color: '#15803d', emoji: '🏋️' },
    'stadium': { color: '#166534', emoji: '🏟️' },
    
    // Services
    'services': { color: '#0891b2', emoji: '🔧' },
    'spa': { color: '#ec4899', emoji: '💆' },
    'luxury': { color: '#fbbf24', emoji: '⭐' },
    'bank': { color: '#0e7490', emoji: '🏦' },
    'atm': { color: '#155e75', emoji: '💳' },
    
    // Health
    'health': { color: '#dc2626', emoji: '💊' },
    'hospital': { color: '#b91c1c', emoji: '🏥' },
    'pharmacy': { color: '#ef4444', emoji: '💉' },
    'clinic': { color: '#f87171', emoji: '🩺' },
  };
  
  return configs[category] || { color: '#6b7280', emoji: '📍' };
};

/**
 * Lấy tất cả categories có icon
 */
export const getAvailableCategories = (): string[] => {
  return Object.keys(iconMap);
};

/**
 * Kiểm tra category có icon không
 */
export const hasIcon = (category: string): boolean => {
  const primaryCategory = category.split(',')[0].trim().toLowerCase();
  return primaryCategory in iconMap;
};

// ============================================
// CLUSTER ICONS (for MarkerClusterGroup)
// ============================================

/**
 * Tạo cluster icon với số lượng markers
 */
export const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 40;
  let className = 'marker-cluster-small';
  
  if (count > 100) {
    size = 60;
    className = 'marker-cluster-large';
  } else if (count > 10) {
    size = 50;
    className = 'marker-cluster-medium';
  }
  
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size * 0.4}px;
      ">
        ${count}
      </div>
    `,
    className: className,
    iconSize: [size, size]
  });
};

// ============================================
// SELECTED/HIGHLIGHTED ICONS
// ============================================

/**
 * Tạo icon cho marker được chọn (lớn hơn và có hiệu ứng)
 */
export const createSelectedIcon = (category: string): L.DivIcon => {
  const config = getCategoryConfig(category.split(',')[0].trim().toLowerCase());
  
  return L.divIcon({
    className: 'custom-marker selected',
    html: `
      <div style="
        background-color: ${config.color};
        width: 50px;
        height: 50px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 4px solid #fbbf24;
        box-shadow: 0 0 20px rgba(251, 191, 36, 0.6), 0 6px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 1.5s ease-in-out infinite;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 25px;
        ">${config.emoji}</span>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.1); }
        }
      </style>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });
};

// ============================================
// CATEGORY GROUPS (for filtering)
// ============================================

/**
 * Nhóm categories theo loại
 */
export const categoryGroups = {
  tourism: ['tourist_attraction', 'natural_feature', 'park', 'beach', 'lake', 'waterfall', 'nature'],
  culture: ['cultural', 'temple', 'museum'],
  accommodation: ['accommodation', 'hotel', 'resort', 'lodging'],
  food: ['food', 'restaurant', 'vietnamese_restaurant', 'cafe'],
  shopping: ['shopping', 'mall', 'market'],
  entertainment: ['entertainment', 'cinema', 'nightlife'],
  transportation: ['transportation', 'bus_station', 'train_station', 'airport'],
  sports: ['sports', 'gym', 'stadium'],
  services: ['services', 'spa', 'luxury', 'bank', 'atm'],
  health: ['health', 'hospital', 'pharmacy', 'clinic'],
};

/**
 * Lấy nhóm của một category
 */
export const getCategoryGroup = (category: string): string | null => {
  const primaryCategory = category.split(',')[0].trim().toLowerCase();
  
  for (const [group, categories] of Object.entries(categoryGroups)) {
    if (categories.includes(primaryCategory)) {
      return group;
    }
  }
  
  return null;
};

// ============================================
// EXPORTS
// ============================================

export default {
  getIcon,
  getIconWithSize,
  getCategoryConfig,
  createCustomIcon,
  createClusterIcon,
  createSelectedIcon,
  getAvailableCategories,
  hasIcon,
  categoryGroups,
  getCategoryGroup,
};