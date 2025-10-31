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
  categories: string;              // Format: "hotel,luxury,spa"
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

export type TabType = 'dashboard' | 'users' | 'places';
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