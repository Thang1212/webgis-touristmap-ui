import type { Place } from './Place';

export interface Favorite {
  id: number;
  user_id: string;
  place_id: number;
  place?: Place; // Populated place data
  createdAt: string;
  updatedAt: string;
}

export interface FavoritesResponse {
  success: boolean;
  data: Favorite[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}