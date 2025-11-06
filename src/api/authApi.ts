import api from './axios';
import type {
  RegisterFormData,
  LoginFormData,
  AuthResponse,
  ProfileResponse,
} from '../type/Auth.types';

export const authApi = {
  // Register
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    console.log(api)
    const response = await api.post<AuthResponse>('/auth/register', data);
    console.log(response)
    return response.data;
  },

  // Login
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/login', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  // Logout all devices
  logoutAll: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout-all');
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/auth/profile');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/refresh');
    return response.data;
  },

  // Google OAuth (redirect)
  //?
  googleLogin: (): void => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    // const apiUrl = 
    //   import.meta.env.MODE === "production"
    //     ? import.meta.env.VITE_GEOSERVER_BASE_URL_PROD
    //     : import.meta.env.VITE_GEOSERVER_BASE_URL_DEV;
    window.location.href = `${apiUrl}/auth/google`;
  },
};