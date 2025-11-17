// api/favoritesApi.ts
import api from './axios';

interface FavoriteResponse {
  success: boolean;
  message: string;
  isFavorite?: boolean;
  data?: any;
}

interface FavoritesListResponse {
  success: boolean;
  data: Array<{
    id: number;
    place_id: number;
    place?: any;
    created_at: string;
    updated_at: string;
  }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface FavoriteIdsResponse {
  success: boolean;
  data: number[];
}

interface FavoriteCountResponse {
  success: boolean;
  placeId: number;
  favoriteCount: number;
}

export const favoritesApi = {
  // Toggle favorite (add/remove)
  toggle: async (placeId: number): Promise<FavoriteResponse> => {
    const response = await api.post<FavoriteResponse>('/favorites/toggle', { placeId });
    return response.data;
  },

  // Check if place is favorited
  check: async (placeId: number): Promise<FavoriteResponse> => {
    const response = await api.get<FavoriteResponse>(`/favorites/check/${placeId}`);
    return response.data;
  },

  // Get all favorites with pagination
  getAll: async (page = 1, limit = 20): Promise<FavoritesListResponse> => {
    const response = await api.get<FavoritesListResponse>(
      `/favorites?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get favorite place IDs only
  getIds: async (): Promise<FavoriteIdsResponse> => {
    const response = await api.get<FavoriteIdsResponse>('/favorites/ids');
    return response.data;
  },

  // Add favorite (strict - only add)
  add: async (placeId: number): Promise<FavoriteResponse> => {
    const response = await api.post<FavoriteResponse>('/favorites', { placeId });
    return response.data;
  },

  // Remove favorite
  remove: async (placeId: number): Promise<FavoriteResponse> => {
    const response = await api.delete<FavoriteResponse>(`/favorites/${placeId}`);
    return response.data;
  },

  // Get favorite count for a place
  getCount: async (placeId: number): Promise<FavoriteCountResponse> => {
    const response = await api.get<FavoriteCountResponse>(`/favorites/count/${placeId}`);
    return response.data;
  },
};