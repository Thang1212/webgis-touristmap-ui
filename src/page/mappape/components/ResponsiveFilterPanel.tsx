import React from "react";
import { Filter, Star, X, Search, Tag, Satellite } from "lucide-react";
import { useMapStore } from "../../../store/mapstore"; 
import type { Category } from "../../../store/mapstore"; 

import { useRoutingStore } from "@/store/routingstore";

interface ResponsiveFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  const categoryOptions = [
    { value: "", label: "Tất cả", emoji: "📍" },
    { value: "Du lịch", label: "Điểm du lịch", emoji: "🎯" },
    { value: "Lưu trú", label: "Lưu trú", emoji: "🏨" },
    { value: "Ăn uống", label: "Ẩm thực", emoji: "🍽️" },
    { value: "Mua sắm", label: "Mua sắm", emoji: "🛍️" },
    { value: "Giải trí", label: "Giải trí", emoji: "🎭" },
  ];

  const getCategoryEmoji = (categories: Category[]) => {
    if (!categories || categories.length === 0) return "📍";
    
    // Lấy category đầu tiên
    const primaryCategory = categories[0].name;
    
    const option = categoryOptions.find((opt) => 
      opt.value.toLowerCase() === primaryCategory.toLowerCase()
    );
    
    return option?.emoji || "📍";
  };

  const getCurrentCategoryLabel = () => {
    if (!filters.categories) return "Tất cả địa điểm";
    const option = categoryOptions.find(
      (opt) => opt.value === filters.categories
    );
    return option?.label || "Tất cả địa điểm";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchText: e.target.value });
  };

  const toggleGPS = () => {
    setUseGPS(!useGPS);
  };

  return (
    <div className="h-full w-[320px] bg-white/95 backdrop-blur-lg shadow-2xl lg:shadow-xl border-r border-gray-100 flex flex-col">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Close filter"
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
            {useGPS ? (
              <div className="p-2 bg-blue-100 rounded-lg">
                <Satellite className="w-4 h-4 text-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-gray-100 rounded-lg">
                <Satellite className="w-4 h-4 text-gray-400" />
              </div>
            )}
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <Search className="w-4 h-4 text-blue-600" />
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchText || ""}
              onChange={handleSearchChange}
              placeholder="Nhập tên địa điểm..."
              className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-gray-400 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {filters.searchText && (
              <button
                onClick={() => setFilters({ searchText: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <Tag className="w-4 h-4 text-blue-600" />
            Danh mục
          </label>
          <select
            value={filters.categories || ""}
            onChange={(e) => setFilters({ categories: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium cursor-pointer transition"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
            <Star className="w-4 h-4 text-blue-600" />
            Đánh giá
          </label>
          <select
            value={filters.rating || ""}
            onChange={(e) => setFilters({ rating: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium cursor-pointer transition"
          >
            <option value="">Tất cả</option>
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
            <Tag className="w-4 h-4 text-blue-600 mt-0.5" />
            <span className="text-sm font-medium text-gray-800">
              {getCurrentCategoryLabel()}
            </span>
          </div>
        </div>

        {/* Place List */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Danh sách địa điểm ({filteredPlaces.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm">Không tìm thấy kết quả phù hợp</p>
              </div>
            ) : (
              filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    setSelectedPlace(place);
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedPlace?.id === place.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* ✅ FIXED: Pass array to function */}
                    <div className="text-2xl">
                      {getCategoryEmoji(place.categories)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition">
                        {place.name}
                      </h4>
                      {place.address && (
                        <p className="text-xs text-gray-500 truncate">
                          {place.address}
                        </p>
                      )}
                      {/* ✅ NEW: Display all categories as badges */}
                      {place.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {place.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {place.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium text-gray-700">
                            {place.rating.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ResponsiveFilterPanel;