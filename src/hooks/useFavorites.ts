// hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import { favoritesApi } from '../api/favoritesApi';
import { toast } from 'react-hot-toast'; // Hoặc notification library anh dùng

export const useFavorites = (placeId: number | undefined) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if place is favorited on mount
  useEffect(() => {
    if (!placeId) return;

    const checkFavorite = async () => {
      try {
        const result = await favoritesApi.check(placeId);
        setIsFavorite(result.isFavorite || false);
      } catch (err: any) {
        // Nếu chưa login, err.response.status === 401
        if (err.response?.status === 401) {
          setIsFavorite(false);
        } else {
          console.error('Error checking favorite status:', err);
        }
      }
    };

    checkFavorite();
  }, [placeId]);

  // Toggle favorite function
  const toggleFavorite = useCallback(async () => {
    if (!placeId) {
      toast.error('Không tìm thấy địa điểm');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await favoritesApi.toggle(placeId);
      
      if (response.success) {
        setIsFavorite(response.isFavorite || !isFavorite);
        toast.success(
          response.message || (isFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích'),
          {
            icon: isFavorite ? '💔' : '❤️',
          }
        );
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra';
      
      // Handle 401 - Not authenticated
      if (err.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để lưu địa điểm yêu thích');
        // Optional: Redirect to login
        // window.location.href = '/login';
      } else {
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  }, [placeId, isFavorite]);

  return {
    isFavorite,
    isLoading,
    error,
    toggleFavorite,
  };
};

// Hook to get all favorites
export const useAllFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await favoritesApi.getAll(page, limit);
      if (response.success) {
        setFavorites(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách yêu thích';
      setError(errorMessage);
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    refetch: fetchFavorites,
  };
};