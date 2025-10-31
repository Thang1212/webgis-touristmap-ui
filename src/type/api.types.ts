// Generic API response
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

// Error response
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Action result
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}