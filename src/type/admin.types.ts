// types/admin.types.ts

// Import từ auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  authProvider: 'local' | 'google';
  createdAt?: string;
}

// Register form data
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Auth response
export interface AuthResponse {
  message: string;
  user: User;
}

// Profile response
export interface ProfileResponse {
  user: User;
}

export type Place = {
  id: number;
  name: string;
  categories: string[];              // Format: "hotel,luxury,spa"
  description?: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  rating?: number;                 // Decimal (0-5)
  userRatingsTotal?: number;
  phone?: string;
  website?: string;
  imageThumbnail?: string;
  open_hour?: string;              // Format "HH:mm:ss"
  close_hour?: string;             // Format "HH:mm:ss"
  createdAt?: string;
  updatedAt?: string;
}

export interface Stats {
  totalUsers: number;
  totalPlaces: number;
  activeUsers: number;
  newUsers: number;
}

export type TabType = 'dashboard' | 'users' | 'places' | 'categories' | 'reviews' |'video';
export type ModalType = 'addUser' | 'editUser' | 'addPlace' | 'editPlace';

// Form data for modals
export interface UserFormData {
  email: string;
  password?: string;
  name?: string;
  role: 'user' | 'admin';
  authProvider: 'local' | 'google';
}

export interface PlaceFormData {
  name: string;
  categories: string;
  description?: string;
  address?: string;
  longitude: number;
  latitude: number;
  rating?: number;
  userRatingsTotal?: number;
  phone?: string;
  website?: string;
  imageThumbnail?: string;
  open_hour?: string;
  close_hour?: string;
}
// types/admin.types.ts
export interface DashboardStats {
  totalPlaces: number;
  totalCategories: number;
  totalReviews: number;
  totalVideos: number;
  totalUsers: number;
  placesThisWeek: number;
  reviewsToday: number;
  videosThisMonth: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  placeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  place: {
    id: number;
    name: string;
  };
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: number;
  place?: {
    id: number;
    name: string;
  };
  platform: 'Youtube' | 'TikTok' | 'Instagram';
  videoId: string;
  title: string;
  channel?: string;
  publishedDate?: string;
  url: string;
  thumbnail?: string;
  description?: string;
  views: number;
  likes: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
