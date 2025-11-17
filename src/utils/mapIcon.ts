
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
export const attractionIcon = createCustomIcon('#f59e0b', '🎯');      
export const naturalFeatureIcon = createCustomIcon('#10b981', '🏞️'); 
export const parkIcon = createCustomIcon('#22c55e', '🌳');            
export const beachIcon = createCustomIcon('#06b6d4', '🏖️');          
export const lakeIcon = createCustomIcon('#0ea5e9', '💧');            
export const waterfallIcon = createCustomIcon('#3b82f6', '💦');       
export const natureIcon = createCustomIcon('#84cc16', '🌿');          

// Culture (Văn hóa)
export const culturalIcon = createCustomIcon('#dc2626', '🏛️');       
export const templeIcon = createCustomIcon('#f97316', '⛩️');         
export const museumIcon = createCustomIcon('#7c3aed', '🖼️');         

// Accommodation (Chỗ ở)
export const accommodationIcon = createCustomIcon('#3b82f6', '🏨');   
export const hotelIcon = createCustomIcon('#2563eb', '🏨');           
export const resortIcon = createCustomIcon('#8b5cf6', '🏝️');         
export const lodgingIcon = createCustomIcon('#6366f1', '🏠');         

// Food & Dining (Ẩm thực)
export const foodIcon = createCustomIcon('#10b981', '🍽️');           
export const restaurantIcon = createCustomIcon('#059669', '🍽️');     
export const vietnameseRestaurantIcon = createCustomIcon('#ef4444', '🇻🇳'); 
export const cafeIcon = createCustomIcon('#a78bfa', '☕');            

// Shopping (Mua sắm)
export const shoppingIcon = createCustomIcon('#f97316', '🛍️');       
export const mallIcon = createCustomIcon('#fb923c', '🏬');            
export const marketIcon = createCustomIcon('#ea580c', '🛒');          

// Entertainment (Giải trí)
export const entertainmentIcon = createCustomIcon('#ec4899', '🎭');   
export const cinemaIcon = createCustomIcon('#db2777', '🎬');          
export const nightlifeIcon = createCustomIcon('#a855f7', '🎉');       

// Transportation (Giao thông)
export const transportationIcon = createCustomIcon('#64748b', '🚌'); 
export const busStationIcon = createCustomIcon('#475569', '🚏');      
export const trainStationIcon = createCustomIcon('#334155', '🚆');    
export const airportIcon = createCustomIcon('#1e293b', '✈️');         

// Sports & Recreation (Thể thao)
export const sportsIcon = createCustomIcon('#16a34a', '⚽');          
export const gymIcon = createCustomIcon('#15803d', '🏋️');            
export const stadiumIcon = createCustomIcon('#166534', '🏟️');        

// Services (Dịch vụ)
export const servicesIcon = createCustomIcon('#0891b2', '🔧');       
export const spaIcon = createCustomIcon('#ec4899', '💆');            
export const luxuryIcon = createCustomIcon('#fbbf24', '⭐');         
export const bankIcon = createCustomIcon('#0e7490', '🏦');           
export const atmIcon = createCustomIcon('#155e75', '💳');            

// Health (Sức khỏe)
export const healthIcon = createCustomIcon('#dc2626', '💊');         
export const hospitalIcon = createCustomIcon('#b91c1c', '🏥');       
export const pharmacyIcon = createCustomIcon('#ef4444', '💉');       
export const clinicIcon = createCustomIcon('#f87171', '🩺');         

// Default
export const defaultIcon = createCustomIcon('#6b7280', '📍');        

// ============================================
// ICON MAPPING
// ============================================

