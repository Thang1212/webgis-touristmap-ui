import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import type { Favorite } from '@/type/Favorite.types';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '@/api/favoritesApi';
import { toast } from 'react-hot-toast';
import { useMapStore } from '@/store/mapstore';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: number) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onRemove }) => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = React.useState(false);
  const {
      setSelectedPlace,
    } = useMapStore();
  const place = favorite.place;
  if (!place) return null;

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      await favoritesApi.remove(place.id);
      toast.success('Đã xóa khỏi danh sách yêu thích');
      onRemove(favorite.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCardClick = () => {
    setSelectedPlace(place)
    navigate('/map', { state: { selectedPlaceId: place.id } });
  };

  // ✅ FIX: Check if categories is array or string
  let categories: any[] = [];
  let firstCategory = 'Địa điểm';

  if (place.categories) {
    if (Array.isArray(place.categories)) {
      // ✅ Categories là array of objects
      categories = place.categories;
      firstCategory = categories[0]?.name || 'Địa điểm';
    } else if (typeof place.categories === 'string') {
      // ✅ Categories là string (comma-separated)
      const categoryNames = place.categories.split(',');
      firstCategory = categoryNames[0] || 'Địa điểm';
    }
  }

  // ✅ Helper function để get category label
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

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.imageThumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-all ${
            isRemoving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isRemoving ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          )}
        </button>

        {/* Category Badge */}
        {firstCategory && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
              {getCategoryLabel(firstCategory)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {place.name}
        </h3>

        {/* Address */}
        {place.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{place.address}</span>
          </div>
        )}

        {/* Rating & Date */}
        <div className="flex items-center justify-between">
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{place.rating.toLocaleString()}</span>
              {place.userRatingsTotal && (
                <span className="text-sm text-gray-500">
                  ({place.userRatingsTotal})
                </span>
              )}
            </div>
          )}

          {/* Saved date */}
          <span className="text-xs text-gray-400">
            {new Date(favorite.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;