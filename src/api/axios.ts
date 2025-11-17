// import axios, { AxiosError } from 'axios';
// import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// // ==================== AXIOS INSTANCES ====================
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api/',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Separate instance for refresh (no interceptors)
// const refreshApi = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api/',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ==================== GLOBAL STATE ====================
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: any) => void;
//   reject: (reason?: any) => void;
// }> = [];

// // ==================== HELPERS ====================
// const processQueue = (error: any = null): void => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve();
//     }
//   });
//   failedQueue = [];
// };

// const shouldSkipRetry = (url?: string): boolean => {
//   const noRetryUrls = ['/auth/refresh', '/auth/login', '/auth/register'];
//   return noRetryUrls.some((endpoint) => url?.includes(endpoint));
// };

// // ==================== REQUEST INTERCEPTOR ====================
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     if (import.meta.env.DEV) {
//       console.log('📤 Request:', config.method?.toUpperCase(), config.url);
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     console.error('❌ Request error:', error.message);
//     return Promise.reject(error);
//   }
// );

// // ==================== RESPONSE INTERCEPTOR ====================
// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     if (import.meta.env.DEV) {
//       console.log(' Response:', response.config.url, response.status);
//     }
//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // Skip retry for certain endpoints
//     if (shouldSkipRetry(originalRequest.url)) {
//       console.log('⏭️ Skipping retry for:', originalRequest.url);
//       return Promise.reject(error);
//     }

//     // Handle 401 Unauthorized (token expired)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       // If already refreshing, queue this request
//       if (isRefreshing) {
//         console.log('⏳ Queueing request:', originalRequest.url);
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => {
//             console.log('🔄 Retrying queued request:', originalRequest.url);
//             return api(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       console.log('🔄 Refreshing token...');

//       try {
//         await refreshApi.post('/auth/refresh');

//         console.log(' Token refreshed successfully');

//         processQueue();
//         isRefreshing = false;

//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error(' Token refresh failed');

//         processQueue(refreshError);
//         isRefreshing = false;

//         // Clear localStorage
//         localStorage.removeItem('webgis_user');

//         // Redirect to login
//         // if (window.location.pathname !== '/login') {
//         //   window.location.href = '/login';
//         // }

//         return Promise.reject(refreshError);
//       }
//     }

//     // Handle other errors
//     if (error.response) {
//       console.error(` Error ${error.response.status}:`, error.response.data);
//     } else if (error.request) {
//       console.error(' No response received:', error.request);
//     } else {
//       console.error(' Error:', error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
// export { refreshApi }; // Export for testing if needed
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ==================== AXIOS INSTANCES ====================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate instance for refresh (no interceptors)
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== GLOBAL STATE ====================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// ==================== HELPERS ====================
const processQueue = (error: any = null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const shouldSkipRetry = (url?: string): boolean => {
  const noRetryUrls = ['/auth/refresh', '/auth/login', '/auth/register'];
  return noRetryUrls.some((endpoint) => url?.includes(endpoint));
};

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check for token in localStorage (fallback for browsers with strict cookie policies)
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      if (import.meta.env.DEV) {
        console.log('🔑 Using token from localStorage');
      }
    } else if (import.meta.env.DEV) {
      console.log('🍪 Using cookies');
    }

    if (import.meta.env.DEV) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error.message);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, response.status);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip retry for certain endpoints
    if (shouldSkipRetry(originalRequest.url)) {
      console.log('⏭️ Skipping retry for:', originalRequest.url);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log('⏳ Queueing request:', originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Update Authorization header if using localStorage
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            console.log('🔄 Retrying queued request:', originalRequest.url);
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log('🔄 Refreshing token...');

      try {
        // Check if using localStorage (fallback for browsers with strict cookie policies)
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // Using localStorage - send refresh token in request body
          console.log('🔄 Refreshing with localStorage token');
          
          const response = await refreshApi.post('/auth/refresh', {
            refreshToken: refreshToken
          });

          // Save new tokens to localStorage
          if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            
            console.log('✅ Token refreshed successfully (localStorage)');
            processQueue(null, response.data.accessToken);
            isRefreshing = false;

            // Update original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          }
        } else {
          // Using cookies - refresh endpoint will use cookies automatically
          console.log('🔄 Refreshing with cookies');
          await refreshApi.post('/auth/refresh');
          
          console.log('✅ Token refreshed successfully (cookies)');
          processQueue();
          isRefreshing = false;
          return api(originalRequest);
        }

        // Fallback
        processQueue();
        isRefreshing = false;
        return api(originalRequest);

      } catch (refreshError) {
        console.error('❌ Token refresh failed');

        processQueue(refreshError);
        isRefreshing = false;

        // Clear all auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('webgis_user');

        // // Redirect to login
        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login';
        // }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      console.error(`❌ Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

export { refreshApi };
