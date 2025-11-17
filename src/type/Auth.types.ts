//Auth.type.ts
// User type 
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  // avatar: string
  authProvider: 'local' | 'google';
  createdAt?: string;
}

// Register form data
export interface RegisterFormData {
  //username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

// Login form data
export interface LoginFormData {
  //username: string;
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