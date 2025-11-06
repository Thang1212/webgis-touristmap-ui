/** 
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  // Load toàn bộ biến từ file .env
  // const env = loadEnv(mode, process.cwd(), '')

  // // Tự chọn URL theo môi trường
  // const isProd = mode === 'production'
  // const apiTarget = isProd ? env.VITE_API_URL_PROD : env.VITE_API_URL_DEV

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: true,
    port: 3030,
    proxy: {
      "/api": {
        // target: "http://localhost:8000/",
        target: import.meta.env.VITE_API_URL || "http://localhost:8000/",
        changeOrigin: true,  
        secure: false,
      },
    },
  },
})
  */

        // target: 
        //   import.meta.env.MODE === "production"
        //     ? import.meta.env.VITE_GEOSERVER_BASE_URL_PROD
        //     : import.meta.env.VITE_GEOSERVER_BASE_URL_DEV,

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // ✅ nạp biến từ .env
  // const isProd = mode === 'production'
  // const apiTarget = isProd ? env.VITE_API_URL_PROD : env.VITE_API_URL_DEV

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      hmr: true,
      port: 3030,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8000/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})