const iconMap: Record<string, L.DivIcon> = {
  'tourist_attraction': attractionIcon,
  'natural_feature': naturalFeatureIcon,
  'park': parkIcon,
  'beach': beachIcon,
  'lake': lakeIcon,
  'waterfall': waterfallIcon,
  'nature': natureIcon,
  'cultural': culturalIcon,
  'temple': templeIcon,
  'museum': museumIcon,
  'accommodation': accommodationIcon,
  'hotel': hotelIcon,
  'resort': resortIcon,
  'lodging': lodgingIcon,
  'food': foodIcon,
  'restaurant': restaurantIcon,
  'vietnamese_restaurant': vietnameseRestaurantIcon,
  'cafe': cafeIcon,
  'shopping': shoppingIcon,
  'mall': mallIcon,
  'market': marketIcon,
  'entertainment': entertainmentIcon,
  'cinema': cinemaIcon,
  'nightlife': nightlifeIcon,
  'transportation': transportationIcon,
  'bus_station': busStationIcon,
  'train_station': trainStationIcon,
  'airport': airportIcon,
  'sports': sportsIcon,
  'gym': gymIcon,
  'stadium': stadiumIcon,
  'services': servicesIcon,
  'spa': spaIcon,
  'luxury': luxuryIcon,
  'bank': bankIcon,
  'atm': atmIcon,
  'health': healthIcon,
  'hospital': hospitalIcon,
  'pharmacy': pharmacyIcon,
  'clinic': clinicIcon,
};

// ============================================
// VIETNAMESE TO ENGLISH MAPPING
// ============================================

const vietnameseToEnglish: Record<string, string> = {
  // Du lịch
  'du lịch': 'tourist_attraction',
  'điểm du lịch': 'tourist_attraction',
  'tham quan': 'tourist_attraction',
  'danh lam': 'natural_feature',
  'thiên nhiên': 'natural_feature',
  'công viên': 'park',
  'bãi biển': 'beach',
  'hồ': 'lake',
  'thác nước': 'waterfall',
  'Nghỉ dưỡng': 'resort',
  // Văn hóa
  'văn hóa': 'cultural',
  'chùa': 'temple',
  'đền': 'temple',
  'bảo tàng': 'museum',
  
  // Lưu trú
  'lưu trú': 'hotel',
  'khách sạn': 'hotel',
  'resort': 'resort',
  'nhà nghỉ': 'lodging',
  'homestay': 'lodging',
  
  // Ăn uống
  'ăn uống': 'restaurant',
  'ẩm thực': 'restaurant',
  'nhà hàng': 'restaurant',
  'quán ăn': 'restaurant',
  'cafe': 'cafe',
  'cà phê': 'cafe',
  'quán café': 'cafe',
  
  // Mua sắm
  'mua sắm': 'shopping',
  'trung tâm thương mại': 'mall',
  'siêu thị': 'mall',
  'chợ': 'market',
  
  // Giải trí
  'giải trí': 'entertainment',
  'rạp chiếu phim': 'cinema',
  'bar': 'nightlife',
  'club': 'nightlife',
  
  // Dịch vụ
  'dịch vụ': 'services',
  'spa': 'spa',
  'massage': 'spa',
  'ngân hàng': 'bank',
  'atm': 'atm',
  
  // Sức khỏe
  'sức khỏe': 'health',
  'bệnh viện': 'hospital',
  'nhà thuốc': 'pharmacy',
  'phòng khám': 'clinic',
  
  // Thể thao
  'thể thao': 'sports',
  'phòng gym': 'gym',
  'sân vận động': 'stadium',
  
  // Giao thông
  'giao thông': 'transportation',
  'bến xe': 'bus_station',
  'ga tàu': 'train_station',
  'sân bay': 'airport',
};

/**
 * Lấy icon dựa trên category (HỖ TRỢ TIẾNG VIỆT)
 * @param category - Category string (Vietnamese hoặc English)
 * @returns L.DivIcon
 */
export const getIcon = (category: string): L.DivIcon => {
  if (!category) return defaultIcon;
  
  // Normalize
  const normalized = category.trim().toLowerCase();
  
  // Convert Vietnamese to English if needed
  const englishKey = vietnameseToEnglish[normalized] || normalized;
  
  // Return icon from map
  return iconMap[englishKey] || defaultIcon;
};

/**
 * Lấy icon với size tùy chỉnh
 */
export const getIconWithSize = (category: string, size: number): L.DivIcon => {
  const normalized = category.trim().toLowerCase();
  const englishKey = vietnameseToEnglish[normalized] || normalized;
  const config = getCategoryConfig(englishKey);
  
  return createCustomIcon(config.color, config.emoji, size);
};

