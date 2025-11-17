import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Filter, Star, X, Search, Tag, Satellite, Loader2 } from "lucide-react";
import { useMapStore } from "../../../store/mapstore"; 
import type { Category } from "../../../store/mapstore"; 
import axios from '../../../api/axios';
import { useRoutingStore } from "@/store/routingstore";
import toast from "react-hot-toast";

interface ResponsiveFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Category emoji mapping helper
const getCategoryEmojiByName = (categoryName: string): string => {
  const emojiMap: Record<string, string> = {
    "Du lịch": "🎯",
    "Lưu trú": "🏨",
    "Ăn uống": "🍽️",
    "Mua sắm": "🛍️",
    "Giải trí": "🎭",
    "Nghỉ dưỡng": "🌴",
    "Dịch vụ": "🔧",
    "Văn hóa": "🎨",
    "Thể thao": "⚽",
    "Y tế": "🏥",
    "Giáo dục": "📚",
  };
  return emojiMap[categoryName] || "📍";
};

// Debounce helper function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const ResponsiveFilterPanel: React.FC<ResponsiveFilterPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    filters,
    filteredPlaces,
    selectedPlace,
    setFilters,
    resetFilters,
    setSelectedPlace,
  } = useMapStore();
  
  const { useGPS, setUseGPS } = useRoutingStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.searchText || "");

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await axios.get("/categories");
      const data: Category[] = res.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        placeCount: Number(cat.placeCount || 0),
      }));
      setCategories(data);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      toast.error("Lỗi khi tải danh mục");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Memoized category options with emojis and counts
  const categoryOptions = useMemo(() => {
    const options = [
      { value: "", label: "Tất cả địa điểm", emoji: "📍", count: null }
    ];
    
    categories.forEach(cat => {
      options.push({
        value: cat.name,
        label: cat.name,
        emoji: getCategoryEmojiByName(cat.name),
        count: cat.placeCount || 0
      });
    });
    
    return options;
  }, [categories]);

  // Get emoji for a place based on its first category
  const getCategoryEmoji = (categories: Category[]) => {
    if (!categories || categories.length === 0) return "📍";
    return getCategoryEmojiByName(categories[0].name);
  };

  // Get current category label for display
  const getCurrentCategoryLabel = () => {
    if (!filters.categories) return "Tất cả địa điểm";
    const option = categoryOptions.find(
      (opt) => opt.value === filters.categories
    );
    return option?.label || "Tất cả địa điểm";
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters({ searchText: value });
    }, 300),
    [setFilters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilters({ searchText: "" });
  };

  // GPS toggle handler
  const toggleGPS = () => {
    setUseGPS(!useGPS);
    toast.success(
      useGPS ? "GPS đã tắt" : "GPS đã bật - Đang theo dõi vị trí của bạn",
      { duration: 2000 }
    );
  };

  // Handle place selection
  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    resetFilters();
    setSearchValue("");
    toast.success("Đã xóa tất cả bộ lọc", { duration: 2000 });
  };

  return (
    <div className="h-full w-[320px] bg-white/95 backdrop-blur-lg shadow-2xl lg:shadow-xl border-r border-gray-100 flex flex-col">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Đóng bộ lọc"
      >
        <X size={20} className="text-gray-600" />
      </button>

      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold tracking-wide">
            Bộ lọc địa điểm
          </h2>
        </div>
        <p className="text-sm text-blue-100 mt-1">
          Khám phá Phan Thiết dễ dàng hơn 🌴
        </p>
      </div>

      {/* GPS Toggle Section */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${useGPS ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Satellite className={`w-4 h-4 ${useGPS ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                GPS tự động
              </p>
              <p className="text-xs text-gray-500">
                {useGPS ? 'Đang theo dõi vị trí' : 'Tắt'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleGPS}
            aria-label={useGPS ? "Tắt GPS" : "Bật GPS"}
            role="switch"
            aria-checked={useGPS}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              useGPS ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                useGPS ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label 
            htmlFor="search-input"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            <Search className="w-4 h-4 text-blue-600" />
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              id="search-input"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Nhập tên địa điểm..."
              aria-label="Tìm kiếm địa điểm"
              className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-gray-400 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            {searchValue && (
              <button
                onClick={clearSearch}
                aria-label="Xóa tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label 
            htmlFor="category-select"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            <Tag className="w-4 h-4 text-blue-600" />
            Danh mục
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={filters.categories || ""}
              onChange={(e) => setFilters({ categories: e.target.value })}
              disabled={isLoadingCategories}
              aria-label="Chọn danh mục"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                  {option.count !== null && option.count > 0 ? ` (${option.count})` : ''}
                </option>
              ))}
            </select>
            {isLoadingCategories && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 animate-spin" />
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label 
            htmlFor="rating-select"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            <Star className="w-4 h-4 text-blue-600" />
            Đánh giá
          </label>
          <select
            id="rating-select"
            value={filters.rating || ""}
            onChange={(e) => setFilters({ rating: e.target.value })}
            aria-label="Chọn mức đánh giá"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium cursor-pointer transition appearance-none"
          >
            <option value="">Tất cả đánh giá</option>
            <option value="3">⭐⭐⭐ (≥ 3.0 sao)</option>
            <option value="3.5">⭐⭐⭐⭐ (≥ 3.5 sao)</option>
            <option value="4">⭐⭐⭐⭐ (≥ 4.0 sao)</option>
            <option value="4.5">⭐⭐⭐⭐⭐ (≥ 4.5 sao)</option>
            <option value="5">⭐⭐⭐⭐⭐ (5.0 sao)</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="border border-gray-100 rounded-xl bg-blue-50/50 p-4 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kết quả:</span>
            <span className="text-lg font-bold text-blue-600">
              {filteredPlaces.length}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Tag className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-800">
              {getCurrentCategoryLabel()}
            </span>
          </div>
          {filters.rating && (
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800">
                Từ {filters.rating} sao trở lên
              </span>
            </div>
          )}
        </div>

        {/* Place List */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center justify-between">
            <span>Danh sách địa điểm</span>
            <span className="text-blue-600">{filteredPlaces.length}</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-sm font-medium text-gray-600">
                  Không tìm thấy kết quả phù hợp
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              filteredPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  aria-label={`Xem chi tiết ${place.name}`}
                  className={`group w-full text-left p-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedPlace?.id === place.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Category Emoji */}
                    <div className="text-2xl flex-shrink-0">
                      {getCategoryEmoji(place.categories)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Place Name */}
                      <h4 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition line-clamp-2">
                        {place.name}
                      </h4>
                      
                      {/* Address */}
                      {place.address && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                          📍 {place.address}
                        </p>
                      )}
                      
                      {/* Category Badges */}
                      {place.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {place.categories.slice(0, 3).map((cat) => (
                            <span
                              key={cat.id}
                              className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium"
                            >
                              {cat.name}
                            </span>
                          ))}
                          {place.categories.length > 3 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              +{place.categories.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Rating */}
                      {place.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold text-gray-700">
                            {place.rating.toFixed(1)}
                          </span>
                          {place.reviewCount && (
                            <span className="text-xs text-gray-500">
                              ({place.reviewCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleResetFilters}
          aria-label="Xóa tất cả bộ lọc"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 active:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveFilterPanel;