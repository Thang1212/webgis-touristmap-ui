import React, { useState } from "react";
import { 
  X, Star, Phone, Globe, Navigation, Info, MessageSquare, Clock, 
  MapPin, Video, Minimize2, Maximize2, Square, Heart, Map 
} from "lucide-react";
import { useMapStore } from "../../../store/mapstore";
import InfoTab from "../components/InfoTab";
import ReviewsTab from "../components/Reviews";
import RoutingTab from "./RoutingTab";
import VideoTab from "./VideoTab";
import NearbyTab from "./NearbyTab";
import { useFavorites } from "../../../hooks/useFavorites";
import { useRoutingStore } from "@/store/routingstore";

interface ResponsiveDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResponsiveDetailsPanel: React.FC<ResponsiveDetailsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    selectedPlace, 
    setSelectedPlace,
    detailsPanelMode,
    isDetailsPanelMinimized,
    setDetailsPanelMode,
    setIsDetailsPanelMinimized
  } = useMapStore();
  
  const { isFavorite, isLoading, toggleFavorite } = useFavorites(selectedPlace?.id);
  const { clearRoute } = useRoutingStore();
  
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'routing' | 'video' | 'nearby'>('info');
  
  if (!selectedPlace) return null;

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
      hotel: "bg-blue-50 text-blue-700 border border-blue-200",
      resort: "bg-purple-50 text-purple-700 border border-purple-200",
      lodging: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      restaurant: "bg-green-50 text-green-700 border border-green-200",
      food: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      tourist_attraction: "bg-amber-50 text-amber-700 border border-amber-200",
      park: "bg-teal-50 text-teal-700 border border-teal-200",
      lake: "bg-cyan-50 text-cyan-700 border border-cyan-200",
      waterfall: "bg-blue-50 text-blue-700 border border-blue-200",
      nature: "bg-lime-50 text-lime-700 border border-lime-200",
      luxury: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      spa: "bg-pink-50 text-pink-700 border border-pink-200",
      vietnamese_restaurant: "bg-red-50 text-red-700 border border-red-200",
      "Du lịch": "bg-amber-50 text-amber-700 border border-amber-200",
      "Lưu trú": "bg-blue-50 text-blue-700 border border-blue-200",
      "Ăn uống": "bg-green-50 text-green-700 border border-green-200",
      "Mua sắm": "bg-pink-50 text-pink-700 border border-pink-200",
      "Giải trí": "bg-purple-50 text-purple-700 border border-purple-200",
    };
    return colors[categoryName] || "bg-gray-50 text-gray-700 border border-gray-200";
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

  const handleClose = () => {
    clearRoute();
    setSelectedPlace(null);
    onClose();
  };

  const toggleMode = () => {
    setDetailsPanelMode(detailsPanelMode === 'panel' ? 'window' : 'panel');
    setIsDetailsPanelMinimized(false);
  };

  const toggleMinimize = () => {
    setIsDetailsPanelMinimized(!isDetailsPanelMinimized);
  };

  const isWindowMode = detailsPanelMode === 'window';
  
  // Responsive window mode classes
  const windowModeClasses = isWindowMode
    ? `fixed z-50 border border-gray-300/50 backdrop-blur-xl shadow-2xl
       bottom-4 right-4
       w-[min(380px,calc(100vw-2rem))]
       ${isDetailsPanelMinimized ? 'h-auto' : 'h-[min(600px,calc(100vh-2rem))]'}
       rounded-2xl
       sm:w-[380px]
       sm:h-${isDetailsPanelMinimized ? 'auto' : '[600px]'}
       md:bottom-4 md:right-4`
    : 'h-full';

  return (
    <div 
      className={`bg-white flex flex-col overflow-y-hidden transition-all duration-300 z-[100] mt-10 ${windowModeClasses} ${
        isWindowMode ? '' : 'border-l border-gray-200'
      }`}
    >
      {/* ============= WINDOW MODE HEADER ============= */}
      {isWindowMode ? (
        <div className="relative rounded-t-2xl overflow-hidden flex-shrink-0">
          {/* Background Image Blur */}
          <div className="absolute inset-0">
            <img
              referrerPolicy="no-referrer"
              src={selectedPlace.imageThumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'}
              alt={selectedPlace.name}
              className="w-full h-full object-cover blur-md scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-indigo-700/95 to-purple-700/95" />
          </div>

          {/* Content */}
          <div className="relative px-3 py-2.5">
            <div className="flex items-start gap-2.5">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ring-2 ring-white/30 shadow-lg">
                <img
                  referrerPolicy="no-referrer"
                  src={selectedPlace.imageThumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-white truncate leading-tight mb-1">
                  {selectedPlace.name}
                </h3>
                
                {/* Rating & Category - Only show when not minimized */}
                {!isDetailsPanelMinimized && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedPlace.rating && (
                      <div className="flex items-center gap-1 bg-white/25 backdrop-blur-sm px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                        <span className="text-xs font-bold text-white">{selectedPlace.rating.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedPlace.categories[0] && (
                      <span className="text-[10px] text-white/90 bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]">
                        {getCategoryLabel(selectedPlace.categories[0].name)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={toggleMinimize}
                  className="p-1.5 hover:bg-white/25 rounded-lg transition-all active:scale-90 backdrop-blur-sm"
                  title={isDetailsPanelMinimized ? "Mở rộng" : "Thu nhỏ"}
                >
                  {isDetailsPanelMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Minimize2 className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleMode}
                  className="p-1.5 hover:bg-white/25 rounded-lg transition-all active:scale-90 backdrop-blur-sm"
                  title="Chế độ panel"
                >
                  <Square className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-red-500/40 rounded-lg transition-all active:scale-90 backdrop-blur-sm"
                  title="Đóng"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============= PANEL MODE HEADER ============= */
        <div className="relative h-64 sm:h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 overflow-hidden">
          <img
            referrerPolicy="no-referrer"
            src={selectedPlace.imageThumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
            alt={selectedPlace.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
          
          {/* Control Buttons */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
            <button
              onClick={toggleMode}
              className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-xl active:scale-95 border border-white/20"
              title="Chế độ cửa sổ"
            >
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <button
              onClick={handleClose}
              className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-xl active:scale-95 border border-white/20"
              title="Đóng"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </div>

          {/* Basic Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-4 sm:pb-5">
            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {selectedPlace.categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold backdrop-blur-md bg-white/95 shadow-sm ${getCategoryColor(category.name)}`}
                >
                  {getCategoryLabel(category.name)}
                </span>
              ))}
            </div>
            
            {/* Place Name */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg leading-tight line-clamp-2">
              {selectedPlace.name}
            </h2>
            
            {/* Rating Info */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/95 flex-wrap">
              {selectedPlace.rating && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 drop-shadow" />
                  <span className="font-bold text-base sm:text-lg">{selectedPlace.rating.toLocaleString()}</span>
                  <span className="text-xs sm:text-sm font-medium">/5</span>
                </div>
              )}
              {selectedPlace.userRatingsTotal && (
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold">
                    {selectedPlace.userRatingsTotal.toLocaleString()} đánh giá
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/70">từ Google Maps</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============= CONTENT SECTION ============= */}
      {!isDetailsPanelMinimized && (
        <>
          {/* Tabs Navigation */}
          <div className={`flex border-b border-gray-200 bg-white flex-shrink-0 shadow-sm sticky top-0 z-10 ${
            isWindowMode ? 'overflow-x-auto scrollbar-hide' : ''
          }`}>
            {[
              { id: 'info', icon: Info, label: 'Info' },
              { id: 'reviews', icon: MessageSquare, label: 'Đánh giá' },
              { id: 'routing', icon: Navigation, label: 'Đường' },
              { id: 'video', icon: Video, label: 'Video' },
              { id: 'nearby', icon: Map, label: 'Gần đây' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all relative group ${
                  isWindowMode ? 'py-2 px-1 min-w-[56px]' : 'py-2.5 sm:py-3 px-2'
                } ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`transition-transform group-hover:scale-110 ${
                  isWindowMode ? 'w-4 h-4' : 'w-4 h-4'
                } ${activeTab === tab.id ? 'text-blue-600' : ''}`} />
                <span className={`whitespace-nowrap font-medium ${
                  isWindowMode ? 'text-[9px]' : 'text-[10px] sm:text-xs'
                }`}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="min-h-full">
              {activeTab === 'info' ? (
                <InfoTab place={selectedPlace} />
              ) : activeTab === 'reviews' ? (
                <ReviewsTab place={selectedPlace} />
              ) : activeTab === 'routing' ? (
                <RoutingTab place={selectedPlace} />
              ) : activeTab === 'video' ? (
                <VideoTab place={selectedPlace} />
              ) : activeTab === 'nearby' ? (
                <NearbyTab place={selectedPlace} />
              ) : null}
            </div>
          </div>

          {/* ============= FOOTER ACTION BUTTONS ============= */}
          <div
  className={`border-t border-gray-100 bg-white flex-shrink-0 ${
    isWindowMode ? "p-1.5" : "p-2 sm:p-3"
  }`}
>
  <div
    className={`grid grid-cols-3 ${
      isWindowMode ? "gap-1" : "gap-1.5 sm:gap-2"
    }`}
  >
    {[
      {
        label: isFavorite ? "Đã lưu" : "Yêu thích",
        onClick: toggleFavorite,
        disabled: isLoading,
        icon: (
          <Heart
            className={`transition-all duration-200 ${
              isWindowMode ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-4.5 sm:h-4.5"
            } ${
              isFavorite
                ? "fill-red-500 scale-105"
                : "text-gray-600 group-hover:text-red-500"
            }`}
          />
        ),
        className: isFavorite
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
      },
      {
        label: "Gọi",
        onClick: handleCallPhone,
        disabled: !selectedPlace.phone,
        icon: (
          <Phone
            className={`${
              isWindowMode ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-4.5 sm:h-4.5"
            }`}
          />
        ),
        className: selectedPlace.phone
          ? "border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
          : "opacity-40 cursor-not-allowed border-gray-100 text-gray-400",
      },
      {
        label: "Web",
        onClick: handleOpenWebsite,
        disabled: !selectedPlace.website,
        icon: (
          <Globe
            className={`${
              isWindowMode ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-4.5 sm:h-4.5"
            }`}
          />
        ),
        className: selectedPlace.website
          ? "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          : "opacity-40 cursor-not-allowed border-gray-100 text-gray-400",
      },
    ].map((btn, i) => (
      <button
        key={i}
        onClick={btn.onClick}
        disabled={btn.disabled}
        className={`group flex flex-col items-center justify-center font-medium border rounded-md transition-all duration-200 ${
          isWindowMode
            ? "gap-0.5 px-1.5 py-1.5 text-[9px]"
            : "gap-0.5 sm:gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs"
        } ${btn.className}`}
      >
        {btn.icon}
        <span className="leading-tight">{btn.label}</span>
      </button>
    ))}
  </div>
</div>

        </>
      )}
    </div>
  );
};

export default ResponsiveDetailsPanel;