/**
 * Lấy config (color + emoji) cho category (HỖ TRỢ TIẾNG VIỆT)
 */
export const getCategoryConfig = (category: string): { color: string; emoji: string } => {
  // Normalize and convert Vietnamese if needed
  const normalized = category.trim().toLowerCase();
  const englishKey = vietnameseToEnglish[normalized] || normalized;
  
  const configs: Record<string, { color: string; emoji: string }> = {
    'tourist_attraction': { color: '#f59e0b', emoji: '🎯' },
    'natural_feature': { color: '#10b981', emoji: '🏞️' },
    'park': { color: '#22c55e', emoji: '🌳' },
    'beach': { color: '#06b6d4', emoji: '🏖️' },
    'lake': { color: '#0ea5e9', emoji: '💧' },
    'waterfall': { color: '#3b82f6', emoji: '💦' },
    'nature': { color: '#84cc16', emoji: '🌿' },
    'cultural': { color: '#dc2626', emoji: '🏛️' },
    'temple': { color: '#f97316', emoji: '⛩️' },
    'museum': { color: '#7c3aed', emoji: '🖼️' },
    'accommodation': { color: '#3b82f6', emoji: '🏨' },
    'hotel': { color: '#2563eb', emoji: '🏨' },
    'resort': { color: '#8b5cf6', emoji: '🏝️' },
    'lodging': { color: '#6366f1', emoji: '🏠' },
    'food': { color: '#10b981', emoji: '🍽️' },
    'restaurant': { color: '#059669', emoji: '🍽️' },
    'vietnamese_restaurant': { color: '#ef4444', emoji: '🇻🇳' },
    'cafe': { color: '#a78bfa', emoji: '☕' },
    'shopping': { color: '#f97316', emoji: '🛍️' },
    'mall': { color: '#fb923c', emoji: '🏬' },
    'market': { color: '#ea580c', emoji: '🛒' },
    'entertainment': { color: '#ec4899', emoji: '🎭' },
    'cinema': { color: '#db2777', emoji: '🎬' },
    'nightlife': { color: '#a855f7', emoji: '🎉' },
    'transportation': { color: '#64748b', emoji: '🚌' },
    'bus_station': { color: '#475569', emoji: '🚏' },
    'train_station': { color: '#334155', emoji: '🚆' },
    
    'airport': { color: '#1e293b', emoji: '✈️' },
    'sports': { color: '#16a34a', emoji: '⚽' },
    'gym': { color: '#15803d', emoji: '🏋️' },
    'stadium': { color: '#166534', emoji: '🏟️' },
    'services': { color: '#0891b2', emoji: '🔧' },
    'spa': { color: '#ec4899', emoji: '💆' },
    'luxury': { color: '#fbbf24', emoji: '⭐' },
    'bank': { color: '#0e7490', emoji: '🏦' },
    'atm': { color: '#155e75', emoji: '💳' },
    'health': { color: '#dc2626', emoji: '💊' },
    'hospital': { color: '#b91c1c', emoji: '🏥' },
    'pharmacy': { color: '#ef4444', emoji: '💉' },
    'clinic': { color: '#f87171', emoji: '🩺' },
  };
  
  return configs[englishKey] || { color: '#6b7280', emoji: '📍' };
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
  const normalized = category.trim().toLowerCase();
  const englishKey = vietnameseToEnglish[normalized] || normalized;
  return englishKey in iconMap;
};

// ============================================
// CLUSTER ICONS
// ============================================

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
// SELECTED ICONS
// ============================================

export const createSelectedIcon = (category: string): L.DivIcon => {
  const config = getCategoryConfig(category);
  
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
// CATEGORY GROUPS
// ============================================

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

export const getCategoryGroup = (category: string): string | null => {
  const normalized = category.trim().toLowerCase();
  const englishKey = vietnameseToEnglish[normalized] || normalized;
  
  for (const [group, categories] of Object.entries(categoryGroups)) {
    if (categories.includes(englishKey)) {
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
  vietnameseToEnglish,
};