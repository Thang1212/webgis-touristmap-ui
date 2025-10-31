import React, { createContext, useState, useEffect, useCallback } from 'react';
import type {ReactNode} from 'react'
import { authApi } from '../api/authApi';
import type { User, RegisterFormData, LoginFormData } from '../type/Auth.types';
import type {ActionResult} from '../type/api.types'
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (data: RegisterFormData) => Promise<ActionResult<User>>;
  login: (data: LoginFormData) => Promise<ActionResult<User>>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  loginWithGoogle: () => void;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
const checkAuth = useCallback(async (): Promise<void> => {
  try {
    const data = await authApi.getProfile();
    setUser(data.user);
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);
  // Check authentication on mount
  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);


  // Register
  const register = async (formData: RegisterFormData): Promise<ActionResult<User>> => {
    try {
      setError(null);
      const data = await authApi.register(formData);
      setUser(data.user);
      return { success: true, data: data.user };
    } catch (err: any) {
      console.log(err)
      const errorMsg = err.response?.data?.message || 'Đăng ký thất bại';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Login
  const login = async (credentials: LoginFormData): Promise<ActionResult<User>> => {
    try {
      setError(null);
      const data = await authApi.login(credentials);
      setUser(data.user);
      return { success: true, data: data.user };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Logout all devices
  const logoutAll = async (): Promise<void> => {
    try {
      await authApi.logoutAll();
      setUser(null);
    } catch (err) {
      console.error('Logout all error:', err);
    }
  };

  // Google login
  const loginWithGoogle = (): void => {
    authApi.googleLogin();
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    logoutAll,
    loginWithGoogle,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};