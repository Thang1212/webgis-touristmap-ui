// hooks/useReviews.ts
import { useState, useCallback } from 'react';
import api from '../api/axios'; 

interface Review {
  id: string;
  user_id: string;
  place_id: number;
  rating: number;
  comment: string | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface ReviewStats {
  avgRating: number;
  totalReviews: number;
}

interface CreateReviewData {
  place_id: number;
  rating: number;
  comment?: string;
  images?: File[];
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
  existingImages?: string[];
  newImages?: File[];
}

export const useReviews = (placeId?: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy reviews của place
  const fetchReviews = useCallback(async (id?: number) => {
    const targetId = id || placeId;
    if (!targetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/reviews/place/${targetId}`); // ✅ Dùng api instance
       console.log(response.data)
      setReviews(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải đánh giá');
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [placeId]);

  // Lấy stats
  const fetchStats = useCallback(async (id?: number) => {
    const targetId = id || placeId;
    if (!targetId) return;

    try {
      const response = await api.get(`/reviews/place/${targetId}/stats`); // ✅ Dùng api instance
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  }, [placeId]);

  // Tạo review
  const createReview = useCallback(async (data: CreateReviewData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('place_id', data.place_id.toString());
      formData.append('rating', data.rating.toString());
      if (data.comment) formData.append('comment', data.comment);

      if (data.images) {
        data.images.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await api.post('/reviews', formData, { // ✅ Dùng api instance
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh reviews
      await fetchReviews();
      await fetchStats();

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo đánh giá');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchReviews, fetchStats]);

  // Update review
  const updateReview = useCallback(async (reviewId: string, data: UpdateReviewData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (data.rating) formData.append('rating', data.rating.toString());
      if (data.comment !== undefined) formData.append('comment', data.comment);
      if (data.existingImages) {
        formData.append('existingImages', JSON.stringify(data.existingImages));
      }

      if (data.newImages) {
        data.newImages.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await api.put(`/reviews/${reviewId}`, formData, { // ✅ Dùng api instance
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh reviews
      await fetchReviews();
      await fetchStats();

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật đánh giá');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchReviews, fetchStats]);

  // Delete review
  const deleteReview = useCallback(async (reviewId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/reviews/${reviewId}`); // ✅ Dùng api instance

      // Refresh reviews
      await fetchReviews();
      await fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa đánh giá');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchReviews, fetchStats]);

  return {
    reviews,
    stats,
    isLoading,
    error,
    fetchReviews,
    fetchStats,
    createReview,
    updateReview,
    deleteReview,
  };
};