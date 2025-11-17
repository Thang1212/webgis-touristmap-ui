import React, { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useAllFavorites } from '@/hooks/useFavorites';
import FavoriteCard from './FavoriteCard';
import type { Favorite } from '@/type/Favorite.types';

const FavoritesList: React.FC = () => {
  const { favorites, isLoading, error, refetch } = useAllFavorites();
  const [localFavorites, setLocalFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleRemove = (favoriteId: number) => {
    setLocalFavorites(prev => prev.filter(f => f.id !== favoriteId));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (localFavorites.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Địa điểm yêu thích
        </h2>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có địa điểm yêu thích
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Khám phá và lưu lại những địa điểm du lịch yêu thích của bạn để xem lại sau
          </p>
          
         <a   href="/map"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Khám phá ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Địa điểm yêu thích ({localFavorites.length})
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {localFavorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;