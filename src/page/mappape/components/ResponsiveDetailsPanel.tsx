import React, { useState } from "react";
import { X, Star, Phone, Globe, Navigation, Info, MessageSquare, Clock, MapPin, Video } from "lucide-react";
import { useMapStore,  } from "../../../store/mapstore";
import type {Category } from "../../../store/mapstore";
import InfoTab from "../components/InfoTab";
import ReviewsTab from "../components/Reviews";
import RoutingTab from "./RoutingTab";
import VideoTab from "./VideoTab";

interface ResponsiveDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResponsiveDetailsPanel: React.FC<ResponsiveDetailsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedPlace, setSelectedPlace } = useMapStore();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'routing' | 'video'>('info');
  
  if (!selectedPlace) return null;

  // ✅ FIXED: Get primary category from array
  const getPrimaryCategory = (categories: Category[]): string => {
    if (!categories || categories.length === 0) return "";
    return categories[0].name;
  };

  const getCategoryLabel = (categoryName: string): string => {
    const labels: Record<string, string> = {
      hotel: "Khách sạn",
      resort: "Resort",
      lodging: "Chỗ ở",
      restaurant: "Nhà hàng",
      food: "Ẩm thực",
      tourist_attraction: "Điểm du lịch",
      park: "Công viên",
      lake: "Hồ",
      waterfall: "Thác nước",
      nature: "Thiên nhiên",
      luxury: "Cao cấp",
      spa: "Spa",
      vietnamese_restaurant: "Nhà hàng Việt",
      "Du lịch": "Điểm du lịch",
      "Lưu trú": "Lưu trú",
      "Ăn uống": "Ẩm thực",
      "Mua sắm": "Mua sắm",
      "Giải trí": "Giải trí",
    };
    return labels[categoryName] || categoryName;
  };

  const getCategoryColor = (categoryName: string): string => {
    const colors: Record<string, string> = {
      hotel: "bg-blue-100 text-blue-700",
      resort: "bg-purple-100 text-purple-700",
      lodging: "bg-indigo-100 text-indigo-700",
      restaurant: "bg-green-100 text-green-700",
      food: "bg-emerald-100 text-emerald-700",
      tourist_attraction: "bg-amber-100 text-amber-700",
      park: "bg-teal-100 text-teal-700",
      lake: "bg-cyan-100 text-cyan-700",
      waterfall: "bg-blue-100 text-blue-700",
      nature: "bg-lime-100 text-lime-700",
      luxury: "bg-yellow-100 text-yellow-700",
      spa: "bg-pink-100 text-pink-700",
      vietnamese_restaurant: "bg-red-100 text-red-700",
      "Du lịch": "bg-amber-100 text-amber-700",
      "Lưu trú": "bg-blue-100 text-blue-700",
      "Ăn uống": "bg-green-100 text-green-700",
      "Mua sắm": "bg-pink-100 text-pink-700",
      "Giải trí": "bg-purple-100 text-purple-700",
    };
    return colors[categoryName] || "bg-gray-100 text-gray-700";
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  const getOpeningHours = () => {
    if (!selectedPlace.open_hour || !selectedPlace.close_hour) return null;
    
    const open = formatTime(selectedPlace.open_hour);
    const close = formatTime(selectedPlace.close_hour);
    
    if (open === "00:00" && close === "23:59") {
      return `Mở cửa 24/7`;
    }
    
    return `${open} - ${close}`;
  };

  const handleCallPhone = () => {
    if (selectedPlace.phone) {
      window.location.href = `tel:${selectedPlace.phone}`;
    }
  };

  const handleOpenWebsite = () => {
    if (selectedPlace.website) {
      window.open(selectedPlace.website, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGetDirections = () => {
    const { lat, lng } = {
      lat: selectedPlace.location.coordinates[1],
      lng: selectedPlace.location.coordinates[0]
    };
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleClose = () => {
    setSelectedPlace(null);
    onClose();
  };

  // ✅ Get primary category info
  const primaryCategoryName = getPrimaryCategory(selectedPlace.categories);
  const categoryLabel = getCategoryLabel(primaryCategoryName);
  const categoryColor = getCategoryColor(primaryCategoryName);

  return (
    <div className="h-full bg-white shadow-2xl lg:shadow-xl border-l border-gray-200 flex flex-col overflow-hidden pt-10">
      {/* Header with Image */}
      <div className="relative h-64 bg-gray-200 flex-shrink-0">
        <img 
          src={selectedPlace.imageThumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} 
          alt={selectedPlace.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Basic Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedPlace.categories.map((category) => (
              <span
                key={category.id}
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category.name)}`}
              >
                {getCategoryLabel(category.name)}
              </span>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1">{selectedPlace.name}</h2>
          <div className="flex items-center gap-4 text-white/90">
            {selectedPlace.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{selectedPlace.rating.toLocaleString()}/5</span>
                {selectedPlace.userRatingsTotal && (
                  <span className="text-sm">({selectedPlace.userRatingsTotal.toLocaleString()} đánh giá)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      {/* <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-2 flex-shrink-0">
        {selectedPlace.address && (
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{selectedPlace.address}</span>
          </div>
        )}
        {getOpeningHours() && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{getOpeningHours()}</span>
          </div>
        )}
      </div> */}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-all ${
            activeTab === 'info'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Info className="w-4 h-4" />
          Thông tin
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-all ${
            activeTab === 'reviews'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Đánh giá
        </button>
        <button
          onClick={() => setActiveTab('routing')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-all ${
            activeTab === 'routing'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Navigation className="w-4 h-4" />
          Chỉ đường
        </button>
                <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-all ${
            activeTab === 'video'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Video className="w-4 h-4" />
          Video
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'info' ? (
          <InfoTab place={selectedPlace} />
        ) : activeTab === 'reviews' ? (
          <ReviewsTab place={selectedPlace} />
        ) : activeTab === 'video' ? (
          <VideoTab place={selectedPlace} />
        ): (
          <RoutingTab />
        )}
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3 flex-shrink-0">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleCallPhone}
            disabled={!selectedPlace.phone}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl transition-all ${
              selectedPlace.phone 
                ? 'hover:bg-gray-50 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Phone className="w-4 h-4" />
            Gọi điện
          </button>
          <button 
            onClick={handleOpenWebsite}
            disabled={!selectedPlace.website}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl transition-all ${
              selectedPlace.website 
                ? 'hover:bg-gray-50 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Globe className="w-4 h-4" />
            Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDetailsPanel;